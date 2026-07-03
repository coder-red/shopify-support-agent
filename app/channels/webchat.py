from app.channels.base import ChannelAdapter


class WebChatAdapter(ChannelAdapter):
    async def send_message(self, recipient: str, text: str) -> bool:
        return True

    async def send_to_owner(self, text: str) -> bool:
        print(f"[OWNER ALERT] {text}")
        return True
