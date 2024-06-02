import { Product } from "/RSS-ECOMM/src/interfaces/product";

export const ProductDetailsPage = async (): Promise<HTMLElement> => {
  const productId: string = document.location.href.split("product=").at(-1) || "";

  localStorage.setItem("productId", productId);

  let productData: Product;
  try {
    const storedData: string | null = localStorage.getItem("productData");
    productData = storedData
      ? (JSON.parse(storedData) as Product)
      : {
          id: productId,
          name: "Product_Name",
          description: "Product_Description",
          price: 100,
          imageUrl: "",
        };
  } catch (error) {
    console.error("Error fetching product data:", error);

    productData = {
      id: productId,
      name: "Unknown_Product",
      description: "Description ont Found",
      price: 0,
      imageUrl: "",
    };
  }

  const productDetails: HTMLElement = document.createElement("div");

  const title: HTMLElement = document.createElement("h1");
  title.textContent = productData.name;
  productDetails.appendChild(title);

  const description: HTMLElement = document.createElement("p");
  description.textContent = productData.description;
  productDetails.appendChild(description);

  const price: HTMLElement = document.createElement("p");
  price.textContent = `Price: $${productData.price}`;
  productDetails.appendChild(price);

  const image: HTMLImageElement = document.createElement("img");
  image.src = productData.imageUrl;
  image.alt = productData.name;
  productDetails.appendChild(image);

  return productDetails;
};

document.addEventListener("DOMContentLoaded", async () => {
  const productDetails: HTMLElement = await ProductDetailsPage();
  const container: HTMLElement | null = document.getElementById("product-details-container");
  if (container) {
    container.appendChild(productDetails);
  }
});
