'''Using API endpoints to update textbook listings from database.'''

import os
from dotenv import load_dotenv
from supabase import create_client
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv() # loading variables from .env

DB_URL = os.getenv("SUPABASE_URL")
DB_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(str(DB_URL), str(DB_KEY))

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

class Textbook(BaseModel):
    '''custom types from Pydantic to be used in POST'''
    title: str
    authors: str
    isbn: int
    description: str | None = None
    price: float
    contact_info: str
    image_url: str

@app.get("/listings")
async def get_listings():
    '''get all listings from database'''
    response = (
        supabase.table("textbook_listings")
        .select("*") # selecting all textbook listings
        .execute()
        )
    return response.data

@app.get('/listings/{textbook_id}')
async def get_specific_listing(textbook_id: str):
    '''
    get specific listing from database using a textbook id
    
    Params:
    textbook_id (str): id of textbook to be found from database
    '''
    response = (
        supabase.table("textbook_listings")
        .select("*")
        .eq("textbook_id", textbook_id)
        .execute()
    )
    return response.data

@app.delete('/listings/{textbook_id}')
async def delete_specific_listing(textbook_id: str):
    '''
    delete a listing from database using a textbook id
    
    Params:
    textbook_id (str): id of textbook to be deleted from database
    '''
    response = (
        supabase.table("textbook_listings")
        .delete()
        .eq("textbook_id", textbook_id)
        .execute()
    )
    return response.data

@app.post('/listings')
async def add_listing(textbook: Textbook):
    '''
    
    adding a listing to database
    
    Params:
    textbook (Textbook): instance of Textbook to be posted to
    database
    '''
    response = (
        supabase.table("textbook_listings")
        .insert(
            {
                "title": textbook.title,
                "authors": textbook.authors,
                "isbn": textbook.isbn,
                "description": textbook.description,
                "price": textbook.price,
                "contact_info": textbook.contact_info,
                "image_url": textbook.image_url
            }
        )
        .execute()
    )
    return response.data
