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
