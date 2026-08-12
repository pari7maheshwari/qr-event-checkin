from fastapi import FastAPI
from sqlalchemy import text

from database import Base, engine
from models.participant import Participant
from routes.participants import router as participant_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(participant_router)


@app.get("/")
def root():
    return {"message": "QR Event Check-In API is running"}


@app.get("/health")
def health_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"database": result.scalar() == 1}