export const EmailAttr: [string, string][] = [
  ["type", "text"],
  ["required", "required"],
  ["autocomplete", "off"],
  ["name", "email"],
  ["pattern", "[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$"],
];

export const formAttributes = [
  ["novalidate", "novalidate"],
  ["action", "#"],
];

export const passwordAttr: [string, string][] = [
  ["type", "password"],
  ["required", "required"],
  ["autocomplete", "off"],
  ["name", "password"],
  ["pattern", "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"],
];

export const showButtonAttributes: [string, string][] = [["type", "button"]];

export const buttonAttr = [["type", "submit"]];

export const createAccountButtonAttributes: [string, string][] = [["type", "button"]];

export type Token_type = "Bearer";

export type AccessTokenResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  refresh_token: string;
  token_type: Token_type;
};

type ErrorObject = {
  code: string;
  message: string;
};

export type AuthErrorResponse = {
  statusCode: number;
  message: string;
  errors: ErrorObject[];
  error: string;
  error_description?: string;
};

export type AccessToken = Pick<AccessTokenResponse, "access_token">;

export type TokenThroughPassword = AccessTokenResponse | Response | Error;

export type UserID = "user";

export type Customer = {
  customer: {
    id: string;
    version: number;
    versionModifiedAt: string;
    lastMessageSequenceNumber: number;
    createdAt: string;
    lastModifiedAt: string;
    lastModifiedBy: {
      isPlatformClient: true;
      user: {
        typeId: UserID;
        id: string;
      };
    };
    createdBy: {
      isPlatformClient: true;
    };
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    addresses: [
      {
        id: string;
        firstName: string;
        lastName: string;
        streetName: string;
        streetNumber: string;
        postalCode: string;
        city: string;
        country: string;
      },
    ];
    shippingAddressIds: [];
    billingAddressIds: [];
    isEmailVerified: true;
    key: string;
    stores: [];
    authenticationMode: string;
  };
};
