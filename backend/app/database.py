from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

_client: AsyncIOMotorClient | None = None
_db = None


async def connect_db():
    """Open the MongoDB connection pool."""
    global _client, _db
    _client = AsyncIOMotorClient(settings.MONGODB_URI)
    _db = _client[settings.DATABASE_NAME]
    print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")


async def close_db():
    """Close the MongoDB connection pool."""
    global _client
    if _client:
        _client.close()
        print("🔌 MongoDB connection closed")


def get_db():
    """Return the current database instance."""
    return _db
