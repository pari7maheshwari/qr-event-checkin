from fastapi import FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from models.participant import Participant
from models.admin import Admin

from routes.participants import router as participant_router
from routes.checkin import router as checkin_router
from routes.dashboard import router as dashboard_router
from routes.auth import router as auth_router


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
app.include_router(checkin_router)
app.include_router(dashboard_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {"message": "QR Event Check-In API is running"}


@app.get("/health")
def health_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

    return {"database": result.scalar() == 1}