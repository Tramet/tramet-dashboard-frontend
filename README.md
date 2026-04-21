# 🚀 Tramet Dashboard Frontend

High-performance dashboard for managing statistics, logistics, and operations for Tramet ©️.

This repository features a robust architecture built with **Next.js 14**, focused on performance, modularity, and developer experience.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Runtime**: [Bun](https://bun.sh/) (Fastest performance)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with Cookie persistence.
- **API Client**: Specialized Fetch wrapper with automatic JWT injection.

---

## ⚡ Quick Start

1.  **Clone the repositories**:
    ```bash
    git clone https://github.com/Tramet/tramet-dashboard-frontend.git
    ```
2.  **Install dependencies**:
    ```bash
    bun install
    ```
3.  **Configure environment**:
    Create a `.env.local` file in the root:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080
    ```
4.  **Run the development server**:
    ```bash
    bun run dev
    ```
    *Open [http://localhost:3000](http://localhost:3000) to see the result.*

---

## 📖 Documentation

The project includes an extensive documentation suite designed for both tech and business stakeholders:

### 🛠 Technical Documentation (English)
Located in [`Docs/Technical/`](Docs/Technical/):
1.  [01 - Architecture Overview](Docs/Technical/01-Architecture-Overview.md)
2.  [02 - API Client Specification](Docs/Technical/02-API-Client-Spec.md)
3.  [03 - State Management & Context](Docs/Technical/03-State-Management.md)
4.  [04 - Security & Authentication](Docs/Technical/04-Security-and-Auth.md)
5.  [05 - UI & Design System](Docs/Technical/05-UI-and-Design-System.md)
6.  **[06 - Setup & Deployment Guide](Docs/Technical/06-Setup-and-Deployment.md)** (Critical for new devs)

### 💼 Reports (Español)
- **[Reporte Ejecutivo](Docs/Business/reporte_ejecutivo.md)**: Resumen operativo y valor del activo para el dueño del código.

---

## 🔗 Project Ecosystem

- **Main Backend (Java)**: [backendmain](https://github.com/Tramet/backendmain)
- **Frontend**: [tramet-dashboard-frontend](https://github.com/Tramet/tramet-dashboard-frontend)
- **Old Backend (Deprecated)**: [Backend](https://github.com/Tramet/Backend)

---

Developed with ❤️ for Tramet.
