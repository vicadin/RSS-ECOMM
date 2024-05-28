export const ProductDetailsPage = async () => {

    const productId = document.location.href.split("product=").at(-1)
    const productData = await fetch(productId)
    return document.createTextNode(productId)
    
}