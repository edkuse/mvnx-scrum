from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.session import get_db
from app.models.epic import Epic
from app.schemas.epic import EpicCreate, EpicUpdate, EpicResponse

router = APIRouter()

@router.get("/", response_model=List[EpicResponse])
def read_epics(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.exec(select(Epic).offset(skip).limit(limit)).all()

@router.post("/", response_model=EpicResponse)
def create_epic(epic: EpicCreate, db: Session = Depends(get_db)):
    db_epic = Epic(**epic.dict())
    db.add(db_epic)
    db.commit()
    db.refresh(db_epic)
    return db_epic

@router.get("/{epic_id}", response_model=EpicResponse)
def read_epic(epic_id: int, db: Session = Depends(get_db)):
    epic = db.get(Epic, epic_id)
    if not epic:
        raise HTTPException(status_code=404, detail="Epic not found")
    return epic

@router.put("/{epic_id}", response_model=EpicResponse)
def update_epic(epic_id: int, epic: EpicUpdate, db: Session = Depends(get_db)):
    db_epic = db.get(Epic, epic_id)
    if not db_epic:
        raise HTTPException(status_code=404, detail="Epic not found")
    epic_data = epic.dict(exclude_unset=True)
    for key, value in epic_data.items():
        setattr(db_epic, key, value)
    db.add(db_epic)
    db.commit()
    db.refresh(db_epic)
    return db_epic

@router.delete("/{epic_id}")
def delete_epic(epic_id: int, db: Session = Depends(get_db)):
    epic = db.get(Epic, epic_id)
    if not epic:
        raise HTTPException(status_code=404, detail="Epic not found")
    db.delete(epic)
    db.commit()
    return {"message": "Epic deleted"} 