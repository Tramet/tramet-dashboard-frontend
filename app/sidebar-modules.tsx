import { ReactNode } from "react";
import { 
  BsHouseDoor, 
  BsBuilding, 
  BsWindowStack, 
  BsPeople, 
  BsKanban, 
  BsGear, 
  BsListUl, 
  BsEnvelope,
  BsClipboard2Check,
  BsArrowLeftRight,
  BsCreditCard,
  BsShieldLock
} from "react-icons/bs";
import { UserPermissions } from "@trm/_types/permissions";

export interface NavItem {
  title: string;
  path?: string;
  icon: ReactNode;
  submenu?: boolean;
  subMenuItems?: NavItem[];
}

export interface NavGroup {
  [key: string]: {
    title: string;
    items: NavItem[];
  };
}

export const getContextModules = (
  site: string | null,
  department: string | null,
  area: string | null,
  userRole: string | undefined,
  pathname: string,
  permissions?: UserPermissions
): NavGroup[] => {
  const navigation: NavGroup[] = [];
  const isTrametAdmin = userRole === "TRAMET_ADMIN";
  const isCustomerAdmin = userRole === "CUSTOMER_ADMIN";
  const isAdmin = isTrametAdmin || isCustomerAdmin;
  
  const safePathname = pathname || "";
  const isOperationalPath = safePathname.startsWith("/dashboard");
  const isAdminPath = safePathname.startsWith("/admin");

  // --- MODO ADMINISTRACIÓN ---
  if (isAdmin && (isAdminPath || !isOperationalPath)) {
    
    // Grupo 1: Gestión de Plataforma (Solo Super Admin)
    if (isTrametAdmin) {
      navigation.push({
        platform: {
          title: "Plataforma SaaS",
          items: [
            {
              title: "Dashboard SaaS",
              path: "/admin",
              icon: <BsHouseDoor size={20} />,
            },
            {
              title: "Clientes (Empresas)",
              path: "/admin/tramet-customers",
              icon: <BsBuilding size={20} />,
            },
            {
              title: "Suscripciones Globales",
              path: "/admin/subscriptions",
              icon: <BsCreditCard size={20} />,
            }
          ]
        }
      });
    } else if (isCustomerAdmin) {
      // Para Admin de Cliente, su dashboard es diferente
      navigation.push({
        platform: {
          title: "Gestión de Cuenta",
          items: [
            {
              title: "Dashboard Admin",
              path: "/admin",
              icon: <BsHouseDoor size={20} />,
            },
            {
              title: "Mi Suscripción",
              path: "/admin/subscriptions",
              icon: <BsCreditCard size={20} />,
            }
          ]
        }
      });
    }

    // Grupo 2: Mi Organización (Estructura y Usuarios)
    const orgItems: NavItem[] = [
      {
        title: "Departamentos",
        path: "/admin/departments",
        icon: <BsShieldLock size={20} />,
      },
      {
        title: "Sitios",
        path: "/admin/sites",
        icon: <BsWindowStack size={20} />,
      },
      {
        title: "Usuarios / Equipo",
        path: "/admin/users",
        icon: <BsPeople size={20} />,
      },
    ];

    navigation.push({
      organization: {
        title: isTrametAdmin ? "Gestión Tramet" : "Gestión Interna",
        items: orgItems,
      },
    });

    // Grupo Especial: Cambio de Plano (Footer)
    navigation.push({
      footer: {
        title: "",
        items: [
          {
            title: "Ir a Panel Operativo",
            path: "/dashboard",
            icon: <BsArrowLeftRight size={20} />,
          }
        ]
      }
    });
    
    if (isAdminPath) return navigation;
  }

  // --- MODO OPERATIVO ---
  if (site && department && area && (isOperationalPath || !isAdmin)) {
    const operationalItems: NavItem[] = [
      {
        title: "Dashboard Op.",
        path: "/dashboard",
        icon: <BsHouseDoor size={20} />,
      },
      {
        title: "Operaciones",
        icon: <BsKanban size={20} />,
        submenu: true,
        subMenuItems: [
          { title: "Almacenaje", path: "/dashboard/operations/almacenaje", icon: <BsKanban size={20} /> },
          { title: "Procesamiento", path: "/dashboard/operations/procesamiento", icon: <BsKanban size={20} /> },
          { title: "Pick & Pack", path: "/dashboard/operations/pick-pack", icon: <BsKanban size={20} /> },
          { title: "Logística Inversa", path: "/dashboard/operations/logistica-inversa", icon: <BsKanban size={20} /> },
          { title: "Maquila", path: "/dashboard/operations/maquila", icon: <BsKanban size={20} /> },
          { title: "Valor Agregado", path: "/dashboard/operations/valor-agregado", icon: <BsKanban size={20} /> },
          { title: "Tráfico", path: "/dashboard/operations/trafico", icon: <BsKanban size={20} /> },
          { title: "Embarques", path: "/dashboard/operations/embarques", icon: <BsKanban size={20} /> },
          { title: "Otros", path: "/dashboard/operations/otros", icon: <BsKanban size={20} /> },
        ].filter(item => {
          // Si no hay permisos definidos, mostramos todo en desarrollo
          if (!permissions || permissions.departments.length === 0) return true;
          // Si hay permisos, solo mostramos si el departamento está en la lista de permitidos/contratados
          // Nota: El título del item debe coincidir o mapearse con el nombre del depto en el backend
          return permissions.departments.includes(item.title);
        }),
      },
      {
        title: "Gestión",
        path: "/dashboard/management",
        icon: <BsGear size={20} />,
      },
      {
        title: "Auto-admin.",
        path: "/dashboard/autoadmin",
        icon: <BsListUl size={20} />,
      },
      {
        title: "Material de apoyo",
        path: "/dashboard/support",
        icon: <BsEnvelope size={20} />,
      },
    ];

    navigation.push({
      modules: {
        title: "Operaciones de Área",
        items: operationalItems,
      },
    });

    // Grupo Especial: Cambio de Plano (Footer)
    if (isAdmin) {
      navigation.push({
        footer: {
          title: "",
          items: [
            {
              title: "Volver a Administración",
              path: "/admin",
              icon: <BsArrowLeftRight size={20} />,
            }
          ]
        }
      });
    }
  }

  return navigation;
};

export const SIDENAV_ITEMS = (pathname: string): NavGroup[] => {
  return [];
};
