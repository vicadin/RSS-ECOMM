import {
  AccessToken,
  CatalogCategoriesAnswer,
  Product,
  ProductByCategory,
  ProductsResult,
} from "./catalog-types.ts";
import { getAccessToken } from "./registration/registrationRequests.ts";
import { setAnonTokenAndCreateAnonCart } from "../utils/cart-utils.ts";
import { getNewAnonToken, getTokenFromLocalStorage } from "../utils/catalog-utils.ts";

export async function fetchGetProducts(
  limit: number,
  page: number,
  id?: string,
): Promise<ProductsResult | Product | boolean> {
  let token: string;
  if (localStorage.getItem("token")) {
    token = JSON.parse(<string>localStorage.getItem("token")).token;
  } else if (localStorage.getItem("anonymous-token")) {
    token = localStorage.getItem("anonymous-token");
  } else {
    const answer = await getAccessToken();
    token = (answer as AccessToken).access_token;
    await setAnonTokenAndCreateAnonCart(token);
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
      : `${process.env.HOST}/${process.env.PROJECT_KEY}/product-projections/search?limit=${limit}&offset=${page}`;
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
  let token = getTokenFromLocalStorage();
  if (token === undefined) {
    token = await getNewAnonToken();
    await setAnonTokenAndCreateAnonCart(token);
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
  } catch (err) {
    return false;
  }

  return false;
}

export async function fetchGetProductByCategoryId(
  id: string,
  limit: number,
  page: number,
): Promise<ProductByCategory | boolean> {
  let token = getTokenFromLocalStorage();
  if (token === undefined) {
    token = await getNewAnonToken();
    await setAnonTokenAndCreateAnonCart(token);
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
      `${process.env.HOST}/${process.env.PROJECT_KEY}/product-projections/search?limit=${limit}&offset=${page}&filter=categories.id:"${id}"`,
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

export async function fetchSearchSortFilter(
  params: URLSearchParams,
): Promise<ProductsResult | boolean> {
  let token = getTokenFromLocalStorage();
  if (token === undefined) {
    token = await getNewAnonToken();
    await setAnonTokenAndCreateAnonCart(token);
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
