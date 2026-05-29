from fastapi import APIRouter, HTTPException, status
from passlib.context import CryptContext
from datetime import datetime, timezone

from app.database import get_db
from app.auth.models import UserRegister, UserLogin, TokenResponse, UserResponse
from app.auth.jwt_handler import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    """Register a new user account."""
    db = get_db()

    # Check if email already exists
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create user document
    user_doc = {
        "name": user.name,
        "email": user.email,
        "password": pwd_context.hash(user.password),
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.users.insert_one(user_doc)

    # Generate JWT
    token = create_access_token({"sub": str(result.inserted_id), "email": user.email})

    return TokenResponse(
        access_token=token,
        user=UserResponse(id=str(result.inserted_id), name=user.name, email=user.email),
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Authenticate user and return JWT."""
    db = get_db()

    user = await db.users.find_one({"email": credentials.email})
    if not user or not pwd_context.verify(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": str(user["_id"]), "email": user["email"]})

    return TokenResponse(
        access_token=token,
        user=UserResponse(id=str(user["_id"]), name=user["name"], email=user["email"]),
    )
