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

export type CatalogTypesAnswer = {
  count: number;
  limit: number;
  offset: number;
  results: CatalogTypeResult[];
  total: number;
};
