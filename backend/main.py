import os
from dotenv import load_dotenv
from supabase import create_client
from fastapi import FastAPI
from pydantic import BaseModel

load_dotenv() # loading variables from .env

DB_URL = os.getenv("SUPABASE_URL")
DB_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(str(DB_URL), str(DB_KEY))

app = FastAPI()

# custom types from Pydantic to be used in POST
class Textbook(BaseModel):
    title: str
    authors: str
    isbn: int
    description: str | None = None
    price: float
    contact_info: str

# get all listings from database
@app.get("/listings")
async def get_listings():
    response = (
        supabase.table("textbook_listings")
        .select("*") # selecting all textbook listings
        .execute()
        )
    return response.data

# get specific listing from database using a textbook id
@app.get('/listings/{textbook_id}')
async def get_specific_listing(textbook_id: str):
    response = (
        supabase.table("textbook_listings")
        .select("*")
        .eq("textbook_id", textbook_id)
        .execute()
    )
    return response.data

# delete a listing from database using a textbook id
@app.delete('/listings/{textbook_id}')
async def delete_specific_listing(textbook_id: str):
    response = (
        supabase.table("textbook_listings")
        .delete()
        .eq("textbook_id", textbook_id)
        .execute()
    )
    return response.data

# adding a listing to database
@app.post('/listings')
async def add_listing(textbook: Textbook):
    response = (
        supabase.table("textbook_listings")
        .insert(
            {
                "title": textbook.title,
                "authors": textbook.authors,
                "isbn": textbook.isbn,
                "description": textbook.description,
                "price": textbook.price,
                "contact_info": textbook.contact_info
            }
        )
        .execute()
    )
    return response.data
