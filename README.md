# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with MERN + TypeScript.

## Tech Stack
- **Frontend**: React.js, TypeScript, TailwindCSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt

## Features
- JWT Authentication with Role-Based Access Control (Admin / Sales)
- Full CRUD Leads Management
- Advanced Filtering (Status, Source, Search, Sort)
- Debounced Search
- Backend Pagination (10 records/page)
- CSV Export
- Docker Support

## Quick Start (Local)

### Prerequisites
- Node.js v18+
- MongoDB running locally OR MongoDB Atlas URI

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## Docker Setup
```bash
# From project root
docker-compose up --build
```
Then open http://localhost:3000

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me (protected)

### Leads (all protected)
- GET    /api/leads          - Get all leads (with filters & pagination)
- GET    /api/leads/:id      - Get single lead
- POST   /api/leads          - Create lead
- PUT    /api/leads/:id      - Update lead
- DELETE /api/leads/:id      - Delete lead (Admin only)
- GET    /api/leads/export/csv - Export to CSV

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## RBAC Roles
- **Admin**: Can see all leads, delete any lead
- **Sales**: Can only see/edit their own leads
