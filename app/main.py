from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.api.routes import router
from app.api.store_routes import router as store_router
from app.config import settings
from app.inventory_alert import check_inventory_and_alert

scheduler = AsyncIOScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"Starting {settings.store_name} support agent")
    print(f"  Demo mode: {settings.demo_mode}")
    print(f"  Channel: {settings.channel}")
    print(f"  LLM: {settings.llm_provider} / {settings.llm_model}")
    scheduler.add_job(
        check_inventory_and_alert, "interval", hours=6,
        id="inventory_alert", replace_existing=True,
    )
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(title="Shopify Support Agent", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(store_router)

print("API only mode - frontend served separately")
