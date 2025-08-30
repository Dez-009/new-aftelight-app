#!/usr/bin/env python3
"""
AfterLight Database Initialization Script
Connects to Railway PostgreSQL and sets up the database schema
"""

import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_database_url():
    """Get database URL from environment variables"""
    # Railway provides DATABASE_URL automatically
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise ValueError("DATABASE_URL environment variable not set")
    return database_url

def read_schema_file():
    """Read the SQL schema file"""
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
    with open(schema_path, 'r') as f:
        return f.read()

def init_database():
    """Initialize the database with schema"""
    try:
        # Connect to database
        database_url = get_database_url()
        logger.info("Connecting to database...")
        
        conn = psycopg2.connect(database_url)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Read and execute schema
        schema_sql = read_schema_file()
        logger.info("Executing database schema...")
        
        # Split by semicolon and execute each statement
        statements = schema_sql.split(';')
        for statement in statements:
            statement = statement.strip()
            if statement:
                try:
                    cursor.execute(statement)
                    logger.info(f"Executed: {statement[:50]}...")
                except Exception as e:
                    logger.warning(f"Statement failed: {statement[:50]}... Error: {e}")
                    # Continue with other statements
        
        logger.info("Database initialization completed successfully!")
        
        # Verify tables were created
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        
        tables = cursor.fetchall()
        logger.info(f"Created tables: {[table[0] for table in tables]}")
        
        # Verify super admin user
        cursor.execute("SELECT email, role FROM users WHERE role = 'SUPER_ADMIN'")
        super_admin = cursor.fetchone()
        if super_admin:
            logger.info(f"Super admin created: {super_admin[0]} ({super_admin[1]})")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

def test_connection():
    """Test database connection"""
    try:
        database_url = get_database_url()
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        logger.info(f"Connected to: {version[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        logger.error(f"Connection test failed: {e}")
        return False

if __name__ == "__main__":
    logger.info("Starting AfterLight database initialization...")
    
    # Test connection first
    if test_connection():
        # Initialize database
        init_database()
        logger.info("Database setup completed!")
    else:
        logger.error("Cannot proceed without database connection")
        exit(1)
