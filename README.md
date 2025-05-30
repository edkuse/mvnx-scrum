# MVNx Scrum

A modern project management tool with a Next.js frontend and FastAPI backend, featuring a beautiful dashboard, Kanban boards, advanced filtering, and robust CRUD for applications, epics, and stories/tasks.

---

## 🚀 Project Overview

MVNx Scrum is a full-stack project management platform designed for agile teams. It provides:
- A modern, responsive UI (Next.js, Tailwind CSS, shadcn/ui)
- A robust FastAPI backend with PostgreSQL
- Kanban boards for stories/tasks
- Epic and application management
- Advanced filtering, sorting, and search
- User assignment, avatars, and progress tracking
- Accessible, consistent, and beautiful design

---

## 🛠️ Tech Stack
- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** FastAPI, SQLModel/SQLAlchemy, PostgreSQL
- **UI/UX:** shadcn/ui, Lucide icons, modern dashboard patterns
- **Other:** date-fns, @hello-pangea/dnd (drag & drop), Vercel (optional)

---

## ✨ Features
- **Dashboard:** Modern stat cards, recent activity, upcoming sprints
- **Applications:** CRUD, filtering, owner avatars
- **Epics:** CRUD, multi-app support, status/priority badges, lead avatars, progress bars, due date countdowns, tags
- **Stories/Tasks:** Kanban board with drag & drop, CRUD, advanced filtering, assignee picker, badges, progress, epic links
- **User Management:** Assign users to stories, avatar support, search
- **Accessibility:** Keyboard navigation, color contrast, responsive design
- **Consistent UI:** Shared components, modern design, shadcn/ui

---

## ⚡ Getting Started

### 1. **Clone the repo**
```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. **Install dependencies**
#### Frontend (Next.js)
```sh
npm install
# or yarn install
```
#### Backend (FastAPI)
```sh
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. **Set up environment variables**
- Copy `.env.example` to `.env` in both root and backend folders (if present)
- Set your database URL, API keys, etc.

### 4. **Run the development servers**
#### Frontend
```sh
npm run dev
```
#### Backend
```sh
cd backend
uvicorn app.main:app --reload
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ⚙️ Environment Variables
- `NEXT_PUBLIC_API_URL` (frontend): URL of your FastAPI backend (e.g., http://localhost:8000)
- `.env` (backend):
  - `DATABASE_URL` (PostgreSQL connection string)
  - Other secrets as needed

---

## 🧑‍💻 Development Workflow
- **Frontend:** All code in `/src/app`, `/src/components`, `/src/lib`
- **Backend:** All code in `/backend/app`, models, routers, schemas
- **Shared UI:** Use shadcn/ui and Tailwind for all components
- **Linting:**
  - Frontend: `npm run lint`
  - Backend: `flake8`, `black`, or your preferred Python linter/formatter
- **Testing:**
  - Frontend: Add tests in `/src/__tests__` (Jest, React Testing Library)
  - Backend: Add tests in `/backend/tests` (pytest)

---

## 🚀 Deployment
- **Frontend:** Deploy to Vercel, Netlify, or your preferred platform
- **Backend:** Deploy FastAPI to Render, Heroku, or your own server
- **Database:** Use managed PostgreSQL (e.g., Supabase, Heroku Postgres) or self-host

---

## 🤝 Contributing
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📝 License
This project is licensed under the MIT License.

---

## 📚 Acknowledgements
- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
