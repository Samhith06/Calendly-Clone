"""
Setup script to initialize the database and seed sample data.
Run this after setting up your MySQL database and .env file.
"""
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from database.seed import *

if __name__ == "__main__":
    print("Setting up database...")
    print("Make sure you have:")
    print("1. Created the MySQL database")
    print("2. Set up the .env file with DATABASE_URL")
    print("3. Installed all requirements (pip install -r requirements.txt)")
    print()
    
    try:
        # The seed script will create tables and seed data
        print("Database setup complete!")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
