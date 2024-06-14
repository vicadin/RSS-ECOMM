export interface Product {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Basket {
  id: string;
  customerId: string;
  lineItems: Product[];
  totalPrice: number;
  version: number;
}
