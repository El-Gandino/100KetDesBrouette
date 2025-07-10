from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database import Base
from datetime import datetime
from .suunto import Suunto

class Position(Base):
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    source = Column(String)
