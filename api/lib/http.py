import json
from http.server import BaseHTTPRequestHandler


def read_json_body(handler: BaseHTTPRequestHandler):
    length = int(handler.headers.get("Content-Length", 0) or 0)
    if length <= 0:
        return None
    raw = handler.rfile.read(length)
    if not raw:
        return None
    return json.loads(raw.decode("utf-8"))


def _send_cors_headers(handler: BaseHTTPRequestHandler) -> None:
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")


def send_cors_preflight(handler: BaseHTTPRequestHandler) -> None:
    """204 must not include a body; invalid 204 responses often drop CORS at the edge."""
    handler.send_response(204)
    _send_cors_headers(handler)
    handler.end_headers()


def send_json(handler: BaseHTTPRequestHandler, status: int, payload: dict):
    body = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(body)))
    _send_cors_headers(handler)
    handler.end_headers()
    handler.wfile.write(body)


def handle_options(handler: BaseHTTPRequestHandler) -> bool:
    if handler.command == "OPTIONS":
        send_cors_preflight(handler)
        return True
    return False


def get_bearer_token(handler: BaseHTTPRequestHandler):
    auth = handler.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:].strip()
    return None
