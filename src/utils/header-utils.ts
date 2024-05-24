import { Header } from "../components/header.ts";
import { createElement } from "./login-page-utils.ts";

export function createNavLink(itemText) {
  const listItem = document.createElement("li");
  const link = document.createElement("a");
  link.href = `#${itemText.toLowerCase()}`;
  link.textContent = itemText;
  listItem.appendChild(link);
  listItem.classList.add("nav_list_item");
  return listItem;
}

export function getListItems(): string[] {
  return localStorage.getItem("token")
    ? ["Register", "Logout", "Home"]
    : ["Register", "Login", "Home"];
}

export function fillNavList(parentUl: HTMLUListElement, items: string[]): void {
  items.forEach((itemText) => {
    parentUl.appendChild(createNavLink(itemText));
  });
}

export function CreateNavigation(
  ctx: Header,
  { navName = "", navClassNames = "", ulName = "", ulClassNames = "", items = [""] },
) {
  ctx[navName] = document.createElement("nav");
  ctx[navName].className = navClassNames;
  ctx[ulName] = createElement("ul", ulClassNames);
  fillNavList(ctx[ulName], items);
  ctx[navName].append(ctx[ulName]);
  return ctx[navName];
}
