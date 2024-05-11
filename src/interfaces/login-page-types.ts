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
