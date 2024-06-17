import { Cart } from "./cart.-types.ts";

export async function fetchCreateAnonCart(currentToken: string): Promise<Cart | boolean> {
  const data = {
    country: "US",
    currency: "USD",
  };
  const config = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${currentToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(`${process.env.HOST}/${process.env.PROJECT_KEY}/me/carts`, config);
  try {
    if (response.ok) {
      const answer: Cart = await response.json();
      localStorage.setItem("anonCartId", answer.id);
      localStorage.setItem("anonId", answer.anonymousId);
      localStorage.setItem("currentCartVersion", String(answer.version));
      return answer;
    }
    return false;
  } catch (err) {
    return false;
  }
}

export async function getMyActiveCart(token: string): Promise<Cart | boolean> {
  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(
      `${process.env.HOST}/${process.env.PROJECT_KEY}/me/active-cart`,
      config,
    );
    if (response.ok) {
      const answer = await response.json();
      return answer;
    }
    return false;
  } catch (err) {
    return false;
  }
}

export async function addLineItem(
  cartVersion: number,
  cartId: string,
  productId: string,
  token: string,
): Promise<Cart | { text: string } | string> {
  const data = {
    version: cartVersion,
    actions: [
      {
        action: "addLineItem",
        productId,
        variantId: 1,
        quantity: 1,
      },
    ],
  };
  const config = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch(
      `${process.env.HOST}/${process.env.PROJECT_KEY}/carts/${cartId}`,
      config,
    );
    if (response.ok) {
      const answer = await response.json();
      return answer;
    }
    return {
      text: "Sorry,something went wrong. Try again later.",
    };
  } catch (err: Error) {
    return err.message;
  }
}

export async function removeLineItem(cartid: string, lineitemId: string, token: string): Promise<Cart | boolean> {
  const config = {
    method: "delete",
    headers: {
      authorization: `bearer ${token}`,
      "content-type": "application/json",
    },
  };

  try {
    const response = await fetch(`${process.env.host}/${process.env.project_key}/carts/${cartid}/line-items/${lineitemId}`, config);

    if (response.ok) {
      const answer: Cart = await response.json();
      return answer;
    } 
    return false;
  } catch (err) {
    return false;
  }
}


export async function fetchCreateMyCart(currentToken: string): Promise<Cart | boolean> {
  const data = {
    country: "US",
    currency: "USD",
  };
  const config = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${currentToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(`${process.env.HOST}/${process.env.PROJECT_KEY}/me/carts`, config);
  try {
    if (response.ok) {
      const answer: Cart = await response.json();

      return answer;
    }
    return false;
  } catch (err) {
    return false;
  }
}
