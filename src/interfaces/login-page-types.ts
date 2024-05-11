const EmailAttr: [string, string][] = [
  ["type", "text"],
  ["required", "required"],
  ["autocomplete", "off"],
  ["pattern", "[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$"],
];
export default EmailAttr;

export const formAttributes = [["novalidate", "novalidate"]];
