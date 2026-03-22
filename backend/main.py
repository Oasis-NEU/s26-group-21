import os
from dotenv import load_dotenv

from supabase import create_client

from fastapi import FastAPI

load_dotenv() # loading variables from .env

DB_URL = os.getenv("SUPABASE_URL")
DB_KEY = os.getenv("SUPABASE_KEY")

app = FastAPI()

