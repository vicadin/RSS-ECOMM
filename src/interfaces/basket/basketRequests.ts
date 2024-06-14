import { log } from "console";
import { Basket, Product } from "./basketTypes";

export async function getUserBasket(): Promise<Basket | null> {
  const userId = localStorage.getItem("id");
  const tokenData = localStorage.getItem("token");
  const token = tokenData ? JSON.parse(tokenData).token : null;
  console.log(token);
  console.log(userId);

  if (!userId || !token) {
    throw new Error("User is not authenticated");
  }
  try {
    const response = await fetch(
      `${process.env.HOST}/${process.env.PROJECT_KEY}/carts/customer-id=${userId}`,
      //const response = await fetch(`${process.env.HOST}/${process.env.PROJECT_KEY}/carts/e2da1674-1b69-4f29-b762-8d1d6267d712`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          /* Authorization: `Bearer HZTao77uyUrMif0XqAOgvzH-YJ14qikI`, */
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch basket");
    }

    const data = await response.json();

    const lineItems = data.lineItems.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      name: item.name["en-US"],
      price: item.price.value.centAmount / 100,
      quantity: item.quantity,
      imageUrl: item.variant.images[0]?.url || "",
    }));

    return {
      id: data.id,
      customerId: data.customerId || "",
      lineItems,
      totalPrice: data.totalPrice.centAmount / 100,
    };
  } catch (error) {
    console.error("Error fetching basket:", error);
    return null;
  }
}

export async function updateProductQuantity(
  customerId: string,
  productId: number,
  quantity: number,
): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.HOST}/${process.env.PROJECT_KEY}/carts/customer-id=${customerId}/product/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update product quantity");
    }

    return true;
  } catch (error) {
    console.error("Error updating product quantity:", error);
    return false;
  }
}
