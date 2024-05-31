import Product from "/RSS-ECOMM/src/interfaces/product";
export const ProductDetailsPage = async (): Promise<HTMLElement> => {
  const productId: string = document.location.href.split("product=").at(-1) || "";

  localStorage.setItem("productId", productId);

  let productData;
  try {
    //const response = await fetch(`https://api.example.com/products/${productId}`);
    // productData = await response.json();
    const storedData: string | null = localStorage.getItem("productData");
    productData = storedData
      ? (JSON.parse(storedData) as Product)
      : { id: productId, name: "NameProduct", description: "Description", price: 100 };
  } catch (error) {
    console.error("Error fetching product data:", error);
    productData = { id: productId, name: "Not Found", description: "Not Found", price: 0 };
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

  return productDetails;
};
