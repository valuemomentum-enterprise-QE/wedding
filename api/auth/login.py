import os
import sys

# Vercel runs each function with api/ on the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from http.server import BaseHTTPRequestHandler

from lib.auth import expected_passcode, issue_token, jwt_secret
from lib.db import mongo_configured, ping_mongo
from lib.http import handle_options, read_json_body, send_json


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        handle_options(self)

    def do_GET(self):
        """Browser / health checks use GET; only POST is supported (avoids 501 from BaseHTTPRequestHandler)."""
        if handle_options(self):
            return
        send_json(
            self,
            405,
            {
                "error": "Method not allowed",
                "hint": 'Send POST with JSON body: {"passcode": "..."}',
            },
        )

    def do_POST(self):
        if handle_options(self):
            return

        if not mongo_configured():
            send_json(self, 503, {"error": "Database not configured"})
            return

        try:
            jwt_secret()
        except RuntimeError as exc:
            send_json(self, 503, {"error": str(exc)})
            return

        if not ping_mongo():
            send_json(self, 503, {"error": "Cannot reach MongoDB"})
            return

        try:
            body = read_json_body(self) or {}
            passcode = (body.get("passcode") or "").strip()
            if passcode != expected_passcode():
                send_json(self, 401, {"error": "Incorrect passcode"})
                return

            token = issue_token()
            send_json(self, 200, {"token": token})
        except Exception as exc:
            send_json(self, 500, {"error": str(exc)})
