from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from app.models.availability import AvailabilitySchedule
from app.models.event_type import EventType
from app.schemas.availability import AvailabilitySchedule as AvailabilitySchema, AvailabilityScheduleCreate, AvailabilityScheduleUpdate

router = APIRouter()

@router.get("/event-type/{event_type_id}", response_model=List[AvailabilitySchema])
def get_availability_for_event_type(event_type_id: int, db: Session = Depends(get_db)):
    """Get all availability schedules for an event type"""
    # Verify event type exists
    event_type = db.query(EventType).filter(EventType.id == event_type_id).first()
    if not event_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event type not found")
    
    schedules = db.query(AvailabilitySchedule).filter(
        AvailabilitySchedule.event_type_id == event_type_id
    ).all()
    return schedules

@router.post("/", response_model=AvailabilitySchema, status_code=status.HTTP_201_CREATED)
def create_availability(availability: AvailabilityScheduleCreate, db: Session = Depends(get_db)):
    """Create a new availability schedule"""
    # Verify event type exists
    event_type = db.query(EventType).filter(EventType.id == availability.event_type_id).first()
    if not event_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event type not found")
    
    # Validate day_of_week
    if availability.day_of_week < 0 or availability.day_of_week > 6:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="day_of_week must be between 0 and 6")
    
    # Validate time range
    if availability.start_time >= availability.end_time:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="start_time must be before end_time")
    
    db_availability = AvailabilitySchedule(**availability.model_dump())
    db.add(db_availability)
    db.commit()
    db.refresh(db_availability)
    return db_availability

@router.post("/bulk", response_model=List[AvailabilitySchema], status_code=status.HTTP_201_CREATED)
def create_bulk_availability(availabilities: List[AvailabilityScheduleCreate], db: Session = Depends(get_db)):
    """Create multiple availability schedules at once"""
    created = []
    for availability in availabilities:
        # Verify event type exists
        event_type = db.query(EventType).filter(EventType.id == availability.event_type_id).first()
        if not event_type:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                              detail=f"Event type {availability.event_type_id} not found")
        
        # Validate day_of_week
        if availability.day_of_week < 0 or availability.day_of_week > 6:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                              detail="day_of_week must be between 0 and 6")
        
        # Validate time range
        if availability.start_time >= availability.end_time:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                              detail="start_time must be before end_time")
        
        db_availability = AvailabilitySchedule(**availability.model_dump())
        db.add(db_availability)
        created.append(db_availability)
    
    db.commit()
    for av in created:
        db.refresh(av)
    return created

@router.put("/{availability_id}", response_model=AvailabilitySchema)
def update_availability(availability_id: int, availability: AvailabilityScheduleUpdate, db: Session = Depends(get_db)):
    """Update an availability schedule"""
    db_availability = db.query(AvailabilitySchedule).filter(AvailabilitySchedule.id == availability_id).first()
    if not db_availability:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Availability schedule not found")
    
    update_data = availability.model_dump(exclude_unset=True)
    
    # Validate day_of_week if provided
    if "day_of_week" in update_data:
        if update_data["day_of_week"] < 0 or update_data["day_of_week"] > 6:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="day_of_week must be between 0 and 6")
    
    # Validate time range if times are being updated
    start_time = update_data.get("start_time", db_availability.start_time)
    end_time = update_data.get("end_time", db_availability.end_time)
    if start_time >= end_time:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="start_time must be before end_time")
    
    for field, value in update_data.items():
        setattr(db_availability, field, value)
    
    db.commit()
    db.refresh(db_availability)
    return db_availability

@router.delete("/{availability_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_availability(availability_id: int, db: Session = Depends(get_db)):
    """Delete an availability schedule"""
    db_availability = db.query(AvailabilitySchedule).filter(AvailabilitySchedule.id == availability_id).first()
    if not db_availability:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Availability schedule not found")
    
    db.delete(db_availability)
    db.commit()
    return None

@router.delete("/event-type/{event_type_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_all_availability_for_event_type(event_type_id: int, db: Session = Depends(get_db)):
    """Delete all availability schedules for an event type"""
    db.query(AvailabilitySchedule).filter(
        AvailabilitySchedule.event_type_id == event_type_id
    ).delete()
    db.commit()
    return None
