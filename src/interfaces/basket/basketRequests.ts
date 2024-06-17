function getAuthData() {
  const tokenData = localStorage.getItem("token");
  const token = tokenData ? JSON.parse(tokenData).token : null;
  const anonCartId = localStorage.getItem("anonCartId");
  const anonToken = localStorage.getItem("anonymous-token");
  const userId = localStorage.getItem("id");

  let url: string;
  let headers: HeadersInit = { "Content-Type": "application/json" };

  if (userId && token) {
    url = `${process.env.HOST}/${process.env.PROJECT_KEY}/carts/customer-id=${userId}`;
    headers.Authorization = `Bearer ${token}`;
  } else if (anonCartId) {
    url = `${process.env.HOST}/${process.env.PROJECT_KEY}/carts/${anonCartId}`;
    headers.Authorization = `Bearer ${anonToken}`;
  } else {
    throw new Error("No authenticated user or anonymous cart ID found");
  }

  return { url, headers };
}

export async function getUserBasket(): Promise<Basket | null> {
  try {
    const { url, headers } = getAuthData();
    const response = await fetch(url, { headers });

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
      discountCodes: item.discountCodes,
      discountOnTotalPrice: item.discountOnTotalPrice,
    }));

    return {
      id: data.id,
      customerId: data.customerId || "",
      lineItems,
      totalPrice: data.totalPrice.centAmount / 100,
      version: data.version,
      discountCodes: data.discountCodes,
      discountOnTotalPrice: data.discountOnTotalPrice,
    };
  } catch (error) {
    console.error("Error fetching basket:", error);
    return null;
  }
}

async function modifyBasket(
  cartId: string,
  method: string,
  cartVersion?: number,
  body?: any,
): Promise<boolean> {
  try {
    const { headers } = getAuthData();
    const requestUrl = cartVersion
      ? `${process.env.HOST}/${process.env.PROJECT_KEY}/carts/${cartId}?version=${cartVersion}`
      : `${process.env.HOST}/${process.env.PROJECT_KEY}/carts/${cartId}`;

    const response = await fetch(requestUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to ${method === "DELETE" ? "clear basket" : "modify basket"}`);
    }

    return true;
  } catch (error) {
    console.error(
      `Error during ${method === "DELETE" ? "clearing basket" : "modifying basket"}:`,
      error,
    );
    return false;
  }
}

export async function clearBasket(cartId: string, cartVersion: number): Promise<boolean> {
  return modifyBasket(cartId, "DELETE", cartVersion);
}

export async function removeProduct(
  cartId: string,
  cartVersion: number,
  lineItemId: string,
): Promise<boolean> {
  const body = {
    version: cartVersion,
    actions: [{ action: "removeLineItem", lineItemId }],
  };
  return modifyBasket(cartId, "POST", undefined, body);
}

export async function updateLineItemQuantity(
  cartId: string,
  cartVersion: number,
  lineItemId: string,
  quantity: number,
): Promise<boolean> {
  const body = {
    version: cartVersion,
    actions: [{ action: "changeLineItemQuantity", lineItemId, quantity }],
  };
  return modifyBasket(cartId, "POST", undefined, body);
}

export async function applyPromoCode(
  cartId: string,
  cartVersion: number,
  promoCode: string,
): Promise<boolean> {
  const body = {
    version: cartVersion,
    actions: [{ action: "addDiscountCode", code: promoCode }],
  };
  return modifyBasket(cartId, "POST", undefined, body);
}
export async function removePromoCode(
  cartId: string,
  cartVersion: number,
  discountCodeId: string,
): Promise<boolean> {
  const body = {
    version: cartVersion,
    actions: [
      {
        action: "removeDiscountCode",
        discountCode: {
          typeId: "discount-code",
          id: discountCodeId,
        },
      },
    ],
  };
  return modifyBasket(cartId, "POST", cartVersion, body);
}
