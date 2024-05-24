import { getAccessToken } from "../../interfaces/registration/registrationRequests.ts";
import { CatalogTypesAnswer } from "../../interfaces/catalog-types.ts";

export default async function fetchGetTypes(): Promise<CatalogTypesAnswer | boolean> {
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
      `${process.env.HOST}/${process.env.PROJECT_KEY}/product-types`,
      config,
    );
    if (response.ok) {
      const answer = await response.json();
      // из ответа (answer) взять атрибуты для фильтров по каждому типу
      return answer;
    }
  } catch {
    return false;
  }
  return false;
}
