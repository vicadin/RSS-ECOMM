import { Search } from "../interfaces/header-types.ts";

export function createNavLink(itemText): HTMLLIElement {
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

export function closeAside() {
  const aside = document.querySelector(".aside");
  aside.classList.add("hidden");
}

export function unlockBody(): void {
  document.body.classList.remove("lock");
  document.body.firstElementChild.classList.add("hidden");
}

export function unlockBodyAndCloseAside(): void {
  closeAside();
  unlockBody();
}

export function isOpen(searchContainer): boolean {
  return !searchContainer.classList.contains("invisible");
}

export function closeSearchContainer(): void {
  const searchContainer = document.querySelector(".find-container");
  if (searchContainer) {
    if (isOpen(searchContainer)) {
      searchContainer.classList.add("invisible");
    }
  }
}

export function openAside(): void {
  const aside = document.querySelector(".aside");
  if (aside) {
    aside.classList.remove("hidden");
  }
}

export function lockBody(): void {
  const bodyOverlay = document.querySelector(".body-overlay");
  document.body.classList.add("lock");
  bodyOverlay.classList.remove("hidden");
}

export function lockBodyAndOpenAside() {
  openAside();
  lockBody();
}

export function outsideEvtListener(): void {
  closeAside();
  unlockBody();
  closeSearchContainer();
}

export function asideHandler(event): void {
  const { target } = event;
  if (target.classList.contains("category-container")) {
    unlockBodyAndCloseAside();
  }
}

export function insertFindIco(where, what): void {
  where.insertAdjacentHTML("beforeend", what);
}

export function unlockBodyAndCloseElem(elemToClose: HTMLElement | HTMLUListElement) {
  elemToClose.classList.add("invisible");
  unlockBody();
}

export function setLocationForSearching(searchParamsFinalString: string) {
  window.location.hash = `#?${searchParamsFinalString}search`;
}

export const searchObject: Search = {
  search: undefined,
};
