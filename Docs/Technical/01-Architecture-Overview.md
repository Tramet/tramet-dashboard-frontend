# 01 - Architecture Overview

This document outlines the core architectural principles and the structural organization of the Tramet Dashboard Frontend.

---

## 🏛 Design Philosophy: The "Internal Assets" Pattern
To avoid polluting the Next.js App Router (where every folder without a prefix is a potential route), we use a convention of prefixing folders with an underscore `_`.

- **Protected Routing**: Next.js ignores folders starting with `_` for routing purposes, allowing us to keep business logic and components close to the pages they serve without creating accidental URLs.
- **Modularity**: The codebase is split into specialized "internal folders" that separate concerns (API, state, UI, logic).

---

## 📂 Project Structure Breakdown

### `/app`
The root of the application, containing all routes and global configuration.

- **`_api/`**: Centralized service layer. Every file here corresponds to a backend controller or a specific feature (e.g., `auth.ts`, `customers.tsx`).
- **`_components/`**: UI repository.
  - `_layout/`: Global layout elements like Sidebar and Header.
  - `ui/`: Atom-level components (buttons, cards, badges) powered by Shadcn/UI.
- **`_hooks/`**: Custom React hooks. These manage everything from screen size detection (`use-media-query`) to global context selection (`use-context-store`).
- **`_lib/`**: Foundation utilities. Contains the specialized `api-client.ts` and general formatting helpers.
- **`_types/`**: Single source of truth for TypeScript interfaces. Ensures consistency between frontend models and backend DTOs.
- **`_data/`**: Static data and mock objects used for development and local testing.

---

## 🔄 Component Hierarchy & Data Flow

1.  **Layout Level**: The `layout.tsx` file provides the shell. It includes the `Sidebar` and `Header`.
2.  **Context Layer**: High-level components consume the `useContextStore` to determine what data to display based on the selected Site, Department, and Area.
3.  **Page Level**: Individual routes (like `dashboard/operations/[id]`) consume the API via hooks and render UI components.
4.  **Middleware**: Every request passes through `middleware.ts` to verify the user's role and token BEFORE the page starts rendering.

---

## 🛠 Key Patterns Used
- **Early Return Pattern**: Used in components and middleware to handle unauthorized or unconfigured states quickly.
- **Custom Hook Overfetch**: We prefer creating specialized hooks (e.g., `useGetUsers`) that wrap the API call and handle loading/error states, keeping the components clean.
- **Persistent Selection**: User choices are stored in **Cookies** to ensure that reload (F5) or direct URL access preserves the user session and context.
