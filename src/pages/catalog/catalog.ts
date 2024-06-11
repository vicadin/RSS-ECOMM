import "./catalog-page.css";
import "../../styles/style.css";
import { createButton, createElement, createInput } from "../../utils/login-page-utils.ts";
import { products, showFilters, unlockBodyAndCloseFilters } from "../../utils/catalog-utils.ts";
import Products from "../../components/catalog/products.ts";
import Breadcrumbs from "../../components/catalog/breadcrumbs.ts";
import { currentSearch } from "../../interfaces/header-types.ts";
import {
  Attributes,
  attributesForFilters,
  currentFilter,
  datasets,
  dropdownButtonAttributes,
  dropdownInputAttributes,
  dropdownItemListAttributes,
  dropdownItems,
  sortObject,
  svgFilter,
} from "../../interfaces/catalog-types.ts";
import { lockBody, setLocationForSearching } from "../../utils/header-utils.ts";
import { filtersCloseButton } from "../../components/catalog/filters-close-button.ts";
import AttributeBlock from "../../components/catalog/attribute-block.ts";
import { showButtonAttributes } from "../../interfaces/login-page-types.ts";

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

  filterButton: HTMLElement;

  filterContainer: HTMLElement | HTMLUListElement;

  filterContainerHeader: HTMLElement | HTMLUListElement;

  filterAttributesContainer: HTMLElement | HTMLUListElement;

  attributesShowButton: HTMLButtonElement;

  arrayOfAttributeBlock: Attributes[];

  constructor() {
    this.pageContainer = createElement("div", "catalog-container");
    this.catalogBreadcrumbs = createElement("div", "catalog_breadcrumbs");
    this.catalogTitle = createElement("div", "catalog_title");
    this.catalogFilterBlock = createElement("div", "catalog_filters-block");
    this.catalogFilterBlock.classList.remove("hidden");
    this.setTitle();
    this.setBreadcrumbs();
    this.createSorting();
    this.createFilterButton();
    this.createFilterBlock();
    this.catalogFilterBlock.append(this.sortWrapper, this.filterButton);
    this.catalogMain = createElement("section", "catalog-main");
    this.catalogMain.append(new Products(products.array).getHtml());
    this.pageContainer.append(
      this.catalogBreadcrumbs,
      this.catalogTitle,
      this.catalogFilterBlock,
      this.catalogMain,
    );
    this.arrayOfAttributeBlock = [];
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

  static setSearchParams(button?: HTMLButtonElement, arrayOfFilters?: Attributes[]) {
    let newSearchParam;
    let filtersSearchParams;

    const finalParamString = [];
    if (localStorage.getItem("productsCategoryId")) {
      currentFilter.filter = `categories.id:"${localStorage.getItem("productsCategoryId")}"`;
    }
    if (button) {
      sortObject.sorting = button.dataset.value;
    }
    if (sortObject.sorting) {
      const sortParam = new URLSearchParams(`sort=${sortObject.sorting}`);
      if (finalParamString.length !== 0) {
        finalParamString.push(`&${sortParam}`);
      } else {
        finalParamString.push(`${sortParam}`);
      }
    }

    if (arrayOfFilters) {
      arrayOfFilters.forEach(([name, value]) => {
        value.forEach((stringValue) => {
          if (name === "size") {
            const filterParam = new URLSearchParams(
              `filter=variants.attributes.${name}.en-US:"${stringValue}"`,
            );
            if (finalParamString.length !== 0) {
              finalParamString.push(`&${filterParam}`);
            } else {
              finalParamString.push(`${filterParam}`);
            }
          } else {
            const filterParam = new URLSearchParams(
              `filter=variants.attributes.${name}:"${stringValue}"`,
            );
            if (finalParamString.length !== 0) {
              finalParamString.push(`&${filterParam}`);
            } else {
              finalParamString.push(`${filterParam}`);
            }
          }
        });
      });
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

    this.filterButton.addEventListener("click", () => {
      showFilters();
      lockBody();
    });

    this.attributesShowButton.addEventListener("click", () => {
      unlockBodyAndCloseFilters();
      this.arrayOfAttributeBlock.length = 0;
      if (this.filterAttributesContainer.children.length !== 0) {
        Array.from(this.filterAttributesContainer.children).forEach((child) => {
          const newKey: string = child.firstElementChild?.firstElementChild.textContent;
          const newarray: string[] = [];
          Array.from(child.lastElementChild.children).forEach((lastChild) => {
            if (lastChild.classList.contains("attribute-item__active")) {
              newarray.push(lastChild?.lastElementChild?.textContent);
            }
          });
          if (newarray.length !== 0) {
            this.arrayOfAttributeBlock.push([newKey, newarray]);
          }
        });
      }
      CatalogPage.setSearchParams(undefined, this.arrayOfAttributeBlock);
    });
  }

  createSorting() {
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
  }

  createFilterButton() {
    this.filterButton = document.createElement("button");
    this.filterButton.className = "filter-button";
    const span = document.createElement("span");
    span.className = "button-text-container";
    const svgToSpan = svgFilter;
    const textToSpan = document.createElement("span");
    textToSpan.className = "filter-button__text";
    textToSpan.textContent = "Filters";
    span.insertAdjacentHTML("afterbegin", svgToSpan);
    span.append(textToSpan);
    this.filterButton.append(span);
  }

  createFilterBlock() {
    this.filterContainer = createElement("div", "filter-container filter-container_closed");

    this.filterContainerHeader = createElement("header", "filter-container__header");
    const filterContainerHeading = createElement("h2", "filter-container__heading");
    filterContainerHeading.textContent = "Filters";
    const closeButton = filtersCloseButton;
    this.filterContainerHeader.append(filterContainerHeading, closeButton.getHtml());

    this.filterAttributesContainer = createElement("div", "attributes-container");
    attributesForFilters.attributes.forEach(([key, value]) => {
      const attributeBlock = new AttributeBlock(key, value);
      this.filterAttributesContainer.append(attributeBlock.getHtml());
    });
    // console.log(attributesForFilters.attributes, "this is from creating filterAside");
    this.attributesShowButton = createButton(
      "attributes-container__show-button hidden",
      showButtonAttributes,
      "Show results",
    );
    this.filterContainer.append(
      this.filterContainerHeader,
      this.filterAttributesContainer,
      this.attributesShowButton,
    );
    this.catalogFilterBlock.append(this.filterContainer);
  }

  getHtml() {
    return this.pageContainer;
  }
}
