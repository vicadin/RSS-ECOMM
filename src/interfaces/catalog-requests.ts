import { CatalogCategoriesAnswer, ProductByCategory } from "./catalog-types.ts";
import { getAccessToken } from "./registration/registrationRequests.ts";

export async function fetchGetProducts(id?: string) {
  let token;
  if (localStorage.getItem("token")) {
    token = JSON.parse(localStorage.getItem("token")).token;
  } else {
    const answer = await getAccessToken();
    token = answer.access_token;
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
      : `${process.env.HOST}/${process.env.PROJECT_KEY}/products`;
    const response = await fetch(fetchInput, config);
    if (response.ok) {
      const answer = await response.json();
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
  } else {
    const answer = await getAccessToken();
    token = answer.access_token;
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
      `${process.env.HOST}/${process.env.PROJECT_KEY}/categories`,
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
  } else {
    const answer = await getAccessToken();
    token = answer.access_token;
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
      // console.log("поиск по категории", answer);
      return answer;
    }
  } catch {
    // console.log("catch по категории");
    return false;
  }
  // console.log("return false");
  return false;
}
