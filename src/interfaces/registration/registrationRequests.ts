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
  street: string,
  city: string,
  postalCode: string,
  country: string,
): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.HOST}/${process.env.PROJECT_KEY}/customers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        streetName: street,
        city: city,
        postalCode: postalCode,
        country: country,
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      console.error("Registration error:", errorData);
      if (errorData.statusCode === 400) {
        displayError(errorData.message);
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
