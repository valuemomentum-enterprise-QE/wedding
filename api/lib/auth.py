import os
from datetime import datetime, timedelta, timezone

import jwt

from .http import get_bearer_token


def expected_passcode() -> str:
    return os.environ.get("PLANNER_PASSCODE", "16102026")


def jwt_secret() -> str:
    secret = os.environ.get("JWT_SECRET")
    if not secret:
        raise RuntimeError("JWT_SECRET is not configured")
    return secret


def issue_token() -> str:
    payload = {
        "sub": "planner",
        "exp": datetime.now(timezone.utc) + timedelta(days=30),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, jwt_secret(), algorithm="HS256")


def verify_request(handler) -> bool:
    token = get_bearer_token(handler)
    if not token:
        return False
    try:
        jwt.decode(token, jwt_secret(), algorithms=["HS256"])
        return True
    except jwt.PyJWTError:
        return False
