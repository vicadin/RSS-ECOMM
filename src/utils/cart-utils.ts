import { Cart, chosen } from "../interfaces/cart.-types.ts";
import { fetchCreateAnonCart, getMyActiveCart } from "../interfaces/cart-request.ts";
import { updateBasketCounter } from "./catalog-utils.ts";

export function getCurrentToken() {
  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token")).token
    : localStorage.getItem("anonymous-token");
  return token;
}

export function setArrayOfChosenProduct(cart: Cart | Error | boolean): void {
  if (typeof cart !== "boolean" && !(cart instanceof Error)) {
    const arrayOfProductsId: string[] = [];
    if (cart.lineItems.length !== 0) {
      cart.lineItems.forEach((lineItem) => {
        arrayOfProductsId.push(lineItem.productId);
      });
    }
    chosen.products = arrayOfProductsId;
  }
}

export async function setAnonTokenAndCreateAnonCart(anonToken: string) {
  localStorage.setItem("anonymous-token", anonToken);
  await fetchCreateAnonCart(anonToken);
}

export function getActiveCartAndUpdateCounter(answerFromRequest: Cart | boolean, token: string) {
  if (answerFromRequest) {
    getMyActiveCart(token).then((gettingCart) => {
      if (gettingCart !== false) {
        updateBasketCounter(answerFromRequest as Cart);
      }
    });
  }
}
