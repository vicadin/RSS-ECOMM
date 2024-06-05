import { getListItems } from "../utils/header-utils.ts";

export type NavObj = {
  navName: string;
  navClassNames: string;
  ulName: string;
  ulClassNames: string;
  items: string[] | [];
};

export const headerPropsForLeftNav: NavObj = {
  navName: "headerNav",
  navClassNames: "primary-nav",
  ulName: "headerNavList",
  ulClassNames: "primary-nav_list",
  items: ["Catalog"],
};

export const headerPropsForRightNav: NavObj = {
  navName: "nav",
  navClassNames: "additional-nav",
  ulName: "navList",
  ulClassNames: "nav_list",
  items: getListItems(),
};

export const svgIco =
  '<svg class=\'find-ico\'focusable="false" height="18"viewBox="0 0 16 16" width="18" style="height: 18px; width: 18px;"><title id="search-:r3e:">search</title><g><path d="M11.9544 10.8246C12.8838 9.65831 13.3941 8.18223 13.3941 6.68793C13.3941 3.00683 10.3872 0 6.68793 0C2.98861 0 0 3.00683 0 6.68793C0 10.369 3.00683 13.3759 6.68793 13.3759C8.16401 13.3759 9.64009 12.8656 10.8246 11.9362L14.8519 15.9636L16 14.8155L11.9544 10.8246ZM6.68793 11.7904C3.89977 11.7904 1.62187 9.51253 1.62187 6.72437C1.62187 3.93622 3.89977 1.65831 6.68793 1.65831C9.47608 1.65831 11.754 3.93622 11.754 6.72437C11.754 9.51253 9.47608 11.7904 6.68793 11.7904Z"></path></g></svg>';

export const svgIcoBig =
  '<svg class=\'find-ico big\'focusable="false" height="18"viewBox="0 0 16 16" width="18" style="height: 40px; width: 40px;"><title id="search-:r3e:">search</title><g><path d="M11.9544 10.8246C12.8838 9.65831 13.3941 8.18223 13.3941 6.68793C13.3941 3.00683 10.3872 0 6.68793 0C2.98861 0 0 3.00683 0 6.68793C0 10.369 3.00683 13.3759 6.68793 13.3759C8.16401 13.3759 9.64009 12.8656 10.8246 11.9362L14.8519 15.9636L16 14.8155L11.9544 10.8246ZM6.68793 11.7904C3.89977 11.7904 1.62187 9.51253 1.62187 6.72437C1.62187 3.93622 3.89977 1.65831 6.68793 1.65831C9.47608 1.65831 11.754 3.93622 11.754 6.72437C11.754 9.51253 9.47608 11.7904 6.68793 11.7904Z"></path></g></svg>';

export const searchInputAttr: [string, string][] = [
  ["type", "text"],
  ["name", "main-search"],
  ["placeholder", "Find products"],
  ["autocomplete", "off"],
];

export const searchButtonAttr: [string, string][] = [
  ["type", "button"],
  ["name", "main-search"],
];

export type Search = {
  currentText: undefined | string;
};

export const paramString: { stringOfParam: string } = {
  stringOfParam: "",
};

export type SearchObject = {
  search: undefined | string;
};

export const currentSearch: Search = {
  currentText: undefined,
};
