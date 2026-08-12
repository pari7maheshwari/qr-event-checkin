import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models.participant import Participant
from schemas.participant import ParticipantCreate

router = APIRouter(
    prefix="/api/participants",
    tags=["Participants"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/")
def create_participant(
    participant_data: ParticipantCreate,
    db: Session = Depends(get_db)
):
    existing_email = (
        db.query(Participant)
        .filter(Participant.email == participant_data.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="A participant with this email already exists."
        )

    existing_roll_number = (
        db.query(Participant)
        .filter(
            Participant.roll_number == participant_data.roll_number
        )
        .first()
    )

    if existing_roll_number:
        raise HTTPException(
            status_code=400,
            detail="A participant with this roll number already exists."
        )

    qr_token = secrets.token_urlsafe(32)

    participant = Participant(
        name=participant_data.name,
        roll_number=participant_data.roll_number,
        email=participant_data.email,
        qr_token=qr_token
    )

    db.add(participant)
    db.commit()
    db.refresh(participant)

    return participant