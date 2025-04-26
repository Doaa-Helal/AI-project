from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import data
import os
app = FastAPI()
app.add_middleware(
     CORSMiddleware,
    allow_origins=["http://localhost:3000" , "https://smartsummarizeai.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(data.data_router)
