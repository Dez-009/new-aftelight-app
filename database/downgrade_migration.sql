-- Migration: Add downgrade handling fields to personas table
-- Run this after the main schema.sql to add new fields to existing databases

-- Add new columns for downgrade handling
ALTER TABLE personas 
ADD COLUMN IF NOT EXISTS access_status VARCHAR(50) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS locked_reason VARCHAR(255),
ADD COLUMN IF NOT EXISTS priority_order INTEGER DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN personas.access_status IS 'Persona access status: active, locked, archived, grace_period';
COMMENT ON COLUMN personas.locked_at IS 'Timestamp when persona was locked';
COMMENT ON COLUMN personas.locked_reason IS 'Reason for locking: downgrade, admin_action, payment_issue, downgrade_grace';
COMMENT ON COLUMN personas.priority_order IS 'Priority order for determining which personas to keep active during downgrades';

-- Create index for efficient queries on access status
CREATE INDEX IF NOT EXISTS idx_personas_access_status ON personas(access_status);
CREATE INDEX IF NOT EXISTS idx_personas_priority_order ON personas(priority_order);

-- Update existing personas to set priority order based on creation date
-- (newest first, so users can choose which to keep)
UPDATE personas 
SET priority_order = EXTRACT(EPOCH FROM (NOW() - created_at))::INTEGER
WHERE priority_order = 0;

-- Create a function to handle persona locking during downgrades
CREATE OR REPLACE FUNCTION lock_personas_for_downgrade(
    p_user_id UUID,
    p_personas_to_lock UUID[],
    p_strategy VARCHAR(50) DEFAULT 'soft'
)
RETURNS VOID AS $$
DECLARE
    persona_id UUID;
BEGIN
    -- Validate strategy
    IF p_strategy NOT IN ('soft', 'hard', 'grace') THEN
        RAISE EXCEPTION 'Invalid strategy: %. Must be soft, hard, or grace.', p_strategy;
    END IF;

    -- Process each persona based on strategy
    FOREACH persona_id IN ARRAY p_personas_to_lock
    LOOP
        IF p_strategy = 'soft' THEN
            -- Lock persona (read-only)
            UPDATE personas 
            SET 
                access_status = 'locked',
                locked_at = NOW(),
                locked_reason = 'downgrade',
                updated_at = NOW()
            WHERE id = persona_id AND user_id = p_user_id;
            
        ELSIF p_strategy = 'hard' THEN
            -- Delete persona (cascade will handle related data)
            DELETE FROM personas 
            WHERE id = persona_id AND user_id = p_user_id;
            
        ELSIF p_strategy = 'grace' THEN
            -- Mark for future locking with grace period
            UPDATE personas 
            SET 
                access_status = 'grace_period',
                locked_at = NOW() + INTERVAL '30 days',
                locked_reason = 'downgrade_grace',
                updated_at = NOW()
            WHERE id = persona_id AND user_id = p_user_id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a function to restore personas after upgrade
CREATE OR REPLACE FUNCTION restore_personas_after_upgrade(
    p_user_id UUID
)
RETURNS INTEGER AS $$
DECLARE
    restored_count INTEGER;
BEGIN
    UPDATE personas 
    SET 
        access_status = 'active',
        locked_at = NULL,
        locked_reason = NULL,
        updated_at = NOW()
    WHERE user_id = p_user_id 
      AND access_status IN ('locked', 'grace_period')
      AND locked_reason = 'downgrade';
    
    GET DIAGNOSTICS restored_count = ROW_COUNT;
    
    RETURN restored_count;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get persona access summary for a user
CREATE OR REPLACE FUNCTION get_persona_access_summary(
    p_user_id UUID
)
RETURNS TABLE(
    total_count BIGINT,
    active_count BIGINT,
    locked_count BIGINT,
    grace_period_count BIGINT,
    archived_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_count,
        COUNT(*) FILTER (WHERE access_status = 'active') as active_count,
        COUNT(*) FILTER (WHERE access_status = 'locked') as locked_count,
        COUNT(*) FILTER (WHERE access_status = 'grace_period') as grace_period_count,
        COUNT(*) FILTER (WHERE access_status = 'archived') as archived_count
    FROM personas 
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create a view for easy access to persona status
CREATE OR REPLACE VIEW persona_status_view AS
SELECT 
    p.id,
    p.user_id,
    p.name,
    p.access_status,
    p.locked_at,
    p.locked_reason,
    p.priority_order,
    p.created_at,
    CASE 
        WHEN p.access_status = 'active' THEN true
        ELSE false
    END as can_edit,
    CASE 
        WHEN p.access_status = 'active' THEN true
        ELSE false
    END as can_use_in_planning,
    CASE 
        WHEN p.access_status = 'active' THEN true
        ELSE false
    END as can_share,
    -- Add storage calculation if needed
    COALESCE(
        (SELECT SUM(file_size_bytes) FROM media WHERE persona_id = p.id), 
        0
    ) as storage_used_bytes
FROM personas p;

-- Grant permissions (adjust based on your setup)
-- GRANT SELECT ON persona_status_view TO authenticated_users;
-- GRANT EXECUTE ON FUNCTION lock_personas_for_downgrade TO authenticated_users;
-- GRANT EXECUTE ON FUNCTION restore_personas_after_upgrade TO authenticated_users;
-- GRANT EXECUTE ON FUNCTION get_persona_access_summary TO authenticated_users;
