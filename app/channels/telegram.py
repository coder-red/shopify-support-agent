import httpx
from app.config import settings
from app.channels.base import ChannelAdapter


class TelegramAdapter(ChannelAdapter):
    def __init__(self):
        self.bot_token = settings.telegram_bot_token
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"
        self.owner_chat_id = settings.owner_telegram_chat_id

    async def _send(self, chat_id: str, text: str) -> bool:
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    f"{self.base_url}/sendMessage",
                    json={"chat_id": chat_id, "text": text},
                    timeout=10,
                )
                return resp.is_success
        except Exception as e:
            print(f"Telegram send error: {e}")
            return False

    async def send_message(self, recipient: str, text: str) -> bool:
        return await self._send(recipient, text)

    async def send_to_owner(self, text: str) -> bool:
        return await self._send(self.owner_chat_id, text)
