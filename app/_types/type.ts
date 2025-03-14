export type SideNavItem = {
  title: string;
  path?: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
  onClick?: string;
};

export type SideNavItemGroup = {
  tramet_customers?: {
    title: string;
    items: SideNavItem[];
  };
  admin?: {
    title: string;
    items: SideNavItem[];
  };
  home?: {
    title: string;
    items: SideNavItem[];
  };
  context?: {
    title: string;
    items: SideNavItem[];
  };
  modules?: {
    title: string;
    items: SideNavItem[];
  };
};
