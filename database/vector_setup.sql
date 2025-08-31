-- Vector Database Setup for AfterLight Personas Knowledge Base
-- This file contains setup instructions and functions for vector embeddings

-- Note: For production, consider using pgvector extension for PostgreSQL
-- CREATE EXTENSION IF NOT EXISTS "vector";

-- Function to store OpenAI embeddings in JSONB format
-- This is a temporary solution until we implement proper vector database integration
CREATE OR REPLACE FUNCTION store_embedding(
    content_text TEXT,
    model_name VARCHAR(50) DEFAULT 'text-embedding-ada-002'
)
RETURNS JSONB AS $$
DECLARE
    embedding_data JSONB;
BEGIN
    -- In production, this would call OpenAI API and return the actual embedding
    -- For now, we'll return a placeholder structure
    embedding_data := jsonb_build_object(
        'model', model_name,
        'timestamp', now(),
        'content_length', length(content_text),
        'placeholder', true
    );
    
    RETURN embedding_data;
END;
$$ LANGUAGE plpgsql;

-- Function to search memories by semantic similarity
-- This is a placeholder until we implement proper vector search
CREATE OR REPLACE FUNCTION search_memories_by_similarity(
    search_query TEXT,
    persona_id UUID,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    memory_id UUID,
    title VARCHAR(255),
    content TEXT,
    memory_type VARCHAR(100),
    emotional_tone VARCHAR(50),
    similarity_score DECIMAL(5,4),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- In production, this would use vector similarity search
    -- For now, return basic text search results
    RETURN QUERY
    SELECT 
        m.id,
        m.title,
        m.content,
        m.memory_type,
        m.emotional_tone,
        0.85 as similarity_score, -- Placeholder score
        m.created_at
    FROM memories m
    WHERE m.persona_id = search_memories_by_similarity.persona_id
    AND (
        m.content ILIKE '%' || search_query || '%'
        OR m.title ILIKE '%' || search_query || '%'
        OR m.memory_type ILIKE '%' || search_query || '%'
    )
    ORDER BY m.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to search media by semantic similarity
CREATE OR REPLACE FUNCTION search_media_by_similarity(
    search_query TEXT,
    persona_id UUID,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    media_id UUID,
    media_type media_type,
    file_name VARCHAR(255),
    description TEXT,
    ai_generated_description TEXT,
    similarity_score DECIMAL(5,4),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- In production, this would use vector similarity search
    RETURN QUERY
    SELECT 
        m.id,
        m.media_type,
        m.file_name,
        m.description,
        m.ai_generated_description,
        0.90 as similarity_score, -- Placeholder score
        m.created_at
    FROM media m
    WHERE m.persona_id = search_media_by_similarity.persona_id
    AND (
        m.description ILIKE '%' || search_query || '%'
        OR m.ai_generated_description ILIKE '%' || search_query || '%'
        OR m.file_name ILIKE '%' || search_query || '%'
    )
    ORDER BY m.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get related memories and media for AI content generation
CREATE OR REPLACE FUNCTION get_context_for_ai_generation(
    persona_id UUID,
    content_type VARCHAR(50),
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    source_type VARCHAR(20), -- 'memory' or 'media'
    content TEXT,
    metadata JSONB,
    relevance_score DECIMAL(5,4)
) AS $$
BEGIN
    -- Get relevant memories
    RETURN QUERY
    SELECT 
        'memory'::VARCHAR(20) as source_type,
        m.content,
        jsonb_build_object(
            'memory_type', m.memory_type,
            'emotional_tone', m.emotional_tone,
            'title', m.title
        ) as metadata,
        0.95 as relevance_score
    FROM memories m
    WHERE m.persona_id = get_context_for_ai_generation.persona_id
    ORDER BY m.created_at DESC
    LIMIT limit_count / 2;
    
    -- Get relevant media descriptions
    RETURN QUERY
    SELECT 
        'media'::VARCHAR(20) as source_type,
        COALESCE(m.ai_generated_description, m.description) as content,
        jsonb_build_object(
            'media_type', m.media_type,
            'file_name', m.file_name
        ) as metadata,
        0.90 as relevance_score
    FROM media m
    WHERE m.persona_id = get_context_for_ai_generation.persona_id
    AND (m.ai_generated_description IS NOT NULL OR m.description IS NOT NULL)
    ORDER BY m.created_at DESC
    LIMIT limit_count / 2;
END;
$$ LANGUAGE plpgsql;

-- Function to update embedding when content changes
CREATE OR REPLACE FUNCTION update_memory_embedding()
RETURNS TRIGGER AS $$
BEGIN
    -- In production, this would call OpenAI API to generate new embedding
    IF NEW.content != OLD.content OR OLD.content IS NULL THEN
        NEW.embedding_vector := store_embedding(NEW.content, NEW.embedding_model);
        NEW.updated_at := now();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update media embedding when description changes
CREATE OR REPLACE FUNCTION update_media_embedding()
RETURNS TRIGGER AS $$
BEGIN
    -- In production, this would call OpenAI API to generate new embedding
    IF NEW.ai_generated_description != OLD.ai_generated_description 
       OR NEW.description != OLD.description 
       OR OLD.ai_generated_description IS NULL 
       OR OLD.description IS NULL THEN
        
        NEW.embedding_vector := store_embedding(
            COALESCE(NEW.ai_generated_description, NEW.description),
            NEW.embedding_model
        );
        NEW.updated_at := now();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic embedding updates
CREATE TRIGGER update_memory_embedding_trigger
    BEFORE UPDATE ON memories
    FOR EACH ROW EXECUTE FUNCTION update_memory_embedding();

CREATE TRIGGER update_media_embedding_trigger
    BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION update_media_embedding();

-- Function to get persona summary for AI context
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

-- Pinecone Integration Notes:
-- 
-- 1. Install Pinecone client:
--    pip install pinecone-client
--
-- 2. Initialize Pinecone:
--    import pinecone
--    pinecone.init(api_key='your-api-key', environment='your-environment')
--
-- 3. Create index:
--    pinecone.create_index('afterlight-personas', dimension=1536, metric='cosine')
--
-- 4. Store embeddings:
--    index = pinecone.Index('afterlight-personas')
--    index.upsert(vectors=[(id, embedding_vector, metadata)])
--
-- 5. Query embeddings:
--    results = index.query(vector=query_embedding, top_k=10, include_metadata=True)
--
-- 6. Update the functions above to use Pinecone instead of placeholder logic
