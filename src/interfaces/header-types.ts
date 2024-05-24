import { getListItems } from "../utils/header-utils.ts";

export type NavObj = {
  navName: string;
  navClassNames: string;
  ulName: string;
  ulClassNames: string;
  items: string[];
};

export const headerPropsForLeftNav: NavObj = {
  navName: "headerNav",
  navClassNames: "primary-nav",
  ulName: "headerNavList",
  ulClassNames: "primary-nav_list",
  items: ["Catalog"],
};

export const headerPropsForRightNav = {
  navName: "nav",
  navClassNames: "additional-nav",
  ulName: "navList",
  ulClassNames: "nav_list",
  items: getListItems(),
};
