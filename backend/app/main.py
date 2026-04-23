from typing import Any

from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def get_health() -> Any:
    return {"status": "healthy"}
