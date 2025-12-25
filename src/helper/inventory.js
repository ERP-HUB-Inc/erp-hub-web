import _ from "lodash";
import SettingUtil from "@common/util";

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

  getVariantId(product) {
    let variantId = "";

    if (product && product.productVariants) {
      variantId = product.productVariants[0].id;
    }

    return variantId;
  }

  getVariantName(product) {
    let name = "";

    if (product && product.productVariants) {
      name = product.productVariants[0].name;
    }

    return name;
  }


  getUnitId(product) {
    let unitId = "";

    if (product && product.unitOfMeasurement) {
      unitId = product.unitOfMeasurement.id;
    }

    return unitId;
  }

  getUnitName(product) {
    let unitName = "";

    if (product && product.unitOfMeasurement) {
      unitName = product.unitOfMeasurement.name;
    }

    return unitName;
  }

  getItemBarcode(product) {
    return this.isValidProductVariant(product) ? product.productVariants[0].barcode : "";
  }

  getItemSku(product) {
    return this.isValidProductVariant(product) ? product.productVariants[0].sku : "";
  }

  getQuantityOnHand(record) {
    let quantity = 0;
    let isNotFilterByLocation = true;
    if (Array.isArray(record["productVariants"])) {
      record["productVariants"].forEach(productVariant => {
          if ("productLocations" in productVariant) {
            isNotFilterByLocation = false;
            quantity += this.getProductQTYLocation(productVariant["productLocations"]);
          }
      });

      if (isNotFilterByLocation) {
          quantity = this.getProductQTYLocation(record["productVariants"]);
      }
    }

    return quantity;
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
      quantity = _.sumBy(productLocations, "quantity") ?? 0;
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

export default new Util();
