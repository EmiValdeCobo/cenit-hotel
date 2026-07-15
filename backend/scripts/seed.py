import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from db.database import engine

def seed_database():
    seed_file_path = os.path.join(os.path.dirname(__file__), 'seed_data.sql')
    if not os.path.exists(seed_file_path):
        print("Seed file not found. Skipping seeding.")
        return

    with open(seed_file_path, 'r', encoding='utf-8') as f:
        sql = f.read()

    print("Executing seed data...")
    with engine.connect() as conn:
        try:
            # We can execute the raw SQL script
            conn.execute(text(sql))
            conn.commit()
            print("Database seeded successfully.")
        except Exception as e:
            print(f"Error seeding database: {e}")

if __name__ == "__main__":
    seed_database()
