-- Avatar Migration for Personas Table
-- Adds avatar image support to existing personas

-- Add avatar_url column to personas table
ALTER TABLE personas ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
ALTER TABLE personas ADD COLUMN IF NOT EXISTS avatar_updated_at TIMESTAMP WITH TIME ZONE;

-- Add index for avatar lookups
CREATE INDEX IF NOT EXISTS idx_personas_avatar_url ON personas(avatar_url) WHERE avatar_url IS NOT NULL;

-- Update existing personas to have a default avatar placeholder
UPDATE personas 
SET avatar_url = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    avatar_updated_at = NOW()
WHERE avatar_url IS NULL;

-- Create a function to update avatar with timestamp
CREATE OR REPLACE FUNCTION update_persona_avatar(
    persona_id_param UUID,
    new_avatar_url VARCHAR(500)
) RETURNS VOID AS $$
BEGIN
    UPDATE personas 
    SET avatar_url = new_avatar_url,
        avatar_updated_at = NOW(),
        updated_at = NOW()
    WHERE id = persona_id_param;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Persona with ID % not found', persona_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a view for persona avatars with metadata
CREATE OR REPLACE VIEW persona_avatar_view AS
SELECT 
    p.id,
    p.name,
    p.avatar_url,
    p.avatar_updated_at,
    p.access_status,
    CASE 
        WHEN p.avatar_url IS NULL THEN 'default'
        WHEN p.avatar_url LIKE '%unsplash.com%' THEN 'placeholder'
        ELSE 'custom'
    END as avatar_type
FROM personas p;

-- Grant permissions (adjust based on your user roles)
-- GRANT SELECT ON persona_avatar_view TO authenticated_users;
-- GRANT EXECUTE ON FUNCTION update_persona_avatar TO authenticated_users;
