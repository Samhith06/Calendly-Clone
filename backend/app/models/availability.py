from sqlalchemy import Column, Integer, String, Time, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base

class AvailabilitySchedule(Base):
    __tablename__ = "availability_schedules"

    id = Column(Integer, primary_key=True, index=True)
    event_type_id = Column(Integer, ForeignKey("event_types.id", ondelete="CASCADE"), nullable=False)
    day_of_week = Column(Integer, nullable=False)  # 0-6, Monday=0
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    timezone = Column(String(50), default="UTC", nullable=False)

    # Relationships
    event_type = relationship("EventType", back_populates="availability_schedules")
