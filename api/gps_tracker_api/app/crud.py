from sqlalchemy.orm import Session
from app import models, schemas

def create_position(db: Session, pos: schemas.PositionCreate):
    db_pos = models.Position(**pos.dict())
    db.add(db_pos)
    db.commit()
    db.refresh(db_pos)
    return db_pos

def get_latest_position(db: Session, user_id: str):
    return db.query(models.Position).filter_by(user_id=user_id).order_by(models.Position.timestamp.desc()).first()
