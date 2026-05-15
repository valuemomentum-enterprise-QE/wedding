import os

import pytest


def pytest_configure(config):
    config.addinivalue_line(
        "markers",
        "mongo: requires MONGO_URL",
    )
    config.addinivalue_line(
        "markers",
        "live_api: requires API_BASE_URL (and PLANNER_PASSCODE for auth)",
    )


@pytest.fixture(scope="session")
def mongo_url():
    url = os.environ.get("MONGO_URL") or os.environ.get("MONGODB_URI")
    if not url:
        pytest.skip("Set MONGO_URL or MONGODB_URI for cluster tests")
    return url


@pytest.fixture(scope="session")
def db_name():
    return os.environ.get("DB_NAME", "wedding")


@pytest.fixture(scope="session")
def api_base_url():
    base = os.environ.get("API_BASE_URL", "").strip().rstrip("/")
    if not base:
        pytest.skip(
            "Set API_BASE_URL for live API tests (e.g. https://your-app.vercel.app)",
        )
    return base
