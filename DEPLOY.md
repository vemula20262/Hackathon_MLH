Quick free deployment guide — Carbon Cruncher

This repo contains a Flask backend (`app.py`) and a React frontend under `carbon-cruncher/`.
Below are two fast, free deployment options and the minimal files/commands you need.

Prerequisites
- GitHub account (recommended)
- Docker (optional)
- You must include `material_detection.h5` in the deployed backend (or load from cloud storage).

Option A — Fastest free split deployment (recommended): Vercel (frontend) + Railway (backend)
- Why: Vercel automatically builds React apps from `carbon-cruncher/`. Railway offers a free Python service for Flask and is simple to configure.

Frontend (Vercel)
1. Push the repo to GitHub.
2. In Vercel, choose "Import Project" -> select your GitHub repo.
3. Set Project Root to `carbon-cruncher`.
4. Build Command: `npm run build` (default)
   Publish Directory: `build`
5. Add an Environment Variable on Vercel (optional) named `REACT_APP_API_URL` with the URL of the backend after you deploy it (see below).

Backend (Railway)
1. Push the repo (backend root) to GitHub (root of repo contains `app.py`).
2. In Railway, create a new Project -> Deploy from GitHub.
3. Point Railway to the repository and select the root where `app.py` is located.
4. In Railway's service settings set the Start Command to:
   `gunicorn app:app --bind 0.0.0.0:$PORT`
5. Add required environment variables and upload `material_detection.h5` to the project (Railway supports file uploads or you can store the model in S3/GCS and download at start).
6. Add `gunicorn` and `Flask-Cors` to `requirements.txt` if they're missing.

Once Railway provides a URL (e.g. `https://your-backend.up.railway.app`) add it to Vercel's `REACT_APP_API_URL` env var.

Option B — Single-host free-ish deployment: Render (free tier for static + web services) or Fly.io
- Why: Simpler single deploy if you prefer one host. We'll serve the React build from Flask.

Steps (single-host)
1. Build React locally:
   cd carbon-cruncher
   npm install
   npm run build
2. Copy the resulting `build` folder to the backend working folder or configure Flask to serve from `carbon-cruncher/build`.
3. Ensure `app.py` serves static files and CORS is enabled (it already has a CORS after_request handler).
4. Deploy to Render: create a new Web Service, link GitHub, ensure Start Command is `gunicorn app:app --bind 0.0.0.0:5000`.

Minimal files you may want to add
- Procfile (Heroku): `web: gunicorn app:app`
- Dockerfile: if you want a container (not included here automatically).

Local quick test
- In one terminal run backend:
  python -m pip install -r requirements.txt
  python app.py
- In another terminal run frontend dev server (optional):
  cd carbon-cruncher
  npm install
  npm start

Notes & gotchas
- The repo currently calls Google Generative API with a hard-coded API key; remove or move keys to environment variables before public deployment.
- Large ML libs (TensorFlow) may not run on some free hosts due to memory/size limits. Use lightweight providers or host the model in cloud storage and stream/serve predictions differently.
- If using split deploy, set `REACT_APP_API_URL` in Vercel to your backend URL.

If you want, I can:
- Add a `Procfile` and `requirements.txt` edits (gunicorn, Flask-Cors) and commit them.
- Create a Dockerfile that builds frontend and bundles with Flask.

Tell me which one you want me to finish and I'll create the needed artifacts and run quick local checks.
