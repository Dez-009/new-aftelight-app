-- AfterLight Database Schema
-- Role-Based Access Control (RBAC) System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');
CREATE TYPE planning_status AS ENUM ('draft', 'in_progress', 'completed', 'archived');
CREATE TYPE step_status AS ENUM ('pending', 'in_progress', 'ai_guided', 'completed');

-- Users table with RBAC
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'USER',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    cultural_preferences JSONB,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- User sessions for authentication
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role permissions table
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role, resource, action)
);

-- Planning sessions
CREATE TABLE planning_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status planning_status DEFAULT 'draft',
    cultural_tradition VARCHAR(100),
    deceased_name VARCHAR(255),
    service_type VARCHAR(100),
    venue VARCHAR(255),
    service_date DATE,
    service_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Planning steps with AI insights
CREATE TABLE planning_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES planning_sessions(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    step_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    data JSONB,
    status step_status DEFAULT 'pending',
    ai_insights JSONB,
    revenue_opportunities JSONB,
    estimated_time INTEGER, -- in minutes
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cultural traditions database
CREATE TABLE cultural_traditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    religious_background VARCHAR(100),
    requirements JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Revenue opportunities tracking
CREATE TABLE revenue_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES planning_sessions(id) ON DELETE CASCADE,
    step_id UUID REFERENCES planning_steps(id) ON DELETE CASCADE,
    opportunity_type VARCHAR(100) NOT NULL,
    description TEXT,
    estimated_value DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'identified',
    converted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log for all changes
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_by ON users(created_by);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_planning_sessions_user_id ON planning_sessions(user_id);
CREATE INDEX idx_planning_sessions_status ON planning_sessions(status);
CREATE INDEX idx_planning_steps_session_id ON planning_steps(session_id);
CREATE INDEX idx_planning_steps_step_number ON planning_steps(session_id, step_number);
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);

-- Insert default role permissions
INSERT INTO role_permissions (role, resource, action) VALUES
-- SUPER_ADMIN permissions (can do everything)
('SUPER_ADMIN', 'users', 'create'),
('SUPER_ADMIN', 'users', 'read'),
('SUPER_ADMIN', 'users', 'update'),
('SUPER_ADMIN', 'users', 'delete'),
('SUPER_ADMIN', 'admins', 'create'),
('SUPER_ADMIN', 'admins', 'delete'),
('SUPER_ADMIN', 'features', 'create'),
('SUPER_ADMIN', 'features', 'update'),
('SUPER_ADMIN', 'features', 'delete'),
('SUPER_ADMIN', 'system', 'configure'),

-- ADMIN permissions (can manage users but not create admins)
('ADMIN', 'users', 'read'),
('ADMIN', 'users', 'update'),
('ADMIN', 'users', 'delete'),
('ADMIN', 'planning_sessions', 'read'),
('ADMIN', 'planning_sessions', 'update'),
('ADMIN', 'revenue_opportunities', 'read'),
('ADMIN', 'revenue_opportunities', 'update'),

-- USER permissions (basic access)
('USER', 'own_profile', 'read'),
('USER', 'own_profile', 'update'),
('USER', 'own_planning_sessions', 'create'),
('USER', 'own_planning_sessions', 'read'),
('USER', 'own_planning_sessions', 'update'),
('USER', 'own_planning_sessions', 'delete');

-- Create trigger function for audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), current_setting('app.current_user_id')::UUID);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), current_setting('app.current_user_id')::UUID);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, user_id)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), current_setting('app.current_user_id')::UUID);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for audit logging
CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_planning_sessions_trigger
    AFTER INSERT OR UPDATE OR DELETE ON planning_sessions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_planning_steps_trigger
    AFTER INSERT OR UPDATE OR DELETE ON planning_steps
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Create function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(
    user_id UUID,
    resource VARCHAR(100),
    action VARCHAR(100)
)
RETURNS BOOLEAN AS $$
DECLARE
    user_role user_role;
BEGIN
    SELECT role INTO user_role FROM users WHERE id = user_id AND is_active = true;
    
    IF user_role IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- SUPER_ADMIN can do everything
    IF user_role = 'SUPER_ADMIN' THEN
        RETURN TRUE;
    END IF;
    
    -- Check specific permissions
    RETURN EXISTS (
        SELECT 1 FROM role_permissions 
        WHERE role = user_role AND resource = resource AND action = action
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to get users by role (with permission check)
CREATE OR REPLACE FUNCTION get_users_by_role(
    requesting_user_id UUID,
    target_role user_role
)
RETURNS TABLE (
    id UUID,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role user_role,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Check if requesting user can view users of this role
    IF NOT check_user_permission(requesting_user_id, 'users', 'read') THEN
        RAISE EXCEPTION 'Insufficient permissions';
    END IF;
    
    -- SUPER_ADMIN can view all users
    IF EXISTS (SELECT 1 FROM users WHERE id = requesting_user_id AND role = 'SUPER_ADMIN') THEN
        RETURN QUERY
        SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.is_active, u.created_at
        FROM users u
        WHERE u.role = target_role;
    -- ADMIN can view users but not other admins or super admins
    ELSIF EXISTS (SELECT 1 FROM users WHERE id = requesting_user_id AND role = 'ADMIN') THEN
        IF target_role IN ('ADMIN', 'SUPER_ADMIN') THEN
            RAISE EXCEPTION 'Admins cannot view other admins or super admins';
        END IF;
        RETURN QUERY
        SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.is_active, u.created_at
        FROM users u
        WHERE u.role = target_role;
    ELSE
        RAISE EXCEPTION 'Insufficient permissions';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Insert default super admin user (password: superadmin123)
-- In production, use proper password hashing
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
VALUES ('superadmin@afterlight.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iKqG', 'Super', 'Admin', 'SUPER_ADMIN', true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
