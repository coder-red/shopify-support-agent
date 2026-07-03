from abc import ABC, abstractmethod


class ChannelAdapter(ABC):
    @abstractmethod
    async def send_message(self, recipient: str, text: str) -> bool:
        ...

    @abstractmethod
    async def send_to_owner(self, text: str) -> bool:
        ...
