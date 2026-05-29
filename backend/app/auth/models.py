from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserRegister(BaseModel):
    """Schema for user registration."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user data in API responses (no password)."""
    id: str
    name: str
    email: str


class TokenResponse(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class SymptomRequest(BaseModel):
    """Schema for symptom checker input."""
    symptoms: list[str] = Field(..., min_length=1)


class EmergencyAlertRequest(BaseModel):
    """Schema for emergency alert input."""
    latitude: float
    longitude: float
    description: Optional[str] = None
    severity: Optional[str] = "unknown"


class MentalHealthMessage(BaseModel):
    """Schema for mental health chat input."""
    message: str = Field(..., min_length=1)
    mood: Optional[str] = None
