import Product from "/RSS-ECOMM/src/interfaces/product"
export const ProductDetailsPage = async () => {

    const productId = document.location.href.split("product=").at(-1);

    localStorage.setItem("productId", "9f4eb6b5-2d60-4046-aeba-be9c466b4b7e");

    let productData;
    try{
        //const response = await fetch(`https://api.example.com/products/${productId}`);
        // productData = await response.json();
        productData = JSON.parse(localStorage.getItem("productData")) || { name: "PRODUCT", description: "DESCRIPTION", price: 100 };
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
    return document.createTextNode(productId)

}