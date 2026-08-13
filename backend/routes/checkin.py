from dependencies import get_current_admin
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models.participant import Participant
from schemas.checkin import CheckInRequest

router = APIRouter(
    prefix="/api/checkin",
    tags=["Check-In"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/")
def check_in(
    checkin_data: CheckInRequest,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    participant = (
        db.query(Participant)
        .filter(Participant.qr_token == checkin_data.qr_token)
        .first()
    )

    if not participant:
        raise HTTPException(
            status_code=404,
            detail="Invalid QR code."
        )

    if participant.checked_in:
        raise HTTPException(
            status_code=409,
            detail="Participant has already checked in."
        )

    participant.checked_in = True
    participant.checked_in_at = datetime.utcnow()

    db.commit()
    db.refresh(participant)

    return {
        "message": "Check-in successful.",
        "participant": {
            "id": participant.id,
            "name": participant.name,
            "roll_number": participant.roll_number,
            "checked_in_at": participant.checked_in_at
        }
    }