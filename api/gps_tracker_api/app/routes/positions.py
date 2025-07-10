from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.PositionOut)
def receive_position(position: schemas.PositionCreate, db: Session = Depends(get_db)):
    return crud.create_position(db, position)

@router.get("/latest/{user_id}", response_model=schemas.PositionOut)
def latest_position(user_id: str, db: Session = Depends(get_db)):
    pos = crud.get_latest_position(db, user_id)
    if not pos:
        return {"detail": "No data"}
    return pos
