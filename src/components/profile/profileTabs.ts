import { UserProfile, getUserProfile } from "../../interfaces/profile/profileRequests.ts";
import { saveUserProfile } from "../../interfaces/profile/profileRequests.ts";


export class ProfileTabs {
  tabContainer: HTMLElement;
  tabContentContainer: HTMLElement;

  constructor() {
    this.tabContainer = document.createElement("div");
    this.tabContainer.classList.add("tab-container");

    this.tabContentContainer = document.createElement("div");
    this.tabContentContainer.classList.add("tab-content-container");

    this.render();
  }

  async render() {
    const userProfile = await getUserProfile();

    if (userProfile) {
      this.createTabs(userProfile);
    } else {
      this.tabContentContainer.innerHTML = "<p>Error loading user profile.</p>";
    }
  }

  createTabs(userProfile: UserProfile) {
    const infoTab = this.createTab("Info", () => this.renderInfoTab(userProfile));
    const addressesTab = this.createTab("Addresses", () => this.renderAddressesTab(userProfile));

    this.tabContainer.append(infoTab, addressesTab);
    this.tabContentContainer.innerHTML = "";
    this.renderInfoTab(userProfile);
  }

  createTab(tabName: string, onClick: () => void): HTMLElement {
    const tab = document.createElement("button");
    tab.classList.add("tab");
    tab.innerText = tabName;
    tab.addEventListener("click", onClick);
    return tab;
  }

  renderInfoTab(userProfile: UserProfile) {
    this.tabContentContainer.innerHTML = `
      <div>
        ${this.createEditableField("First name", userProfile.firstName, "setFirstName", "firstName")}
        ${this.createEditableField("Last name", userProfile.lastName, "setLastName", "lastName")}
        ${this.createEditableField("Email", userProfile.email, "changeEmail", "email")}
        ${this.createEditableField("Date of Birth", userProfile.dateOfBirth, "setDateOfBirth", "dateOfBirth", "date")}
      </div>
    `;
    this.setupFieldEventHandlers();
  }

  createEditableField(label: string, value: string, action: string, fieldName: string, type: string = "text"): string {
    return `
      <div class="editable-field">
        <label>${label}: </label>
        <span class="field-value">${value}</span>
        <input type="${type}" class="field-input" style="display:none" value="${value}" data-action="${action}" data-field-name="${fieldName}" data-original-value="${value}">
        <button class="edit-button">Edit</button>
        <button class="save-button" style="display:none">Save</button>
      </div>
    `;
  }

  renderAddressesTab(userProfile: UserProfile) {
    const { addresses, billingAddressIds, shippingAddressIds, defaultShippingAddressId, defaultBillingAddressId } = userProfile;

    const billingAddresses = addresses.filter(address => billingAddressIds.includes(address.id));
    const shippingAddresses = addresses.filter(address => shippingAddressIds.includes(address.id));

    this.tabContentContainer.innerHTML = `
      <div class="addresses-section">
        <div class="address-column">
          <h3>Billing Addresses</h3>
          ${billingAddresses.map(address => this.renderAddress(address, defaultBillingAddressId)).join("")}
        </div>
        <div class="address-column">
          <h3>Shipping Addresses</h3>
          ${shippingAddresses.map(address => this.renderAddress(address, defaultShippingAddressId)).join("")}
        </div>
      </div>
    `;
  }

  renderAddress(address: any, defaultAddressId: string): string {
    return `
      <div class="address-item ${address.id === defaultAddressId ? "default-address" : ""}">
        <p>Street: ${address.streetName}</p>
        <p>City: ${address.city}</p>
        <p>Postal Code: ${address.postalCode}</p>
        <p>Country: ${address.country}</p>
        ${address.id === defaultAddressId ? "<p>(Default)</p>" : ""}
      </div>
    `;
  }

  enableEditMode(editButton: HTMLButtonElement, saveButton: HTMLButtonElement, fieldSpan: HTMLElement, fieldInput: HTMLInputElement) {
    editButton.style.display = "none";
    saveButton.style.display = "inline";
    fieldSpan.style.display = "none";
    fieldInput.style.display = "inline";
  }

  disableEditMode(editButton: HTMLButtonElement, saveButton: HTMLButtonElement, fieldSpan: HTMLElement, fieldInput: HTMLInputElement) {
    editButton.style.display = "inline";
    saveButton.style.display = "none";
    fieldSpan.style.display = "inline";
    fieldInput.style.display = "none";
  }

  async saveField(fieldInput: HTMLInputElement) {
    const action = fieldInput.dataset.action!;
    const fieldName = fieldInput.dataset.fieldName!;
    const newValue = fieldInput.value;

    const success = await saveUserProfile({ action, value: newValue });

    if (success) {
      fieldInput.dataset.originalValue = newValue;
      const fieldSpan = fieldInput.previousElementSibling as HTMLElement;
      fieldSpan.innerText = newValue;
    } else {
      alert("Failed to save the field");
      fieldInput.value = fieldInput.dataset.originalValue!;
    }
  }

  setupFieldEventHandlers() {
    const editableFields = this.tabContentContainer.querySelectorAll(".editable-field");

    editableFields.forEach(field => {
      const editButton = field.querySelector(".edit-button") as HTMLButtonElement;
      const saveButton = field.querySelector(".save-button") as HTMLButtonElement;
      const fieldSpan = field.querySelector(".field-value") as HTMLElement;
      const fieldInput = field.querySelector(".field-input") as HTMLInputElement;

      editButton.addEventListener("click", () => this.enableEditMode(editButton, saveButton, fieldSpan, fieldInput));
      saveButton.addEventListener("click", () => {
        this.saveField(fieldInput);
        this.disableEditMode(editButton, saveButton, fieldSpan, fieldInput);
      });
    });
  }

  getHtml() {
    const container = document.createElement("div");
    container.append(this.tabContainer, this.tabContentContainer);
    return container;
  }
}

export const profileTabs = new ProfileTabs();