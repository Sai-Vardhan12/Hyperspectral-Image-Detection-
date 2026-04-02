"""
Hyperspectral Image Object Detection - FastAPI Backend
Entry point: uvicorn main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

app = FastAPI(
    title="Hyperspectral Image Object Detection API",
    description="PCA + CNN Patch-Based Prediction with Visualization",
    version="1.0.0"
)

# Allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {"message": "Hyperspectral Detection API is running 🚀"}


@app.get("/health")
def health():
    return {"status": "ok"}
