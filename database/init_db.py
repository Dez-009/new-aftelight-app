#!/usr/bin/env python3
"""
AfterLight Database Initialization Script
Sets up the complete database schema including Personas Knowledge Base
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_database_url():
    """Get database URL from environment or prompt user"""
    db_url = os.getenv('DATABASE_URL')
    
    if not db_url:
        logger.info("No DATABASE_URL found in environment variables.")
        logger.info("Please provide your database connection details:")
        
        host = input("Database host (default: localhost): ").strip() or "localhost"
        port = input("Database port (default: 5432): ").strip() or "5432"
        database = input("Database name: ").strip()
        user = input("Database user: ").strip()
        password = input("Database password: ").strip()
        
        db_url = f"postgresql://{user}:{password}@{host}:{port}/{database}"
        
        # Save to .env file for future use
        with open('.env', 'a') as f:
            f.write(f"\nDATABASE_URL={db_url}\n")
        
        logger.info("Database URL saved to .env file")
    
    return db_url

def create_database_if_not_exists(db_url):
    """Create database if it doesn't exist"""
    try:
        # Parse the URL to get connection details
        from urllib.parse import urlparse
        parsed = urlparse(db_url)
        
        # Connect to postgres database to create our database
        postgres_url = f"postgresql://{parsed.username}:{parsed.password}@{parsed.hostname}:{parsed.port}/postgres"
        
        conn = psycopg2.connect(postgres_url)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        database_name = parsed.path[1:]  # Remove leading slash
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (database_name,))
        exists = cursor.fetchone()
        
        if not exists:
            logger.info(f"Creating database: {database_name}")
            cursor.execute(f"CREATE DATABASE {database_name}")
            logger.info(f"Database '{database_name}' created successfully")
        else:
            logger.info(f"Database '{database_name}' already exists")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        logger.error(f"Error creating database: {e}")
        raise

def run_sql_file(conn, file_path):
    """Run a SQL file against the database"""
    try:
        with open(file_path, 'r') as f:
            sql_content = f.read()
        
        cursor = conn.cursor()
        cursor.execute(sql_content)
        conn.commit()
        cursor.close()
        
        logger.info(f"Successfully executed: {file_path}")
        
    except Exception as e:
        logger.error(f"Error executing {file_path}: {e}")
        conn.rollback()
        raise

def initialize_database():
    """Main initialization function"""
    try:
        # Get database URL
        db_url = get_database_url()
        logger.info("Database URL obtained")
        
        # Create database if it doesn't exist
        create_database_if_not_exists(db_url)
        
        # Connect to the target database
        conn = psycopg2.connect(db_url)
        logger.info("Connected to database successfully")
        
        # Run schema files in order
        schema_files = [
            'database/schema.sql',
            'database/vector_setup.sql'
        ]
        
        for schema_file in schema_files:
            if os.path.exists(schema_file):
                logger.info(f"Running schema file: {schema_file}")
                run_sql_file(conn, schema_file)
            else:
                logger.warning(f"Schema file not found: {schema_file}")
        
        # Verify tables were created
        cursor = conn.cursor()
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """)
        
        tables = cursor.fetchall()
        logger.info("Created tables:")
        for table in tables:
            logger.info(f"  - {table[0]}")
        
        cursor.close()
        conn.close()
        
        logger.info("Database initialization completed successfully!")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        sys.exit(1)

def test_connection():
    """Test the database connection"""
    try:
        db_url = get_database_url()
        conn = psycopg2.connect(db_url)
        
        cursor = conn.cursor()
        cursor.execute("SELECT version()")
        version = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        logger.info("Database connection test successful!")
        logger.info(f"PostgreSQL version: {version[0]}")
        return True
        
    except Exception as e:
        logger.error(f"Database connection test failed: {e}")
        return False

if __name__ == "__main__":
    logger.info("Starting AfterLight database initialization...")
    
    # Test connection first
    if test_connection():
        initialize_database()
    else:
        logger.error("Cannot proceed without database connection")
        sys.exit(1)
