from pydantic import BaseModel, EmailStr


class ParticipantCreate(BaseModel):
    name: str
    roll_number: str
    email: EmailStr