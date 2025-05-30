from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime
from app.db.session import get_db
from app.models.standup import Standup
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Standup])
def read_standups(
    skip: int = 0,
    limit: int = 100,
    team_name: Optional[str] = None,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = select(Standup)
    if team_name:
        query = query.where(Standup.team_name == team_name)
    if user_id:
        query = query.where(Standup.user_id == user_id)
    standups = db.exec(query.offset(skip).limit(limit)).all()
    return standups

@router.post("/", response_model=Standup)
def create_standup(
    team_name: str,
    user_id: str,
    responses: dict,
    db: Session = Depends(get_db)
):
    # Verify user exists
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    standup = Standup(
        team_name=team_name,
        user_id=user_id,
        date=datetime.utcnow(),
        responses=responses,
        status="completed"
    )
    db.add(standup)
    db.commit()
    db.refresh(standup)
    return standup

@router.get("/{standup_id}", response_model=Standup)
def read_standup(
    standup_id: int,
    db: Session = Depends(get_db)
):
    standup = db.get(Standup, standup_id)
    if not standup:
        raise HTTPException(status_code=404, detail="Standup not found")
    return standup

@router.put("/{standup_id}", response_model=Standup)
def update_standup(
    standup_id: int,
    responses: dict,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    standup = db.get(Standup, standup_id)
    if not standup:
        raise HTTPException(status_code=404, detail="Standup not found")
    
    standup.responses = responses
    if status:
        standup.status = status
    standup.updated_at = datetime.utcnow()
    
    db.add(standup)
    db.commit()
    db.refresh(standup)
    return standup

@router.delete("/{standup_id}")
def delete_standup(
    standup_id: int,
    db: Session = Depends(get_db)
):
    standup = db.get(Standup, standup_id)
    if not standup:
        raise HTTPException(status_code=404, detail="Standup not found")
    
    db.delete(standup)
    db.commit()
    return {"message": "Standup deleted successfully"} 