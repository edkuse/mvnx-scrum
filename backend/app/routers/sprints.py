from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime
from app.db.session import get_db
from app.models.sprint import Sprint
from app.schemas.sprint import SprintCreate, SprintUpdate, SprintResponse

router = APIRouter()

@router.get("/", response_model=List[SprintResponse])
def read_sprints(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = select(Sprint)
    if status:
        query = query.where(Sprint.status == status)
    sprints = db.exec(query.offset(skip).limit(limit)).all()
    return sprints

@router.post("/", response_model=SprintResponse)
def create_sprint(
    sprint_in: SprintCreate,
    db: Session = Depends(get_db)
):
    sprint = Sprint(**sprint_in.model_dump())
    db.add(sprint)
    db.commit()
    db.refresh(sprint)
    return sprint

@router.get("/{sprint_id}", response_model=SprintResponse)
def read_sprint(
    sprint_id: int,
    db: Session = Depends(get_db)
):
    sprint = db.get(Sprint, sprint_id)
    if not sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")
    return sprint

@router.put("/{sprint_id}", response_model=SprintResponse)
def update_sprint(
    sprint_id: int,
    sprint_in: SprintUpdate,
    db: Session = Depends(get_db)
):
    sprint = db.get(Sprint, sprint_id)
    if not sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")
    sprint_data = sprint_in.model_dump(exclude_unset=True)
    for key, value in sprint_data.items():
        setattr(sprint, key, value)
    sprint.updated_at = datetime.utcnow()
    db.add(sprint)
    db.commit()
    db.refresh(sprint)
    return sprint

@router.delete("/{sprint_id}")
def delete_sprint(
    sprint_id: int,
    db: Session = Depends(get_db)
):
    sprint = db.get(Sprint, sprint_id)
    if not sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")
    db.delete(sprint)
    db.commit()
    return {"message": "Sprint deleted successfully"} 