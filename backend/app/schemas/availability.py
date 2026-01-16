from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import time

class AvailabilityScheduleBase(BaseModel):
    event_type_id: int
    day_of_week: int  # 0-6, Monday=0
    start_time: time
    end_time: time
    timezone: str = "UTC"

class AvailabilityScheduleCreate(AvailabilityScheduleBase):
    pass

class AvailabilityScheduleUpdate(BaseModel):
    day_of_week: Optional[int] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    timezone: Optional[str] = None

class AvailabilitySchedule(AvailabilityScheduleBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
