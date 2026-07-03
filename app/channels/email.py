import resend
from app.config import settings
from app.channels.base import ChannelAdapter


class EmailAdapter(ChannelAdapter):
    def __init__(self):
        resend.api_key = settings.resend_api_key
        self.from_email = settings.support_email
        self.owner_email = settings.owner_email

    async def send_message(self, recipient: str, text: str) -> bool:
        try:
            params = {"from": self.from_email, "to": recipient, "subject": "Support Update", "text": text}
            resend.Emails.send(params)
            return True
        except Exception as e:
            print(f"Email send error: {e}")
            return False

    async def send_to_owner(self, text: str) -> bool:
        return await self.send_message(self.owner_email, text)
