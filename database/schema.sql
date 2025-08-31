-- AfterLight Database Schema
-- Role-Based Access Control (RBAC) System + Personas Knowledge Base

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable vector extension for embeddings (if using pgvector)
-- CREATE EXTENSION IF NOT EXISTS "vector";

-- Create custom types
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');
CREATE TYPE planning_status AS ENUM ('draft', 'in_progress', 'completed', 'archived');
CREATE TYPE step_status AS ENUM ('pending', 'in_progress', 'ai_guided', 'completed');
CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'religious', 'healthcare', 'other');
CREATE TYPE media_type AS ENUM ('photo', 'voice', 'document');
CREATE TYPE relationship_type AS ENUM ('spouse', 'parent', 'child', 'sibling', 'grandparent', 'grandchild', 'friend', 'colleague', 'other');

-- Users table with RBAC and subscription management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'USER',
    subscription_tier subscription_tier NOT NULL DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    cultural_preferences JSONB,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Subscription limits and features
CREATE TABLE subscription_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier subscription_tier NOT NULL,
    max_personas INTEGER NOT NULL,
    max_storage_mb INTEGER NOT NULL,
    ai_features BOOLEAN DEFAULT false,
    family_collaboration BOOLEAN DEFAULT false,
    white_label BOOLEAN DEFAULT false,
    priority_support BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personas table - core entity for memorial planning
CREATE TABLE personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    death_date DATE,
    relationship_to_user VARCHAR(100),
    biography TEXT,
    cultural_background VARCHAR(100),
    religious_preferences VARCHAR(100),
    favorite_quotes TEXT[],
    favorite_music TEXT[],
    hobbies TEXT[],
    achievements TEXT[],
    personality_traits TEXT[],
    is_public BOOLEAN DEFAULT false,
    -- Downgrade handling fields
    access_status VARCHAR(50) DEFAULT 'active', -- 'active', 'locked', 'archived'
    locked_at TIMESTAMP WITH TIME ZONE,
    locked_reason VARCHAR(255), -- 'downgrade', 'admin_action', 'payment_issue'
    priority_order INTEGER DEFAULT 0, -- For determining which personas to keep active
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Memories table - text-based memories with vector embeddings
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    memory_type VARCHAR(100), -- 'childhood', 'career', 'family', 'hobby', etc.
    emotional_tone VARCHAR(50), -- 'joyful', 'touching', 'humorous', 'inspiring', etc.
    embedding_vector JSONB, -- Store OpenAI embedding as JSONB for now
    embedding_model VARCHAR(50), -- 'text-embedding-ada-002'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Media table - photos, voice recordings, documents
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    media_type media_type NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255),
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    description TEXT,
    ai_generated_description TEXT, -- OpenAI vision API description
    embedding_vector JSONB, -- Vector embedding of description
    embedding_model VARCHAR(50),
    metadata JSONB, -- Duration for voice, dimensions for photos, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Relationships table - family and social connections
CREATE TABLE relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    related_persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    relationship_type relationship_type NOT NULL,
    relationship_details TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- External relationships (people not in the system)
CREATE TABLE external_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    person_name VARCHAR(255) NOT NULL,
    relationship_type relationship_type NOT NULL,
    relationship_details TEXT,
    contact_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cultural and religious preferences
CREATE TABLE cultural_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    cultural_tradition VARCHAR(100),
    religious_background VARCHAR(100),
    memorial_customs TEXT[],
    preferred_language VARCHAR(50),
    dietary_restrictions TEXT[],
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI-generated content cache
CREATE TABLE ai_content_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL, -- 'obituary', 'eulogy', 'memorial_speech', 'design_suggestion'
    prompt_used TEXT NOT NULL,
    generated_content TEXT NOT NULL,
    model_used VARCHAR(50),
    tokens_used INTEGER,
    cost_usd DECIMAL(10,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE -- Cache expiration for cost management
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
    persona_id UUID REFERENCES personas(id) ON DELETE SET NULL,
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
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_users_created_by ON users(created_by);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);

-- Personas indexes
CREATE INDEX idx_personas_user_id ON personas(user_id);
CREATE INDEX idx_personas_name ON personas(name);
CREATE INDEX idx_personas_cultural_background ON personas(cultural_background);
CREATE INDEX idx_personas_created_at ON personas(created_at);

-- Memories indexes
CREATE INDEX idx_memories_persona_id ON memories(persona_id);
CREATE INDEX idx_memories_memory_type ON memories(memory_type);
CREATE INDEX idx_memories_emotional_tone ON memories(emotional_tone);
CREATE INDEX idx_memories_created_at ON memories(created_at);

-- Media indexes
CREATE INDEX idx_media_persona_id ON media(persona_id);
CREATE INDEX idx_media_media_type ON media(media_type);
CREATE INDEX idx_media_created_at ON media(created_at);

-- Relationships indexes
CREATE INDEX idx_relationships_persona_id ON relationships(persona_id);
CREATE INDEX idx_relationships_related_persona_id ON relationships(related_persona_id);
CREATE INDEX idx_relationships_type ON relationships(relationship_type);

-- Planning indexes
CREATE INDEX idx_planning_sessions_user_id ON planning_sessions(user_id);
CREATE INDEX idx_planning_sessions_persona_id ON planning_sessions(persona_id);
CREATE INDEX idx_planning_sessions_status ON planning_sessions(status);
CREATE INDEX idx_planning_steps_session_id ON planning_steps(session_id);
CREATE INDEX idx_planning_steps_step_number ON planning_steps(session_id, step_number);

-- AI content cache indexes
CREATE INDEX idx_ai_content_cache_persona_id ON ai_content_cache(persona_id);
CREATE INDEX idx_ai_content_cache_content_type ON ai_content_cache(content_type);
CREATE INDEX idx_ai_content_cache_expires_at ON ai_content_cache(expires_at);

-- Audit log indexes
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);

-- Insert default subscription features
INSERT INTO subscription_features (tier, max_personas, max_storage_mb, ai_features, family_collaboration, white_label, priority_support) VALUES
('free', 1, 100, false, false, false, false),
('premium', 5, 1000, true, true, false, false),
('religious', 25, 5000, true, true, true, false),
('healthcare', 50, 10000, true, true, true, true),
('other', 25, 5000, true, true, true, false);

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
('USER', 'own_planning_sessions', 'delete'),
('USER', 'own_personas', 'create'),
('USER', 'own_personas', 'read'),
('USER', 'own_personas', 'update'),
('USER', 'own_personas', 'delete');

-- Create trigger function for audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for audit logging
CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_personas_trigger
    AFTER INSERT OR UPDATE OR DELETE ON personas
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_memories_trigger
    AFTER INSERT OR UPDATE OR DELETE ON memories
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_media_trigger
    AFTER INSERT OR UPDATE OR DELETE ON media
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

-- Create function to check subscription limits
CREATE OR REPLACE FUNCTION check_subscription_limit(
    user_id UUID,
    limit_type VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
    user_tier subscription_tier;
    current_count INTEGER;
    max_allowed INTEGER;
BEGIN
    SELECT subscription_tier INTO user_tier FROM users WHERE id = user_id;
    
    IF user_tier IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Get current count based on limit type
    CASE limit_type
        WHEN 'personas' THEN
            SELECT COUNT(*) INTO current_count FROM personas WHERE personas.user_id = check_subscription_limit.user_id;
        WHEN 'storage' THEN
            SELECT COALESCE(SUM(file_size_bytes), 0) INTO current_count FROM media m 
            JOIN personas p ON m.persona_id = p.id 
            WHERE p.user_id = check_subscription_limit.user_id;
        ELSE
            RETURN FALSE;
    END CASE;
    
    -- Get max allowed from subscription features
    SELECT 
        CASE limit_type
            WHEN 'personas' THEN max_personas
            WHEN 'storage' THEN max_storage_mb * 1024 * 1024 -- Convert MB to bytes
        END
    INTO max_allowed 
    FROM subscription_features 
    WHERE tier = user_tier;
    
    RETURN current_count < max_allowed;
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
    subscription_tier subscription_tier,
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
        SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.subscription_tier, u.is_active, u.created_at
        FROM users u
        WHERE u.role = target_role;
    -- ADMIN can view users but not other admins or super admins
    ELSIF EXISTS (SELECT 1 FROM users WHERE id = requesting_user_id AND role = 'ADMIN') THEN
        IF target_role IN ('ADMIN', 'SUPER_ADMIN') THEN
            RAISE EXCEPTION 'Admins cannot view other admins or super admins';
        END IF;
        RETURN QUERY
        SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.subscription_tier, u.is_active, u.created_at
        FROM users u
        WHERE u.role = target_role;
    ELSE
        RAISE EXCEPTION 'Insufficient permissions';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Insert default super admin user (password: superadmin123)
-- In production, use proper password hashing
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified, subscription_tier)
VALUES ('superadmin@afterlight.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iKqG', 'Super', 'Admin', 'SUPER_ADMIN', true, 'healthcare');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
