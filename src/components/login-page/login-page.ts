import "./login-page.css";
import { form } from "./form/form.ts";

export default class LoginPage {
  loginPage: HTMLDivElement;

  constructor() {
    this.loginPage = document.createElement("div");
    this.loginPage.className = "login-page";
    const loginMainContainer = document.createElement("div");
    loginMainContainer.className = "login-main-container";
    const loginHeading = document.createElement("h1");
    loginHeading.className = "login-heading";
    loginHeading.textContent = "Log in to your account";
    loginMainContainer.append(loginHeading);
    loginMainContainer.append(form.getHtmlElem());
    this.loginPage.append(loginMainContainer);
  }

  render(parent: HTMLElement) {
    parent.append(this.loginPage);
  }

  getHtmlElem() {
    return this.loginPage;
  }
}
