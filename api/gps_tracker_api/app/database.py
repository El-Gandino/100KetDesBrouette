from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./gps.db"  # Pour démarrer simple. Passe à PostgreSQL plus tard.

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def create_tables():
    from app import models
    Base.metadata.create_all(bind=engine)