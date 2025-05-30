from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import users, applications, epics, stories, sprints, standups
from app.db.session import engine
from app.models.user import User
from app.models.sprint import Sprint
from app.models.standup import Standup
from sqlmodel import SQLModel

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(applications.router, prefix=f"{settings.API_V1_STR}/applications", tags=["applications"])
app.include_router(epics.router, prefix=f"{settings.API_V1_STR}/epics", tags=["epics"])
app.include_router(stories.router, prefix=f"{settings.API_V1_STR}/stories", tags=["stories"])
app.include_router(sprints.router, prefix=f"{settings.API_V1_STR}/sprints", tags=["sprints"])
app.include_router(standups.router, prefix=f"{settings.API_V1_STR}/standups", tags=["standups"])

@app.get("/")
async def root():
    return {"message": "Welcome to MVNx Scrum API"} 
