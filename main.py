from typing import Annotated

from fastapi import APIRouter, FastAPI, HTTPException, Path

from fastapi.responses import FileResponse

from fastapi.staticfiles import StaticFiles

from app_routes import app_router

app = FastAPI(title="Todo Items App", version="1.0.0")


@app.get("/")
async def home():
    return FileResponse("./frontend/index.html")


app.include_router(app_router, tags=["basketballstats"], prefix="/basketballstats")


app.mount("/", StaticFiles(directory="frontend"), name="static")