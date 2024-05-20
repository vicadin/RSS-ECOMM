export class Header {
  header: HTMLElement;

  nav: HTMLElement;

  navList: HTMLUListElement;

  constructor() {
    this.header = document.createElement("header");
    this.nav = document.createElement("nav");
    this.navList = document.createElement("ul");
    this.navList.classList.add("nav_list");
    this.fillNavList();
    this.nav.appendChild(this.navList);
    this.header.appendChild(this.nav);
    this.addEventListeners();
  }

  fillNavList() {
    const navItems = localStorage.getItem("token")
      ? ["Register", "Logout", "Home"]
      : ["Register", "Login", "Home"];
    navItems.forEach((itemText) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${itemText.toLowerCase()}`;
      link.textContent = itemText;
      listItem.appendChild(link);
      this.navList.appendChild(listItem);
      listItem.classList.add("nav_list_item");
    });
  }

  addEventListeners() {
    this.navList.addEventListener("click", (ev) => {
      if ((ev.target as HTMLLinkElement).textContent === "Logout") {
        localStorage.clear();
        this.updateNav();
      }
    });
  }

  updateNav() {
    this.nav.innerHTML = "";
    this.navList.innerHTML = "";

    this.fillNavList();
    this.nav.append(this.navList);
  }

  getHtml() {
    return this.header;
  }
}

export const headerEl = new Header();
