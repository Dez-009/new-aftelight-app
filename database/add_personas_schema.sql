-- Add Personas Knowledge Base Schema to Existing Database
-- This script adds only the new tables and functions without conflicts

-- Add new ENUM types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'religious', 'healthcare', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE media_type AS ENUM ('photo', 'voice', 'document');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE relationship_type AS ENUM ('spouse', 'parent', 'child', 'sibling', 'grandparent', 'grandchild', 'friend', 'colleague', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add subscription_tier column to users table if it doesn't exist
DO $$ BEGIN
    ALTER TABLE users ADD COLUMN subscription_tier subscription_tier NOT NULL DEFAULT 'free';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE users ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add persona_id column to planning_sessions if it doesn't exist
DO $$ BEGIN
    ALTER TABLE planning_sessions ADD COLUMN persona_id UUID;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create subscription_features table
CREATE TABLE IF NOT EXISTS subscription_features (
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

-- Create personas table
CREATE TABLE IF NOT EXISTS personas (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Create memories table
CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    memory_type VARCHAR(100),
    emotional_tone VARCHAR(50),
    embedding_vector JSONB,
    embedding_model VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    media_type media_type NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255),
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    description TEXT,
    ai_generated_description TEXT,
    embedding_vector JSONB,
    embedding_model VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Create relationships table
CREATE TABLE IF NOT EXISTS relationships (
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

-- Create external_relationships table
CREATE TABLE IF NOT EXISTS external_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    person_name VARCHAR(255) NOT NULL,
    relationship_type relationship_type NOT NULL,
    relationship_details TEXT,
    contact_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cultural_preferences table
CREATE TABLE IF NOT EXISTS cultural_preferences (
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

-- Create ai_content_cache table
CREATE TABLE IF NOT EXISTS ai_content_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL,
    prompt_used TEXT NOT NULL,
    generated_content TEXT NOT NULL,
    model_used VARCHAR(50),
    tokens_used INTEGER,
    cost_usd DECIMAL(10,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_personas_user_id ON personas(user_id);
CREATE INDEX IF NOT EXISTS idx_personas_name ON personas(name);
CREATE INDEX IF NOT EXISTS idx_personas_cultural_background ON personas(cultural_background);
CREATE INDEX IF NOT EXISTS idx_personas_created_at ON personas(created_at);

CREATE INDEX IF NOT EXISTS idx_memories_persona_id ON memories(persona_id);
CREATE INDEX IF NOT EXISTS idx_memories_memory_type ON memories(memory_type);
CREATE INDEX IF NOT EXISTS idx_memories_emotional_tone ON memories(emotional_tone);
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at);

CREATE INDEX IF NOT EXISTS idx_media_persona_id ON media(persona_id);
CREATE INDEX IF NOT EXISTS idx_media_media_type ON media(media_type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at);

CREATE INDEX IF NOT EXISTS idx_relationships_persona_id ON relationships(persona_id);
CREATE INDEX IF NOT EXISTS idx_relationships_related_persona_id ON relationships(related_persona_id);
CREATE INDEX IF NOT EXISTS idx_relationships_type ON relationships(relationship_type);

CREATE INDEX IF NOT EXISTS idx_planning_sessions_persona_id ON planning_sessions(persona_id);

CREATE INDEX IF NOT EXISTS idx_ai_content_cache_persona_id ON ai_content_cache(persona_id);
CREATE INDEX IF NOT EXISTS idx_ai_content_cache_content_type ON ai_content_cache(content_type);
CREATE INDEX IF NOT EXISTS idx_ai_content_cache_expires_at ON ai_content_cache(expires_at);

-- Insert default subscription features (only if table is empty)
INSERT INTO subscription_features (tier, max_personas, max_storage_mb, ai_features, family_collaboration, white_label, priority_support)
SELECT * FROM (VALUES
    ('free'::subscription_tier, 1, 100, false, false, false, false),
    ('premium'::subscription_tier, 5, 1000, true, true, false, false),
    ('religious'::subscription_tier, 25, 5000, true, true, true, false),
    ('healthcare'::subscription_tier, 50, 10000, true, true, true, true),
    ('other'::subscription_tier, 25, 5000, true, true, true, false)
) AS v(tier, max_personas, max_storage_mb, ai_features, family_collaboration, white_label, priority_support)
WHERE NOT EXISTS (SELECT 1 FROM subscription_features);

-- Add new permissions to role_permissions table
INSERT INTO role_permissions (role, resource, action)
SELECT * FROM (VALUES
    ('USER'::user_role, 'own_personas', 'create'),
    ('USER'::user_role, 'own_personas', 'read'),
    ('USER'::user_role, 'own_personas', 'update'),
    ('USER'::user_role, 'own_personas', 'delete')
) AS v(role, resource, action)
WHERE NOT EXISTS (
    SELECT 1 FROM role_permissions 
    WHERE role = v.role AND resource = v.resource AND action = v.action
);

-- Update super admin to healthcare tier
UPDATE users 
SET subscription_tier = 'healthcare' 
WHERE role = 'SUPER_ADMIN' AND subscription_tier = 'free';

-- Add foreign key constraint for planning_sessions.persona_id
DO $$ BEGIN
    ALTER TABLE planning_sessions 
    ADD CONSTRAINT fk_planning_sessions_persona_id 
    FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create audit triggers for new tables
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

-- Create triggers for new tables (only if they don't exist)
DO $$ BEGIN
    CREATE TRIGGER audit_personas_trigger
        AFTER INSERT OR UPDATE OR DELETE ON personas
        FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER audit_memories_trigger
        AFTER INSERT OR UPDATE OR DELETE ON memories
        FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER audit_media_trigger
        AFTER INSERT OR UPDATE OR DELETE ON media
        FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create functions for subscription limit checking
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

-- Create function to get persona summary for AI context
CREATE OR REPLACE FUNCTION get_persona_summary(
    target_persona_id UUID
)
RETURNS JSONB AS $$
DECLARE
    persona_data JSONB;
    memories_summary JSONB;
    media_summary JSONB;
    relationships_summary JSONB;
BEGIN
    -- Get basic persona info
    SELECT to_jsonb(p.*) INTO persona_data
    FROM personas p
    WHERE p.id = target_persona_id;
    
    -- Get memories summary
    SELECT jsonb_agg(
        jsonb_build_object(
            'type', memory_type,
            'tone', emotional_tone,
            'content', content
        )
    ) INTO memories_summary
    FROM memories
    WHERE persona_id = target_persona_id;
    
    -- Get media summary
    SELECT jsonb_agg(
        jsonb_build_object(
            'type', media_type,
            'description', COALESCE(ai_generated_description, description)
        )
    ) INTO media_summary
    FROM media
    WHERE persona_id = target_persona_id;
    
    -- Get relationships summary
    SELECT jsonb_agg(
        jsonb_build_object(
            'type', relationship_type,
            'details', relationship_details
        )
    ) INTO relationships_summary
    FROM relationships
    WHERE persona_id = target_persona_id;
    
    -- Combine all data
    RETURN jsonb_build_object(
        'persona', persona_data,
        'memories', COALESCE(memories_summary, '[]'::jsonb),
        'media', COALESCE(media_summary, '[]'::jsonb),
        'relationships', COALESCE(relationships_summary, '[]'::jsonb)
    );
END;
$$ LANGUAGE plpgsql;

-- Verify the setup
SELECT 'Personas Knowledge Base schema added successfully!' as status;
