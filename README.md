# Study Mate (STM)

Full-stack student productivity app — courses, assignments/deadlines, weekly
timetable, progress tracking, and a Research tab (AI topic explanations,
Wikipedia search, dictionary lookup).

## Stack
- **Frontend:** React (Vite), plain JavaScript, React Router. Data/formatting
  logic lives in `src/data/*.js`, kept separate from page/UI components.
- **Backend:** Node.js + Express, MongoDB (Mongoose), JWT auth.
- **External APIs:** Anthropic API (AI explain), Wikipedia REST/search API,
  dictionaryapi.dev (all free/keyless except Anthropic).

## Backend setup
```bash
cd backend
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY
npm install
npm run dev             # http://localhost:5000
```

## Frontend setup
```bash
cd frontend
cp .env.example .env    # point VITE_API_URL at your backend
npm install
npm run dev              # http://localhost:5173
```

## Deploying (matches your usual setup)
- Frontend → Vercel (`frontend/vercel.json` included — SPA rewrites so React Router routes work on refresh)
- Backend → Render (`backend/render.yaml` included as a blueprint)
- Database → MongoDB Atlas (set `MONGO_URI` in Render's env vars)
- Set `CLIENT_ORIGIN` on the backend to your deployed frontend URL for CORS
- Set `ANTHROPIC_API_KEY` on Render for the AI explain feature to work

## API overview
| Route | Description |
|---|---|
| `POST /api/auth/register` `/login` | Auth, returns JWT |
| `GET /api/auth/me` | Current user |
| `GET/POST/DELETE /api/courses` | Courses CRUD |
| `GET/POST/PATCH/DELETE /api/assignments` | Assignments CRUD |
| `GET/POST/DELETE /api/timetable` | Weekly timetable slots |
| `GET/POST/DELETE /api/notes` | Study log entries |
| `POST /api/ai/explain` | AI topic explanation (Anthropic) |
| `GET /api/wiki/search?q=` | Wikipedia search + summary |
| `GET /api/wiki/web?q=` | Quick web search (DuckDuckGo instant answer) |
| `GET /api/wiki/define?word=` | Dictionary lookup |

All routes except register/login require `Authorization: Bearer <token>`.
