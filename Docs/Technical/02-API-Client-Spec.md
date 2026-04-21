# 02 - API Client Specification

The `api-client.ts` is the nervous system of the Tramet Frontend. It centralizes all communication with the backend and handles security, error reporting, and data parsing.

---

## 🔧 The Client Location
Path: [`app/_lib/api/api-client.ts`](../../app/_lib/api/api-client.ts)

---

## 🛠 Core Functionality

### 1. Automatic JWT Injection
The client is designed to be "Session Aware". 
- It attempts to read the `auth-storage` cookie on every request.
- If a token is found, it automatically adds the `Authorization: Bearer <token>` header.
- This ensures that developers don't have to manually pass tokens to every API call.

### 2. Standardized Request Flow
The `apiRequest` function handles the following cycle:
1.  **URL Construction**: Combines `BASE_URL` (from `.env.local`) with the specific endpoint.
2.  **Request Execution**: Uses the native `fetch` API.
3.  **Error Identification**: 
    - **401/403**: Redirects the user to `/login` as the session is invalid or expired.
    - **JSON Errors**: If the backend returns a JSON error, the client parses it and displays a `sonner` toast notification to the user.
    - **Physical Errors**: Handles network failures or non-JSON responses gracefully.

### 3. Usage Examples

#### GET Request
```typescript
const users = await api.get<ApiUser[]>("/admin/users/all");
```

#### POST Request
```typescript
const result = await api.post("/auth/login", { username, password });
```

---

## 📝 How to Add a New Service

To maintain modularity, do NOT call the `api` object directly from components. Instead, create a service file in `app/_api/`.

**Example: creating `tickets.ts`**
1. Create `app/_api/tickets.ts`.
2. Define your functions:
   ```typescript
   import { api } from "@trm/_lib/api/api-client";
   
   export const getTickets = async () => {
     return api.get("/tickets");
   };
   ```
3. Import and use the function in your components or hooks.

---

## ⚠️ Important Implementation Details
- **Safety**: The client uses a `try/catch` block inside the response parsing to prevent the application from crashing if the backend returns malformed data or empty bodies.
- **Base URL**: Defaults to `http://localhost:8080`. This can be overridden in production by setting the `NEXT_PUBLIC_API_URL` environment variable.
