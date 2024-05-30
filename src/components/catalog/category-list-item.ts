import CategoryLink from "./category-item.ts";
import { CatalogCategoryResult } from "../../interfaces/catalog-types.ts";
import { addArrow } from "./arrow.ts";
import CategoryList from "./category-list.ts";
import { categories } from "../../utils/catalog-utils.ts";
import hasChildren from "../../utils/categories-utils.ts";
import { unlockBody } from "../../utils/header-utils.ts";

export default class CategoryListItem {
  children: CatalogCategoryResult[];

  categorlistItemId: string;

  subCategoryBlock: Element | null | undefined;

  categoryListAnsestors: [{ typeId: "category"; id: string }];

  categoryListItem: HTMLLIElement;

  categoryListItemKey: string;

  constructor(
    categoryList: CatalogCategoryResult[],
    item: CatalogCategoryResult,
    isRoot: boolean,
    subCategoryId?: string,
  ) {
    this.categoryListItem = document.createElement("li");
    this.categoryListItem.className = "category-list_item";
    this.categorlistItemId = item.id;
    this.categoryListItemKey = item.key;
    this.children = CategoryListItem.getChildren(categoryList, item);
    this.subCategoryBlock = null;
    this.categoryListAnsestors = item.ancestors;
    if (isRoot) {
      if (!item.parent) {
        this.categoryListItem.append(new CategoryLink(item, this.children).getHtml());
      }
    } else if (subCategoryId === item.parent?.id) {
      this.categoryListItem.append(new CategoryLink(item, this.children).getHtml());
    }
    if (this.categoryListItem.firstElementChild) {
      this.categoryListItem.classList.add("not-empty");
      addArrow(this.children, this.categoryListItem);
    }
    this.addEventListeners();
  }

  addEventListeners() {
    this.categoryListItem.addEventListener("click", () => {
      if (!hasChildren(this.children)) {
        const elem = document.querySelectorAll(".category-container_invisible");
        if (elem) {
          elem.forEach((item) => {
            item.classList.remove("category-container_invisible");
          });
        }
        const pathname = `${this.categorlistItemId}`;
        window.location.hash = `#${pathname}products_by_category`;
        unlockBody();
      } else if (document.documentElement.offsetWidth < 1023) {
        const parent = this.categoryListItem.parentElement?.parentElement;
        parent.classList.add("category-container_invisible");
      } else {
        const elem = document.querySelectorAll(".category-container_invisible");
        if (elem) {
          elem.forEach((item) => {
            item.classList.remove("category-container_invisible");
          });
        }
        const pathname = `${this.categorlistItemId}`;
        window.location.hash = `#${pathname}products_by_category`;
        unlockBody();
      }
    });

    this.categoryListItem.addEventListener("mouseover", () => {
      this.subCategoryBlock = this.categoryListItem.parentElement?.parentElement.lastElementChild;
      if (this.subCategoryBlock) {
        CategoryListItem.clearAndShow(this.subCategoryBlock);
        const subCategoryList = new CategoryList(categories.array, false, this.categorlistItemId);
        this.subCategoryBlock.append(subCategoryList.getHtml());
        if (this.children.length === 0) {
          this.subCategoryBlock.classList.add("not-visible");
        }
      }
    });
  }

  static getChildren(categoryList: CatalogCategoryResult[], item: CatalogCategoryResult) {
    return categoryList.filter((categoryListItem) => categoryListItem.parent?.id === item.id);
  }

  getHtml() {
    return this.categoryListItem;
  }

  static clearAndShow(block: Element) {
    const newBlock = block;
    newBlock.innerHTML = "";
    if (newBlock.classList.contains("not-visible")) {
      newBlock.classList.remove("not-visible");
    }
  }
}
