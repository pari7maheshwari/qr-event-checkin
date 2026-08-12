import secrets

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from database import SessionLocal
from models.participant import Participant
from schemas.participant import ParticipantCreate
from utils.qr import generate_qr_code
from dependencies import get_current_admin

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
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
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

@router.get("/{participant_id}/qr")
def get_participant_qr(
    participant_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    participant = (
        db.query(Participant)
        .filter(Participant.id == participant_id)
        .first()
    )

    if not participant:
        raise HTTPException(
            status_code=404,
            detail="Participant not found."
        )

    qr_image = generate_qr_code(participant.qr_token)

    return Response(
        content=qr_image,
        media_type="image/png"
    )

@router.get("/")
def get_participants(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    participants = (
        db.query(Participant)
        .order_by(Participant.created_at.desc())
        .all()
    )

    return participants