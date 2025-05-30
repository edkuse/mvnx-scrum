from typing import Optional
from sqlmodel import SQLModel

class ApplicationBase(SQLModel):
    itap_id: str
    name: str
    acronym: str
    mots_id: Optional[int] = None
    description: Optional[str] = None
    active: bool = True
    it_owner: Optional[str] = None
    it_owner_alt: Optional[str] = None
    install_status: Optional[str] = None
    lifecycle_status: Optional[str] = None
    install_type: Optional[str] = None
    app_type: Optional[str] = None
    business_purpose: Optional[str] = None
    business_unit: Optional[str] = None
    business_owner: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(SQLModel):
    name: Optional[str] = None
    acronym: Optional[str] = None
    description: Optional[str] = None
    active: Optional[bool] = None
    it_owner: Optional[str] = None
    it_owner_alt: Optional[str] = None
    install_status: Optional[str] = None
    lifecycle_status: Optional[str] = None
    install_type: Optional[str] = None
    app_type: Optional[str] = None
    business_purpose: Optional[str] = None
    business_unit: Optional[str] = None
    business_owner: Optional[str] = None

class ApplicationResponse(ApplicationBase):
    owner_name: Optional[str] = None
    business_owner_name: Optional[str] = None
    owner_profile_picture: Optional[str] = None
    owner_alt_name: Optional[str] = None
    owner_alt_profile_picture: Optional[str] = None
    business_owner_profile_picture: Optional[str] = None 