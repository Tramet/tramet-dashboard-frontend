export type SideNavItem = {
  title: string;
  path?: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export type SideNavItemGroup = {
  admin?: {
    title: string;
    items: SideNavItem[];
  };
  home?: {
    title: string;
    items: SideNavItem[];
  };
};
