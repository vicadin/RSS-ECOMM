import {
  AccessToken,
  CatalogCategoriesAnswer,
  Product,
  ProductByCategory,
  ProductsResult,
} from "./catalog-types.ts";
import { getAccessToken } from "./registration/registrationRequests.ts";
import { fetchCreateAnonCart } from "./cart-request.ts";

export async function fetchGetProducts(id?: string): Promise<ProductsResult | Product | boolean> {
  let token: string;
  if (localStorage.getItem("token")) {
    token = JSON.parse(<string>localStorage.getItem("token")).token;
  } else if (localStorage.getItem("anonymous-token")) {
    token = localStorage.getItem("anonymous-token");
  } else {
    const answer = await getAccessToken();
    token = (answer as AccessToken).access_token;
    localStorage.setItem("anonymous-token", token);
    await fetchCreateAnonCart(token);
  }
  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const fetchInput = id
      ? `${process.env.HOST}/${process.env.PROJECT_KEY}/products/${id}`
      : `${process.env.HOST}/${process.env.PROJECT_KEY}/product-projections/search?limit=50`;
    const response = await fetch(fetchInput, config);
    if (response.ok) {
      const answer: Promise<ProductsResult | Product> = await response.json();
      return answer;
    }
  } catch {
    return false;
  }
  return false;
}

export async function fetchGetCategories(): Promise<CatalogCategoriesAnswer | boolean> {
  let token;
  if (localStorage.getItem("token")) {
    token = JSON.parse(localStorage.getItem("token")).token;
  } else if (localStorage.getItem("anonymous-token")) {
    token = localStorage.getItem("anonymous-token");
  } else {
    const answer = await getAccessToken();
    if (answer as AccessToken) {
      token = (answer as AccessToken).access_token;
      localStorage.setItem("anonymous-token", token);
      await fetchCreateAnonCart(token);
    }
  }
  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(
      `${process.env.HOST}/${process.env.PROJECT_KEY}/categories/search?limit=40`,
      config,
    );
    if (response.ok) {
      const answer = await response.json();
      return answer;
    }
  } catch {
    return false;
  }
  return false;
}

export async function fetchGetProductByCategoryId(
  id: string,
): Promise<ProductByCategory | boolean> {
  let token;
  if (localStorage.getItem("token")) {
    token = JSON.parse(localStorage.getItem("token")).token;
  } else if (localStorage.getItem("anonymous-token")) {
    token = localStorage.getItem("anonymous-token");
  } else {
    const answer = await getAccessToken();
    token = (answer as AccessToken).access_token;
    localStorage.setItem("anonymous-token", token);
    await fetchCreateAnonCart(token);
  }
  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(
      `${process.env.HOST}/${process.env.PROJECT_KEY}/product-projections/search?filter=categories.id:"${id}"`,
      config,
    );
    if (response.ok) {
      const answer = await response.json();
      return answer;
    }
  } catch {
    return false;
  }
  return false;
}

export async function fetchSearchSortFilter(params: URLSearchParams) {
  let token;
  if (localStorage.getItem("token")) {
    token = JSON.parse(localStorage.getItem("token")).token;
  } else if (localStorage.getItem("anonymous-token")) {
    token = localStorage.getItem("anonymous-token");
  } else {
    const answer = await getAccessToken();
    token = (answer as AccessToken).access_token;
    localStorage.setItem("anonymous-token", token);
    await fetchCreateAnonCart(token);
  }
  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(
      `${process.env.HOST}/${process.env.PROJECT_KEY}/product-projections/search?${params}`,
      config,
    );
    if (response.ok) {
      const answer = await response.json();
      return answer;
    }
  } catch {
    return false;
  }
  return false;
}
