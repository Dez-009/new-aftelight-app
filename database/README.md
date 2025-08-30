# AfterLight Database Setup

This directory contains the database schema and initialization scripts for AfterLight.

## 🗄️ Database Schema

The `schema.sql` file contains a comprehensive PostgreSQL schema with:

- **Role-Based Access Control (RBAC)**
  - SUPER_ADMIN: Can create admins, users, and modify all features
  - ADMIN: Can manage users but cannot create admins or super admins
  - USER: Basic access to own planning sessions

- **Core Tables**
  - `users` - User accounts with role management
  - `planning_sessions` - Memorial planning sessions
  - `planning_steps` - Individual planning steps with AI insights
  - `cultural_traditions` - Religious and cultural practices
  - `revenue_opportunities` - Revenue tracking for printing services
  - `audit_log` - Complete audit trail of all changes

## 🚀 Railway Setup

### 1. Add PostgreSQL Service
- Go to your Railway project
- Click "New Service" → "Database" → "PostgreSQL"
- Railway will automatically provide `DATABASE_URL`

### 2. Initialize Database
```bash
cd database
pip install -r requirements.txt
python init_db.py
```

### 3. Environment Variables
Railway automatically provides:
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

## 🔐 Default Super Admin

The schema creates a default super admin:
- **Email**: `superadmin@afterlight.com`
- **Password**: `superadmin123`
- **Role**: `SUPER_ADMIN`

**⚠️ Change this password immediately in production!**

## 🛡️ Security Features

- **Audit Logging**: All changes are logged with user tracking
- **Permission Functions**: Server-side permission validation
- **Role Isolation**: Admins cannot view other admins or super admins
- **UUID Primary Keys**: Secure identifier generation

## 📊 Database Functions

- `check_user_permission(user_id, resource, action)` - Validate permissions
- `get_users_by_role(requesting_user_id, target_role)` - Get users with permission checks
- `audit_trigger_function()` - Automatic audit logging

## 🔄 Migration Strategy

For future schema changes:
1. Create new migration files
2. Use Alembic or similar tool
3. Test in development first
4. Apply to production during maintenance window

## 📈 Performance

- **Indexes**: Optimized for common queries
- **JSONB**: Flexible data storage for planning steps
- **Partitioning**: Ready for large-scale data growth
