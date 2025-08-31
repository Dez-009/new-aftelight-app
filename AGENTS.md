You are working on **AfterLight**, a premium digital platform designed to help families plan funerals, memorials, and celebrations of life with elegance and ease.

It is a **modular, microservices-based app** built under the **Legacy Echo brand**, but operates as a **standalone product**. It combines AI automation, luxury keepsakes, and logistical planning to serve both everyday and high-end clients.

---

🕊️ **App Purpose**:
AfterLight helps families:
- Plan memorial events (funeral, celebration of life, etc.)
- Automate logistics (invites, printing, venue coordination)
- Generate obituaries, speeches, and cultural assets using AI
- Order physical keepsakes (cards, booklets, engraved objects)
- Handle email + print fulfillment, RSVP tracking, and vendor discovery

---

⚙️ **Architecture Overview**:
AfterLight uses a **microservices architecture**, broken into clean, scalable modules with shared authentication and automation.

### Tech Stack:

| Layer        | Technology                          |
|--------------|--------------------------------------|
Frontend       | Next.js (App Router) + Tailwind CSS  
Backend        | FastAPI (per microservice)  
Database       | Supabase PostgreSQL (shared to start)  
Auth           | Supabase Auth (JWT + RLS)  
Storage        | Supabase Storage (for media, PDF, voice)  
Automation     | n8n (email, print, webhook triggers)  
AI             | OpenAI, Whisper, DALL·E  
Print API      | Printful, Lob, or third-party partner  
Deployment     | Vercel (frontend), Railway/Fly.io (backend)

---

🧩 **Core Microservices**:

- `user-service`: auth, profile, culture
- `planner-service`: step-based planning wizard
- `invite-service`: generate/send invites, RSVPs
- `obituary-service`: obituary + speech generation
- `keepsake-service`: engraving customization + previews
- `fulfillment-service`: webhook with print/email vendors
- `vendor-service`: local lookup for funeral homes/churches

All services communicate through REST APIs or automation webhooks. Authentication is handled via Supabase JWT and passed through the API Gateway.

---

🎨 **Branding & UX Goals**:
- Calm, luxurious UI (soft gold, charcoal, cream)
- Ethically guided user flow (warm, non-intrusive)
- Cultural customization (top 5 U.S. traditions supported)
- Lightweight product interaction (no 3D models, but image overlays and previews)

---

🗓️ **MVP Goals (First 4 Sprints)**:
1. Setup core app layout and planning flow UI
2. Implement AI-generated obituaries + invite tools
3. Add print + RSVP automation via n8n
4. Offer cultural templates and product previews (engraving, themes)

---

💡 This prompt is reusable:
Use this context to regenerate:
- Codex tasks for Cursor
- Sprint breakdowns
- Docker configs
- Auth + DB schemas
- API endpoints
- UI components
- Partner portal logic

You’re building a high-end, AI-enhanced, culturally sensitive memorial planning platform for the modern age — **AfterLight**.