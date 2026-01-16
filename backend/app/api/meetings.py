from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime
from typing import List, Optional
import pytz
from database.database import get_db
from app.models.meeting import Meeting, MeetingStatus
from app.schemas.meeting import Meeting as MeetingSchema, MeetingUpdate

router = APIRouter()

@router.get("/", response_model=List[MeetingSchema])
def get_meetings(
    status_filter: Optional[str] = None,
    upcoming_only: bool = False,
    past_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get all meetings with optional filtering"""
    query = db.query(Meeting)
    
    now = datetime.now(pytz.UTC)
    
    if upcoming_only:
        query = query.filter(Meeting.scheduled_at >= now)
    elif past_only:
        query = query.filter(Meeting.scheduled_at < now)
    
    if status_filter:
        try:
            status_enum = MeetingStatus[status_filter.upper()]
            query = query.filter(Meeting.status == status_enum)
        except KeyError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {status_filter}. Must be one of: scheduled, cancelled, completed"
            )
    
    meetings = query.order_by(Meeting.scheduled_at.desc()).all()
    return meetings

@router.get("/upcoming", response_model=List[MeetingSchema])
def get_upcoming_meetings(db: Session = Depends(get_db)):
    """Get all upcoming meetings"""
    now = datetime.now(pytz.UTC)
    meetings = db.query(Meeting).filter(
        Meeting.scheduled_at >= now,
        Meeting.status == MeetingStatus.SCHEDULED
    ).order_by(Meeting.scheduled_at.asc()).all()
    return meetings

@router.get("/past", response_model=List[MeetingSchema])
def get_past_meetings(db: Session = Depends(get_db)):
    """Get all past meetings"""
    now = datetime.now(pytz.UTC)
    meetings = db.query(Meeting).filter(
        Meeting.scheduled_at < now
    ).order_by(Meeting.scheduled_at.desc()).all()
    return meetings

@router.get("/{meeting_id}", response_model=MeetingSchema)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    """Get a specific meeting by ID"""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    return meeting

@router.put("/{meeting_id}/cancel", response_model=MeetingSchema)
def cancel_meeting(meeting_id: int, db: Session = Depends(get_db)):
    """Cancel a meeting"""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    
    if meeting.status == MeetingStatus.CANCELLED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Meeting is already cancelled")
    
    meeting.status = MeetingStatus.CANCELLED
    db.commit()
    db.refresh(meeting)
    return meeting
