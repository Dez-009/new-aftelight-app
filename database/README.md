# AfterLight Database Schema

## Overview
This database schema supports AfterLight's Personas Knowledge Base, a comprehensive memorial planning platform with AI-powered features, subscription tiers, and vector embeddings for semantic search.

## Core Tables

### 1. Users & Subscriptions
- **`users`** - User accounts with subscription tiers
- **`subscription_features`** - Feature limits for each subscription tier

### 2. Personas Knowledge Base
- **`personas`** - Core entity for memorial planning (deceased person)
- **`memories`** - Text-based memories with vector embeddings
- **`media`** - Photos, voice recordings, documents with AI descriptions
- **`relationships`** - Family and social connections
- **`external_relationships`** - People not in the system
- **`cultural_preferences`** - Cultural and religious information

### 3. AI & Planning
- **`ai_content_cache`** - Cached AI-generated content (obituaries, eulogies)
- **`planning_sessions`** - Memorial planning sessions
- **`planning_steps`** - Step-by-step planning process

## Subscription Tiers

| Tier | Personas | Storage | AI Features | Family Collab | White Label | Priority Support |
|------|----------|---------|-------------|---------------|-------------|------------------|
| Free | 1 | 100 MB | ❌ | ❌ | ❌ | ❌ |
| Premium | 5 | 1 GB | ✅ | ✅ | ❌ | ❌ |
| Religious | 25 | 5 GB | ✅ | ✅ | ✅ | ❌ |
| Healthcare | 50+ | 10 GB | ✅ | ✅ | ✅ | ✅ |
| Other | 25 | 5 GB | ✅ | ✅ | ✅ | ❌ |

## Vector Embeddings

### Current Implementation
- Uses JSONB to store OpenAI embeddings temporarily
- Includes placeholder functions for semantic search
- Ready for Pinecone integration

### Pinecone Integration (Production)
1. Install: `pip install pinecone-client`
2. Initialize with your API key
3. Create index: `afterlight-personas` (1536 dimensions)
4. Replace placeholder functions with actual vector search

## Key Functions

### Semantic Search
- `search_memories_by_similarity()` - Find relevant memories
- `search_media_by_similarity()` - Find relevant media
- `get_context_for_ai_generation()` - Get context for AI content

### AI Context
- `get_persona_summary()` - Complete persona data for AI
- `store_embedding()` - Store OpenAI embeddings

### Subscription Management
- `check_subscription_limit()` - Enforce tier limits
- `check_user_permission()` - RBAC enforcement

## Database Setup

### 1. Run Main Schema
```bash
psql -d your_database -f schema.sql
```

### 2. Run Vector Setup
```bash
psql -d your_database -f vector_setup.sql
```

### 3. Verify Installation
```sql
-- Check tables
\dt

-- Check functions
\df

-- Check subscription features
SELECT * FROM subscription_features;
```

## Data Flow

### 1. User Creates Persona
```
User → Personas Table → Basic Info
```

### 2. Add Memories & Media
```
User → Memories/Media Tables → OpenAI Embeddings → Vector Storage
```

### 3. AI Content Generation
```
Persona Data + Vector Search → AI Context → Generated Content → Cache
```

### 4. Planning Integration
```
Persona → Planning Session → AI-Guided Steps → Memorial Plan
```

## Security Features

### Row-Level Security (RLS)
- Users can only access their own personas
- Admin users can view user data within their scope
- Super admins have full access

### Audit Logging
- All changes logged with user, timestamp, and IP
- Complete audit trail for compliance
- Configurable retention policies

## Performance Considerations

### Indexes
- Primary keys on all tables
- Foreign key indexes for joins
- Subscription tier indexes for filtering
- Timestamp indexes for sorting

### Vector Search
- Pinecone handles vector similarity
- PostgreSQL handles relational queries
- Hybrid approach for best performance

## Migration Notes

### From Previous Schema
- New subscription fields added to users table
- Planning sessions now link to personas
- Audit triggers added for new tables

### Breaking Changes
- None - all additions are backward compatible
- Existing data preserved
- New features optional

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/afterlight

# OpenAI
OPENAI_API_KEY=your-openai-key

# Pinecone
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=your-environment
```

## Next Steps

### 1. Frontend Implementation
- Personas Knowledge Base wizard
- Subscription tier management
- AI content generation UI

### 2. Backend Services
- OpenAI integration for embeddings
- Pinecone vector database setup
- Subscription enforcement API

### 3. Testing
- Database migration testing
- Vector search performance
- Subscription limit enforcement

## Support

For database questions or issues:
1. Check the schema documentation
2. Review the vector setup file
3. Test with sample data
4. Contact the development team

---

**Note**: This schema is designed for scalability and performance. Vector embeddings are stored temporarily in JSONB format until Pinecone integration is complete.
