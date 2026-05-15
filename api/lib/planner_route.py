import json
from http.server import BaseHTTPRequestHandler

from .auth import verify_request
from .db import get_planner_field, mongo_configured, set_planner_field
from .http import handle_options, read_json_body, send_json


def make_planner_handler(field: str, seed_if_empty=None):
    """Factory for GET/PUT handlers on a planner list field."""

    class PlannerHandler(BaseHTTPRequestHandler):
        def do_OPTIONS(self):
            handle_options(self)

        def do_GET(self):
            if handle_options(self):
                return
            if not mongo_configured():
                send_json(self, 503, {"error": "Database not configured"})
                return
            if not verify_request(self):
                send_json(self, 401, {"error": "Unauthorized"})
                return
            try:
                items = get_planner_field(field, [])
                if not isinstance(items, list):
                    items = []
                if len(items) == 0 and seed_if_empty is not None:
                    items = seed_if_empty()
                    set_planner_field(field, items)
                send_json(self, 200, {"items": items})
            except Exception as exc:
                send_json(self, 500, {"error": str(exc)})

        def do_PUT(self):
            if handle_options(self):
                return
            if not mongo_configured():
                send_json(self, 503, {"error": "Database not configured"})
                return
            if not verify_request(self):
                send_json(self, 401, {"error": "Unauthorized"})
                return
            try:
                body = read_json_body(self)
                if body is None or "items" not in body:
                    send_json(self, 400, {"error": "Expected JSON body: { \"items\": [...] }"})
                    return
                items = body["items"]
                if not isinstance(items, list):
                    send_json(self, 400, {"error": "items must be an array"})
                    return
                set_planner_field(field, items)
                send_json(self, 200, {"items": items})
            except json.JSONDecodeError:
                send_json(self, 400, {"error": "Invalid JSON"})
            except Exception as exc:
                send_json(self, 500, {"error": str(exc)})

    return PlannerHandler
