import RegistrationPage from "./pages/registration.ts";
import LoginPage from "./components/login-page/login-page.ts";
import NotFoundComponent from "./components/404components.ts";
import { profilePage } from "./pages/profile.ts";
import { headerEl } from "./components/header.ts";
import CatalogPage from "./pages/catalog/catalog.ts";
import {
  fetchGetCategories,
  fetchGetProductByCategoryId,
  fetchGetProducts,
  fetchSearchSortFilter,
} from "./interfaces/catalog-requests.ts";

import {
  categories,
  clearCurrentFilter,
  clearCurrentSort,
  getAttributes,
  removeCategoryData,
  setArrayOfAttributes,
  setCategoriesArray,
  setCurrentFilter,
  setCurrentFiltersArray,
  setCurrentSort,
  setDataForBreadcrumbs,
  setProductsArray,
  setTempArrayOfAttributes,
} from "./utils/catalog-utils.ts";
import { clearCurrentSearch, setCurrentSearch } from "./utils/header-utils.ts";
import DetailedCard from "./components/pdp/DetailedCard.ts";
import { getAccessToken } from "./interfaces/registration/registrationRequests.ts";
import { getMyActiveCart } from "./interfaces/cart-request.ts";
import {
  getCurrentToken,
  setAnonTokenAndCreateAnonCart,
  setArrayOfChosenProduct,
} from "./utils/cart-utils.ts";
import { AccessToken } from "./interfaces/catalog-types.ts";

type Routes = {
  [key: string]: () => void;
};

export function handleHash() {
  let hash: string = window.location.hash ? window.location.hash.slice(1) : "";
  const newContent: HTMLElement | null = document.getElementById("content");
  if (hash.endsWith("products_by_category")) {
    hash = "products_by_category";
    const productsCategoryId = window.location.hash.slice(1, -20);
    localStorage.setItem("productsCategoryId", productsCategoryId);
  }

  if (hash.endsWith("search")) {
    hash = "search";
  }

  const routes: Routes = {
    home: () => {
      if (newContent) {
        newContent.innerHTML = "<h2>Welcome!</h2>";
        clearCurrentSearch();
        clearCurrentSort();
        removeCategoryData();
        headerEl.updateNav("navList");
      }
    },
    login: () => {
      if (newContent) {
        newContent.innerHTML = "";
        newContent.appendChild(new LoginPage().getHtmlElem());
      }
    },
    register: () => {
      if (newContent) {
        newContent.innerHTML = "";
        RegistrationPage();
      }
    },
    profile: () => {
      if (newContent) {
        newContent.innerHTML = "";
        if (localStorage.getItem("token")) {
          newContent.appendChild(profilePage.getHtml());
        } else {
          window.location.hash = "login";
        }
      }
    },
    "": () => {
      if (newContent) {
        newContent.innerHTML = "";
        newContent.innerHTML = NotFoundComponent.render();
      }
    },
    catalog: () => {
      if (newContent) {
        newContent.innerHTML = "";
        removeCategoryData();
        clearCurrentSearch();
        clearCurrentSort();
        clearCurrentFilter();

        const promise = fetchGetProducts();
        promise.then((promiseResult) => {
          setProductsArray(promiseResult);
          getAttributes(promiseResult);
          setArrayOfAttributes(getAttributes(promiseResult));
          const currentCart = getMyActiveCart(getCurrentToken());
          currentCart.then((cart) => {
            setArrayOfChosenProduct(cart);
            newContent.append(new CatalogPage().getHtml());
          });
        });
      }
    },

    search: () => {
      if (newContent) {
        newContent.innerHTML = "";
        const newParams = new URLSearchParams(window.location.hash.slice(1, -6));
        setCurrentSearch(newParams);
        fetchSearchSortFilter(newParams).then((res) => {
          setProductsArray(res);
          setCurrentFilter(newParams);
          setCurrentFiltersArray(newParams);
          setArrayOfAttributes(getAttributes(res));
          setTempArrayOfAttributes(newParams);
          const currentCart = getMyActiveCart(getCurrentToken());
          currentCart.then((cart) => {
            setArrayOfChosenProduct(cart);
            newContent.append(new CatalogPage().getHtml());
            setCurrentSort(newParams);
          });
        });
      }
    },

    products_by_category: () => {
      if (newContent) {
        newContent.innerHTML = "";
        const getRequests = [
          fetchGetCategories(),
          fetchGetProductByCategoryId(localStorage.getItem("productsCategoryId")),
        ];
        const mutateFunctions = [setCategoriesArray, setProductsArray];
        Promise.all(getRequests).then((promiseResultAsArray) => {
          promiseResultAsArray.forEach((promiseResultItem, index) => {
            if (typeof promiseResultItem !== "boolean") {
              mutateFunctions[index](promiseResultItem);
              if (index === 1) {
                setArrayOfAttributes(getAttributes(promiseResultItem));
              }
            }
          });
          setDataForBreadcrumbs(localStorage.getItem("productsCategoryId"), categories.array);
          const currentCart = getMyActiveCart(getCurrentToken());
          currentCart.then((cart) => {
            setArrayOfChosenProduct(cart);
            newContent.append(new CatalogPage().getHtml());
          });
        });
      }
    },

    product: () => {
      if (newContent) {
        newContent.innerHTML = "";
        if (localStorage.getItem("productId")) {
          const prodItem = fetchGetProducts(localStorage.getItem("productId"));
          prodItem.then((result) => {
            if (!(typeof result === "boolean")) {
              newContent.append(new DetailedCard(result, "en-US").getHtml());
            }
          });
        }
      }
    },
  };

  if (localStorage.getItem("token") && hash === "login") {
    hash = "home";
    window.location.hash = hash;
  }
  if (hash === "logout") {
    hash = "home";
    window.location.hash = hash;
    getAccessToken().then(async (answer) => {
      await setAnonTokenAndCreateAnonCart((answer as AccessToken).access_token);
    });
  }

  if (hash.match(/.product/s)) {
    hash = "product";
    const productId = window.location.hash.slice(1, -7);
    localStorage.setItem("productId", productId);
  }

  const routeHandler = routes[hash] || routes[""];
  routeHandler();
}

export function routerInit() {
  window.addEventListener("hashchange", handleHash);
  const currentHash = window.location.hash;
  if (window.location.hash.slice(-7) === "product") {
    window.location.hash = currentHash;
    handleHash();
    return;
  }
  if (window.location.hash.slice(-20) === "products_by_category") {
    window.location.hash = currentHash;
    handleHash();
    return;
  }
  if (window.location.hash.slice(-6) === "search") {
    window.location.hash = currentHash;
    handleHash();
    return;
  }

  if (window.location.hash.slice(-7) === "catalog") {
    window.location.hash = currentHash;
    handleHash();
    return;
  }

  window.location.hash = "#home";
  // window.location.hash = "#home";
  handleHash();
}
