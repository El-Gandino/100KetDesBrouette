from pydantic import BaseModel
from datetime import datetime

class PositionCreate(BaseModel):
    user_id: str
    latitude: float
    longitude: float
    timestamp: datetime
    source: str

class PositionOut(PositionCreate):
    id: int

    class Config:
        orm_mode = True
