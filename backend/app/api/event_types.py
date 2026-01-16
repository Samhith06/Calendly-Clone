from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from app.models.event_type import EventType
from app.schemas.event_type import EventType as EventTypeSchema, EventTypeCreate, EventTypeUpdate

router = APIRouter()

@router.get("/", response_model=List[EventTypeSchema])
def get_event_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all event types"""
    event_types = db.query(EventType).offset(skip).limit(limit).all()
    return event_types

@router.get("/{event_type_id}", response_model=EventTypeSchema)
def get_event_type(event_type_id: int, db: Session = Depends(get_db)):
    """Get a specific event type by ID"""
    event_type = db.query(EventType).filter(EventType.id == event_type_id).first()
    if not event_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event type not found")
    return event_type

@router.get("/slug/{slug}", response_model=EventTypeSchema)
def get_event_type_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get a specific event type by slug"""
    event_type = db.query(EventType).filter(EventType.slug == slug).first()
    if not event_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event type not found")
    return event_type

@router.post("/", response_model=EventTypeSchema, status_code=status.HTTP_201_CREATED)
def create_event_type(event_type: EventTypeCreate, db: Session = Depends(get_db)):
    """Create a new event type"""
    # Check if slug already exists
    existing = db.query(EventType).filter(EventType.slug == event_type.slug).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already exists")
    
    db_event_type = EventType(**event_type.model_dump())
    db.add(db_event_type)
    db.commit()
    db.refresh(db_event_type)
    return db_event_type

@router.put("/{event_type_id}", response_model=EventTypeSchema)
def update_event_type(event_type_id: int, event_type: EventTypeUpdate, db: Session = Depends(get_db)):
    """Update an event type"""
    db_event_type = db.query(EventType).filter(EventType.id == event_type_id).first()
    if not db_event_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event type not found")
    
    # Check if new slug conflicts with existing
    if event_type.slug and event_type.slug != db_event_type.slug:
        existing = db.query(EventType).filter(EventType.slug == event_type.slug).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already exists")
    
    update_data = event_type.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_event_type, field, value)
    
    db.commit()
    db.refresh(db_event_type)
    return db_event_type

@router.delete("/{event_type_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event_type(event_type_id: int, db: Session = Depends(get_db)):
    """Delete an event type"""
    db_event_type = db.query(EventType).filter(EventType.id == event_type_id).first()
    if not db_event_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event type not found")
    
    db.delete(db_event_type)
    db.commit()
    return None
