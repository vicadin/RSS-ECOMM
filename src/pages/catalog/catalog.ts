import "./catalog-page.css";
import { createButton, createElement, createInput } from "../../utils/login-page-utils.ts";
import { products } from "../../utils/catalog-utils.ts";
import Products from "../../components/catalog/products.ts";
import Breadcrumbs from "../../components/catalog/breadcrumbs.ts";
import { currentSearch } from "../../interfaces/header-types.ts";
import {
  currentFilter,
  datasets,
  dropdownButtonAttributes,
  dropdownInputAttributes,
  dropdownItemListAttributes,
  dropdownItems,
  sortObject,
} from "../../interfaces/catalog-types.ts";
import { setLocationForSearching } from "../../utils/header-utils.ts";

export default class CatalogPage {
  aside: HTMLElement;

  pageContainer: HTMLElement | HTMLUListElement;

  catalogMain: HTMLElement | HTMLUListElement;

  catalogBreadcrumbs: HTMLElement | HTMLUListElement;

  catalogTitle: HTMLElement | HTMLUListElement;

  catalogFilterBlock: HTMLElement | HTMLUListElement;

  sortWrapper: HTMLElement | HTMLUListElement;

  sortButton: HTMLButtonElement;

  dropdownList: HTMLElement | HTMLUListElement;

  dropdownInput: HTMLInputElement;

  constructor() {
    this.pageContainer = createElement("div", "catalog-container");
    this.catalogBreadcrumbs = createElement("div", "catalog_breadcrumbs");
    this.catalogTitle = createElement("div", "catalog_title");
    this.catalogFilterBlock = createElement("div", "catalog_filters-block");
    this.catalogFilterBlock.classList.remove("hidden");
    this.setTitle();
    this.setBreadcrumbs();

    this.sortWrapper = createElement("div", "sort-wrapper");
    this.sortButton = createButton("dropdown__button", dropdownButtonAttributes, dropdownItems[0]);
    this.dropdownList = createElement("div", "dropdown__list hidden");
    this.dropdownInput = createInput("dropdown__input_hidden", dropdownInputAttributes);
    this.sortWrapper.append(this.sortButton, this.dropdownList, this.dropdownInput);

    dropdownItems.forEach((item, index) => {
      const button = createButton("dropdown__list-item", dropdownItemListAttributes, item);
      button.dataset.value = datasets[index];
      button.addEventListener("click", () => {
        this.sortButton.textContent = button.textContent;
        this.dropdownList.classList.add("hidden");
        CatalogPage.setSearchParams(button);
      });
      this.dropdownList.append(button);
    });

    this.catalogFilterBlock.append(this.sortWrapper);

    this.catalogMain = createElement("section", "catalog-main");
    this.catalogMain.append(new Products(products.array).getHtml());
    this.pageContainer.append(
      this.catalogBreadcrumbs,
      this.catalogTitle,
      this.catalogFilterBlock,
      this.catalogMain,
    );

    this.addEventListeners();
  }

  setTitle() {
    if (products.array.length === 0) {
      this.catalogTitle.textContent = "Nothing was found.";
      this.catalogFilterBlock.classList.add("hidden");
    } else if (currentSearch.currentText) {
      const text = currentSearch.currentText;
      this.catalogTitle.textContent = text.charAt(0).toUpperCase() + text.slice(1);
    }
  }

  setBreadcrumbs() {
    if (
      localStorage.getItem("categoryListAncestors") &&
      localStorage.getItem("currentCategoryName")
    ) {
      const currentBreadcrumbs = new Breadcrumbs(
        JSON.parse(localStorage.getItem("categoryListAncestors")!),
        localStorage.getItem("currentCategoryName")!,
      );
      this.catalogTitle.textContent = localStorage.getItem("currentCategoryName");
      this.catalogBreadcrumbs.append(currentBreadcrumbs.getHtml());
    }
  }

  static setSearchParams(button) {
    let newSearchParam;
    let filtersSearchParams;

    const finalParamString = [];
    if (localStorage.getItem("productsCategoryId")) {
      currentFilter.filter = `categories.id:"${localStorage.getItem("productsCategoryId")}"`;
    }

    sortObject.sorting = button.dataset.value;
    const sortParam = new URLSearchParams(`sort=${sortObject.sorting}`);
    if (finalParamString.length !== 0) {
      finalParamString.push(`&${sortParam}`);
    } else {
      finalParamString.push(`${sortParam}`);
    }

    if (currentSearch.currentText) {
      newSearchParam = new URLSearchParams(`text.en-US=${currentSearch.currentText}`);
      finalParamString.push("&fuzzy=true");
      if (finalParamString.length !== 0) {
        finalParamString.push(`&${newSearchParam}`);
      } else {
        finalParamString.push(`${newSearchParam}`);
      }
    }

    if (currentFilter.filter) {
      filtersSearchParams = new URLSearchParams(`filter=${currentFilter.filter}`);
      if (finalParamString.length !== 0) {
        finalParamString.push(`&${filtersSearchParams}`);
      } else {
        finalParamString.push(`${filtersSearchParams}`);
      }
    }
    setLocationForSearching(finalParamString.join(",").replace(",&", "&").replace(",&", "&"));
  }

  addEventListeners() {
    this.sortButton.addEventListener("click", () => {
      this.dropdownList.classList.toggle("hidden");
    });
  }

  getHtml() {
    return this.pageContainer;
  }
}
