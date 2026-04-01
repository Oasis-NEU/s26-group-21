'''
routers/users.py
----------------
All API endpoints related to users.
This file is "plugged in" to main.py using app.include_router().
The prefix "/users" is set in main.py, so we don't repeat it here
'''

from fastapi import APIRouter
from database import supabase  # import the shared Supabase client
from models import User        # import the User data model

# APIRouter works like FastAPI() but for a section of the app
router = APIRouter()


@router.get("/")
async def get_users():
    '''
    Fetch all users from the database.
    '''
    response = (
        supabase.table("users")
        .select("*")
        .execute()
    )
    return response.data

@router.get("/{user_id}")
async def get_specific_user(user_id: str):
    '''
    Fetch a specific user by their unique user_id.

    Params:
        user_id (str): the UUID of the user row in Supabase
    '''
    response = (
        supabase.table("users")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    return response.data

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    '''
    Delete user by their unique user_id.

    Params:
        user_id (str): the UUID of the user row in Supabase
    '''
    response = (
        supabase.table("users")
        .delete()
        .eq("user_id", user_id)
        .execute()
    )
    return response.data

@router.post("/")
async def add_user(user: User):
    '''
    Add a new user to the database.
    FastAPI automatically reads the request body and validates it
    against the User model before this function runs.

    Params:
        user (User): the validated user data from the request body
    '''
    response = (
        supabase.table("users")
        .insert(
            {
                "user_id": user.user_id,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        )
        .execute()
    )
    return response.data
