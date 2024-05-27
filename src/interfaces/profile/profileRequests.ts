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

  interface UpdateAddress {
    action: string;
    addressId: string;
    address?: Address;
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
  
  export async function addAddress(update: UpdateAddress): Promise<boolean> {
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
  
      const actionBody: any = { action: update.action, address: update.address };
  
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
        console.error("Failed to add address. Response:", errorText);
        throw new Error("Failed to add address");
      }
  
      return true;
    } catch (error) {
      console.error("Error adding address:", error);
      return false;
    }
  }
  
  export async function updateAddress(update: UpdateAddress): Promise<boolean> {
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
  
      if (update.action === "changeAddress") {
        actionBody.addressId = update.addressId;
        actionBody.address = update.address;
      } else {
        actionBody.addressId = update.addressId;
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
        console.error("Failed to update address. Response:", errorText);
        throw new Error("Failed to update address");
      }
  
      return true;
    } catch (error) {
      console.error("Error updating address:", error);
      return false;
    }
  }
  
  export async function setDefaultAddress(update: UpdateAddress): Promise<boolean> {
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
  
      const actionBody: any = { action: update.action, addressId: update.addressId };
  
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
        console.error("Failed to set default address. Response:", errorText);
        throw new Error("Failed to set default address");
      }
  
      return true;
    } catch (error) {
      console.error("Error setting default address:", error);
      return false;
    }
  }
  
  export async function deleteAddress(update: UpdateAddress): Promise<boolean> {
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
  
      const actionBody: any = { action: update.action, addressId: update.addressId };
  
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
        console.error("Failed to delete address. Response:", errorText);
        throw new Error("Failed to delete address");
      }
  
      return true;
    } catch (error) {
      console.error("Error deleting address:", error);
      return false;
    }
  }