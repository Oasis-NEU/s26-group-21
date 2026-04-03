'''
routers/listings.py
-------------------
All API endpoints related to textbook listings.
This file is "plugged in" to main.py using app.include_router().
The prefix "/listings" is set in main.py, so we don't repeat it here.
'''

from fastapi import APIRouter
from database import supabase  # import the shared Supabase client
from models import Textbook    # import the Textbook data model

# APIRouter works like FastAPI() but for a section of the app
router = APIRouter()

# FastAPI reads top down, want to make sure it matches ids
# Should get less specific as we move down

@router.get("/")
async def get_listings():
    '''Fetch every textbook listing from the database.'''
    response = (
        supabase.table("textbook_listings")
        .select("*")
        .order('listed_at', desc=True)
        .execute()
    )
    return response.data

@router.get("/user/{user_id}")
async def get_listings_by_user(user_id: str):
    '''
    Fetch listings by unique user_id.

    Params:
        user_id (str): the UUID of the user row as a foreign key
                        matches user to what textbooks they own
    '''
    response = (
        supabase.table("textbook_listings")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    return response.data



@router.get("/{textbook_id}")
async def get_listing_by_textbook(textbook_id: str):
    '''
    Fetch one listing by its unique textbook_id.

    Params:
        textbook_id (str): the UUID of the textbook row in Supabase
    '''
    response = (
        supabase.table("textbook_listings")
        .select("*")
        .eq("textbook_id", textbook_id)
        .execute()
    )
    return response.data


@router.delete("/{textbook_id}")
async def delete_listing(textbook_id: str):
    '''
    Delete one listing by its unique textbook_id.

    Params:
        textbook_id (str): the UUID of the textbook row to delete
    '''
    response = (
        supabase.table("textbook_listings")
        .delete()
        .eq("textbook_id", textbook_id)
        .execute()
    )
    return response.data


@router.post("/")
async def add_listing(textbook: Textbook):
    '''
    Add a new textbook listing to the database.
    FastAPI automatically reads the request body and validates it
    against the Textbook model before this function runs.

    Params:
        textbook (Textbook): the validated listing data from the request body
    '''
    response = (
        supabase.table("textbook_listings")
        .insert(
            {
                "user_id": textbook.user_id,
                "title": textbook.title,
                "authors": textbook.authors,
                "isbn": textbook.isbn,
                "category": textbook.category,
                "description": textbook.description,
                "price": textbook.price,
                "image_url": textbook.image_url,
            }
        )
        .execute()
    )
    return response.data
