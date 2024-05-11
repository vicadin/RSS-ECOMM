export function createElement(tag: string, classNames: string, text?: string): HTMLElement {
  const newElem = document.createElement(tag);
  newElem.className = classNames;
  if (text) {
    newElem.textContent = text;
  }
  return newElem;
}

export function setAttributes(attributes: [string, string][], htmlElement: HTMLElement) {
  const that = htmlElement;
  attributes.forEach((attr) => {
    const [key, value] = attr;
    that.setAttribute(key, value);
  });
}

export function createInput(classNames: string, attributes: [string, string][]): HTMLInputElement {
  const newInput = document.createElement("input");
  newInput.className = classNames;
  setAttributes(attributes, newInput);
  return newInput;
}

export function createForm(classNames: string, attributes: [string, string][]): HTMLFormElement {
  const newForm = document.createElement("form");
  newForm.className = classNames;
  setAttributes(attributes, newForm);
  return newForm;
}
