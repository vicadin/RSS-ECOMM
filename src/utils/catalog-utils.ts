import { NavObj } from "../interfaces/header-types.ts";
import { fetchGetTypes } from "../pages/catalog/catalog-requests.ts";

export async function fillCategoriesNames(): Promise<string[] | []> {
  const tempArray = [];
  const names = [];
  const jsonAnswer = await fetchGetTypes();
  if (typeof jsonAnswer !== "boolean") {
    jsonAnswer.results.forEach((item) => {
      tempArray.push(item);
    });
  }
  tempArray.forEach((categoryObject) => {
    names.push(categoryObject.name);
  });
  return names;
}

export const asideProps: NavObj = {
  navName: "asideNav",
  navClassNames: "aside-nav",
  ulName: "asideNavList",
  ulClassNames: "aside-nav_list",
  items: [],
};

export const products = {
  array: [],
};

export function setAsidePropsItems(array: string[]) {
  if (array.length) {
    asideProps.items = array;
  }
}

export function setProductsArray(array) {
  if (array.results) {
    products.array = array.results;
  }
}

export function getLocale(props) {
  let locale;
  const userLanguages = window.navigator.languages;
  const appLanguages = Object.keys(props.masterData.current.name);

  if (appLanguages.length === 1) {
    locale = appLanguages.toString();
  } else {
    const languagesSet = new Set(appLanguages.concat(userLanguages));

    if (languagesSet.size === appLanguages.length + userLanguages.length) {
      locale = languagesSet.has("en-US") ? "en-US" : Array.from(languagesSet)[0];
    } else if (appLanguages.length + userLanguages.length - languagesSet.size === 1) {
      appLanguages.forEach((item) => {
        if (languagesSet.has(item)) {
          locale = item;
        }
        return locale;
      });
    } else {
      [locale] = Array.from(languagesSet);
    }
  }
  return locale;
}

export function getPriceBlockByLocale(props, locale) {
  const productPrices = props.masterData.current.masterVariant.prices;
  const priceBlock = productPrices.find((item) => item.country === `${locale.split("-")[1]}`);
  return priceBlock;
}

function setCurrency(priceBlock, number) {
  if (number === 0) {
    return "";
  }
  const currencyCode = priceBlock.value.currencyCode === "EUR" ? "€" : "$";
  const { fractionDigits } = priceBlock.value;
  const numberFixed = number / 10 ** fractionDigits;
  return currencyCode + numberFixed;
}

export function setFinalPrice(props, locale: string) {
  const priceBlock = getPriceBlockByLocale(props, locale);
  const finalPriceNumber = priceBlock.discounted?.value?.centAmount ?? priceBlock.value.centAmount;
  return setCurrency(priceBlock, finalPriceNumber);
}

export function setBeforeDiscountPrice(props, locale: string) {
  const priceBlock = getPriceBlockByLocale(props, locale);
  const BeforeDiscountPriceNumber = priceBlock.discounted?.value?.centAmount
    ? priceBlock.value.centAmount
    : 0;
  return setCurrency(priceBlock, BeforeDiscountPriceNumber);
}

// [2][`${locale.split("-")[1]}`]?.discounted?.value?.centAmount ?? props.masterData.current.masterVariant.prices[2].value.centAmount;
// this.finalPrice.textContent =
