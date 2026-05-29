from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter(tags=["Health Check"])


@router.get("/health")
async def health_check():
    """Server health check endpoint."""
    return {
        "status": "ok",
        "service": "MediVerse AI Backend",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
