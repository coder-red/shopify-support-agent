from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional

@dataclass
class Order:
    id: int
    order_number: int
    customer_name: str
    customer_email: str
    total_price: str
    currency: str
    financial_status: str
    fulfillment_status: str
    created_at: str
    tracking_company: str
    tracking_number: str
    tracking_url: str

@dataclass
class Variant:
    id: int
    title: str
    price: str
    inventory_quantity: int
    sku: str

@dataclass
class Product:
    id: int
    title: str
    body_html: str
    vendor: str
    variants: list[Variant]

class ShopifyProvider(ABC):
    @abstractmethod
    async def get_order_by_number(self, order_number: str) -> Optional[Order]: ...
    @abstractmethod
    async def get_order_by_email(self, email: str) -> Optional[Order]: ...
    @abstractmethod
    async def search_products(self, query: str) -> list[Product]: ...
    @abstractmethod
    async def get_fulfillments(self, order_id: int) -> list[dict]: ...
    @abstractmethod
    async def get_all_products(self) -> list[Product]: ...
    @abstractmethod
    async def get_all_orders(self) -> list[Order]: ...
    @abstractmethod
    async def check_inventory(self) -> list[dict]: ...
