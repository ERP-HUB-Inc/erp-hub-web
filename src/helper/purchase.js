import _ from "lodash";
import SettingUtil from "../app/modules/common/util";

class Purchase {
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

  getProductNameV2(product) {
    const currentLanguageCode = (new SettingUtil()).getCurrentLanguageCode();
    if (currentLanguageCode === "en") {
      return `${product.name ? product.name : ""}${product.namekm ? (product.name ? " / " : "") + product.namekm : ""}`;
    } else if (currentLanguageCode === "km") {
      return `${product.namekm ? product.namekm : ""}${product.name ? (product.namekm ? " / " : "") + product.name : ""}`;
    }
    
  }

  getStatus(product) {
    if (product === null)
      return "";

    if (!("productDescriptions" in product))
      return "";

    if (product.productDescriptions.length > 0) {
      return product.productDescriptions[0].status;
    } else {
      return "";
    }
  }

  getProductId(product) {
    let productId = "";

    if (product && product.productVariants) {
      productId = product.productVariants.id;
    }

    return productId;
  }

  getProductVariantId(product) {
    let productVariantId = "";

    if (product && product.productVariants) {
      productVariantId = product.productVariants[0].id;
    }

    return productVariantId;
  }

  getProductBarcode(product) {
    return this.isValidProductVariant(product) ? product.productVariants[0].barcode : "";
  }

  getProductSku(product) {
    return this.isValidProductVariant(product) ? product.productVariants[0].sku : "";
  }

  getProductPrice(product) {
    return this.isValidProductVariant(product) ? product.productVariants[0].price : 0;
  }

  getProductWholeSalePrice(product) {
    return this.isValidProductVariant(product) && product.productVariants[0].wholePrice ? product.productVariants[0].wholePrice : 0;
  }

  getProductDistributePrice(product) {
    return this.isValidProductVariant(product) && product.productVariants[0].distributePrice ? product.productVariants[0].distributePrice : 0;
  }

  getProductCost(product) {
    return this.isValidProductVariant(product) ? product.productVariants[0].cost : 0;
  }

  getProductBrand(product, emptyVaue = "") {
    if (!product) return emptyVaue;
    
    if (product.brand) {
      return product.brand.name;
    }

    return emptyVaue;
  }

  getProductAttributeName(productAttribute) {
    let name = "";
    
    if (productAttribute && productAttribute.attribute) {
      name = productAttribute.attribute.name;
    }

    return name;
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

  getProductTypeName(productType) {
    const currentLanguageCode = (new SettingUtil()).getCurrentLanguageCode();
    return productType[`name${currentLanguageCode === "en" ? "" : currentLanguageCode}`];;
  }

  countProductQTYCurrentLocation(product, currentLocationId) {
    let quantity = 0;
    if (this.isValidProductVariant(product)) {
      product.productVariants.forEach(productVariant => {
        if (productVariant && Array.isArray(productVariant.productLocations)) {
          productVariant.productLocations.forEach(productLocation => {
            if (productLocation.locationId === currentLocationId) {
              quantity += productLocation.quantity;
            }
          });
        }
      });
    }
    return quantity;
  }

  countProductQTYOtherLocation(product, currentLocationId) {
    let quantity = 0;
    if (this.isValidProductVariant(product)) {
      product.productVariants.forEach(productVariant => {
        if (productVariant && Array.isArray(productVariant.productLocations)) {
          productVariant.productLocations.forEach(productLocation => {
            if (productLocation.locationId !== currentLocationId) {
              quantity += productLocation.quantity;
            }
          });
        }
      });
    }
    return quantity;
  }

  isValidProductVariant(product) {
    return product && Array.isArray(product.productVariants) && product.productVariants.length > 0;
  }

  isOutOfStandardProductStock(product) {
    if (!product || (product.productVariants[0] && product.productVariants[0].productLocations.length === 0)) {
      return true;
    }

    if (product.productVariants[0].quantity <= 0 || product.productVariants[0].productLocations[0].quantity <= 0) {
      return true;
    }
  }
}

export default new Purchase();
