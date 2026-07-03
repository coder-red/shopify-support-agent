from app.config import settings

KB_ENTRIES = [
    {
        "id": "return-policy",
        "title": "Return Policy",
        "keywords": ["return", "refund", "exchange", "money back", "send back"],
        "content": f"Items can be returned within {settings.return_window_days} days of delivery. Items must be unused and in original packaging. Refunds are processed within 5-10 business days after we receive the item. To start a return, contact support with your order number.",
    },
    {
        "id": "shipping-policy",
        "title": "Shipping Policy",
        "keywords": ["shipping", "delivery", "ship", "free shipping", "shipping cost", "shipping time"],
        "content": "Free standard shipping on all orders over $75. Standard shipping takes 5-8 business days. Express shipping (2-3 business days) is available for $12.99. International shipping is $25 flat rate (10-14 business days).",
    },
    {
        "id": "tracking",
        "title": "Order Tracking",
        "keywords": ["track", "tracking", "where is my order", "where's my order", "package", "shipment"],
        "content": "Tracking information is sent via email once your order ships. You can also ask the support agent for your tracking number and tracking URL. Carriers include UPS, FedEx, and USPS.",
    },
    {
        "id": "payment",
        "title": "Payment Methods",
        "keywords": ["payment", "pay", "credit card", "paypal", "afterpay", "affirm", "klarna"],
        "content": "We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, Google Pay, Shop Pay, and Klarna (buy now, pay later in 4 installments). All payments are processed securely.",
    },
    {
        "id": "cancel-order",
        "title": "Cancel an Order",
        "keywords": ["cancel", "cancellation", "change my mind", "cancel order"],
        "content": "Orders can be cancelled within 1 hour of placement if they haven't been fulfilled yet. Contact support immediately with your order number to request a cancellation. Orders that have already shipped cannot be cancelled.",
    },
    {
        "id": "damaged-item",
        "title": "Damaged or Defective Items",
        "keywords": ["damaged", "defective", "broken", "wrong item", "incorrect", "missing"],
        "content": "If you received a damaged, defective, or incorrect item, contact us within 48 hours of delivery with photos. We'll send a replacement or full refund immediately. You don't need to return damaged items.",
    },
    {
        "id": "warranty",
        "title": "Product Warranty",
        "keywords": ["warranty", "guarantee", "repair", "defective", "replacement"],
        "content": "All products come with a 1-year warranty against manufacturing defects. The warranty does not cover normal wear and tear, misuse, or unauthorized modifications. Contact support to file a warranty claim.",
    },
    {
        "id": "gift-card",
        "title": "Gift Cards",
        "keywords": ["gift card", "gift certificate", "gift", "store credit"],
        "content": "Digital gift cards are available from $10 to $500. They are delivered via email within 5 minutes of purchase. Gift cards never expire and can be used on any product in the store.",
    },
    {
        "id": "size-guide",
        "title": "Size Guide",
        "keywords": ["size", "fit", "measurement", "sizing", "measure", "size guide"],
        "content": "Size guides vary by product category. Apparel: XS (0-2), S (4-6), M (8-10), L (12-14), XL (16-18). Shoes: US men's 7-13, women's 5-11. All product pages have detailed measurement guides. Contact support if you need help choosing a size.",
    },
    {
        "id": "loyalty-program",
        "title": "Loyalty Program",
        "keywords": ["loyalty", "rewards", "points", "vip", "member", "loyalty program"],
        "content": "Join our free loyalty program: earn 1 point for every $1 spent. 100 points = $5 off. Members get early access to sales, free birthday gifts, and exclusive discounts. Sign up on your account page.",
    },
    {
        "id": "privacy",
        "title": "Privacy & Security",
        "keywords": ["privacy", "data", "personal information", "secure", "gdpr", "ccpa"],
        "content": "We take your privacy seriously. Your personal information is encrypted and never shared with third parties without your consent. We comply with GDPR and CCPA regulations. You can request data deletion at any time.",
    },
    {
        "id": "order-change",
        "title": "Change Order Details",
        "keywords": ["change address", "change order", "modify order", "update shipping", "change shipping"],
        "content": "You can modify your shipping address or order details within 1 hour of placing the order. After that, the order enters fulfillment and changes may not be possible. Contact support immediately with your order number.",
    },
]


async def query_knowledge_base(query: str) -> str:
    q = query.lower()
    results = []
    for entry in KB_ENTRIES:
        score = 0
        for kw in entry["keywords"]:
            if kw in q:
                score += 1
        if any(word in q for word in entry["title"].lower().split()):
            score += 1
        if any(word in q for word in entry["title"].lower().split()) and len(q.split()) > 2:
            score += 1
        if score > 0:
            results.append((score, entry))

    if not results:
        for entry in KB_ENTRIES:
            words = set(q.split())
            title_words = set(entry["title"].lower().split())
            if words & title_words:
                results.append((1, entry))

    results.sort(key=lambda x: -x[0])
    top = results[:2]
    if not top:
        topic_words = [w for w in q.split() if len(w) > 3]
        for entry in KB_ENTRIES:
            if any(w in entry["content"].lower() for w in topic_words):
                top.append((1, entry))
                break

    if not top:
        return "I couldn't find a specific policy for that. Let me transfer you to a human agent."

    output = []
    for score, entry in top:
        output.append(f"📋 {entry['title']}:\n{entry['content']}")
    return "\n\n".join(output)
