from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.database import Base

class EventType(Base):
    __tablename__ = "event_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    availability_schedules = relationship("AvailabilitySchedule", back_populates="event_type", cascade="all, delete-orphan")
    meetings = relationship("Meeting", back_populates="event_type", cascade="all, delete-orphan")
