import { NavObj } from "../interfaces/header-types.ts";
import fetchGetTypes from "../pages/catalog/catalog-requests.ts";

export async function fillCategoriesNames(): Promise<string[] | []> {
  const tempArray = [];
  const names = [];
  const jsonAnswer = await fetchGetTypes();
  if (typeof jsonAnswer !== "boolean") {
    jsonAnswer.results.forEach((item) => {
      tempArray.push(item);
    });
  }
  tempArray.forEach((categoryObject) => {
    names.push(categoryObject.name);
  });
  return names;
}

export const asideProps: NavObj = {
  navName: "asideNav",
  navClassNames: "aside-nav",
  ulName: "asideNavList",
  ulClassNames: "aside-nav_list",
  items: [],
};
