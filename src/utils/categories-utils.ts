import { CatalogCategoryResult } from "../interfaces/catalog-types.ts";

export default function hasChildren(childrenArray: CatalogCategoryResult[]) {
  return childrenArray.length > 0;
}

export function makeVisibleAllNavs() {
  const elem = document.querySelectorAll(".category-container_invisible");
  if (elem) {
    elem.forEach((item) => {
      item.classList.remove("category-container_invisible");
    });
  }
}

export function setCategoryHash(str: string) {
  const pathname = `${str}`;
  window.location.hash = `#${pathname}products_by_category`;
}
