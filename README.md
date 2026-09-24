# Study Mate (STM)

Full-stack student productivity app — courses, assignments/deadlines, weekly
timetable, progress tracking, and a Research tab (Wikipedia search, quick web
search, dictionary lookup). No AI dependency — runs fully standalone with
just a database.

## Stack
- **Frontend:** React (Vite), plain JavaScript, React Router, axios. Data/formatting
  logic lives in `src/data/*.js`, kept separate from page/UI components.
- **Backend:** Node.js + Express, MongoDB (Mongoose), JWT auth, axios.
- **External APIs:** Wikipedia REST/search API, DuckDuckGo Instant Answer API,
  dictionaryapi.dev — all free and keyless, no accounts or secrets required.

## Database setup (MongoDB Atlas — free tier)
1. Go to https://www.mongodb.com/cloud/atlas/register and create an account (or log in).
2. Create a new **Project**, then click **Build a Database** → choose the **M0 Free** tier → pick a cloud provider/region → **Create**.
3. Under **Security → Database Access**, add a database user (username + password, "Read and write to any database" role). Save the password — you'll need it in the connection string.
4. Under **Security → Network Access**, add an IP address. For local dev/testing, **Allow Access from Anywhere** (`0.0.0.0/0`) is easiest; for production, restrict it to your Render service's IPs if possible.
5. Go to **Database → Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with the database user from step 3, and add a database name before the `?`, e.g. `.../studymate?retryWrites=true&w=majority`. This full string is your `MONGO_URI`.

## Backend setup
```bash
cd backend
cp .env.example .env   # paste your MONGO_URI from above, set JWT_SECRET to any long random string
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

## API overview
| Route | Description |
|---|---|
| `POST /api/auth/register` `/login` | Auth, returns JWT |
| `GET /api/auth/me` | Current user |
| `GET/POST/DELETE /api/courses` | Courses CRUD |
| `GET/POST/PATCH/DELETE /api/assignments` | Assignments CRUD |
| `GET/POST/DELETE /api/timetable` | Weekly timetable slots |
| `GET/POST/DELETE /api/notes` | Study log entries |
| `GET /api/wiki/search?q=` | Wikipedia search + summary |
| `GET /api/wiki/web?q=` | Quick web search (DuckDuckGo instant answer) |
| `GET /api/wiki/define?word=` | Dictionary lookup |

All routes except register/login require `Authorization: Bearer <token>`.
