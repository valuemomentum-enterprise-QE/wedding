import os

from pymongo import MongoClient
from pymongo.errors import PyMongoError

_client = None
PLANNER_DOC_ID = "main"


def mongo_configured() -> bool:
    return bool(os.environ.get("MONGO_URL"))


def get_collection():
    global _client
    if not mongo_configured():
        raise RuntimeError("MONGO_URL is not configured")

    if _client is None:
        _client = MongoClient(os.environ["MONGO_URL"], serverSelectionTimeoutMS=5000)

    db_name = os.environ.get("DB_NAME", "wedding")
    return _client[db_name]["planner"]


def get_planner_field(field: str, default=None):
    col = get_collection()
    doc = col.find_one({"_id": PLANNER_DOC_ID}, {field: 1})
    if not doc or field not in doc:
        return default if default is not None else []
    return doc[field]


def set_planner_field(field: str, value):
    col = get_collection()
    col.update_one(
        {"_id": PLANNER_DOC_ID},
        {"$set": {field: value}},
        upsert=True,
    )


def ping_mongo() -> bool:
    try:
        get_collection().database.client.admin.command("ping")
        return True
    except (PyMongoError, RuntimeError):
        return False
