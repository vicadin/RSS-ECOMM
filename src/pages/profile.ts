export class ProfilePage {
  profileSection: HTMLElement;

  constructor() {
    this.profileSection = document.createElement("section");
    this.profileSection.classList.add("profile-section");

    this.render();
  }

  async render() {
    this.profileSection.innerHTML = `
          <h1>Profile</h1>
          <div class="profile-info">
         
          </div>
        `;
  }

  getHtml() {
    return this.profileSection;
  }
}

export const profilePage = new ProfilePage();
