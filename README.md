# 🚀 Finance Data Processing & Access Control Backend

A **production-ready backend system** designed for managing financial records, enforcing role-based access control (RBAC), and delivering aggregated dashboard insights.

This project demonstrates **backend architecture, data modeling, secure authentication, and real-world business logic implementation**.

---

## 📌 Overview

This system simulates a **finance dashboard backend** where users interact with financial data based on their role:

* Store and manage financial transactions
* Enforce strict role-based permissions
* Provide aggregated analytics for dashboards
* Handle authentication, authorization, and secure token flows

---

## ✨ Core Features

### 🔐 Authentication & Security

* JWT-based authentication (Access + Refresh tokens)
* Token persistence with expiry & revocation
* Google OAuth login (Passport.js)
* Email verification & password reset (Nodemailer)

---

### 👥 Role-Based Access Control (RBAC)

| Role    | Capabilities                      |
| ------- | --------------------------------- |
| Viewer  | Read-only access to own data      |
| Analyst | Access assigned users + analytics |
| Admin   | Full system control               |

✔ Enforced at:

* Route level (middleware)
* Service level (data-level restrictions)

---

### 💰 Financial Records Management

* Create, update, delete records
* Soft delete (data not permanently removed)
* Filtering:

  * Type (INCOME / EXPENSE)
  * Category
  * Date range
* Pagination support

---

### 📊 Dashboard & Analytics

* Total income
* Total expenses
* Net balance
* Category-wise breakdown
* Monthly trends
* Recent transactions
* User-level breakdown (Admin / Analyst)

---

### 🔄 Analyst Assignment System

* Admin assigns users to analysts
* Analysts can only access assigned users
* Prevents unauthorized data access

---

### ✅ Validation & Error Handling

* Zod-based request validation
* Centralized error handling middleware
* Consistent API response structure
* Proper HTTP status codes

---

## 🏗️ Tech Stack

* **Node.js + Express**
* **TypeScript**
* **PostgreSQL**
* **Prisma ORM**
* **Zod (Validation)**
* **JWT Authentication**
* **Passport.js (Google OAuth)**
* **Nodemailer (Emails)**

---

## 📂 Project Structure

```
src/
│
├── config/         # Prisma, env, OAuth config
├── middleware/     # Auth, RBAC, validation, error handling
├── modules/
│   ├── auth/       # Authentication & token logic
│   ├── user/       # User management (Admin)
│   ├── record/     # Financial records
│   ├── dashboard/  # Aggregated analytics
│   ├── assignment/ # Analyst-user mapping
│
├── utils/          # JWT, hashing, pagination, response helpers
├── validations/    # Zod schemas
├── routes/         # Route registration
└── server.ts       # Entry point
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Swapnil0717/Finance_backend.git
cd Finance_backend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create `.env` file:

```env
PORT=5000
DATABASE_URL=your_postgres_url

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

APP_URL=http://localhost:3000
```

---

### 4️⃣ Run Database Migrations

```bash
npx prisma migrate dev
```

---

### 5️⃣ Start Development Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## 🔑 API Overview

### 🔐 Auth

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/auth/signup`          |
| POST   | `/auth/login`           |
| POST   | `/auth/refresh`         |
| POST   | `/auth/forgot-password` |
| POST   | `/auth/reset-password`  |
| GET    | `/auth/google`          |
| GET    | `/auth/google/callback` |

---

### 💰 Records

| Method | Endpoint       |
| ------ | -------------- |
| POST   | `/records`     |
| GET    | `/records`     |
| GET    | `/records/:id` |
| PATCH  | `/records/:id` |
| DELETE | `/records/:id` |

---

### 📊 Dashboard

| Method | Endpoint     |
| ------ | ------------ |
| GET    | `/dashboard` |

---

### 👥 Users (Admin Only)

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | `/users`            |
| PATCH  | `/users/:id/role`   |
| PATCH  | `/users/:id/status` |

---

### 🔗 Assignments

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/assignments`          |
| GET    | `/assignments`          |
| DELETE | `/assignments/:id`      |
| GET    | `/assignments/my-users` |

---

## 🔐 Access Control Summary

| Action           | Viewer  | Analyst      | Admin   |
| ---------------- | ------- | ------------ | ------- |
| View records     | ✅ (own) | ✅ (assigned) | ✅ (all) |
| Create records   | ❌       | ✅            | ✅       |
| Update records   | ❌       | ✅ (assigned) | ✅       |
| Delete records   | ❌       | ✅ (assigned) | ✅       |
| Dashboard access | ✅ (own) | ✅ (assigned) | ✅       |
| Manage users     | ❌       | ❌            | ✅       |

---

## 🧪 Example Requests

### Create Record

```json
POST /records

{
  "amount": 1000,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-04-01"
}
```

---

### Filter Records

```
GET /records?type=EXPENSE&category=Food&startDate=2026-04-01&endDate=2026-04-30&page=1&limit=10
```

---

## 🧠 Design Decisions

* **RBAC enforced at service layer** → prevents bypassing via routes
* **Soft delete implemented** → preserves audit history
* **Token system persisted in DB** → secure refresh & revocation
* **Modular architecture** → scalable and maintainable
* **Validation centralized via middleware** → consistent input handling
* **Dashboard built via aggregation queries** → efficient data processing

---

## ⚠️ Assumptions

* Analyst can only access assigned users
* Admin must provide `userId` when creating records
* Viewer cannot perform any write operations
* Deleted records are hidden but not permanently removed

---

## 🚀 Additional Enhancements

* Google OAuth integration
* Email verification & password reset
* Token hashing & revocation system
* Pagination & filtering
* Soft delete implementation

---

## 👨‍💻 Author

**Pranav Pathare (Swapnil0717)**

---

