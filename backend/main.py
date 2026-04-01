'''
main.py
-------
The entry point for the FastAPI backend.
This file only does two things:
  1. Sets up the app and its middleware (CORS)
  2. Registers the routers so their endpoints are available

All actual endpoint logic lives in the routers/ folder.
'''

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import listings, users  # import each router module

app = FastAPI()

# CORS (Cross-Origin Resource Sharing) allows React frontend
# running on localhost:5173 to make requests to this backend.
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # which frontend URLs are allowed
    allow_credentials=True,     # allow cookies/auth headers
    allow_methods=["*"],        # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],        # allow all headers
)

# Register the listings router — all its endpoints will start with /listings
app.include_router(listings.router, prefix="/listings")

# Register the users router — all its endpoints will start with /users
app.include_router(users.router, prefix="/users")
