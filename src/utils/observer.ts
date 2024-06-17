import {
  fetchGetProductByCategoryId,
  fetchGetProducts,
  fetchSearchSortFilter,
} from "../interfaces/catalog-requests.ts";
import { products, setProductsArray } from "./catalog-utils.ts";

import Products from "../components/catalog/products.ts";
import { ProductsResult, utilObject } from "../interfaces/catalog-types.ts";

let nextpage = 1;

const infiniteObserver = new IntersectionObserver(
  ([entry], observer) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      let promise;
      if (window.location.hash.slice(-6) === "search") {
        const stringFromSearchField = window.location.hash.slice(1, -6);
        const stringWithOffset = `${stringFromSearchField}&offset=${nextpage * 8}&limit=8`;
        const newParams = new URLSearchParams(stringWithOffset);
        promise = fetchSearchSortFilter(newParams);
        nextpage += 1;
      } else if (window.location.hash.slice(-20) === "products_by_category") {
        promise = fetchGetProductByCategoryId(
          <string>localStorage.getItem("productsCategoryId"),
          8,
          8 * nextpage,
        );
        nextpage += 1;
      } else {
        promise = fetchGetProducts(8, 8 * nextpage);
        nextpage += 1;
      }
      promise.then((res) => {
        setProductsArray(res);
        const mainSection = document.querySelector(".catalog-main");
        if (products.array.length === 0) {
          nextpage = 1;
        }
        if ((utilObject as ProductsResult).total >= (nextpage - 1) * 8) {
          mainSection.append(new Products(products.array).getHtml());
        } else {
          nextpage = 1;
        }
      });
    }
  },
  {
    threshold: 1,
  },
);

export default infiniteObserver;
