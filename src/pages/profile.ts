import { profileTabs } from "../components/profile/profileTabs.ts";

export class ProfilePage {
  profileSection: HTMLElement;
  profileTitle: HTMLElement;

  constructor() {
    this.profileSection = document.createElement("div");
    this.profileSection.classList.add("profile-section");
    this.profileTitle = document.createElement("h1");
    this.profileTitle.classList.add("title");
    this.profileTitle.innerText = "Profile";

    this.render();
  }

  async render() {
    this.profileSection.append(this.profileTitle);
    const profileInfoDiv = document.createElement("div");
    profileInfoDiv.classList.add("profile-info");

    this.profileSection.append(profileTabs.getHtml());
  }

  getHtml() {
    return this.profileSection;
  }
}

export const profilePage = new ProfilePage();