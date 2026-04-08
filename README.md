# Finance Data Processing & Access Control Backend

A **production-ready backend system** designed for managing financial records, enforcing role-based access control (RBAC), and delivering aggregated dashboard insights.

This project demonstrates **backend architecture, data modeling, secure authentication, and real-world business logic implementation**.

---

## Overview

This system simulates a **finance dashboard backend** where users interact with financial data based on their role:

* Store and manage financial transactions
* Enforce strict role-based permissions
* Provide aggregated analytics for dashboards
* Handle authentication, authorization, and secure token flows

---

## Core Features

### Authentication & Security

* JWT-based authentication (Access + Refresh tokens)
* Token persistence with expiry & revocation
* Google OAuth login (Passport.js)
* Email verification & password reset (Nodemailer)

---

### Role-Based Access Control (RBAC)

| Role    | Capabilities                      |
| ------- | --------------------------------- |
| Viewer  | Read-only access to own data      |
| Analyst | Access assigned users + analytics |
| Admin   | Full system control               |

✔ Enforced at:

* Route level (middleware)
* Service level (data-level restrictions)

---

### Financial Records Management

* Create, update, delete records
* Soft delete (data not permanently removed)
* Filtering:

  * Type (INCOME / EXPENSE)
  * Category
  * Date range
* Pagination support

---

### Dashboard & Analytics

* Total income
* Total expenses
* Net balance
* Category-wise breakdown
* Monthly trends
* Recent transactions
* User-level breakdown (Admin / Analyst)

---

### Analyst Assignment System

* Admin assigns users to analysts
* Analysts can only access assigned users
* Prevents unauthorized data access

---

### Validation & Error Handling

* Zod-based request validation
* Centralized error handling middleware
* Consistent API response structure
* Proper HTTP status codes

---

## Tech Stack

* **Node.js + Express**
* **TypeScript**
* **PostgreSQL**
* **Prisma ORM**
* **Zod (Validation)**
* **JWT Authentication**
* **Passport.js (Google OAuth)**
* **Nodemailer (Emails)**

---

## Project Structure
