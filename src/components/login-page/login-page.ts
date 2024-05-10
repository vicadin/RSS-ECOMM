import "./login-page.css";
import { form } from "./form/form.ts";

export default class LoginPage {
  loginPage: HTMLDivElement;

  constructor() {
    this.loginPage = document.createElement("div");
    this.loginPage.className = "login-page";
    const loginMainContainer = document.createElement("div");
    loginMainContainer.className = "login-main-container";
    const loginWrapper = document.createElement("div");

    const loginHeading = document.createElement("h1");
    loginHeading.className = "login-heading";
    loginHeading.textContent = "Log in to your account";

    loginWrapper.append(loginHeading);
    loginMainContainer.append(loginWrapper);
    loginMainContainer.append(form.getHtmlElem());
    this.loginPage.append(loginMainContainer);
  }

  getHtmlElem() {
    return this.loginPage;
  }
}
