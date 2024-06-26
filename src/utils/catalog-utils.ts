import {
  AccessToken,
  Ancestor,
  Ancestors,
  Attributes,
  attributesForFilters,
  CatalogCategoryResult,
  CategoryType,
  currentFilter,
  currentFilterArray,
  ProductsResult,
  sortObject,
} from "../interfaces/catalog-types.ts";
import { createElement } from "./login-page-utils.ts";
import CategoryList from "../components/catalog/category-list.ts";
import { asideHandler, unlockBody } from "./header-utils.ts";
import { getAccessToken } from "../interfaces/registration/registrationRequests.ts";
import { currentSearch } from "../interfaces/header-types.ts";
import { fetchSearchSortFilter } from "../interfaces/catalog-requests.ts";
import { Cart } from "../interfaces/cart.-types.ts";
import Products from "../components/catalog/products.ts";

export const categories: CategoryType = {
  array: [],
};

export function setCategoriesArray(answer) {
  if (answer.results) {
    categories.array = answer.results;
  }
}

export const products = {
  array: [],
};

export function setProductsArray(answer) {
  products.array.length = 0;
  if (answer.results) {
    products.array = answer.results;
  }
}

export function getPriceBlockByLocale(props, locale) {
  const productPrices = props.masterData?.current?.masterVariant?.prices
    ? props.masterData.current.masterVariant.prices
    : props.masterVariant.prices;
  const priceblock = productPrices.find((item) => item.country === `${locale.split("-")[1]}`)
    ? productPrices.find((item) => item.country === `${locale.split("-")[1]}`)
    : productPrices[0];
  return priceblock;
}

function setCurrency(priceBlock, number) {
  if (number === 0) {
    return "";
  }
  const currencyCode = priceBlock.value.currencyCode === "EUR" ? "€" : "$";
  const { fractionDigits } = priceBlock.value;
  const numberFixed = number / 10 ** fractionDigits;
  return currencyCode + numberFixed;
}

export function setFinalPrice(props: Products | ProductsResult, locale: string) {
  const priceBlock = getPriceBlockByLocale(props, locale);
  const finalPriceNumber = priceBlock?.discounted?.value?.centAmount ?? priceBlock.value.centAmount;
  return setCurrency(priceBlock, finalPriceNumber);
}

export function setBeforeDiscountPrice(props, locale: string) {
  const priceBlock = getPriceBlockByLocale(props, locale);
  const BeforeDiscountPriceNumber = priceBlock?.discounted?.value?.centAmount
    ? priceBlock?.value?.centAmount
    : 0;
  return setCurrency(priceBlock, BeforeDiscountPriceNumber);
}

export function createAside(categoriesObject) {
  const asideElement = createElement("aside", "aside hidden");
  const asideNav = new CategoryList(categoriesObject.array, true);
  asideNav.getHtml().classList.add("aside_category-container");
  asideElement.append(asideNav.getHtml());
  asideElement.addEventListener("click", asideHandler);
  return asideElement;
}

export function setDataForBreadcrumbs(
  categoryId: string,
  categoriesArray: CatalogCategoryResult[],
) {
  if (categoriesArray.length !== 0) {
    const currentCategory = categoriesArray.find((item) => item.id === categoryId);
    const ancestorsArray: Ancestors = currentCategory.ancestors;

    if (ancestorsArray.length) {
      const spreadAncestors = [];
      ancestorsArray.forEach((ancestor) => {
        const ancestorItem: Ancestor = ancestor;
        const tempAncestor = categoriesArray.find(
          (categoryItem) => categoryItem.id === ancestorItem.id,
        );
        ancestorItem.name = tempAncestor.name["en-US"];
        spreadAncestors.push(ancestorItem);
        localStorage.setItem("categoryListAncestors", JSON.stringify(spreadAncestors));
      });
    } else {
      localStorage.setItem("categoryListAncestors", JSON.stringify([]));
    }

    localStorage.setItem("currentCategoryName", currentCategory.name["en-US"]);
  }
}

export function removeCategoryData() {
  if (localStorage.getItem("productsCategoryId")) {
    localStorage.removeItem("productsCategoryId");
  }
  if (localStorage.getItem("categoryListAncestors")) {
    localStorage.removeItem("categoryListAncestors");
  }
  if (localStorage.getItem("currentCategoryName")) {
    localStorage.removeItem("currentCategoryName");
  }
}

export function setCurrentSort(params: URLSearchParams) {
  const paramsArray = Array.from(params.entries());
  paramsArray.forEach(([key, value]) => {
    if (key === "sort") {
      const sortButton = document.querySelector(".dropdown__button");
      if (sortButton) {
        switch (value) {
          case "price asc":
            sortButton.textContent = "Sort by price ↑";
            break;
          case "price desc":
            sortButton.textContent = "Sort by price ↓";
            break;
          case "name.en-US asc":
            sortButton.textContent = "Sort by name ↑";
            break;
          case "name.en-US desc":
            sortButton.textContent = "Sort by name ↓";
            break;
          default:
            sortButton.textContent = "Sort by default";
            break;
        }
      }
    }
  });
}

export function setCurrentFilter(params: URLSearchParams) {
  const paramsArray = Array.from(params.entries());
  paramsArray.forEach(([key, value]) => {
    if (key === "filter" && value.startsWith("categories")) {
      currentFilter.filter = value;
    }
  });
}

export function setCurrentFiltersArray(params: URLSearchParams) {
  const array = [];
  const paramsArray = Array.from(params.entries());
  paramsArray.forEach(([key, value]) => {
    if (key === "filter" && !value.startsWith("categories")) {
      array.push(value);
    }
  });
  currentFilterArray.filter = array;
}

export function clearCurrentSort() {
  sortObject.sorting = undefined;
}

export function clearCurrentFilter() {
  currentFilter.filter = undefined;
}

export function getAttributes(answer): Attributes {
  const result: Attributes = [];
  const totalAttributes = [];
  let totalAttributesNames = [];
  if (answer.results) {
    answer.results.forEach((answerResult) => {
      answerResult.masterVariant.attributes.forEach((attribute) => {
        totalAttributesNames.push(attribute.name);
        totalAttributes.push(attribute);
      });
    });
    const newset = new Set(totalAttributesNames);
    totalAttributesNames = Array.from(newset);
    totalAttributesNames.forEach((name) => {
      const valuesAccordingToName = [];
      const filteredByName = totalAttributes.filter((entry) => entry.name === name);
      filteredByName.forEach((entry) => {
        const currentValue = typeof entry.value === "string" ? entry.value : entry.value["en-US"];
        valuesAccordingToName.push(currentValue);
      });
      result.push([name, Array.from(new Set(valuesAccordingToName))]);
    });
  }
  return result;
}

export function closeFilters(): void {
  const filters = document.querySelector(".filter-container");
  if (filters) {
    filters.classList.add("filter-container_closed");
  }
}

export function unlockBodyAndCloseFilters(): void {
  closeFilters();
  unlockBody();
}

export function showFilters(): void {
  const filters = document.querySelector(".filter-container");
  if (filters) {
    filters.classList.remove("filter-container_closed");
  }
}

export function closeFiltersHandler(event): void {
  const { target } = event;
  if (target.closest(".filter-container__close-button")) {
    unlockBodyAndCloseFilters();
  }
}

export function addProfileIco(where: HTMLElement) {
  const profileListItem = document.createElement("li");
  profileListItem.classList.add("nav_list_item");

  const profileLink = document.createElement("a");
  profileLink.href = "#profile";
  profileLink.classList.add("profile-link");

  const profileIcon = document.createElement("img");
  profileIcon.src = "../assets/icons/user.png";
  profileIcon.alt = "Profile";
  profileIcon.classList.add("profile-icon");

  profileLink.appendChild(profileIcon);
  profileListItem.appendChild(profileLink);
  where.appendChild(profileListItem);
}

export function addBasketIco(where: HTMLElement) {
  const profileListItem = document.createElement("li");
  profileListItem.classList.add("nav_list_item");

  const profileLink = document.createElement("a");
  profileLink.href = "#basket";
  profileLink.classList.add("basket-link");

  const profileIcon = document.createElement("img");
  profileIcon.src = "../assets/icons/bag.png";
  profileIcon.alt = "Basket";
  profileIcon.classList.add("basket-icon");

  profileLink.appendChild(profileIcon);
  profileListItem.appendChild(profileLink);
  where.appendChild(profileListItem);
}

export function setArrayOfAttributes(attributes: Attributes) {
  attributesForFilters.attributes = attributes;
}

export function setTempArrayOfAttributes(params) {
  const temparr = [];
  const paramsArray = Array.from(params.entries());
  paramsArray.forEach(([key, value]) => {
    if (key === "filter" && !value.startsWith("categories")) {
      const [tempstring1, tempstring2] = value.slice(20).split(":");
      if (tempstring1.slice(-2) === "US") {
        temparr.push([tempstring1.slice(0, -6), tempstring2.slice(1, -1)]);
      }
      if (tempstring1.slice(-2) !== "US") {
        temparr.push([tempstring1, tempstring2.slice(1, -1)]);
      }
    }
  });
  temparr.push(["limit", "150"]);
}

export function getTokenFromLocalStorage(): string | undefined {
  let token;
  if (localStorage.getItem("token")) {
    token = JSON.parse(localStorage.getItem("token")).token;
  } else if (localStorage.getItem("anonymous-token")) {
    token = localStorage.getItem("anonymous-token");
  }
  return token;
}

export async function getNewAnonToken(): Promise<string> {
  const answer = await getAccessToken();
  return (answer as AccessToken).access_token;
}

export async function getBaseForAttributes() {
  let p;
  if (currentSearch.currentText) {
    const searchString = `text.en-US=${currentSearch.currentText}&limit=8&offset=0&fuzzy=true`;
    p = new URLSearchParams(searchString);
  } else if (localStorage.getItem("productsCategoryId")) {
    const string = `limit=8&offset=0&filter=categories.id:"${localStorage.getItem("productsCategoryId")}"`;
    p = new URLSearchParams(string);
  } else {
    p = new URLSearchParams("limit=50&offset=0");
  }
  const result = await fetchSearchSortFilter(p);
  return result;
}

export function addParamToFinalParamArray(finalArray: string[], param: URLSearchParams): void {
  if (finalArray.length !== 0) {
    finalArray.push(`&${param}`);
  } else {
    finalArray.push(`${param}`);
  }
}

export function updateBasketCounter(basket: Cart | boolean): void {
  const counter = document.querySelector(".basket-counter");
  if (typeof basket !== "boolean") {
    if (basket.totalLineItemQuantity) {
      if (!counter.classList.contains(".counter_active")) {
        counter.classList.add("counter_active");
      }
      counter.textContent = String(basket.totalLineItemQuantity);
    } else {
      counter.classList.remove("counter_active");
      counter.textContent = "";
    }
  }
}
