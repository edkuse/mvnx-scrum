from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime
from app.db.session import get_db
from app.models.sprint import Sprint, SprintStatus

router = APIRouter()

@router.get("/", response_model=List[Sprint])
def read_sprints(
    skip: int = 0,
    limit: int = 100,
    status: Optional[SprintStatus] = None,
    db: Session = Depends(get_db)
):
    query = select(Sprint)
    if status:
        query = query.where(Sprint.status == status)
    sprints = db.exec(query.offset(skip).limit(limit)).all()
    return sprints

@router.post("/", response_model=Sprint)
def create_sprint(
    name: str,
    description: Optional[str],
    start_date: datetime,
    end_date: datetime,
    status: SprintStatus = SprintStatus.PLANNED,
    db: Session = Depends(get_db)
):
    sprint = Sprint(
        name=name,
        description=description,
        start_date=start_date,
        end_date=end_date,
        status=status
    )
    db.add(sprint)
    db.commit()
    db.refresh(sprint)
    return sprint

@router.get("/{sprint_id}", response_model=Sprint)
def read_sprint(
    sprint_id: int,
    db: Session = Depends(get_db)
):
    sprint = db.get(Sprint, sprint_id)
    if not sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")
    return sprint

@router.put("/{sprint_id}", response_model=Sprint)
def update_sprint(
    sprint_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    status: Optional[SprintStatus] = None,
    db: Session = Depends(get_db)
):
    sprint = db.get(Sprint, sprint_id)
    if not sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")
    
    if name is not None:
        sprint.name = name
    if description is not None:
        sprint.description = description
    if start_date is not None:
        sprint.start_date = start_date
    if end_date is not None:
        sprint.end_date = end_date
    if status is not None:
        sprint.status = status
    
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