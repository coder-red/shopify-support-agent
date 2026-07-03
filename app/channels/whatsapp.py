from twilio.rest import Client
from app.config import settings
from app.channels.base import ChannelAdapter


class WhatsAppAdapter(ChannelAdapter):
    def __init__(self):
        self.client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
        self.from_number = settings.twilio_whatsapp_number
        self.owner_number = settings.owner_whatsapp_number

    async def send_message(self, recipient: str, text: str) -> bool:
        try:
            self.client.messages.create(body=text, from_=self.from_number, to=recipient)
            return True
        except Exception as e:
            print(f"WhatsApp send error: {e}")
            return False

    async def send_to_owner(self, text: str) -> bool:
        return await self.send_message(self.owner_number, text)
