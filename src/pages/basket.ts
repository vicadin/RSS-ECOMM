import Basket from "../components/basket/Basket.ts";

export default function BasketPage() {
  const basketForm = new Basket();
  const container = document.getElementById("content");
  if (container) {
    basketForm.render(container);
  }
}
