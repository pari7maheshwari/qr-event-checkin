from dependencies import get_current_admin
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models.participant import Participant

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    total_participants = (
        db.query(Participant)
        .count()
    )

    checked_in = (
        db.query(Participant)
        .filter(Participant.checked_in.is_(True))
        .count()
    )

    not_checked_in = total_participants - checked_in

    attendance_percentage = (
        (checked_in / total_participants) * 100
        if total_participants > 0
        else 0
    )

    return {
        "total_participants": total_participants,
        "checked_in": checked_in,
        "not_checked_in": not_checked_in,
        "attendance_percentage": round(
            attendance_percentage,
            2
        )
    }