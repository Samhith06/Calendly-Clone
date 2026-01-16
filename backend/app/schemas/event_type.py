from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class EventTypeBase(BaseModel):
    name: str
    duration_minutes: int
    slug: str

class EventTypeCreate(EventTypeBase):
    pass

class EventTypeUpdate(BaseModel):
    name: Optional[str] = None
    duration_minutes: Optional[int] = None
    slug: Optional[str] = None

class EventType(EventTypeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
