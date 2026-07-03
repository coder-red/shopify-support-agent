from datetime import datetime, timezone
from app.config import settings
from langchain_openai import ChatOpenAI


def _get_llm():
    if settings.llm_provider == "groq":
        return ChatOpenAI(
            model=settings.llm_model, api_key=settings.groq_api_key,
            base_url=settings.groq_base_url, temperature=0.7,
        )
    if settings.llm_provider == "openrouter":
        return ChatOpenAI(
            model=settings.llm_model, api_key=settings.openrouter_api_key,
            base_url=settings.openrouter_base_url, temperature=0.7,
            default_headers={"HTTP-Referer": "https://shopify-support-agent.onrender.com", "X-Title": "Shopify Support Agent"},
        )
    return ChatOpenAI(model=settings.llm_model or "gpt-4o", api_key=settings.openai_api_key, temperature=0.7)


RECOVERY_PROMPT = """You are a cart recovery specialist for {store_name}.

Generate a friendly, personalized recovery message for a customer who abandoned their cart.
The message should:
1. Greet the customer by name
2. Remind them what's in their cart (be specific: item names, quantities, prices)
3. Offer a small incentive (mention free shipping over $75, or a friendly nudge)
4. Include a clear call to action
5. Be warm and conversational, NOT pushy or spammy

Keep it to 3-4 sentences max. Do NOT use markdown or asterisks."""


class CartRecoveryAgent:
    def __init__(self):
        self.llm = _get_llm()

    async def generate_recovery_message(self, cart: dict) -> str:
        items_desc = "; ".join(f"{i['quantity']}x {i['title']} (${i['price']} each)" for i in cart["items"])
        total = cart["total"]
        hours_ago = int((datetime.now(timezone.utc) - datetime.fromisoformat(cart["abandoned_at"].replace("Z", "+00:00"))).total_seconds() / 3600)
        if hours_ago < 1:
            time_desc = "just a little while ago"
        elif hours_ago < 24:
            time_desc = f"about {hours_ago} hours ago"
        else:
            time_desc = f"about {hours_ago // 24} days ago"

        prompt = RECOVERY_PROMPT.format(store_name=settings.store_name)
        prompt += f"\n\nCustomer: {cart['customer_name']}\nItems: {items_desc}\nTotal: ${total}\nAbandoned: {time_desc}"
        prompt += f"\nAttempt #{cart['recovery_attempts'] + 1}"

        result = await self.llm.ainvoke([{"role": "user", "content": prompt}])
        return result.content.strip()
