import { displayError } from "./registartionFormUtils.ts";

export async function getAccessToken() {
  const config = {
    method: "POST",
    headers: {
      Authorization:
        "Basic ZkVIRlZjM1hGM29tNXAwNHNjSncyR3pGOkNqNndxLUJKQ3JRMHh4UVQ1ZWZJRzY4Q2xKQ2JZMExU",
    },
  };
  try {
    const response = await fetch(
      `${process.env.AUTH_URL}/oauth/token?grant_type=client_credentials`,
      config,
    );
    if (response.ok) {
      return await response.json();
    }
    return response;
  } catch (err) {
    return err;
  }
}

interface Address {
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}

interface RequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
  defaultShippingAddress?: number;
  shippingAddresses: number[];
  defaultBillingAddress?: number;
  billingAddresses: number[];
}

export async function registerUser(
  token: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  deliveryStreet: string,
  deliveryCity: string,
  deliveryPostalCode: string,
  deliveryCountry: string,
  billingStreet: string,
  billingCity: string,
  billingPostalCode: string,
  billingCountry: string,
  defaultDeliveryAddress: boolean,
  defaultBillingAddress: boolean,
): Promise<boolean> {
  try {
    const addresses: Address[] = [
      {
        streetName: deliveryStreet,
        city: deliveryCity,
        postalCode: deliveryPostalCode,
        country: deliveryCountry,
      },
      {
        streetName: billingStreet,
        city: billingCity,
        postalCode: billingPostalCode,
        country: billingCountry,
      },
    ];

    const deliveryAddressIndex = 0;
    const billingAddressIndex = 1;

    const requestBody: RequestBody = {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      addresses,
      shippingAddresses: [deliveryAddressIndex],
      billingAddresses: [billingAddressIndex],
    };

    if (defaultDeliveryAddress) {
      requestBody.defaultShippingAddress = deliveryAddressIndex;
    }
    if (defaultBillingAddress) {
      requestBody.defaultBillingAddress = billingAddressIndex;
    }

    const response = await fetch(`${process.env.HOST}/${process.env.PROJECT_KEY}/customers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return await response.json();
    }

    const errorData = await response.json();
    console.error("Registration error:", errorData);
    if (errorData.statusCode === 400 && errorData.errors[0].code === "DuplicateField") {
      displayError("User with this email already exists");
    } else if (errorData.statusCode === 500) {
      displayError("Oops! Try again a little later.");
    }

    return false;
  } catch (error) {
    console.error("Error registering user:", error);
    return false;
  }
}
