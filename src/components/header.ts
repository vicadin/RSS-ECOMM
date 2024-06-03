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
    const profileListItem = document.createElement("li");
    profileListItem.classList.add("nav_list_item");

    const profileLink = document.createElement("a");
    profileLink.href = "#profile";
    profileLink.classList.add("profile-link");

    const profileIcon = document.createElement("img");
    profileIcon.src = "../assets/icons/user.png";
    profileIcon.alt = "Profile";
    profileIcon.classList.add("profile-icon");

    profileLink.appendChild(profileIcon);
    profileListItem.appendChild(profileLink);
    this.navList.appendChild(profileListItem);
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
