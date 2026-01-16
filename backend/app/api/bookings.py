from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, datetime
from typing import List
import pytz
from database.database import get_db
from app.models.event_type import EventType
from app.models.meeting import Meeting, MeetingStatus
from app.schemas.meeting import MeetingCreate, Meeting as MeetingSchema
from app.services.booking_service import get_available_time_slots, is_time_slot_available

router = APIRouter()

@router.get("/available/{event_type_slug}")
def get_available_slots(
    event_type_slug: str,
    date: date,
    timezone: str = "UTC",
    db: Session = Depends(get_db)
):
    """Get available time slots for an event type on a specific date"""
    # Get event type by slug
    event_type = db.query(EventType).filter(EventType.slug == event_type_slug).first()
    if not event_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event type not found")
    
    # Get available slots
    slots = get_available_time_slots(db, event_type.id, date, timezone)
    
    return {
        "event_type_id": event_type.id,
        "event_type_name": event_type.name,
        "duration_minutes": event_type.duration_minutes,
        "date": date.isoformat(),
        "timezone": timezone,
        "available_slots": [slot.isoformat() for slot in slots]
    }

@router.post("/", response_model=MeetingSchema, status_code=status.HTTP_201_CREATED)
def create_booking(booking: MeetingCreate, db: Session = Depends(get_db)):
    """Create a new booking"""
    # Get event type
    event_type = db.query(EventType).filter(EventType.id == booking.event_type_id).first()
    if not event_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event type not found")
    
    # Ensure scheduled_at is timezone-aware (UTC)
    scheduled_at = booking.scheduled_at
    if scheduled_at.tzinfo is None:
        scheduled_at = pytz.UTC.localize(scheduled_at)
    else:
        scheduled_at = scheduled_at.astimezone(pytz.UTC)
    
    # Check if time slot is available
    if not is_time_slot_available(db, booking.event_type_id, scheduled_at, event_type.duration_minutes):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Time slot is not available or conflicts with an existing booking"
        )
    
    # Create meeting
    db_meeting = Meeting(
        event_type_id=booking.event_type_id,
        invitee_name=booking.invitee_name,
        invitee_email=booking.invitee_email,
        scheduled_at=scheduled_at,
        status=MeetingStatus.SCHEDULED
    )
    
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    
    return db_meeting
