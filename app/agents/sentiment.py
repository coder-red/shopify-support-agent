from app.config import settings
from langchain_openai import ChatOpenAI


def _get_llm():
    if settings.llm_provider == "groq":
        return ChatOpenAI(model=settings.llm_model, api_key=settings.groq_api_key, base_url=settings.groq_base_url, temperature=0)
    if settings.llm_provider == "openrouter":
        return ChatOpenAI(model=settings.llm_model, api_key=settings.openrouter_api_key, base_url=settings.openrouter_base_url, temperature=0)
    return ChatOpenAI(model=settings.llm_model or "gpt-4o", api_key=settings.openai_api_key, temperature=0)


_llm = _get_llm()


SENTIMENT_PROMPT = """Analyze the sentiment of this customer support message. Respond with exactly one word:
- positive (happy, satisfied, grateful, pleased)
- neutral (factual question, neutral inquiry)
- negative (frustrated, angry, upset, complaining, urgent)

Message: {message}

Sentiment:"""


async def analyze_sentiment(message: str) -> str:
    prompt = SENTIMENT_PROMPT.format(message=message[:500])
    try:
        result = await _llm.ainvoke([{"role": "user", "content": prompt}])
        sentiment = result.content.strip().lower()
        if sentiment in ("positive", "neutral", "negative"):
            return sentiment
        return "neutral"
    except Exception:
        return "neutral"
