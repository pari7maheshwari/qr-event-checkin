from fastapi import FastAPI
from sqlalchemy import text

from database import Base, engine
from models.participant import Participant

app = FastAPI()


Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "QR Event Check-In API is running"}


@app.get("/health")
def health_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"database": result.scalar() == 1}