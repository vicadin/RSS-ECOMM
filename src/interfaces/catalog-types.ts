export type Image = {
  dimensions: { w: number; h: number };
  url: string;
};

export type Discounted = {
  discount: { typeId: "product-discount"; id: string };
  value: {
    type: "centPrecision";
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
};

export type Prices = {
  country?: string;
  discounted: Discounted;
  id: string;
};

export type LocaleStrings = {
  ["en-US"]: string;
  ["de-DE"]?: string;
  ["en-GB"]?: string;
};

export type Current = {
  categories: {
    id: string;
    typeId: "category";
  }[];
  categoryOrderHints: object;
  description: LocaleStrings;
  masterVariant: {
    id: number;
    sku: string;
    prices: Prices[] | Prices;
    images: Image[];
    attributes: [];
  };
  name: LocaleStrings;
  searchKeywords: object;
  slug: LocaleStrings;
  variants: [];
};

export type Staged = {
  categories: [];
  categoryOrderHints: object;
  description: LocaleStrings;
  masterVariant: {
    id: 1;
    sku: string;
    prices: [];
    images: [];
    attributes: [];
    assets: [];
    availability: object;
  };
  name: LocaleStrings;
  searchKeywords: object;
  slug: LocaleStrings;
  variants: [];
};

export type Product = {
  createdAt: string;
  createdBy: { isPlatformClient: true };
  id: string;
  key: string;
  lastMessageSequenceNumber: number;
  lastModifiedAt: string;
  lastModifiedBy: { isPlatformClient: boolean };
  lastVariantId: number;
  masterData: {
    current: Current;
    staged: Staged;
    hasStagedChanges: boolean;
    published: true;
  };
  productType: { typeId: "product-type"; id: string };
  taxCategory: { typeId: "tax-category"; id: string };
  version: number;
  versionModifiedAt: string;
};

export type ProductsResult = {
  count: number;
  limit: number;
  offset: number;
  results: Product[];
  total: number;
};

export type AccessToken = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: "Bearer";
};

export type CatalogCategoryResult = {
  id: string;
  version: number;
  key: string;
  externalId: string;
  name: LocaleStrings;
  slug: {
    en: string;
  };
  description: string;
  ancestors: [
    {
      typeId: "category";
      id: string;
    },
  ];
  parent: {
    typeId: "category";
    id: string;
  };
  orderHint: string;
  createdAt: string;
  lastModifiedAt: string;
};

export type CatalogCategoriesAnswer = {
  count: number;
  limit: number;
  offset: number;
  results: CatalogCategoryResult[];
  total: number;
};

export type CategoryType = {
  array: CatalogCategoryResult[] | [];
};

export type LinkOfCategory = {
  id: string;
  parentID: string | undefined;
  ancestors: [{ typeId: "category"; id: string }];
  childrenList: LinkOfCategory[];
  element: HTMLButtonElement;
  subCategoryBlock: Element | null | undefined;
};

export type ProductByCategory = {
  count: number;
  facets: object;
  limit: number;
  offset: number;
  results: {
    id: string;
    version: number;
    productType: object;
    name: object;
    description: object;
  }[];
  total: number;
};

export type Ancestor = { typeId: "category"; id: string; name?: string };

export type Ancestors = Ancestor[] | [];

export type BreadCrumb = {
  href: string;
  name: string;
};

export const HomeLink = {
  href: "/#home",
  name: "Home",
};

export const dropdownButtonAttributes: [string, string][] = [["type", "button"]];

export const dropdownInputAttributes: [string, string][] = [
  ["type", "text"],
  ["autocomplete", "off"],
  ["name", "select-category"],
];

export const dropdownItems = [
  "Sort by default",
  "Sort by price ↑",
  "Sort by price ↓",
  "Sort by name ↑",
  "Sort by name ↓",
];

export const dropdownItemListAttributes: [string, string][] = [["type", "button"]];

export type SortType = {
  sorting: undefined | string;
};

export const sortObject: SortType = {
  sorting: undefined,
};

export const datasets = [
  "score desc",
  "price asc",
  "price desc",
  "name.en-US asc",
  "name.en-US desc",
];

export type FilterType = {
  filter: undefined | string;
};

export const currentFilter: FilterType = {
  filter: undefined,
};

export const priceInputAttributes: [string, string][] = [
  ["type", "range"],
  ["autocomplete", "off"],
  ["min", "20"],
];

export const svgFilter = `<svg class="filter-button__ico" width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.56254 9.71128H3.93758V11.9613H0.666748L0.666748 13.5862H3.93758L3.93758 15.8362H5.56254L5.56254 9.71128ZM15.3334 11.9613L7.06258 11.9613V13.5862L15.3334 13.5862V11.9613ZM15.3334 5.41962H12.0625V3.16962L10.4376 3.16962V9.29457H12.0625V7.04457H15.3334V5.41962ZM8.93754 5.41962H0.666748L0.666748 7.04457H8.93754V5.41962Z" fill="currentColor"/>
    </svg>`;

export type StringArray = string[];
export type Attributes = [string, StringArray];

export type FiltersArray = {
  filter: string[] | [];
};

// is set from router to fill filterContainer
export const currentFilterArray: FiltersArray = {
  filter: [],
};

// is set before every rendering of Catalog Page to fill attibutes container of filter-container-main
export const attributesForFilters: { attributes: [] | Attributes } = {
  attributes: [],
};

export const svgCheckActive =
  "<svg xmlns='http://www.w3.org/2000/svg' class ='svg-check' width='25' height='24' fill='#666'><path fill-rule='evenodd' d='M12.928 0c-9.6 0-12 2.4-12 12s2.4 12 12 12 12-2.4 12-12-2.4-12-12-12' clip-rule='evenodd'/><path stroke='#fff' stroke-width='2.325' d='m6.511 11.121 4.203 4.665 8.63-9.354'/></svg>";

export const svgCheckInactive =
  "<svg xmlns='http://www.w3.org/2000/svg' class ='svg-check' width='25' height='24' fill='none' stroke='#666'><path stroke-width='3' d='M12.928 1.5c-4.81 0-7.216.638-8.54 1.96-1.322 1.324-1.96 3.73-1.96 8.54s.638 7.216 1.96 8.54c1.324 1.322 3.73 1.96 8.54 1.96 4.811 0 7.217-.638 8.54-1.96 1.323-1.324 1.96-3.73 1.96-8.54s-.637-7.216-1.96-8.54c-1.323-1.322-3.729-1.96-8.54-1.96Z'/></svg>";

export type FilterObj = {
  size?: [string];
  ["suited-to"]?: [string];
  ["key-ingredients"]?: [string];
};

export type TempArrayOfAttributes = Attributes[];
