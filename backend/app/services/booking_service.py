from sqlalchemy.orm import Session
from datetime import datetime, date, time, timedelta
from typing import List, Optional
import pytz
from app.models.event_type import EventType
from app.models.availability import AvailabilitySchedule
from app.models.meeting import Meeting, MeetingStatus

def get_available_time_slots(
    db: Session,
    event_type_id: int,
    selected_date: date,
    timezone: str = "UTC"
) -> List[datetime]:
    """
    Calculate available time slots for a given event type and date.
    Returns list of datetime objects in UTC.
    """
    # Get event type
    event_type = db.query(EventType).filter(EventType.id == event_type_id).first()
    if not event_type:
        return []
    
    # Get day of week (0=Monday, 6=Sunday)
    day_of_week = selected_date.weekday()
    
    # Get availability schedules for this day of week
    schedules = db.query(AvailabilitySchedule).filter(
        AvailabilitySchedule.event_type_id == event_type_id,
        AvailabilitySchedule.day_of_week == day_of_week
    ).all()
    
    if not schedules:
        return []
    
    # Get all existing meetings for this event type on this date
    start_of_day = datetime.combine(selected_date, time.min).replace(tzinfo=pytz.UTC)
    end_of_day = datetime.combine(selected_date, time.max).replace(tzinfo=pytz.UTC)
    
    existing_meetings = db.query(Meeting).filter(
        Meeting.event_type_id == event_type_id,
        Meeting.status == MeetingStatus.SCHEDULED,
        Meeting.scheduled_at >= start_of_day,
        Meeting.scheduled_at <= end_of_day
    ).all()
    
    booked_times = {meeting.scheduled_at for meeting in existing_meetings}
    
    # Convert timezone
    tz = pytz.timezone(timezone)
    
    available_slots = []
    duration_minutes = event_type.duration_minutes
    
    for schedule in schedules:
        # Create datetime objects in the specified timezone
        start_datetime = datetime.combine(selected_date, schedule.start_time)
        start_datetime = tz.localize(start_datetime)
        
        end_datetime = datetime.combine(selected_date, schedule.end_time)
        end_datetime = tz.localize(end_datetime)
        
        # Convert to UTC for comparison
        start_utc = start_datetime.astimezone(pytz.UTC)
        end_utc = end_datetime.astimezone(pytz.UTC)
        
        # Generate time slots
        current = start_utc
        while current + timedelta(minutes=duration_minutes) <= end_utc:
            # Check if this slot is already booked
            if current not in booked_times:
                available_slots.append(current)
            current += timedelta(minutes=duration_minutes)
    
    return sorted(available_slots)

def is_time_slot_available(
    db: Session,
    event_type_id: int,
    scheduled_at: datetime,
    duration_minutes: int
) -> bool:
    """
    Check if a specific time slot is available for booking.
    """
    # Convert to UTC if not already
    if scheduled_at.tzinfo is None:
        scheduled_at = pytz.UTC.localize(scheduled_at)
    else:
        scheduled_at = scheduled_at.astimezone(pytz.UTC)
    
    # Get event type
    event_type = db.query(EventType).filter(EventType.id == event_type_id).first()
    if not event_type:
        return False
    
    # Check if duration matches
    if duration_minutes != event_type.duration_minutes:
        return False
    
    # Get the date and day of week
    selected_date = scheduled_at.date()
    day_of_week = selected_date.weekday()
    
    # Get availability schedules for this day
    schedules = db.query(AvailabilitySchedule).filter(
        AvailabilitySchedule.event_type_id == event_type_id,
        AvailabilitySchedule.day_of_week == day_of_week
    ).all()
    
    if not schedules:
        return False
    
    # Check if the time falls within any availability schedule
    slot_time = scheduled_at.time()
    slot_end = (scheduled_at + timedelta(minutes=duration_minutes)).time()
    
    is_within_availability = False
    for schedule in schedules:
        if schedule.start_time <= slot_time and slot_end <= schedule.end_time:
            is_within_availability = True
            break
    
    if not is_within_availability:
        return False
    
    # Check for conflicts with existing meetings
    end_time = scheduled_at + timedelta(minutes=duration_minutes)
    
    conflicting_meeting = db.query(Meeting).filter(
        Meeting.event_type_id == event_type_id,
        Meeting.status == MeetingStatus.SCHEDULED,
        Meeting.scheduled_at < end_time,
        Meeting.scheduled_at + timedelta(minutes=event_type.duration_minutes) > scheduled_at
    ).first()
    
    return conflicting_meeting is None
