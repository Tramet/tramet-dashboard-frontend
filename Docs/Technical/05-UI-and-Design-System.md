# 05 - UI & Design System

The Tramet Dashboard features a premium, customized design system built on **Tailwind CSS** and **Shadcn/UI**, focused on branding and usability.

---

## 🎨 Branding & Color Palette
The primary colors are defined as HSL variables in [`app/globals.css`](../../app/globals.css).

### Core Brand Colors
- **Primary (Orange)**: `hsl(23 95% 55%)` - Used for the main brand identity, call-to-action buttons, and sidebar highlights.
- **Secondary (Blue)**: `hsl(202 100% 30%)` - Used for headings, secondary branding, and deep interface elements.

### Theme Modes
- **Light**: Default clean look with soft gray and orange accents.
- **Dark**: High-contrast mode for focus and low-light environments.
- **Custom (`.custom`)**: A specialized class applied to the layout to enforce specific Tramet branding gradients and highlights.

---

## 🧩 Component Library: Shadcn/UI
We use **Shadcn/UI** as the foundation for our components. These are located in `app/_components/ui/`.

### Key Components
- **Dashboard Cards**: Custom cards with gradient borders and semantic highlights.
- **Context Selector**: A reactive header component that allows users to change their organizational context on the fly.
- **Feedback (Sonner)**: Standardized global notifications for success, error, and info states.

---

## 📱 Responsive Strategies
The dashboard is fully responsive across mobile, tablet, and desktop:
- **Sidebar**: Mobile-first approach where the sidebar collapses into a hamburger menu or "Drawer" on smaller screens.
- **Grid Layouts**: Dashboard layouts use flexible CSS grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) to adapt content flow.
- **Media Query Hook**: The [`use-media-query`](../../app/_hooks/use-media-query.ts) hook is used for conditional rendering logic based on viewport width.

---

## ✨ Design Tokens
Common UI treatments are standardized through CSS classes and Tailwind utilities:
- `navbar-gradient`: A horizontal brand gradient used in the top bar.
- `sidebar-highlight`: A subtle orange highlight for active navigation items.
- `card-accent`: A top-border accent for primary cards.

---

## ⚙️ How to Add Components
When adding new UI elements:
1.  **Check existing `ui/`**: See if a base Shadcn component is available.
2.  **Use Variables**: Always use Tailwind classes like `text-primary` or `bg-secondary` instead of hardcoded hex colors. This ensures theme compatibility.
3.  **Encapsulation**: If a component is specific to one page, keep it in an `_internal` folder near that page. If it's used globally, put it in `app/_components/`.
