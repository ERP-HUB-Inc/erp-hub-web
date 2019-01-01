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

  getProductId(product) {
    let productId = "";

    if (product && product.productVariants) {
      productId = product.productVariants.id;
    }

    return productId;
  }

  getProductBarcode(product) {
    return product && product.productVariants.length > 0 ? product.productVariants[0].barcode : "";
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

  countProductQTYCurrentLocation(product, currentLocationId) {
    let quantity = 0;
    if (product.productVariants && Array.isArray(product.productVariants)) {
      product.productVariants.forEach(productVariant => { console.log("ProductVariant:", product.productVariants);
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
    if (product.productVariants && Array.isArray(product.productVariants)) {
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

  cartesian(data) {
    const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
    const recurse = (a,b, ...c) => (b? recurse(f(a, b),...c): a);
    return recurse.apply(this, data);
  }

  generateProductVariant(collection) {
    const values = collection.map(row => row.attributeValue);
    const results = this.cartesian(values).map(row => row.join(" / "));

    return results;
  }
}

export default new Util();
