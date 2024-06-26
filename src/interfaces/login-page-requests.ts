import { TokenThroughPassword } from "./login-page-types.ts";

export async function fetchGetAccessTokenThroughPassword(
  email: string,
  password: string,
): Promise<TokenThroughPassword> {
  const config = {
    method: "POST",
    headers: {
      Authorization:
        "Basic TEhfelo0VlRtN2ZtQ3BHYzJETWlPejJWOjBnRnkyVl9EbWNyTGw4NUJhUXVWU0dPYV9iYUlaT2dm",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const response = await fetch(
      `${process.env.AUTH_URL}/oauth/${process.env.PROJECT_KEY}/customers/token?grant_type=password&username=${email}&password=${password}`,
      config,
    );
    if (response.ok) {
      return await response.json();
    }
    return response;
  } catch (err) {
    return err;
  }
}

export async function fetchAuthenticateCustomer(
  token: string,
  customerEmail: string,
  customerPassword: string,
) {
  const data = {
    email: customerEmail,
    password: customerPassword,
  };
  const anonymousCartData = {
    anonymousCart: {
      id: localStorage.getItem("anonCartId"),
      typeId: "cart",
    },
    anonymousId: localStorage.getItem("anonId"),
    anonymousCartSignInMode: "MergeWithExistingCustomerCart",
  };
  const usefulData = localStorage.getItem("anonCartId")
    ? { ...{}, ...data, ...anonymousCartData }
    : data;
  const config = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usefulData),
  };

  try {
    const response = await fetch(`${process.env.HOST}/${process.env.PROJECT_KEY}/login`, config);
    if (response.ok) {
      const answer = await response.json();
      if (localStorage.getItem("anonCartId")) {
        localStorage.removeItem("anonCartId");
      }
      return answer;
    }
    return false;
  } catch (error) {
    return error;
  }
}
