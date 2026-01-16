from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from app.models.meeting import MeetingStatus

class MeetingBase(BaseModel):
    event_type_id: int
    invitee_name: str
    invitee_email: str
    scheduled_at: datetime

class MeetingCreate(MeetingBase):
    pass

class Meeting(MeetingBase):
    id: int
    status: MeetingStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MeetingUpdate(BaseModel):
    status: Optional[MeetingStatus] = None
