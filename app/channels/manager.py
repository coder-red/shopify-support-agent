from app.config import settings
from app.channels.base import ChannelAdapter
from app.channels.whatsapp import WhatsAppAdapter
from app.channels.telegram import TelegramAdapter
from app.channels.email import EmailAdapter
from app.channels.webchat import WebChatAdapter


class ChannelManager:
    def __init__(self):
        self.adapter: ChannelAdapter = self._load_adapter()

    def _load_adapter(self) -> ChannelAdapter:
        channel = settings.channel.lower()
        if channel == "whatsapp":
            return WhatsAppAdapter()
        elif channel == "telegram":
            return TelegramAdapter()
        elif channel == "email":
            return EmailAdapter()
        elif channel == "webchat":
            return WebChatAdapter()
        raise ValueError(f"Unknown channel: {channel}")

    async def send_message(self, recipient: str, text: str) -> bool:
        return await self.adapter.send_message(recipient, text)

    async def send_to_owner(self, text: str) -> bool:
        return await self.adapter.send_to_owner(text)


channel_manager = ChannelManager()
