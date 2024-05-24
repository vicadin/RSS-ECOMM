import { Header } from "../components/header.ts";
import { createElement } from "./login-page-utils.ts";
import { fillNavList } from "./header-utils.ts";
import CatalogPage from "../pages/catalog/catalog.ts";

export default function CreateNavigation(
  context: Header | CatalogPage,
  { navName = "", navClassNames = "", ulName = "", ulClassNames = "", items = [""] },
) {
  context[navName] = document.createElement("nav");
  context[navName].className = navClassNames;
  context[ulName] = createElement("ul", ulClassNames);
  fillNavList(context[ulName], items);
  context[navName].append(context[ulName]);
  return context[navName];
}
