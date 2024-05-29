import CategoryLink from "./category-item.ts";
import { CatalogCategoryResult } from "../../interfaces/catalog-types.ts";
import { addArrow } from "./arrow.ts";
import CategoryList from "./category-list.ts";
import { categories } from "../../utils/catalog-utils.ts";
import hasChildren from "../../utils/categories-utils.ts";
import { unlockBody } from "../../utils/header-utils.ts";

export default class CategoryListItem {
  categorlistItem: HTMLLIElement;

  children: CatalogCategoryResult[];

  categorlistItemId: string;

  subCategoryBlock: Element | null | undefined;

  categoryListAnsestors: [{ typeId: "category"; id: string }];

  categorlistItemKey: string;

  constructor(
    categoryList: CatalogCategoryResult[],
    item: CatalogCategoryResult,
    isRoot: boolean,
    subCategoryId?: string,
  ) {
    this.categorlistItem = document.createElement("li");
    this.categorlistItem.className = "category-list_item";
    this.categorlistItemId = item.id;
    this.categorlistItemKey = item.key;
    this.children = CategoryListItem.getChildren(categoryList, item);
    this.subCategoryBlock = null;
    this.categoryListAnsestors = item.ancestors;
    if (isRoot) {
      if (!item.parent) {
        this.categorlistItem.append(new CategoryLink(item, this.children).getHtml());
      }
    } else if (subCategoryId === item.parent?.id) {
      this.categorlistItem.append(new CategoryLink(item, this.children).getHtml());
    }
    if (this.categorlistItem.firstElementChild) {
      this.categorlistItem.classList.add("not-empty");
      addArrow(this.children, this.categorlistItem);
    }
    this.addEventListeners();
  }

  addEventListeners() {
    this.categorlistItem.addEventListener("click", () => {
      if (!hasChildren(this.children)) {
        const pathname = `${this.categorlistItemId}`;
        window.location.hash = `#${pathname}products_by_category`;
      }
      unlockBody();
    });

    this.categorlistItem.addEventListener("mouseover", () => {
      this.subCategoryBlock = this.categorlistItem.parentElement?.parentElement.lastElementChild;
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
    return this.categorlistItem;
  }

  static clearAndShow(block: Element) {
    const newBlock = block;
    newBlock.innerHTML = "";
    if (newBlock.classList.contains("not-visible")) {
      newBlock.classList.remove("not-visible");
    }
  }
}
