# Enterprise Asset & Workflow Management System

> ระบบจัดการ Asset และ Workflow สำหรับองค์กร — แนวเดียวกับ Jira / ServiceNow

![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)

---

## 📋 Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | JWT Login / Register / Refresh Token อัตโนมัติ |
| 👥 **RBAC** | 3 roles: Admin / Manager / Employee |
| 📦 **Asset Management** | CRUD + Serial Number + Owner + Status + History |
| 🔄 **Workflow System** | เบิก / ซ่อม / โอน → Pending → Approved → Completed |
| 📊 **Dashboard** | Stats + Charts (Recharts) แบบ Real-time |
| 📎 **File Upload** | แนบรูป / PDF กับ Workflow และ Asset |
| 📨 **Notifications** | Email + LINE Notify + Discord Webhook (async queue) |
| 📝 **Audit Log** | บันทึกทุก action ว่าใครทำอะไร เมื่อไหร่ |
| 🚀 **CI/CD** | GitHub Actions → Auto test → Auto deploy |

---

## 🛠 Tech Stack

### Backend
- **Laravel 11** + PHP 8.3
- **MySQL 8** — Database หลัก
- **Redis** — Queue + Cache
- **JWT Auth** (tymon/jwt-auth)
- **Laravel Queue** — Background jobs

### Frontend
- **React 18** + TypeScript
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **React Query** — Server state management
- **Zustand** — Client state (Auth)
- **Axios** — HTTP client + interceptors

### Infrastructure
- **Docker Compose** — 6 services
- **Nginx** — Reverse proxy
- **GitHub Actions** — CI/CD pipeline

---

## 🏗 Architecture

```
Browser
  ↓
Nginx :80 (Reverse Proxy)
  ├── /api  → Laravel PHP-FPM :9000
  └── /     → React Vite :3000

Laravel → MySQL
Laravel → Redis → Queue Worker → Email / LINE / Discord
```

---

## 🚀 Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

### 1. Clone
```bash
git clone https://github.com/maximum5921/Enterprise-Asset-And-Workflow-System.git
cd Enterprise-Asset-And-Workflow-System
```

### 2. Setup environment
```bash
cp .env.example .env
# แก้ไขค่าใน .env ตามต้องการ
```

### 3. Start
```bash
docker compose up -d --build
```

### 4. Setup database
```bash
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan jwt:secret
docker compose exec backend php artisan migrate --seed
```

### 5. Open browser
```
http://localhost:3000/
```

---

## 👤 Default Users

| Role | Email | Password |
|---|---|---|
| Admin | admin@enterprise.local | Admin@1234 |
| Manager | manager@enterprise.local | Manager@1234 |
| Employee | employee@enterprise.local | Employee@1234 |

---

## 📁 Project Structure

```
enterprise-system/
├── .github/workflows/     # CI/CD pipelines
├── backend/               # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Services/          # Business logic
│   │   ├── Models/
│   │   └── Jobs/              # Queue jobs
│   ├── database/migrations/
│   └── routes/api.php
├── frontend/              # React + TypeScript
│   └── src/
│       ├── api/           # API functions
│       ├── components/    # Reusable UI
│       ├── hooks/         # React Query hooks
│       ├── pages/         # Route pages
│       ├── stores/        # Zustand stores
│       └── types/         # TypeScript types
├── docker/php/Dockerfile
├── nginx/nginx.conf
└── docker-compose.yml
```

---

## 🔌 API Endpoints

```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
GET    /api/v1/auth/me

GET    /api/v1/assets
POST   /api/v1/assets
GET    /api/v1/assets/:id
PUT    /api/v1/assets/:id
DELETE /api/v1/assets/:id

GET    /api/v1/workflows
POST   /api/v1/workflows
PUT    /api/v1/workflows/:id/approve
PUT    /api/v1/workflows/:id/reject
PUT    /api/v1/workflows/:id/complete

GET    /api/v1/dashboard/stats
GET    /api/v1/audit-logs
```

---

## 🧪 Testing

```bash
# Backend tests
docker compose exec backend php artisan test

# Frontend type check
cd frontend && npx tsc --noEmit
```

---

## 📄 License

MIT License — free to use for portfolio and learning purposes.

---

<p align="center">Built with ❤️ using Laravel + React + Docker</p>
