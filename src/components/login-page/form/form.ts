import "./form.css";

export class Form {
  form: HTMLFormElement;

  constructor() {
    this.form = document.createElement("form");
    this.form.className = "form";
  }

  getHtmlElem() {
    return this.form;
  }
}

export const form = new Form();
