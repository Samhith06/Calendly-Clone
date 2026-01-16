from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database.database import Base

class MeetingStatus(enum.Enum):
    SCHEDULED = "scheduled"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    event_type_id = Column(Integer, ForeignKey("event_types.id", ondelete="CASCADE"), nullable=False)
    invitee_name = Column(String(255), nullable=False)
    invitee_email = Column(String(255), nullable=False)
    scheduled_at = Column(DateTime(timezone=True), nullable=False, index=True)
    status = Column(Enum(MeetingStatus), default=MeetingStatus.SCHEDULED, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    event_type = relationship("EventType", back_populates="meetings")
