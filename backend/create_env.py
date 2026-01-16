"""
Helper script to create .env file interactively.
Run this to set up your environment variables.
"""
import os
from pathlib import Path

def create_env_file():
    env_path = Path(__file__).parent / '.env'
    
    if env_path.exists():
        response = input(f".env file already exists. Overwrite? (y/N): ")
        if response.lower() != 'y':
            print("Cancelled. Existing .env file preserved.")
            return
    
    print("\n=== Calendly Clone - Environment Setup ===\n")
    print("Please provide your MySQL database credentials:\n")
    
    db_user = input("MySQL Username [root]: ").strip() or "root"
    db_password = input("MySQL Password: ").strip()
    db_host = input("MySQL Host [localhost]: ").strip() or "localhost"
    db_port = input("MySQL Port [3306]: ").strip() or "3306"
    db_name = input("Database Name [calendly_db]: ").strip() or "calendly_db"
    
    # URL encode password if it contains special characters
    import urllib.parse
    encoded_password = urllib.parse.quote_plus(db_password)
    
    database_url = f"mysql+pymysql://{db_user}:{encoded_password}@{db_host}:{db_port}/{db_name}"
    
    secret_key = input("\nSecret Key (press Enter for default): ").strip()
    if not secret_key:
        import secrets
        secret_key = secrets.token_urlsafe(32)
        print(f"Generated secret key: {secret_key[:20]}...")
    
    env_content = f"""# Database Configuration
DATABASE_URL={database_url}

# Secret Key
SECRET_KEY={secret_key}
"""
    
    with open(env_path, 'w') as f:
        f.write(env_content)
    
    print(f"\n✅ .env file created successfully at: {env_path}")
    print("\nNext steps:")
    print("1. Make sure MySQL is running")
    print("2. Create the database: CREATE DATABASE " + db_name + ";")
    print("3. Run: python database/seed.py")

if __name__ == "__main__":
    try:
        create_env_file()
    except KeyboardInterrupt:
        print("\n\nSetup cancelled.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
