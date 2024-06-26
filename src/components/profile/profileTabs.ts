import {
  UserProfile,
  getUserProfile,
  saveUserProfile,
  addAddress,
  updateAddress,
  changePassword,
  Address,
  AddressUpdateParams,
} from "../../interfaces/profile/profileRequests.ts";

import countries from "../../interfaces/registration/countriesList.ts";
import "./profileTabs.css";
import {
  validateStreet,
  validateCity,
  validatePostalCode,
  validateDateOfBirth,
  validateName,
  validateEmail,
  validatePassword,
} from "../../interfaces/registration/registartionFormUtils.ts";

import {
  fetchAuthenticateCustomer,
  fetchGetAccessTokenThroughPassword,
} from "../../interfaces/login-page-requests.ts";
import { AccessTokenResponse, Customer } from "../../interfaces/login-page-types.ts";

export class ProfileTabs {
  tabContainer: HTMLElement;

  tabContentContainer: HTMLElement;

  userProfile: UserProfile | null = null;

  version: number;

  private successMessage: HTMLElement;

  private overlay: HTMLElement;

  constructor() {
    this.tabContainer = document.createElement("div");
    this.tabContainer.classList.add("tab-container");

    this.tabContentContainer = document.createElement("div");
    this.tabContentContainer.classList.add("tab-content-container");

    this.overlay = document.createElement("div");
    this.overlay.classList.add("overlay");
    this.successMessage = document.createElement("div");
    this.successMessage.innerHTML = "Registration was successful!";
    this.successMessage.classList.add("alert");

    this.render();
  }

  async render() {
    const userId = localStorage.getItem("id");
    const tokenData = localStorage.getItem("token");
    const token = tokenData ? JSON.parse(tokenData).token : null;

    if (userId || token) {
      this.userProfile = await getUserProfile();
      if (this.userProfile) {
        this.createTabs();
      }
    }
  }

  createTabs() {
    const infoTab = ProfileTabs.createTab("Info", () => this.renderInfoTab());
    const addressesTab = ProfileTabs.createTab("Addresses", () => this.renderAddressesTab());

    this.tabContainer.append(infoTab, addressesTab);
    this.tabContentContainer.innerHTML = "";
    this.renderInfoTab();
  }

  static createTab(tabName: string, onClick: () => void): HTMLElement {
    const tab = document.createElement("button");
    tab.classList.add("tab");
    tab.innerText = tabName;
    tab.addEventListener("click", onClick);
    return tab;
  }

  async renderInfoTab() {
    const userId = localStorage.getItem("id");
    const tokenData = localStorage.getItem("token");
    const token = tokenData ? JSON.parse(tokenData).token : null;

    if (userId || token) {
      this.userProfile = await getUserProfile();
    }
    if (!this.userProfile) return;
    this.tabContentContainer.innerHTML = `
      <div>
        ${ProfileTabs.createEditableField("First name", this.userProfile.firstName, "setFirstName", "firstName")}
        ${ProfileTabs.createEditableField("Last name", this.userProfile.lastName, "setLastName", "lastName")}
        ${ProfileTabs.createEditableField("Email", this.userProfile.email, "changeEmail", "email")}
        ${ProfileTabs.createEditableField("Date of Birth", this.userProfile.dateOfBirth, "setDateOfBirth", "dateOfBirth", "date")}
        <button class="submit-button" id="change-password-btn">Change password</button>
      </div>
    `;
    const changePasswordBtn = this.tabContentContainer.querySelector(
      "#change-password-btn",
    ) as HTMLButtonElement;
    changePasswordBtn.addEventListener("click", () => this.showChangePasswordModal());
    this.setupFieldEventHandlers();
  }

  static createEditableField(
    label: string,
    value: string,
    action: string,
    fieldName: string,
    type: string = "text",
  ): string {
    return `
      <div class="editable-field">
        <label>${label}: </label>
        <span class="field-value">${value}</span>
        <input type="${type}" class="field-input" style="display:none" value="${value}" data-action="${action}" data-field-name="${fieldName}" data-original-value="${value}">
        <span class="error-message" style="color: red; display: none;"></span>
        <button class="btn-edit"><img src="../assets/icons/edit.png"></button>
        <button class="btn-save" style="display:none"><img src="../assets/icons/check.png"></button>
      </div>
    `;
  }

  showChangePasswordModal() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2>Change password</h2>
        <div class="input-container">
          <label for="current-password">Current password</label>
          <input type="password" id="current-password" name="currentPassword" class="field-input">
          <span class="error-message" style="color: red; display: none;"></span>
        </div>
        <div class="input-container">
          <label for="new-password">New password</label>
          <input type="password" id="new-password" name="newPassword" class="field-input">
          <span class="error-message" style="color: red; display: none;"></span>
        </div>
        <div class="input-container">
          <label for="confirm-new-password">Confirm new password</label>
          <input type="password" id="confirm-new-password" name="confirmNewPassword" class="field-input">
          <span class="error-message" style="color: red; display: none;"></span>
        </div>
        <button class="submit-button">Save</button>
      </div>
    `;

    document.body.appendChild(modal);

    const closeButton = modal.querySelector(".close-button") as HTMLSpanElement;
    const submitButton = modal.querySelector(".submit-button") as HTMLButtonElement;

    closeButton.addEventListener("click", () => document.body.removeChild(modal));

    const formInputs = modal.querySelectorAll(".field-input");
    formInputs.forEach((input) => {
      input.addEventListener("focusin", () => {
        const label = input.previousElementSibling as HTMLLabelElement;
        label.classList.add("label_moved");
      });
      input.addEventListener("focusout", () => {
        if ((input as HTMLInputElement).value === "") {
          const label = input.previousElementSibling as HTMLLabelElement;
          label.classList.remove("label_moved");
        }
      });
    });

    submitButton.addEventListener("click", async () => {
      const currentPasswordInput = modal.querySelector("#current-password") as HTMLInputElement;
      const newPasswordInput = modal.querySelector("#new-password") as HTMLInputElement;
      const confirmNewPasswordInput = modal.querySelector(
        "#confirm-new-password",
      ) as HTMLInputElement;

      const currentPassword = currentPasswordInput.value;
      const newPassword = newPasswordInput.value;
      const confirmNewPassword = confirmNewPasswordInput.value;

      let errorMessage = null;
      if (newPassword !== confirmNewPassword) {
        errorMessage = "The new password and the new password confirmation do not match.";
        ProfileTabs.displayFieldError(confirmNewPasswordInput, errorMessage);
        return;
      }

      errorMessage = validatePassword(newPassword);
      if (errorMessage) {
        ProfileTabs.displayFieldError(newPasswordInput, errorMessage);
        return;
      }

      const id = localStorage.getItem("id");
      if (id) {
        const result = await changePassword({
          currentPassword,
          newPassword,
        });

        if (result.success) {
          document.body.removeChild(modal);
          const profileSection = document.querySelector(".profile-section");
          if (profileSection) {
            profileSection.appendChild(this.overlay);
            this.overlay.classList.add("show");
            profileSection.appendChild(this.successMessage);
            setTimeout(() => {
              profileSection.removeChild(this.overlay);
              this.overlay.classList.remove("show");
              profileSection.removeChild(this.successMessage);
            }, 500);
          }

          if (this.userProfile) {
            const responseFetchGetAccessTokenThroughPassword = fetchGetAccessTokenThroughPassword(
              this.userProfile.email,
              newPassword,
            );

            responseFetchGetAccessTokenThroughPassword.then(
              (resultFetchGetAccessTokenThroughPassword) => {
                let authToken: string;
                if (
                  (resultFetchGetAccessTokenThroughPassword as AccessTokenResponse).token_type ===
                  "Bearer"
                ) {
                  authToken = (resultFetchGetAccessTokenThroughPassword as AccessTokenResponse)
                    .access_token;
                  if (authToken && this.userProfile) {
                    fetchAuthenticateCustomer(authToken, this.userProfile.email, newPassword).then(
                      (resfetchAuthenticateCustomer) => {
                        const { id: customerId } = (resfetchAuthenticateCustomer as Customer)
                          .customer;
                        localStorage.setItem("id", customerId);
                        localStorage.setItem("token", JSON.stringify({ token: authToken }));
                        window.location.hash = "#home";
                      },
                    );
                  }
                }
              },
            );
          }
        } else {
          ProfileTabs.displayFieldError(currentPasswordInput, result.message);
        }
      }
    });
  }

  renderAddressesTab() {
    if (!this.userProfile) return;

    const {
      addresses,
      billingAddressIds,
      shippingAddressIds,
      defaultShippingAddressId,
      defaultBillingAddressId,
    } = this.userProfile;

    const billingAddresses = addresses.filter((address) => billingAddressIds.includes(address.id));
    const shippingAddresses = addresses.filter((address) =>
      shippingAddressIds.includes(address.id),
    );

    this.tabContentContainer.innerHTML = `
      <div class="addresses-section">
        <div class="address-column">
          <h3>Billing Addresses</h3>
          ${billingAddresses.map((address) => ProfileTabs.renderAddress(address, defaultBillingAddressId, "billing")).join("")}
          <button class="add-new-address-btn" data-address-type="billing"><img src="../assets/icons/add.png">Add New Billing Address</button>
        </div>
        <div class="address-column">
          <h3>Shipping Addresses</h3>
          ${shippingAddresses.map((address) => ProfileTabs.renderAddress(address, defaultShippingAddressId, "shipping")).join("")}
          <button class="add-new-address-btn" data-address-type="shipping"><img src="../assets/icons/add.png">Add New Shipping Address</button>
        </div>
      </div>
    `;

    this.setupAddressEventHandlers();
  }

  static renderAddress(
    address: Address,
    defaultAddressId: string,
    addressType: "billing" | "shipping",
  ): string {
    let defaultButton = "";

    if (address.id !== defaultAddressId) {
      if (addressType === "billing") {
        defaultButton =
          '<button class="set-default-address-btn" data-address-type="billing">Set as Default Billing</button>';
      } else {
        defaultButton =
          '<button class="set-default-address-btn" data-address-type="shipping">Set as Default Shipping</button>';
      }
    }
    return `
      <div class="address-item ${address.id === defaultAddressId ? "default-address" : ""}" data-address-id="${address.id}">
        <div>
          <label>Street: </label>
          <span class="field-value">${address.streetName}</span>
          <input type="text" class="field-input" style="display:none" value="${address.streetName}" data-field-name="streetName">
          <span class="error-message" style="color: red; display: none;"></span>
        </div>
        <div>
          <label>City: </label>
          <span class="field-value">${address.city}</span>
          <input type="text" class="field-input" style="display:none" value="${address.city}" data-field-name="city">
          <span class="error-message" style="color: red; display: none;"></span>
        </div>
        <div>
          <label>Postal Code: </label>
          <span class="field-value">${address.postalCode}</span>
          <input type="text" class="field-input" style="display:none" value="${address.postalCode}" data-field-name="postalCode">
          <span class="error-message" style="color: red; display: none;"></span>
        </div>
        <div>
          <label>Country: </label>
          <span class="field-value">${address.country}</span>
          <select class="field-input" style="display:none" data-field-name="country">
            ${ProfileTabs.renderCountryOptions(address.country)}
          </select>
        </div>
        ${address.id === defaultAddressId ? `<p class="badge">Default</p>` : ""}
        <div class="buttons-row">
          <button class="edit-address-btn"><img src="../assets/icons/edit.png"></button>
          <button class="save-address-btn" style="display:none"><img src="../assets/icons/check.png"></button>
          <button class="delete-address-btn"><img src="../assets/icons/delete.png"></button>
          ${defaultButton}

        </div>
        </div>
    `;
  }

  static renderCountryOptions(selectedCountry: string): string {
    return Object.entries(countries)
      .map(
        ([code, name]) =>
          `<option value="${code}" ${selectedCountry === code ? "selected" : ""}>${name}</option>`,
      )
      .join("");
  }

  static enableEditMode(
    editButton: HTMLButtonElement,
    saveButton: HTMLButtonElement,
    fieldSpans: NodeListOf<HTMLElement>,
    fieldInputs: NodeListOf<HTMLInputElement | HTMLSelectElement>,
  ) {
    const editBtn = editButton;
    const saveBtn = saveButton;

    editBtn.style.display = "none";
    saveBtn.style.display = "inline";
    fieldSpans.forEach((span) => {
      const tempSpan = span;
      tempSpan.style.display = "none";
    });
    fieldInputs.forEach((input) => {
      const tempInput = input;
      tempInput.style.display = "inline";
    });
  }

  static disableEditMode(
    editButton: HTMLButtonElement,
    saveButton: HTMLButtonElement,
    fieldSpans: NodeListOf<HTMLElement>,
    fieldInputs: NodeListOf<HTMLInputElement | HTMLSelectElement>,
  ) {
    const editBtn = editButton;
    const saveBtn = saveButton;

    editBtn.style.display = "inline";
    saveBtn.style.display = "none";
    fieldSpans.forEach((span) => {
      const tempSpan = span;
      tempSpan.style.display = "inline";
    });
    fieldInputs.forEach((input) => {
      const tempInput = input;
      tempInput.style.display = "none";
    });
  }

  static async saveField(fieldInput: HTMLInputElement) {
    const action = fieldInput.dataset.action!;
    const fieldName = fieldInput.dataset.fieldName!;
    const newValue = fieldInput.value;

    let errorMessage = null;
    switch (fieldName) {
      case "firstName":
      case "lastName":
        errorMessage = validateName(newValue);
        break;
      case "email":
        errorMessage = validateEmail(newValue);
        break;
      case "dateOfBirth":
        errorMessage = validateDateOfBirth(newValue);
        break;
      default:
        break;
    }

    if (errorMessage) {
      ProfileTabs.displayFieldError(fieldInput, errorMessage);
      return;
    }
    ProfileTabs.clearFieldError(fieldInput);

    const success = await saveUserProfile({ action, value: newValue });

    if (success) {
      /* eslint no-param-reassign: "error" */
      fieldInput.dataset.originalValue = newValue;
      const fieldSpan = fieldInput.previousElementSibling as HTMLElement;
      fieldSpan.innerText = newValue;
    } else {
      alert("Failed to save the field");
      fieldInput.value = fieldInput.dataset.originalValue!;
    }
  }

  static displayFieldError(fieldInput: HTMLInputElement | HTMLSelectElement, errorMessage: string) {
    const errorElement = fieldInput.nextElementSibling as HTMLElement;
    errorElement.innerText = errorMessage;
    errorElement.style.display = "block";
  }

  static clearFieldError(fieldInput: HTMLInputElement | HTMLSelectElement) {
    const errorElement = fieldInput.nextElementSibling as HTMLElement;
    errorElement.innerText = "";
    errorElement.style.display = "none";
  }

  async saveAddress(addressElement: Element) {
    const addressId = addressElement.getAttribute("data-address-id")!;
    const fieldInputs = addressElement.querySelectorAll(".field-input") as NodeListOf<
      HTMLInputElement | HTMLSelectElement
    >;
    const updatedAddress: AddressUpdateParams = {};
    let hasValidationError = false;
    fieldInputs.forEach((input) => {
      const fieldName = input.getAttribute("data-field-name")!;
      updatedAddress[fieldName] = input.value;

      let errorMessage = null;
      switch (fieldName) {
        case "streetName":
          errorMessage = validateStreet(input.value);
          break;
        case "city":
          errorMessage = validateCity(input.value);
          break;
        case "postalCode":
          errorMessage = validatePostalCode(input.value);
          break;
        default:
          errorMessage = "";
      }
      const errorElement = input.nextElementSibling as HTMLElement;

      if (errorMessage) {
        if (errorElement) {
          errorElement.innerText = errorMessage;
          errorElement.style.display = "block";
        }
        hasValidationError = true;
      } else if (errorElement) {
        errorElement.style.display = "none";
        updatedAddress[fieldName] = input.value;
      }
    });
    if (hasValidationError) {
      return;
    }
    const success = await updateAddress({
      action: "changeAddress",
      addressId,
      address: updatedAddress,
    });

    if (success) {
      this.updateAddressInMemory(addressId, updatedAddress);
      this.renderAddressesTab();
    } else {
      alert("Failed to save the address");
      fieldInputs.forEach((input) => {
        const tempInput = input;
        tempInput.value = tempInput.dataset.originalValue!;
      });
    }
  }

  async deleteAddress(addressId: string) {
    const success = await updateAddress({ action: "removeAddress", addressId });

    if (success) {
      this.removeAddressFromMemory(addressId);
      this.renderAddressesTab();
    } else {
      alert("Failed to delete the address");
    }
  }

  async setDefaultAddress(addressId: string, addressType: "billing" | "shipping") {
    const action =
      addressType === "billing" ? "setDefaultBillingAddress" : "setDefaultShippingAddress";
    const success = await updateAddress({ action, addressId });

    if (success) {
      if (addressType === "billing") {
        this.userProfile!.defaultBillingAddressId = addressId;
      } else {
        this.userProfile!.defaultShippingAddressId = addressId;
      }
      this.renderAddressesTab();
    } else {
      alert("Failed to set default address");
    }
  }

  removeAddressFromMemory(addressId: string) {
    if (this.userProfile) {
      this.userProfile.addresses = this.userProfile.addresses.filter(
        (address) => address.id !== addressId,
      );
      this.userProfile.billingAddressIds = this.userProfile.billingAddressIds.filter(
        (id) => id !== addressId,
      );
      this.userProfile.shippingAddressIds = this.userProfile.shippingAddressIds.filter(
        (id) => id !== addressId,
      );
    }
  }

  updateAddressInMemory(addressId: string, updatedAddress: AddressUpdateParams) {
    if (this.userProfile) {
      const addressIndex = this.userProfile.addresses.findIndex(
        (address) => address.id === addressId,
      );
      if (addressIndex !== -1) {
        this.userProfile.addresses[addressIndex] = {
          ...this.userProfile.addresses[addressIndex],
          ...updatedAddress,
        };
      }
    }
  }

  setupFieldEventHandlers() {
    const editableFields = this.tabContentContainer.querySelectorAll(".editable-field");

    editableFields.forEach((field) => {
      const editButton = field.querySelector(".btn-edit") as HTMLButtonElement;
      const saveButton = field.querySelector(".btn-save") as HTMLButtonElement;

      const fieldSpans = field.querySelectorAll(".field-value") as NodeListOf<HTMLElement>;

      const fieldInputs = field.querySelectorAll(".field-input") as NodeListOf<HTMLInputElement>;

      editButton.addEventListener("click", () =>
        ProfileTabs.enableEditMode(editButton, saveButton, fieldSpans, fieldInputs),
      );
      saveButton.addEventListener("click", () => {
        fieldInputs.forEach((input) => {
          ProfileTabs.saveField(input as HTMLInputElement);
        });
        ProfileTabs.disableEditMode(editButton, saveButton, fieldSpans, fieldInputs);
      });
    });
  }

  setupAddressEventHandlers() {
    const addressItems = this.tabContentContainer.querySelectorAll(".address-item");

    addressItems.forEach((addressItem) => {
      const editButton = addressItem.querySelector(".edit-address-btn") as HTMLButtonElement;
      const saveButton = addressItem.querySelector(".save-address-btn") as HTMLButtonElement;
      const deleteButton = addressItem.querySelector(".delete-address-btn") as HTMLButtonElement;
      const setDefaultButtons = addressItem.querySelectorAll(
        ".set-default-address-btn",
      ) as NodeListOf<HTMLButtonElement>;
      const fieldSpans = addressItem.querySelectorAll(".field-value") as NodeListOf<HTMLElement>;

      const fieldInputs = addressItem.querySelectorAll(".field-input") as NodeListOf<
        HTMLInputElement | HTMLSelectElement
      >;

      editButton.addEventListener("click", () =>
        ProfileTabs.enableEditMode(editButton, saveButton, fieldSpans, fieldInputs),
      );
      saveButton.addEventListener("click", () => {
        this.saveAddress(addressItem);
        ProfileTabs.disableEditMode(editButton, saveButton, fieldSpans, fieldInputs);
      });
      deleteButton.addEventListener("click", () =>
        this.deleteAddress(addressItem.getAttribute("data-address-id")!),
      );
      setDefaultButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const addressType = button.getAttribute("data-address-type") as "billing" | "shipping";
          this.setDefaultAddress(addressItem.getAttribute("data-address-id")!, addressType);
        });
      });
    });

    const addNewAddressButtons = this.tabContentContainer.querySelectorAll(
      ".add-new-address-btn",
    ) as NodeListOf<HTMLButtonElement>;
    addNewAddressButtons.forEach((button) => {
      button.addEventListener("click", () =>
        this.showAddAddressModal(
          button.getAttribute("data-address-type") as "billing" | "shipping",
        ),
      );
    });
  }

  showAddAddressModal(addressType: "billing" | "shipping") {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2>Add New ${addressType.charAt(0).toUpperCase() + addressType.slice(1)} Address</h2>
        <div class="input-container">
          <label for="street">Street:</label>
          <input type="text" id="street" name="street" class="field-input" data-field-name="streetName">
          <span class="error-message" style="color: red; display: none;"></span>
        </div>
        <div class="input-container">
          <label for="city">City:</label>
          <input type="text" id="city" name="city" class="field-input" data-field-name="city">
          <span class="error-message" style="color: red; display: none;"></span>
        </div>
        <div class="input-container">
          <label for="postalCode">Postal Code:</label>
          <input type="text" id="postalCode" name="postalCode" class="field-input" data-field-name="postalCode">
          <span class="error-message" style="color: red; display: none;"></span>
        </div>
        <div class="form-group">
          <label for="country">Country:</label>
          <select id="country" name="country" class="field-input" data-field-name="country">
            ${ProfileTabs.renderCountryOptions("")}
          </select>
          <span class="error-message" style="color: red; display: none;"></span>
        </div>
        <button class="submit-button">Create</button>
      </div>
    `;

    document.body.appendChild(modal);

    const closeButton = modal.querySelector(".close-button") as HTMLSpanElement;
    const submitButton = modal.querySelector(".submit-button") as HTMLButtonElement;

    const formInputs = modal.querySelectorAll(".field-input");
    formInputs.forEach((input) => {
      input.addEventListener("focusin", () => {
        const label = input.previousElementSibling as HTMLLabelElement;
        label.classList.add("label_moved");
      });
      input.addEventListener("focusout", () => {
        if (input.value === "") {
          const label = input.previousElementSibling as HTMLLabelElement;
          label.classList.remove("label_moved");
        }
      });
    });

    closeButton.addEventListener("click", () => document.body.removeChild(modal));
    submitButton.addEventListener("click", async () => {
      const fieldInputs = modal.querySelectorAll(".field-input") as NodeListOf<
        HTMLInputElement | HTMLSelectElement
      >;
      const newAddress: Address = {};
      let hasValidationError = false;

      fieldInputs.forEach((input) => {
        const fieldName = input.getAttribute("data-field-name")!;
        const { value } = input;

        let errorMessage = null;
        switch (fieldName) {
          case "streetName":
            errorMessage = validateStreet(value);
            break;
          case "city":
            errorMessage = validateCity(value);
            break;
          case "postalCode":
            errorMessage = validatePostalCode(value);
            break;
          default:
            errorMessage = "";
        }

        const errorElement = input.nextElementSibling as HTMLElement;

        if (errorMessage) {
          if (errorElement) {
            errorElement.innerText = errorMessage;
            errorElement.style.display = "block";
          }
          hasValidationError = true;
        } else if (errorElement) {
          errorElement.style.display = "none";
          newAddress[fieldName] = value;
        }
      });

      if (hasValidationError) {
        return;
      }

      const success = await this.addNewAddress(newAddress, addressType);

      if (success) {
        document.body.removeChild(modal);
      } else {
        alert("Failed to add new address.");
      }
    });
  }

  async addNewAddress(address: Address, addressType: "billing" | "shipping"): Promise<boolean> {
    const success = await addAddress({ action: "addAddress", address });

    if (success) {
      const userProfile = await getUserProfile();
      if (userProfile) {
        this.userProfile = userProfile;
        const newAddressId = userProfile.addresses[userProfile.addresses.length - 1].id;

        const linkSuccess = await updateAddress({
          action: addressType === "billing" ? "addBillingAddressId" : "addShippingAddressId",
          addressId: newAddressId,
        });

        if (linkSuccess) {
          this.userProfile[
            addressType === "billing" ? "billingAddressIds" : "shippingAddressIds"
          ].push(newAddressId);
          this.renderAddressesTab();
          return true;
        }

        alert("Failed to link new address");
        return false;
      }
    } else {
      alert("Failed to add new address");
      return false;
    }

    return false;
  }

  getHtml() {
    const container = document.createElement("div");
    container.append(this.tabContainer, this.tabContentContainer);
    return container;
  }
}

export const profileTabs = new ProfileTabs();
