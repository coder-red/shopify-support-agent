from app.config import settings
from app.shopify.provider import ShopifyProvider
from app.shopify.mock_provider import MockShopifyProvider
from app.shopify.real_provider import RealShopifyProvider

_provider: ShopifyProvider = None


def get_shopify_provider() -> ShopifyProvider:
    global _provider
    if _provider is not None:
        return _provider
    if settings.demo_mode:
        _provider = MockShopifyProvider()
    else:
        _provider = RealShopifyProvider()
    return _provider


def reset_provider():
    global _provider
    _provider = None
