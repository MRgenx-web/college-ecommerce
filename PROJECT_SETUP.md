# Project Setup Guide (Windows)

Step-by-step instructions for getting TechKart India running on a Windows machine for the
first time. This assumes you've just received the project folder (via zip, USB, or `git
clone`) and have nothing installed yet except Windows itself.

---

## 1. Install Prerequisites

### Node.js

1. Download the **LTS** installer from [nodejs.org](https://nodejs.org/) (version 18 or
   later).
2. Run the installer, accepting the defaults (this also installs npm).
3. Verify the install by opening **PowerShell** or **Command Prompt** and running:
   ```powershell
   node -v
   npm -v
   ```
   Both commands should print a version number. If they don't, restart your terminal (and
   your machine, if that still doesn't work) so the updated `PATH` takes effect.

### A code editor (optional but recommended)

[VS Code](https://code.visualstudio.com/) is a good default choice if you don't already have
one.

### Git (optional, only if you're cloning from a repository)

Download from [git-scm.com](https://git-scm.com/download/win) if you plan to `git clone` this
project rather than receiving it as a folder/zip.

---

## 2. Get the Project Onto Your Machine

- **If you received a `.zip` file:** right-click it → *Extract All...* → choose a destination
  folder (e.g. `C:\Projects\techkart-india`). Avoid extracting directly onto your Desktop or
  into a path with spaces if you can help it — it works either way, but simpler paths are
  easier to debug if something goes wrong.
- **If you're cloning via Git:**
  ```powershell
  git clone <repository-url> techkart-india
  cd techkart-india
  ```

The project has two independent folders you'll be working with: `backend/` and `frontend/`.

---

## 3. Set Up the Backend

Open a terminal (PowerShell) and navigate into the project:

```powershell
cd C:\path\to\techkart-india\backend
```

### 3.1 Install dependencies

```powershell
npm install
```

This downloads all packages listed in `package.json` into a new `backend\node_modules\`
folder. It can take a minute or two the first time.

> **Note on `better-sqlite3`:** this package includes a native binary. `npm install` should
> download a prebuilt binary automatically for Windows — you do **not** need Visual Studio
> Build Tools or Python installed for this to work. If installation fails with a build error,
> see the Troubleshooting section below.

### 3.2 Create your environment file

Copy the example environment file to a real `.env` file:

```powershell
copy .env.example .env
```

Open the new `.env` in your editor. The defaults work as-is for local development — you don't
need to change anything to get started. If you do customize it, the important variables are:

| Variable | What it does |
|---|---|
| `PORT` | Port the API server listens on (default `5000`) |
| `JWT_SECRET` | Secret used to sign login tokens — the server won't start without this set |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials for the admin account created by the seed script |
| `CLIENT_URL` | Must match the URL the frontend runs on, for CORS to work |

### 3.3 Create and seed the database

```powershell
npm run seed
```

This creates a new SQLite database file at `backend\src\database\ecommerce.db` (it does not
exist yet — this command creates it from scratch), applies the schema, creates the admin
account, and inserts 27 sample products. You should see output ending in
`Seeding complete.`

### 3.4 Start the backend server

```powershell
npm run dev
```

You should see:
```
Server running in development mode on port 5000
```

Leave this terminal window open — the server needs to keep running. Open a **second**
terminal window for the frontend.

---

## 4. Set Up the Frontend

In your **second** PowerShell window:

```powershell
cd C:\path\to\techkart-india\frontend
```

### 4.1 Install dependencies

```powershell
npm install
```

### 4.2 Create your environment file

```powershell
copy .env.example .env
```

The default value (`VITE_API_URL=http://localhost:5000/api`) matches the backend's default
port, so no changes are needed unless you changed `PORT` in the backend's `.env`.

### 4.3 Start the frontend dev server

```powershell
npm run dev
```

You should see output ending with something like:
```
➜  Local:   http://localhost:5173/
```

---

## 5. Open the App

With both terminals still running, open your browser to:

- **Storefront:** [http://localhost:5173](http://localhost:5173)
- **Admin login:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
  — sign in with the credentials from `backend/.env` (`admin@techkart.in` / `Admin@123` by
  default).

To stop either server, click into its terminal window and press `Ctrl+C`.

---

## 6. Everyday Commands Reference

| Task | Command | Run from |
|---|---|---|
| Install/update backend deps | `npm install` | `backend/` |
| Reset & reseed the database | `del src\database\ecommerce.db* ; npm run seed` | `backend/` |
| Start backend (dev, auto-restart) | `npm run dev` | `backend/` |
| Start backend (no auto-restart) | `npm start` | `backend/` |
| Install/update frontend deps | `npm install` | `frontend/` |
| Start frontend dev server | `npm run dev` | `frontend/` |
| Build frontend for production | `npm run build` | `frontend/` |
| Lint frontend code | `npm run lint` | `frontend/` |

---

## 7. Troubleshooting

**`npm install` fails on `better-sqlite3` with a native build error**
This usually means no prebuilt binary was available for your exact Node.js version/platform
and npm fell back to compiling from source, which needs build tools it can't find. Fix by
either:
- Installing a Node.js **LTS** version (prebuilt binaries are published for LTS releases), or
- Installing the "Desktop development with C++" workload via [Visual Studio Build
  Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/), then re-running
  `npm install`.

**Port 5000 or 5173 is already in use**
Something else on your machine is using that port. Either close that program, or change the
port: edit `PORT` in `backend/.env` (and update `CLIENT_URL` there, plus `VITE_API_URL` in
`frontend/.env`, to match).

**Frontend loads but shows errors fetching products / login fails**
The backend isn't running, or `VITE_API_URL` doesn't match the backend's actual port. Check
the backend terminal is still running and showing no errors, and that the two `.env` files
agree on the port.

**"JWT_SECRET is missing" error on backend startup**
You skipped step 3.2, or deleted the `JWT_SECRET` line from `backend/.env`. Re-copy
`.env.example` to `.env`.

**I want to start over with a clean database**
Stop the backend (`Ctrl+C`), delete the three database files in `backend\src\database\`
(`ecommerce.db`, `ecommerce.db-shm`, `ecommerce.db-wal` — the last two may not exist if the
server was stopped cleanly), then run `npm run seed` again.
