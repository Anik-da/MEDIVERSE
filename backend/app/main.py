from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import connect_db, close_db
from app.auth.routes import router as auth_router
from app.routes.health import router as health_router
from app.routes.ai_features import router as ai_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage startup and shutdown events."""
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="MediVerse AI",
    description="AI-Powered Healthcare Platform — Backend API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(ai_router)


@app.get("/")
async def root():
    return {
        "service": "MediVerse AI Backend",
        "version": "1.0.0",
        "docs": "/docs",
    }
