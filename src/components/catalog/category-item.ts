import "./category.css";
import { categories } from "../../utils/catalog-utils.ts";
import { LinkOfCategory } from "../../interfaces/catalog-types.ts";
import CategoryList from "./category-list.ts";

export default class CategoryLink {
  id: string;

  parentID: string | undefined;

  ancestors: [{ typeId: "category"; id: string }];

  childrenList: LinkOfCategory[];

  element: HTMLButtonElement;

  subCategoryBlock: Element | null | undefined;

  constructor(categoryObj, children) {
    this.id = categoryObj.id;
    this.parentID = categoryObj.parent?.id;
    this.ancestors = categoryObj.ancestors;
    this.childrenList = children;
    this.element = document.createElement("button");
    this.element.textContent = categoryObj.name["en-US"];
    this.element.className = "category-item";
    this.subCategoryBlock = null;
    this.addEventListeners();
  }

  addEventListeners() {
    this.element.addEventListener("click", () => {});

    this.element.addEventListener("mouseover", () => {
      this.subCategoryBlock =
        this.element.parentElement?.parentElement?.parentElement.lastElementChild;
      if (this.subCategoryBlock) {
        this.subCategoryBlock.innerHTML = "";
        if (this.subCategoryBlock.classList.contains("not-visible")) {
          this.subCategoryBlock.classList.remove("not-visible");
        }
        const subCategoryList = new CategoryList(categories.array, false, this.id);
        this.subCategoryBlock.append(subCategoryList.getHtml());
        if (this.childrenList.length === 0) {
          this.subCategoryBlock.classList.add("not-visible");
        }
      }
    });
  }

  getHtml() {
    return this.element;
  }
}
