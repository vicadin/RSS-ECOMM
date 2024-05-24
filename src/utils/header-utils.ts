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
