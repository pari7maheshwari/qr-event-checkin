from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import SessionLocal
from models.admin import Admin
from auth import verify_password, create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

class LoginRequest(BaseModel):
    username: str
    password: str

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db)
):
    username = credentials.username
    password = credentials.password
    admin = (
        db.query(Admin)
        .filter(Admin.username == username)
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is inactive"
        )

    if not verify_password(
        password,
        admin.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    access_token = create_access_token(
        {
            "sub": str(admin.id),
            "username": admin.username
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }