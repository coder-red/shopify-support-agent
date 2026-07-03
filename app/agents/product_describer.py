from langchain_openai import ChatOpenAI
from app.config import settings


def _get_llm():
    if settings.llm_provider == "groq":
        return ChatOpenAI(
            model=settings.llm_model, api_key=settings.groq_api_key,
            base_url=settings.groq_base_url, temperature=0.8,
        )
    if settings.llm_provider == "openrouter":
        return ChatOpenAI(
            model=settings.llm_model, api_key=settings.openrouter_api_key,
            base_url=settings.openrouter_base_url, temperature=0.8,
        )
    return ChatOpenAI(model=settings.llm_model or "gpt-4o", api_key=settings.openai_api_key, temperature=0.8)


DESCRIPTION_PROMPT = """You are an expert e-commerce copywriter for {store_name}. Write THREE distinct product description variations for a new product.

Product name: {name}
Category: {category}
Key features: {features}
Target audience: {audience}

For each variation, make it:
- 2-3 sentences
- Engaging and benefit-driven
- Tone-appropriate for the target audience

Variation 1 — Professional & detailed:
Variation 2 — Short & punchy (for mobile):
Variation 3 — Story-driven & emotional:

Label each clearly with the variation name on its own line, then the description text on the next line. Do not add extra commentary."""


class ProductDescriber:
    def __init__(self):
        self.llm = _get_llm()

    async def generate(self, name: str, category: str, features: str, audience: str = "online shoppers") -> str:
        prompt = DESCRIPTION_PROMPT.format(
            store_name=settings.store_name,
            name=name,
            category=category,
            features=features,
            audience=audience,
        )
        result = await self.llm.ainvoke([{"role": "user", "content": prompt}])
        return result.content.strip()
