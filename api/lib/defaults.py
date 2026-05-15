import json
from pathlib import Path

_DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _load_json(name: str):
    path = _DATA_DIR / name
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def default_guests():
    return _load_json("guests.json")


def default_events():
    return _load_json("events.json")
