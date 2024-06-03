import "./breadcrumbs.css";
import { createElement } from "../../utils/login-page-utils.ts";
import { Ancestors, BreadCrumb, HomeLink } from "../../interfaces/catalog-types.ts";

export default class Breadcrumbs {
  breadcrumbsContainer: HTMLElement | HTMLUListElement;

  breadcrumbsList: HTMLElement | HTMLUListElement;

  constructor(ancestors: Ancestors, currentName: string) {
    this.breadcrumbsContainer = createElement("div", "breadcrumbs");
    this.breadcrumbsList = createElement("ul", "breadcrumbs_list");
    this.createBreadcrumbs(ancestors, currentName);
    this.breadcrumbsContainer.append(this.breadcrumbsList);
  }

  createBreadcrumbs(ancestors: Ancestors, currentName: string) {
    const home = Breadcrumbs.createBreadCrumb(HomeLink);
    this.breadcrumbsList.append(home);
    if (ancestors.length) {
      ancestors.forEach((ancestor) => {
        const ancestorData = {
          ...{ href: `/#${ancestor.id}products_by_category`, name: `${ancestor.name}` },
        };
        const ancestorLi = Breadcrumbs.createBreadCrumb(ancestorData);
        this.breadcrumbsList.append(ancestorLi);
      });
    }
    const current = Breadcrumbs.createBreadCrumbLi();
    current.textContent = currentName;
    this.breadcrumbsList.append(current);
  }

  static createBreadCrumb(breadCrumbObject: BreadCrumb) {
    const breadCrumb = Breadcrumbs.createBreadCrumbLi();

    const breadCrumbLink = document.createElement("a");
    breadCrumbLink.className = "breadcrumbs_link";
    breadCrumbLink.href = breadCrumbObject.href;

    const breadCrumbLinkText = document.createElement("span");
    breadCrumbLinkText.className = "breadcrumbs_link-name";
    breadCrumbLinkText.textContent = breadCrumbObject.name;
    const slash = document.createElement("span");
    slash.textContent = "/";

    breadCrumbLink.append(breadCrumbLinkText);
    breadCrumb.append(breadCrumbLink, slash);
    return breadCrumb;
  }

  static createBreadCrumbLi() {
    const li = document.createElement("li");
    li.className = "breadcrumbs_item";
    return li;
  }

  getHtml() {
    return this.breadcrumbsContainer;
  }
}
