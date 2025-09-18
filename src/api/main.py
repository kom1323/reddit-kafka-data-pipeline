from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import comments, analytics


app = FastAPI(title="Reddit Kafka Pipeline API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(comments.router, prefix="/comments", tags=["comments"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Reddit Kafka Pipeline API is running!"}