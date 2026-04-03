from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.endpoints import router

app = FastAPI(
    title="NLP Resume Parser API",
    description="API for parsing resumes, extracting information, and matching with jobs.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for MVP. In prod, restrict to frontend domain.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the NLP Resume Parser API"}
