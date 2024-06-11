import "./basket.css";

export default class Basket {
    private title: HTMLElement;

    constructor() {
      this.title = document.createElement("h1");
      this.title.innerText = "Basket";
      this.title.classList.add("title");
    }
  
    public render(container: HTMLElement): void {
      container.appendChild(this.title);
    }
}