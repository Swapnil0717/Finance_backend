# 🚀 Finance Backend API

A **production-ready backend system** for managing financial data, user roles, and dashboard analytics.

Built to demonstrate **backend architecture, RBAC (Role-Based Access Control), data processing, and clean API design**.

---

## 📌 Features

### 🔐 Authentication & Authorization

* JWT-based authentication (Access + Refresh tokens)
* Google OAuth login
* Email verification & password reset
* Role-based access control (RBAC)

### 👥 User Roles

* **Viewer** → No access to protected APIs
* **Analyst** → Manage own financial data
* **Admin** → Full system access (users + all records)

---

### 💰 Financial Records

* Create, update, delete records
* Soft delete support
* Filter by:

  * Type (Income / Expense)
  * Category
  * Date range
* Pagination (production-safe)

---

### 📊 Dashboard APIs

* Total income
* Total expenses
* Net balance
* Category-wise breakdown
* Monthly trends
* Recent transactions

---

### ✅ Validation & Error Handling

* Zod-based request validation
* Centralized error handling
* Proper HTTP status codes

---

## 🏗️ Tech Stack

* **Node.js + Express**
* **TypeScript**
* **PostgreSQL**
* **Prisma ORM**
* **Zod (Validation)**
* **JWT Authentication**
* **Nodemailer (Emails)**

---

## 📂 Project Structure

```
src/
│
├── config/        # Prisma, env, OAuth config
├── middleware/    # Auth, validation, error handling
├── modules/
│   ├── auth/
│   ├── user/
│   ├── record/
│   ├── dashboard/
│
├── utils/         # JWT, hashing, pagination
├── validations/   # Zod schemas
├── routes/        # Main route handler
└── server.ts      # Entry point
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo

```bash
git clone https://github.com/Swapnil0717/Finance_backend.git
cd finance-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create `.env`:

```
PORT=5000
DATABASE_URL=your_postgres_url

JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_password

GOOGLE_CLIENT_ID=your_google_client_id

APP_URL=http://localhost:3000
```

---

### 4️⃣ Run Prisma

```bash
npx prisma migrate dev
```

---

### 5️⃣ Start Server

```bash
npm run dev
```

---

## 🔑 API Overview

### Auth

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/auth/signup`          |
| POST   | `/auth/login`           |
| POST   | `/auth/refresh`         |
| POST   | `/auth/forgot-password` |
| POST   | `/auth/reset-password`  |
| POST   | `/auth/google`          |

---

### Records

| Method | Endpoint       |
| ------ | -------------- |
| POST   | `/records`     |
| GET    | `/records`     |
| GET    | `/records/:id` |
| PATCH  | `/records/:id` |
| DELETE | `/records/:id` |

---

### Dashboard

| Method | Endpoint     |
| ------ | ------------ |
| GET    | `/dashboard` |

---

### Users (Admin Only)

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | `/users`            |
| PATCH  | `/users/:id/role`   |
| PATCH  | `/users/:id/status` |

---

## 🔐 Role-Based Access Control

| Action         | Viewer | Analyst | Admin   |
| -------------- | ------ | ------- | ------- |
| View records   | ❌      | ✅ (own) | ✅ (all) |
| Create records | ❌      | ✅       | ✅       |
| Update records | ❌      | ✅ (own) | ✅       |
| Delete records | ❌      | ✅ (own) | ✅       |
| Manage users   | ❌      | ❌       | ✅       |

---

## 🧪 Example Requests

### Create Record

```json
POST /records

{
  "amount": 500,
  "type": "EXPENSE",
  "category": "Food",
  "date": "2026-04-03"
}
```

---

### Get Records with Filters

```
GET /records?type=EXPENSE&category=Food&page=1&limit=10
```

---

## 🧠 Design Decisions

* **RBAC enforced at service layer** for security
* **Soft delete** used for audit safety
* **Pagination sanitized at service level** (never trust input)
* **Modular architecture** for scalability

## 👨‍💻 Author

**Pranav Pathare (Swapnil0717)**

---
