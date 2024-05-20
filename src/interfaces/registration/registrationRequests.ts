import { displayError } from "./registartionFormUtils";

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
    const addresses = [];

    const deliveryAddressIndex = addresses.length;
    addresses.push({
      streetName: deliveryStreet,
      city: deliveryCity,
      postalCode: deliveryPostalCode,
      country: deliveryCountry,
    });

    const billingAddressIndex = addresses.length;
    addresses.push({
      streetName: billingStreet,
      city: billingCity,
      postalCode: billingPostalCode,
      country: billingCountry,
    });

    const requestBody: any = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      addresses: addresses,
    };

    if (defaultDeliveryAddress) {
      requestBody.defaultShippingAddress = deliveryAddressIndex;
    }
    requestBody.shippingAddresses = [deliveryAddressIndex];
    if (defaultBillingAddress) {
      requestBody.defaultBillingAddress = billingAddressIndex;
    }
    requestBody.billingAddresses = [billingAddressIndex];

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
    } else {
      const errorData = await response.json();
      console.error("Registration error:", errorData);
      if (errorData.statusCode === 400 && errorData.errors[0].code === "DuplicateField") {
        console.log(errorData);
        displayError("User with this email already exists");
      } else if (errorData.statusCode === 500) {
        displayError("Oops! Try again a little later.");
      }

      return false;
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return false;
  }
}
