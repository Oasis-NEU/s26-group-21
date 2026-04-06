'''
routers/wants.py
-------------------
All API endpoints related to textbook listings the user wants.
This file is "plugged in" to main.py using app.include_router().
The prefix "/wants" is set in main.py, so we don't repeat it here.
'''

from fastapi import APIRouter
from database import supabase  # import the shared Supabase client
from models import Want        # import the Want data model

# APIRouter works like FastAPI() but for a section of the app
router = APIRouter()

@router.get('/{user_id}')
async def get_wants(user_id: str):
    '''
    Fetch all textbooks that user has under 'wants' from database
    
    Params:
        user_id (str): the UUID of the user as a foreign key
                        matches user to what textbooks they want
    '''
    response = (
        supabase.table("wants")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    return response.data

@router.delete('/{textbook_id}')
async def remove_want(textbook_id: str):
    '''
    Remove a textbook from a user's wants

    Params:
        textbook_id (str): the UUID of the textbook the user wants to remove
    '''
    response = (
        supabase.table("wants")
        .delete()
        .eq("textbook_id", textbook_id)
        .execute()
    )
    return response.data

@router.post('/')
async def add_want(want: Want):
    '''
    Add a wanted textbook to 'wants' in database

    Params:
        want (Want): the validated want data (user & textbook id) from the
                        request body
    '''
    response = (
        supabase.table("wants")
        .insert(
            {
                "user_id": want.user_id,
                "textbook_id": want.textbook_id
            }
        )
        .execute()
    )
    return response.data
