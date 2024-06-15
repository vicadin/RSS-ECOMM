import { LocaleStrings, Prices } from "./catalog-types";

export type LineItem = {
  addedAt: string;
  discountedPricePerQuantity: [];
  id: string;
  lastModifiedAt: string;
  lineItemMode: string;
  name: LocaleStrings;
  perMethodTaxRate: [];
  price: Prices;
  priceMode: "Platform";
  productId: string;
  productKey: string;
  productSlug: LocaleStrings;
  productType: {
    typeId: "product-type";
    id: string;
    version: number;
  };
  quantity: number;
  state: [
    {
      quantity: number;
      state: {
        id: string;
        typeId: "state";
      };
    },
  ];
  taxedPricePortions: [];
  totalPrice: {
    type: "centPrecision";
    currencyCode: "USD";
    centAmount: number;
    fractionDigits: number;
  };
  variant: {
    id: number;
    sku: string;
    prices: [];
    images: [];
    attributes: [];
    assets: [];
  };
};

export type Cart = {
  anonymousId: string;
  cartState: "Active";
  country: "US";
  createdAt: string;
  createdBy: {
    clientId: string;
    isPlatformClient: false;
    anonymousId: string;
  };
  customLineItems: [];
  customerId: string;
  deleteDaysAfterLastModification: number;
  directDiscounts: [];
  discountCodes: [];
  id: string;
  inventoryMode: string;
  itemShippingAddresses: [];
  lastMessageSequenceNumber: number;
  lastModifiedAt: string;
  lastModifiedBy: {
    clientId: string;
    isPlatformClient: false;
    customer: {
      id: string;
      typeId: "customer";
    };
  };
  lineItems: LineItem[];
  origin: "Customer";
  refusedGifts: [];
  shipping: [];
  shippingMode: "Single";
  taxCalculationMode: "LineItemLevel";
  taxMode: "Platform";
  taxRoundingMode: "HalfEven";
  totalLineItemQuantity: 10;
  totalPrice: { type: "centPrecision"; currencyCode: "USD"; centAmount: 24396; fractionDigits: 2 };
  type: "Cart";
  version: 23;
  versionModifiedAt: "2024-06-13T17:20:27.213Z";
};
