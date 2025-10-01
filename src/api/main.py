from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import comments, analytics
from src.stream.kafka_consumer import consume_comments
from src.stream.kafka_admin import setup_topic
from contextlib import asynccontextmanager
import threading

@asynccontextmanager
async def lifespan(app: FastAPI):
    api_exit_event = threading.Event()
    setup_topic()
    kafka_consumer_thread = threading.Thread(target=consume_comments,args=(api_exit_event,),daemon=True)
    kafka_consumer_thread.start()
    yield
    api_exit_event.set()

app = FastAPI(title="Reddit Kafka Pipeline API", lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # React dev server
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(comments.router, prefix="/comments", tags=["comments"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Reddit Kafka Pipeline API is running!"}