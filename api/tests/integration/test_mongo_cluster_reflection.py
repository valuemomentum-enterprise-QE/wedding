"""
Verify the same MongoDB cluster your app uses reflects writes (integration).

Run from repo root:

  pip install -r requirements-dev.txt
  set MONGO_URL=your-atlas-uri
  pytest api/tests/integration/test_mongo_cluster_reflection.py -v

Optional:
  set DB_NAME=wedding
  set API_BASE_URL=https://your-app.vercel.app
  set PLANNER_PASSCODE=your-passcode
"""

from __future__ import annotations

import os
import time
import uuid

import pytest
import requests
from pymongo import MongoClient
from pymongo.errors import PyMongoError

PROBE_DOC_ID = "__integration_probe__"


@pytest.mark.mongo
def test_admin_ping_reaches_cluster(mongo_url, db_name):
    client = MongoClient(mongo_url, serverSelectionTimeoutMS=10_000)
    try:
        client.admin.command("ping")
    finally:
        client.close()


@pytest.mark.mongo
def test_planner_collection_accepts_write_and_reflects_read(mongo_url, db_name):
    """Uses a dedicated probe document — does not modify planner doc 'main'."""
    run_id = str(uuid.uuid4())
    client = MongoClient(mongo_url, serverSelectionTimeoutMS=10_000)
    try:
        col = client[db_name]["planner"]
        col.update_one(
            {"_id": PROBE_DOC_ID},
            {
                "$set": {
                    "_id": PROBE_DOC_ID,
                    "type": "pytest_cluster_probe",
                    "run_id": run_id,
                    "ts": time.time(),
                }
            },
            upsert=True,
        )
        doc = col.find_one({"_id": PROBE_DOC_ID})
        assert doc is not None, "Probe document missing after upsert"
        assert doc.get("run_id") == run_id
    finally:
        try:
            client[db_name]["planner"].delete_one({"_id": PROBE_DOC_ID})
        except PyMongoError:
            pass
        client.close()


@pytest.mark.mongo
def test_main_planner_doc_readable_if_present(mongo_url, db_name):
    """Reads production-shaped doc if it exists; does not require it on empty clusters."""
    client = MongoClient(mongo_url, serverSelectionTimeoutMS=10_000)
    try:
        col = client[db_name]["planner"]
        doc = col.find_one({"_id": "main"})
        if doc is None:
            pytest.skip("No planner document 'main' yet (normal before first planner use)")
        assert isinstance(doc, dict)
        # App stores list fields — at least one may exist after UI use
        for key in ("tasks", "guests", "events", "budgetItems"):
            if key in doc:
                assert isinstance(doc[key], list), f"Field {key} should be a list"
    finally:
        client.close()


@pytest.mark.live_api
def test_live_login_returns_token(api_base_url):
    passcode = os.environ.get("PLANNER_PASSCODE", "16102026")
    r = requests.post(
        f"{api_base_url}/api/auth/login",
        json={"passcode": passcode},
        headers={"Content-Type": "application/json"},
        timeout=30,
    )
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and data["token"], "login JSON missing token"


@pytest.mark.live_api
def test_live_tasks_endpoint_reflects_backend_state(api_base_url):
    passcode = os.environ.get("PLANNER_PASSCODE", "16102026")
    login = requests.post(
        f"{api_base_url}/api/auth/login",
        json={"passcode": passcode},
        headers={"Content-Type": "application/json"},
        timeout=30,
    )
    assert login.status_code == 200, login.text
    token = login.json()["token"]

    r = requests.get(
        f"{api_base_url}/api/tasks",
        headers={"Authorization": f"Bearer {token}"},
        timeout=30,
    )
    assert r.status_code == 200, f"GET /api/tasks: {r.status_code} {r.text}"
    data = r.json()
    assert "items" in data
    assert isinstance(data["items"], list)
