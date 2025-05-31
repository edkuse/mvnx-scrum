from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from sqlalchemy.exc import SQLAlchemyError
import logging
from app.db.session import get_db
from app.models.story import Story
from app.schemas.story import StoryCreate, StoryUpdate, StoryResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[StoryResponse])
def read_stories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        stories = db.exec(select(Story).offset(skip).limit(limit)).all()
        logger.info(f"Retrieved {len(stories)} stories")
        return stories
    
    except SQLAlchemyError as e:
        logger.error(f"Database error while fetching stories: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error occurred while fetching stories")


@router.post("/", response_model=StoryResponse)
def create_story(story: StoryCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Creating new story: {story.model_dump()}")
        db_story = Story(**story.model_dump())
        db.add(db_story)
        db.commit()
        db.refresh(db_story)
        logger.info(f"Successfully created story with ID: {db_story.id}")
        return db_story
    
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error while creating story: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error occurred while creating story")
    
    except Exception as e:
        logger.error(f"Unexpected error while creating story: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@router.get("/{story_id}", response_model=StoryResponse)
def read_story(story_id: int, db: Session = Depends(get_db)):
    try:
        story = db.get(Story, story_id)
        if not story:
            logger.warning(f"Story not found with ID: {story_id}")
            raise HTTPException(status_code=404, detail="Story not found")
        logger.info(f"Retrieved story with ID: {story_id}")
        return story
    except SQLAlchemyError as e:
        logger.error(f"Database error while fetching story {story_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error occurred while fetching story")

@router.put("/{story_id}", response_model=StoryResponse)
def update_story(story_id: int, story: StoryUpdate, db: Session = Depends(get_db)):
    try:
        db_story = db.get(Story, story_id)
        if not db_story:
            logger.warning(f"Story not found with ID: {story_id}")
            raise HTTPException(status_code=404, detail="Story not found")
        
        logger.info(f"Updating story {story_id} with data: {story.model_dump(exclude_unset=True)}")
        story_data = story.model_dump(exclude_unset=True)

        for key, value in story_data.items():
            setattr(db_story, key, value)
        
        db.add(db_story)
        db.commit()
        db.refresh(db_story)
        logger.info(f"Successfully updated story with ID: {story_id}")
        return db_story
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error while updating story {story_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error occurred while updating story")
    except Exception as e:
        logger.error(f"Unexpected error while updating story {story_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@router.delete("/{story_id}")
def delete_story(story_id: int, db: Session = Depends(get_db)):
    try:
        story = db.get(Story, story_id)
        if not story:
            logger.warning(f"Story not found with ID: {story_id}")
            raise HTTPException(status_code=404, detail="Story not found")
        
        logger.info(f"Deleting story with ID: {story_id}")
        db.delete(story)
        db.commit()
        logger.info(f"Successfully deleted story with ID: {story_id}")
        return {"message": "Story deleted"}
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error while deleting story {story_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error occurred while deleting story")
    except Exception as e:
        logger.error(f"Unexpected error while deleting story {story_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred") 