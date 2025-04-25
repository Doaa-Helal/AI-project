from fastapi import FastAPI
from routes import data
import os

app=FastAPI()
app.include_router(data.data_router)


