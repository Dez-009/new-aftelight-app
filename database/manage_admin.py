#!/usr/bin/env python3
"""
AfterLight Admin Management Script
Manage super admin accounts and credentials
"""

import os
import psycopg2
import bcrypt
import argparse
from typing import Optional

def get_database_url():
    """Get database URL from environment variables"""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise ValueError("DATABASE_URL environment variable not set")
    return database_url

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def get_current_super_admin(conn) -> Optional[dict]:
    """Get current super admin user"""
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, email, first_name, last_name, created_at 
        FROM users 
        WHERE role = 'SUPER_ADMIN' 
        LIMIT 1
    """)
    result = cursor.fetchone()
    cursor.close()
    
    if result:
        return {
            'id': result[0],
            'email': result[1],
            'first_name': result[2],
            'last_name': result[3],
            'created_at': result[4]
        }
    return None

def update_super_admin(conn, email: str, first_name: str, last_name: str, password: Optional[str] = None):
    """Update super admin information"""
    cursor = conn.cursor()
    
    if password:
        hashed_password = hash_password(password)
        cursor.execute("""
            UPDATE users 
            SET email = %s, first_name = %s, last_name = %s, password_hash = %s, updated_at = NOW()
            WHERE role = 'SUPER_ADMIN'
        """, (email, first_name, last_name, hashed_password))
    else:
        cursor.execute("""
            UPDATE users 
            SET email = %s, first_name = %s, last_name = %s, updated_at = NOW()
            WHERE role = 'SUPER_ADMIN'
        """, (email, first_name, last_name))
    
    conn.commit()
    cursor.close()
    print(f"✅ Super admin updated: {email}")

def create_new_super_admin(conn, email: str, first_name: str, last_name: str, password: str):
    """Create a new super admin user"""
    cursor = conn.cursor()
    
    # Check if email already exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        print(f"❌ Email {email} already exists")
        cursor.close()
        return False
    
    # Create new super admin
    hashed_password = hash_password(password)
    cursor.execute("""
        INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified, created_at, updated_at)
        VALUES (%s, %s, %s, %s, 'SUPER_ADMIN', true, NOW(), NOW())
    """, (email, hashed_password, first_name, last_name))
    
    conn.commit()
    cursor.close()
    print(f"✅ New super admin created: {email}")
    return True

def delete_super_admin(conn, email: str):
    """Delete a super admin user"""
    cursor = conn.cursor()
    
    # Check if this is the only super admin
    cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'SUPER_ADMIN'")
    count = cursor.fetchone()[0]
    
    if count <= 1:
        print("❌ Cannot delete the only super admin")
        cursor.close()
        return False
    
    cursor.execute("DELETE FROM users WHERE email = %s AND role = 'SUPER_ADMIN'", (email,))
    
    if cursor.rowcount > 0:
        conn.commit()
        print(f"✅ Super admin deleted: {email}")
        cursor.close()
        return True
    else:
        print(f"❌ Super admin not found: {email}")
        cursor.close()
        return False

def list_all_users(conn):
    """List all users in the system"""
    cursor = conn.cursor()
    cursor.execute("""
        SELECT email, first_name, last_name, role, is_active, created_at
        FROM users 
        ORDER BY role, created_at
    """)
    
    users = cursor.fetchall()
    cursor.close()
    
    print("\n👥 All Users:")
    print("-" * 80)
    for user in users:
        print(f"📧 {user[0]:<30} | {user[1]} {user[2]:<20} | {user[3]:<12} | {'✅' if user[4] else '❌'} | {user[5]}")
    print("-" * 80)

def main():
    parser = argparse.ArgumentParser(description='Manage AfterLight Super Admin Accounts')
    parser.add_argument('--action', choices=['show', 'update', 'create', 'delete', 'list'], 
                       default='show', help='Action to perform')
    parser.add_argument('--email', help='Email address')
    parser.add_argument('--first-name', help='First name')
    parser.add_argument('--last-name', help='Last name')
    parser.add_argument('--password', help='Password (for create/update)')
    
    args = parser.parse_args()
    
    try:
        # Connect to database
        database_url = get_database_url()
        conn = psycopg2.connect(database_url)
        
        if args.action == 'show':
            admin = get_current_super_admin(conn)
            if admin:
                print(f"\n👑 Current Super Admin:")
                print(f"   Email: {admin['email']}")
                print(f"   Name: {admin['first_name']} {admin['last_name']}")
                print(f"   Created: {admin['created_at']}")
            else:
                print("❌ No super admin found")
        
        elif args.action == 'update':
            if not all([args.email, args.first_name, args.last_name]):
                print("❌ Email, first name, and last name are required for update")
                return
            update_super_admin(conn, args.email, args.first_name, args.last_name, args.password)
        
        elif args.action == 'create':
            if not all([args.email, args.first_name, args.last_name, args.password]):
                print("❌ Email, first name, last name, and password are required for create")
                return
            create_new_super_admin(conn, args.email, args.first_name, args.last_name, args.password)
        
        elif args.action == 'delete':
            if not args.email:
                print("❌ Email is required for delete")
                return
            delete_super_admin(conn, args.email)
        
        elif args.action == 'list':
            list_all_users(conn)
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
