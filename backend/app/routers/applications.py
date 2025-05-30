from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from sqlalchemy.orm import aliased
from app.db.session import get_db
from app.models.application import Application
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationResponse

router = APIRouter()

ITOwner = aliased(User)
BusinessOwner = aliased(User)
ITOwnerAlt = aliased(User)

@router.get("/", response_model=List[ApplicationResponse])
def read_applications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Join with users table to get owner names (using aliases)
    query = (
        select(Application, ITOwner, BusinessOwner, ITOwnerAlt)
        .outerjoin(ITOwner, Application.it_owner == ITOwner.attuid)
        .outerjoin(BusinessOwner, Application.business_owner == BusinessOwner.attuid)
        .outerjoin(ITOwnerAlt, Application.it_owner_alt == ITOwnerAlt.attuid)
        .offset(skip)
        .limit(limit)
    )
    results = db.exec(query).all()
    
    applications = []
    for row in results:
        app = row[0]
        it_owner_user = row[1]
        business_owner_user = row[2]
        it_owner_alt_user = row[3]
        app_dict = app.dict()
        if it_owner_user:
            app_dict["owner_name"] = f"{it_owner_user.preferred_nm or it_owner_user.first_nm} {it_owner_user.last_nm}"
            app_dict["owner_profile_picture"] = it_owner_user.profile_picture
        if business_owner_user:
            app_dict["business_owner_name"] = f"{business_owner_user.preferred_nm or business_owner_user.first_nm} {business_owner_user.last_nm}"
            app_dict["business_owner_profile_picture"] = business_owner_user.profile_picture
        if it_owner_alt_user:
            app_dict["owner_alt_name"] = f"{it_owner_alt_user.preferred_nm or it_owner_alt_user.first_nm} {it_owner_alt_user.last_nm}"
            app_dict["owner_alt_profile_picture"] = it_owner_alt_user.profile_picture
        applications.append(app_dict)
    
    return applications

@router.post("/", response_model=ApplicationResponse)
def create_application(application: ApplicationCreate, db: Session = Depends(get_db)):
    db_app = Application(**application.dict())
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@router.get("/{app_id}", response_model=ApplicationResponse)
def read_application(app_id: str, db: Session = Depends(get_db)):
    # Join with users table to get owner name (using aliases)
    query = (
        select(Application, ITOwner, BusinessOwner, ITOwnerAlt)
        .outerjoin(ITOwner, Application.it_owner == ITOwner.attuid)
        .outerjoin(BusinessOwner, Application.business_owner == BusinessOwner.attuid)
        .outerjoin(ITOwnerAlt, Application.it_owner_alt == ITOwnerAlt.attuid)
        .where(Application.itap_id == app_id)
    )
    result = db.exec(query).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Application not found")
    
    app = result[0]
    it_owner_user = result[1]
    business_owner_user = result[2]
    it_owner_alt_user = result[3]
    app_dict = app.dict()
    if it_owner_user:
        app_dict["owner_name"] = f"{it_owner_user.preferred_nm or it_owner_user.first_nm} {it_owner_user.last_nm}"
        app_dict["owner_profile_picture"] = it_owner_user.profile_picture
    if business_owner_user:
        app_dict["business_owner_name"] = f"{business_owner_user.preferred_nm or business_owner_user.first_nm} {business_owner_user.last_nm}"
        app_dict["business_owner_profile_picture"] = business_owner_user.profile_picture
    if it_owner_alt_user:
        app_dict["owner_alt_name"] = f"{it_owner_alt_user.preferred_nm or it_owner_alt_user.first_nm} {it_owner_alt_user.last_nm}"
        app_dict["owner_alt_profile_picture"] = it_owner_alt_user.profile_picture
    
    return app_dict

@router.put("/{app_id}", response_model=ApplicationResponse)
def update_application(app_id: str, application: ApplicationUpdate, db: Session = Depends(get_db)):
    app = db.get(Application, app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app_data = application.dict(exclude_unset=True)
    for key, value in app_data.items():
        setattr(app, key, value)
    db.add(app)
    db.commit()
    db.refresh(app)
    return app

@router.delete("/{app_id}")
def delete_application(app_id: str, db: Session = Depends(get_db)):
    app = db.get(Application, app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app)
    db.commit()
    return {"message": "Application deleted"} 