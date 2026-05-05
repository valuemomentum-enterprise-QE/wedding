from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone

from supabase import create_client


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
supabase_url = os.environ.get(
    'SUPABASE_URL',
    'https://cofrnevdytahhsjtnedl.supabase.co',
)
supabase_key = os.environ.get(
    'SUPABASE_KEY',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvZnJuZXZkeXRhaGhzanRuZWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODg1MDUsImV4cCI6MjA5MzU2NDUwNX0.sZb3qba_E772u_yyvzZAhSipt5lnjgm03OmIVDh8qis',
)
sb = create_client(supabase_url, supabase_key)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


# Add your routes to the router instead of directly to app
@api_router.get("/")
def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())

    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()

    sb.table('status_checks').insert(doc).execute()
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
def get_status_checks():
    result = sb.table('status_checks').select('*').limit(1000).execute()
    rows = result.data or []

    for check in rows:
        if isinstance(check.get('timestamp'), str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])

    return rows


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
