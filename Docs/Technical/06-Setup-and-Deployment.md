# 06 - Setup & Deployment Guide

This guide ensures any developer can set up the full Tramet ecosystem (Frontend, Backend, and Database) from scratch.

---

## 🔗 Source Control (GitHub)
The project is hosted on GitHub under the **Tramet** organization. You should have access to the following repositories:

- **Frontend**: [tramet-dashboard-frontend](https://github.com/Tramet/tramet-dashboard-frontend) (Current)
- **Backend (Main)**: [backendmain](https://github.com/Tramet/backendmain) (Active production backend)
- **Backend (Old)**: [Backend](https://github.com/Tramet/Backend) (Deprecated - Reference only)

---

## 💻 Local Environment Setup

### Prerequisites
- **Docker Desktop**: Mandatory for the database.
- **Java 17 JDK (e.g., Temurin)**: Mandatory for the Spring Boot backend.
- **Bun** (Preferred) or **Node.js**: For the Next.js frontend.
- **Git**: For version control.

### 1. Database & Infrastructure
The system uses Docker to manage the database to ensure "it works on my machine" reproducibility.

1.  Navigate to the `/backendmain` folder.
2.  Run the infrastructure:
    ```bash
    docker-compose up -d
    ```
3.  **Verification**: Open Docker Desktop and ensure the `mysql` container is running and healthy on port **3306**.

### 2. Backend (Spring Boot)
1.  **Configure Environment**: Ensure you have the following system environment variables set or passed during execution:
    - `DB_URL`: `jdbc:mysql://localhost:3306/tramet`
    - `DB_USERNAME`: `root` (or your local user)
    - `DB_PASSWORD`: `root` (or your local password)
    - `JWT_SECRET`: A string used for token encryption (e.g., `SuperSecretKeyForTrametDashboard2024`).
2.  **Run with Maven Wrapper**:
    ```bash
    ./mvnw spring-boot:run
    ```
3.  **Verification**: The backend should be accessible at `http://localhost:8080`.

### 3. Frontend (Next.js)
1.  Navigate to the `/tramet-dashboard-frontend` folder.
2.  **Install Dependencies**:
    ```bash
    bun install
    ```
3.  **Configure `.env.local`**:
    ```env
    # The URL of your running backend
    NEXT_PUBLIC_API_URL=http://localhost:8080
    ```
4.  **Run Development Mode**:
    ```bash
    bun run dev
    ```
5.  **Verification**: Open `http://localhost:3000` in your browser.

---

## 🚀 Deployment Considerations (Production)

### Frontend
- **Build**: Use `bun run build` to generate the production bundle.
- **Variable Injection**: Ensure `NEXT_PUBLIC_API_URL` is set in your CI/CD (Vercel, Docker, or AWS) environment.
- **Headers**: Middleware ensures secure headers are used in production.

### Backend
- **Pack**: Use `./mvnw clean package` to generate a `.jar` file.
- **Security**: In production, **USE A REAL JWT SECRET** and store it in a secure Vault or Environment Manager.
- **Database**: Ensure the cloud database (RDS, etc.) is accessible and the migrations are applied.

---

## ❓ Troubleshooting

### Port Conflict (3306 or 8080)
- **Problem**: You get "Address already in use".
- **Solution**: Check if a local MySQL service or another app is running on these ports. Use `netstat -ano | findstr :3306` (Windows) or `lsof -i :3306` (Unix) to find and stop the process.

### JAVA_HOME Error
- **Problem**: `mvnw` says JAVA_HOME is not found.
- **Solution**: Ensure Java 17 is in your PATH. On Windows, set the `JAVA_HOME` environment variable to `C:\Program Files\Java\jdk-17` (adjust to your path).

### API Connection Failed
- **Problem**: Login returns "Failed to fetch".
- **Solution**: Check if the backend is running and that the `NEXT_PUBLIC_API_URL` in `.env.local` matches exactly where the backend is listening.
