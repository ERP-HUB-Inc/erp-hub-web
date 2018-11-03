import _ from "lodash";
class Util {
  getProductName(product) {
    if (product === null)
      return "";

    if (!("productDescriptions" in product))
      return "";

    if (product.productDescriptions.length > 0) {
      return product.productDescriptions[0].name;
    } else {
      return "";
    }
  }

  getProductBrand(product, emptyVaue = "") {
    if (!product) return emptyVaue;
    
    if (product.brand) {
      return product.brand.name;
    }

    return emptyVaue;
  }

  getProductQTYLocation(productLocations) {
    let quantity = 0;

    if (Array.isArray(productLocations)) {
      quantity = _.sumBy(productLocations, "quantity");
    }

    return quantity;
  }

  getProductTypeDescription(productTypeDescriptions, key ="name") {
    if (productTypeDescriptions === null && !Array.isArray(productTypeDescriptions))
      return "";

    if (productTypeDescriptions.length > 0) {
      return productTypeDescriptions[0][key];
    } else {
      return "";
    }
  }


}

export default new Util();
