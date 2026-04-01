'''
database.py
-----------
Creates a single Supabase client that the rest of the backend imports.
'''

import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from the .env file (SUPABASE_URL and SUPABASE_KEY)
load_dotenv()

# Read the URL and key from environment variables
DB_URL: str = os.getenv("SUPABASE_URL", "")
DB_KEY: str = os.getenv("SUPABASE_KEY", "")

# Create the Supabase client
supabase: Client = create_client(DB_URL, DB_KEY)
