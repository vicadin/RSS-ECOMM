import { Customer, TokenThroughPassword } from "./login-page-types.ts";

const authUrl = "https://auth.europe-west1.gcp.commercetools.com";
const host = "https://api.europe-west1.gcp.commercetools.com";
const projectKey = "commerce-app";

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
      `${authUrl}/oauth/${projectKey}/customers/token?grant_type=password&username=${email}&password=${password}`,
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
): Promise<Customer | boolean | Error> {
  const data = {
    email: customerEmail,
    password: customerPassword,
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
    const response = await fetch(`${host}/${projectKey}/login`, config);
    if (response.ok) {
      return await response.json();
    }
    return false;
  } catch (error) {
    return error;
  }
}
