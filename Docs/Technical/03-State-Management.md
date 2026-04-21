# 03 - State Management & Context

Tramet Dashboard uses a dual-layer state management system: **Zustand** for in-memory reactive state and **Cookies** for persistent, server-side accessible context.

---

## 🧠 The Store: `useContextStore`
Path: [`app/_hooks/use-context-store.ts`](../../app/_hooks/use-context-store.ts)

### State Structure
The store tracks three levels of organizational context:
- `site`: The physical location (e.g., "Oficina Central").
- `department`: The functional unit (e.g., "Mantenimiento").
- `area`: The specific operation zone.

### Features
1.  **Reactive UI**: Dashboard components automatically re-render when a new site or area is selected.
2.  **Breadcrumb Integration**: The selection is automatically reflected in the header and sidebar titles.
3.  **Reset Capability**: A `resetContext()` function clears the entire selection in one call.

---

## 🍪 The Cookie Layer: Persistence & SSR
Standard state managers like Zustand lose their data when the user refreshes the page (F5). To solve this, we mirror the state in Cookies.

### Why Cookies?
- **Server-Side Rendering (SSR)**: Next.js can read cookies *before* sending the page to the browser. This allows the server to know which Site/Dept is selected and render the correct content immediately, preventing "content jumping" or layout shifts.
- **Persistence**: Selections remain active even after closing the browser or logging out and back in (unless explicitly cleared).

### Implementation
We use the `js-cookie` library within the store's actions:
```typescript
setSite: (site) => {
  set({ site });
  Cookies.set("context-site", site); // Mirrors state to cookie
},
```

---

## 🛠 Usage in Components

### Accessing State
```typescript
const { site, department, area } = useContextStore();
```

### Checking for Selection
A boolean helper `isContextComplete` is available to check if the user has selected all three levels:
```typescript
const isComplete = useContextStore((state) => state.site && state.department && state.area);
```

---

## 🔐 Permission State: `usePermissionsStore`
Path: [`app/_hooks/use-permissions.ts`](../../app/_hooks/use-permissions.ts)

Alongside the organizational context, we track RBAC (Role-Based Access Control) fine-grained permissions.

### Features
1. **Dynamic Initialization**: Populated asynchronously during login by `safeGetUserPermissions()` inside `use-auth.ts`.
2. **Helper Methods**: Provides boolean functions like `hasModuleAccess('dashboard')` or `hasSiteAccess(siteId)` so UI components can safely hide or show secure elements without parsing raw JWT claims manually.
3. **Fail-Safe**: If the API is disabled (`PERMISSIONS_API_ENABLED=false`), it falls back to default wide-open permissions for development ease.

---

## 🔄 Interaction with Sidebar
The file [`app/sidebar-modules.tsx`](../../app/sidebar-modules.tsx) exports a function `getContextModules`. This function takes the current state from the store and returns a subset of navigation links that are relevant to that specific context. This ensures the user only sees what they need for the area they are currently managing.
