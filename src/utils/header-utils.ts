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

function unlockBody() {
  const aside = document.querySelector(".aside");
  aside.classList.add("hidden");
  document.body.classList.remove("lock");
  document.body.firstElementChild.classList.add("hidden");
}

export function lockBody() {
  const aside = document.querySelector(".aside");
  const bodyOverlay = document.querySelector(".body-overlay");
  document.body.classList.add("lock");
  bodyOverlay.classList.remove("hidden");
  aside.classList.remove("hidden");
}

export function outsideEvtListener() {
  unlockBody();
}

export function asideHandler(event) {
  const { target } = event;
  if (target.classList.contains("category-container")) {
    unlockBody();
  }
}
