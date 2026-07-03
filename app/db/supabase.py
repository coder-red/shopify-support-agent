import json
import os
from datetime import datetime, timezone
from app.config import settings

_conversations: dict[str, list] = {}
_escalations: list[dict] = []

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
os.makedirs(DATA_DIR, exist_ok=True)
CONV_FILE = os.path.join(DATA_DIR, "conversations.json")
ESC_FILE = os.path.join(DATA_DIR, "escalations.json")


def _load_json(path: str) -> dict:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def _save_json(path: str, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str)


async def get_conversation(customer_identifier: str) -> list:
    global _conversations
    if not _conversations:
        _conversations = _load_json(CONV_FILE)
    return _conversations.get(customer_identifier, [])


async def save_conversation(customer_identifier: str, messages: list):
    global _conversations
    _conversations[customer_identifier] = messages
    _save_json(CONV_FILE, _conversations)


async def get_all_conversations() -> dict:
    global _conversations
    if not _conversations:
        _conversations = _load_json(CONV_FILE)
    return _conversations


async def get_all_escalations() -> list:
    global _escalations
    if not _escalations:
        loaded = _load_json(ESC_FILE)
        _escalations = loaded if isinstance(loaded, list) else []
    return _escalations


def log_escalation(customer_message: str, conversation_history: str, reason: str):
    global _escalations
    entry = {
        "id": len(_escalations) + 1,
        "customer_message": customer_message,
        "conversation_snapshot": conversation_history,
        "reason": reason,
        "resolved": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _escalations.append(entry)
    _save_json(ESC_FILE, _escalations)
