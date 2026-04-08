# Finance Data Processing and Access Control Backend

A production-ready backend system designed for managing financial records, enforcing role-based access control (RBAC), and delivering aggregated dashboard insights.

This project demonstrates backend architecture, data modeling, secure authentication, and real-world business logic implementation.

---

## Overview

This system simulates a finance dashboard backend where users interact with financial data based on their role:

- Store and manage financial transactions  
- Enforce strict role-based permissions  
- Provide aggregated analytics for dashboards  
- Handle authentication, authorization, and secure token flows  

---

## Core Features

### Authentication and Security

- JWT-based authentication (Access and Refresh tokens)  
- Token persistence with expiry and revocation  
- Google OAuth login using Passport.js  
- Email verification and password reset using Nodemailer  

---

### Role-Based Access Control (RBAC)

| Role    | Capabilities                              |
|---------|-------------------------------------------|
| Viewer  | Read-only access to own data              |
| Analyst | Access assigned users and analytics       |
| Admin   | Full system control                       |

RBAC is enforced at:
- Route level using middleware  
- Service level using data-level restrictions  

---

### Financial Records Management

- Create, update, and delete financial records  
- Soft delete (data is not permanently removed)  
- Filtering support:
  - Type (INCOME / EXPENSE)  
  - Category  
  - Date range  
- Pagination support  

---

### Dashboard and Analytics

- Total income  
- Total expenses  
- Net balance  
- Category-wise breakdown  
- Monthly trends  
- Recent transactions  
- User-level breakdown for Admin and Analyst  

---

### Analyst Assignment System

- Admin assigns users to analysts  
- Analysts can only access assigned users  
- Prevents unauthorized data access  

---

### Validation and Error Handling

- Zod-based request validation  
- Centralized error handling middleware  
- Consistent API response structure  
- Proper HTTP status codes  

---

## Tech Stack

- Node.js  
- Express.js  
- TypeScript  
- PostgreSQL  
- Prisma ORM  
- Zod (Validation)  
- JWT Authentication  
- Passport.js (Google OAuth)  
- Nodemailer (Emails)  

---

## Project Structure

```bash
src/
│
├── config/         # Prisma, environment, OAuth configuration
├── middleware/     # Authentication, RBAC, validation, error handling
├── modules/
│   ├── auth/       
│   ├── user/       
│   ├── record/     
│   ├── dashboard/  
│   ├── assignment/ 
│
├── utils/          # JWT, hashing, pagination, response helpers
├── validations/    # Zod schemas
├── routes/         
└── server.ts       
```

---

## Setup Instructions

### Clone Repository

```bash
git clone https://github.com/Swapnil0717/Finance_backend.git
cd Finance_backend
```

---

### Install Dependencies

```bash
npm install
```

---

### Configure Environment Variables

Create a `.env` file:

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

### Run Database Migrations

```bash
npx prisma migrate dev
```

---

### Start Development Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## API Overview

### Authentication

| Method | Endpoint                |
|--------|------------------------|
| POST   | /auth/signup           |
| POST   | /auth/login            |
| POST   | /auth/refresh          |
| POST   | /auth/forgot-password  |
| POST   | /auth/reset-password   |
| GET    | /auth/google           |
| GET    | /auth/google/callback  |

---

### Records

| Method | Endpoint       |
|--------|----------------|
| POST   | /records       |
| GET    | /records       |
| GET    | /records/:id   |
| PATCH  | /records/:id   |
| DELETE | /records/:id   |

---

### Dashboard

| Method | Endpoint    |
|--------|-------------|
| GET    | /dashboard  |

---

### Users (Admin Only)

| Method | Endpoint              |
|--------|-----------------------|
| GET    | /users                |
| PATCH  | /users/:id/role       |
| PATCH  | /users/:id/status     |

---

### Assignments

| Method | Endpoint                  |
|--------|---------------------------|
| POST   | /assignments              |
| GET    | /assignments              |
| DELETE | /assignments/:id          |
| GET    | /assignments/my-users     |

---

## Access Control Summary

| Action            | Viewer       | Analyst          | Admin |
|------------------|--------------|------------------|-------|
| View records     | Own          | Assigned         | All   |
| Create records   | No           | Yes              | Yes   |
| Update records   | No           | Assigned         | Yes   |
| Delete records   | No           | Assigned         | Yes   |
| Dashboard access | Own          | Assigned         | All   |
| Manage users     | No           | No               | Yes   |

---

## Example Requests

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

```bash
GET /records?type=EXPENSE&category=Food&startDate=2026-04-01&endDate=2026-04-30&page=1&limit=10
```

---

## Design Decisions

- RBAC enforced at service layer to prevent bypassing via routes  
- Soft delete implemented to preserve audit history  
- Token system persisted in database for secure refresh and revocation  
- Modular architecture for scalability and maintainability  
- Centralized validation for consistent input handling  
- Dashboard built using aggregation queries for efficient data processing  

---

## Assumptions

- Analysts can only access assigned users  
- Admin must provide userId when creating records  
- Viewer cannot perform write operations  
- Deleted records are hidden but not permanently removed  

---

## Future Enhancements

- Google OAuth integration improvements  
- Email verification and password reset enhancements  
- Token hashing and revocation system  
- Advanced pagination and filtering  
- Improved soft delete strategies  

---

## Author

Pranav Pathare  
GitHub: Swapnil0717  
