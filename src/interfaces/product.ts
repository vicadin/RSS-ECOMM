export interface Product {
  id: string;
  masterData: {
    current: {
      name: { [locale: string]: string };
      description: { [locale: string]: string };
      masterVariant: {
        images: { url: string }[];
        prices: {
          value: { centAmount: number; currencyCode: string };
          discounted?: { value: { centAmount: number; currencyCode: string } };
        }[];
      };
    };
  };
}
