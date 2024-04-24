export type SideNavItem = {
  title: string;
  path?: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
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
};
