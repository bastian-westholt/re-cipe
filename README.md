# re:cipe

> *Every recipe has roots. Creativity comes from tradition.*

A bilingual recipe platform that connects traditional cuisine with AI-driven fusion creativity. Users browse curated original recipes from around the world and use the Fusion Creator to let GPT-4o combine multiple traditions into something new.

---

## Tech Stack

**Frontend** — React 19 + Vite + TypeScript, Tailwind CSS v4, React Router, Zustand, react-i18next

**Backend** — Flask + SQLAlchemy, PostgreSQL (Neon), Alembic, pgvector

**AI & Media** — OpenAI GPT-5.2 (Structured Output), OpenAI Embeddings, Pollinations.ai imagen-4, Cloudinary

---

## Key Features

### AI Fusion Pipeline
1. User selects 2–5 original recipes
2. GPT-4o returns a bilingual fusion (DE + EN) via Pydantic Structured Output
3. Pollinations generates a food photo → uploaded to Cloudinary
4. Embedding generated for semantic search
5. User can give feedback → GPT refines without regenerating the image
6. On save: fusion + ingredients + steps + related recipe links written to DB

### Semantic Search
`/recipes?q=...` embeds the query and runs cosine distance search via pgvector.

### Bilingual (DE/EN)
All content stored as `_de`/`_en` column pairs. Frontend switches via `getLang(obj, field, lang)` utility + react-i18next.

---

## Project Structure

```
01_recipe/
├── app.py               # Flask app, routes
├── models.py            # SQLAlchemy models
├── data_manager.py      # DB operations
├── ai_service.py        # OpenAI + Pollinations, Pydantic schemas
├── storage_service.py   # Cloudinary upload
├── seed.py              # 30 bilingual recipes + embeddings
├── migrations/          # Alembic versions
├── frontend/src/
│   ├── components/      # feed/ + shared/ components
│   ├── pages/           # FeedPage, RecipeDetailPage
│   ├── store/           # Zustand stores
│   ├── utils/           # getLang()
│   └── locales/         # de + en translation JSONs
└── _concept/            # Schema, wireframes, API docs
```

---

## API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/recipes` | All recipes — supports `?q=` (semantic search), `?page=` |
| GET | `/recipes/<id>` | Recipe with ingredients + steps |
| POST | `/recipes/fusion/create` | Generate fusion (supports feedback loop) |
| POST | `/recipes/fusion/save` | Save confirmed fusion to DB |

---

## Local Setup

**Backend**
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# .env: DATABASE_URL, GPT_API_KEY, POLLINATIONS_API_KEY, CLOUDINARY_*
alembic upgrade head
python seed.py
python app.py
```

**Frontend**
```bash
cd frontend && npm install && npm run dev
```

---

## Roadmap

**v1** — Feed, Recipe Detail, Fusion Creator, Semantic Search, Bilingual

**v2** — Auth (JWT), Favorites, Profile, Related Fusions Feed, Fusion feedback UI, RAG in Fusion Creator

**v3** — Ratings, Comments, Landing page
