import "./styles/normalize.css";
import LoginPage from "./components/login-page/login-page.ts";

class App {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  start(): void {
    const main = document.createElement("div");
    main.id = this.id;
    document.body.append(main);
  }
}

const app = new App("app");
app.start();

document.getElementById("app").append(new LoginPage().getHtmlElem());
