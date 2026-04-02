'''
models.py
---------
Pydantic models define the shape of data coming into the API.
FastAPI uses these to automatically validate request bodies —
if a required field is missing or the wrong type, it rejects the request.
'''

from pydantic import BaseModel

class Textbook(BaseModel):
    '''
    Represents the data needed to create a new textbook listing.
    Each field maps to a column in the textbook_listings table in Supabase.

    Fields:
        user_id     (str)        : the UUID of the user who owns the textbook
        title       (str)        : name of the textbook
        authors     (str)        : author(s) of the textbook
        isbn        (int)        : unique ISBN number
        category    (str)        : the category of which the textbook falls under
        description (str | None) : optional description — can be left blank
        price       (float)      : listing price in dollars
        image_url   (str)        : link to an image of the textbook
    '''
    user_id: str
    title: str
    authors: str
    isbn: int
    category: str
    description: str | None = None
    price: float
    image_url: str

class User(BaseModel):
    '''
    Represents the data needed to add a new user to the database.
    Each field maps to a column in the users table in Supabase.

    Fields:
    user_id     (str)        : the UUID of the user
    first_name  (str)        : first name of user
    last_name   (str)        : last name of user
    '''
    user_id: str
    first_name: str
    last_name: str
