from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class Application(SQLModel, table=True):
    __tablename__ = "applications"

    itap_id: str = Field(primary_key=True, max_length=25)
    name: str = Field(max_length=50)
    acronym: str = Field(max_length=25)
    mots_id: Optional[int] = None
    description: Optional[str] = None
    active: bool = Field(default=True)
    it_owner: Optional[str] = Field(default=None, max_length=10)
    it_owner_alt: Optional[str] = Field(default=None, max_length=10)
    install_status: Optional[str] = Field(default=None, max_length=25)
    lifecycle_status: Optional[str] = Field(default=None, max_length=25)
    install_type: Optional[str] = Field(default=None, max_length=25)
    app_type: Optional[str] = Field(default=None, max_length=25)
    business_purpose: Optional[str] = Field(default=None, max_length=25)
    business_unit: Optional[str] = Field(default=None, max_length=50)
    business_owner: Optional[str] = Field(default=None, max_length=10)

    # Relationships
    # epics: List["Epic"] = Relationship(back_populates="application") 