import { CatalogCategoryResult } from "../interfaces/catalog-types.ts";

export default function hasChildren(childrenArray: CatalogCategoryResult[]) {
  return childrenArray.length > 0;
}
