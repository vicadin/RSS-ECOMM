export interface Address {
    id: string;
    streetName: string;
    city: string;
    postalCode: string;
    country: string;
  }
  
  export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    addresses: Address[];
    billingAddressIds: string[];
    shippingAddressIds: string[];
    defaultShippingAddressId?: string;
    defaultBillingAddressId?: string;
    version: number;
  }

  interface UpdateUserProfile {
    action: string;
    value: string;
  }

  export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const userId = localStorage.getItem("id");
    const tokenData = localStorage.getItem("token");
    const token = tokenData ? JSON.parse(tokenData).token : null;

    if (!userId || !token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${process.env.HOST}/${process.env.PROJECT_KEY}/customers/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const userProfile: UserProfile = await response.json();
    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
 export async function saveUserProfile(update: UpdateUserProfile): Promise<boolean> {
  try {
    const userProfile = await getUserProfile();
    if (!userProfile) {
      throw new Error("Failed to fetch user profile");
    }

    const userId = localStorage.getItem("id");
    const tokenData = localStorage.getItem("token");
    const token = tokenData ? JSON.parse(tokenData).token : null;

    if (!userId || !token) {
      throw new Error("User is not authenticated");
    }

    const actionBody: any = { action: update.action };

    if (update.action === "setFirstName") {
      actionBody.firstName = update.value;
    } else if (update.action === "setLastName") {
      actionBody.lastName = update.value;
    } else if (update.action === "changeEmail") {
      actionBody.email = update.value;
    } else if (update.action === "setDateOfBirth") {
      actionBody.dateOfBirth = update.value;
    }

    const response = await fetch(`${process.env.HOST}/${process.env.PROJECT_KEY}/customers/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: userProfile.version,
        actions: [actionBody],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to save user profile. Response:", errorText);
      throw new Error("Failed to save user profile");
    }

    return true;
  } catch (error) {
    console.error("Error saving user profile:", error);
    return false;
  }
}