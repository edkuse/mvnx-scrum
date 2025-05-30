from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel
from app.models.sprint import SprintStatus

class SprintBase(SQLModel):
    name: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    status: SprintStatus = SprintStatus.PLANNED

class SprintCreate(SprintBase):
    pass

class SprintUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[SprintStatus] = None

class SprintResponse(SprintBase):
    id: int
    created_at: datetime
    updated_at: datetime 