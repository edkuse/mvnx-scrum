from sqlmodel import Session, create_engine
from app.core.config import settings

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True)

# Dependency
def get_db():
    with Session(engine) as session:
        yield session 