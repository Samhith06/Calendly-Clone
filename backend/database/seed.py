import sys
from pathlib import Path

# Add parent directory to path so we can import app modules
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import EventType, AvailabilitySchedule, Meeting, MeetingStatus
from database.database import Base, DATABASE_URL
from datetime import time, datetime, timedelta
import pytz

# Create database tables
engine = create_engine(DATABASE_URL, echo=True)
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

try:
    # Clear existing data
    db.query(Meeting).delete()
    db.query(AvailabilitySchedule).delete()
    db.query(EventType).delete()
    db.commit()

    # Create sample event types
    event_type1 = EventType(
        name="30 Minute Meeting",
        duration_minutes=30,
        slug="30min-meeting"
    )
    db.add(event_type1)
    db.flush()

    event_type2 = EventType(
        name="1 Hour Consultation",
        duration_minutes=60,
        slug="1hour-consultation"
    )
    db.add(event_type2)
    db.flush()

    event_type3 = EventType(
        name="15 Minute Quick Chat",
        duration_minutes=15,
        slug="15min-quick-chat"
    )
    db.add(event_type3)
    db.flush()

    # Create availability schedules for event_type1 (Monday-Friday, 9 AM - 5 PM)
    for day in range(5):  # Monday to Friday (0-4)
        availability = AvailabilitySchedule(
            event_type_id=event_type1.id,
            day_of_week=day,
            start_time=time(9, 0),
            end_time=time(17, 0),
            timezone="UTC"
        )
        db.add(availability)

    # Create availability schedules for event_type2 (Monday, Wednesday, Friday, 10 AM - 3 PM)
    for day in [0, 2, 4]:  # Monday, Wednesday, Friday
        availability = AvailabilitySchedule(
            event_type_id=event_type2.id,
            day_of_week=day,
            start_time=time(10, 0),
            end_time=time(15, 0),
            timezone="UTC"
        )
        db.add(availability)

    # Create availability schedules for event_type3 (All weekdays, 8 AM - 6 PM)
    for day in range(5):  # Monday to Friday
        availability = AvailabilitySchedule(
            event_type_id=event_type3.id,
            day_of_week=day,
            start_time=time(8, 0),
            end_time=time(18, 0),
            timezone="UTC"
        )
        db.add(availability)

    # Create sample meetings
    utc = pytz.UTC
    now = datetime.now(utc)
    
    # Upcoming meeting (tomorrow at 10 AM)
    tomorrow = (now + timedelta(days=1)).replace(hour=10, minute=0, second=0, microsecond=0)
    meeting1 = Meeting(
        event_type_id=event_type1.id,
        invitee_name="John Doe",
        invitee_email="john.doe@example.com",
        scheduled_at=tomorrow,
        status=MeetingStatus.SCHEDULED
    )
    db.add(meeting1)

    # Upcoming meeting (day after tomorrow at 2 PM)
    day_after = (now + timedelta(days=2)).replace(hour=14, minute=0, second=0, microsecond=0)
    meeting2 = Meeting(
        event_type_id=event_type2.id,
        invitee_name="Jane Smith",
        invitee_email="jane.smith@example.com",
        scheduled_at=day_after,
        status=MeetingStatus.SCHEDULED
    )
    db.add(meeting2)

    # Past meeting (yesterday)
    yesterday = (now - timedelta(days=1)).replace(hour=11, minute=0, second=0, microsecond=0)
    meeting3 = Meeting(
        event_type_id=event_type1.id,
        invitee_name="Bob Johnson",
        invitee_email="bob.johnson@example.com",
        scheduled_at=yesterday,
        status=MeetingStatus.COMPLETED
    )
    db.add(meeting3)

    # Past meeting (last week)
    last_week = (now - timedelta(days=7)).replace(hour=15, minute=0, second=0, microsecond=0)
    meeting4 = Meeting(
        event_type_id=event_type3.id,
        invitee_name="Alice Williams",
        invitee_email="alice.williams@example.com",
        scheduled_at=last_week,
        status=MeetingStatus.COMPLETED
    )
    db.add(meeting4)

    db.commit()
    print("Database seeded successfully!")

except Exception as e:
    db.rollback()
    print(f"Error seeding database: {e}")
    raise
finally:
    db.close()
