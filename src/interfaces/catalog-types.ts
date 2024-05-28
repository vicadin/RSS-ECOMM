export type CatalogTypeResult = {
  attributes: [];
  classifier: string;
  createdAt: string;
  createdBy: { isPlatformClient: boolean };
  description: string;
  id: string;
  key: string;
  lastModifiedAt: string;
  lastModifiedBy: { isPlatformClient: boolean };
  name: string;
  version: number;
  versionModifiedAt: string;
};

export type CatalogCategoryResult = {
  id: string;
  version: number;
  key: string;
  externalId: string;
  name: {
    en: string;
  };
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

export type CatalogTypesAnswer = {
  count: number;
  limit: number;
  offset: number;
  results: CatalogTypeResult[];
  total: number;
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
