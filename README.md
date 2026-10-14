# Course Management

Course Management consists of a Spring Boot backend and a React/Vite frontend.

## Requirements

- Java 25
- Node.js and npm
- MySQL

## Run the backend

From the repository root, configure the database and JWT signing key in PowerShell:

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/course_management"
$env:DB_USERNAME = "your-mysql-user"
$env:DB_PASSWORD = "your-mysql-password"
$env:JWT_SECRET = "replace-with-a-long-random-secret"
```

Optionally set `ADMIN_EMAIL` and `ADMIN_PASSWORD` to create the initial administrator account. The default email is `admin@courseapp.local`; no administrator is seeded when its password is left unset.

Then start the backend:

```powershell
cd .\coursemanagement
.\mvnw.cmd spring-boot:run
```

## Run the frontend

In a separate terminal:

```powershell
cd .\course-management-frontend
npm ci
npm run dev
```
