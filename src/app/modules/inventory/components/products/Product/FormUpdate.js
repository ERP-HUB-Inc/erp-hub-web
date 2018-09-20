import React from "react";
import FormItem from "./FormItem";
import ProductAction from "../../../actions/products/product";
import Constant from "../../../constants/products/product";
import BrandAction from "../../../actions/products/brand";
import FormCreateBrand from "../../../containers/products/Brand/FormCreate";
import ProductTypeAction from "../../../actions/products/productsType";
import FormCreateProductType from "../../../containers/products/ProductsType/FormCreate";
import VariantAttributeAction from "../../../actions/products/variantAttribute";
import FormCreateVariantAttribute from "../../../containers/products/VariantAttribute/FormCreate";
import UnitAction from "../../../actions/products/productsUnit";
import FormCreateUnit from "../../../containers/products/ProductsUnit/FormCreate";
import TaxAction from "../../../../pos/action/settings/tax";
import FormCreateTax from "../../../../pos/containers/settings/Tax/FormCreate";
import TagAction from "../../../actions/products/productsTag";
import FormCreateTag from "../../../containers/products/productsTag/FormCreate";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      isNotYetLoadComponentDidUpdated: true,
      tagList: []
    };

    this.tagList = [];

    this.title = <this.Translate id="update_products_title" />;
    this.width = "100%";
    this.wrapClassName = "modal-product";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddBrand = this.handleAddBrand.bind(this);
    this.handleAddVariantAttribute = this.handleAddVariantAttribute.bind(this);
    this.handleAddUnit = this.handleAddUnit.bind(this);
    this.handleAddTax = this.handleAddTax.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleChangeTag = this.handleChangeTag.bind(this);
    this.handleSelectTag = this.handleSelectTag.bind(this);
    this.handleDeselectTag = this.handleDeselectTag.bind(this);
    this.handleAddProductType = this.handleAddProductType.bind(this);
  }

  componentWillUpdate() {
    const {productDetail} = this.props;
    if (productDetail.fetched) {
      if (productDetail.data) {
        const tagList = [];
        productDetail.data.productTagToProduct.forEach(productTag => {
          if (productTag.status === this.Enum.ACTIVE) {
            tagList.push({
              id: productTag.id,
              tagId: productTag.tagId,
              tag: "",
              status: this.Enum.ACTIVE
            });
          }
        });
        this.setState({tagList});
      }
      this.dispatch(ProductAction.reset(Constant.PARTIAL_RESET_DETAIL_PRODUCTS));
    }
  }

  componentWillReceiveProps(nextProps) {
    const {tagAdd} = nextProps;
    if (tagAdd.added) {
      const existTagList = this.state.tagList;
      existTagList.push({
        id: "",
        tagId: tagAdd.response.data.id,
        tag: tagAdd.response.data.tag,
        status: this.Enum.ACTIVE
      });
      this.setState({tagList: existTagList});
      this.dispatch(TagAction.reset());
    }
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // PREPARE DATA FOR VARIANT
        const productVariantToProduct = [];
        if ("attributeId" in values && "variantName" in values) {
          values["attributeId"].forEach((variantAttributeId, attributeIdIndex) => {
            // RESTRIEVE ALL PRODUCT VARIANT
            values["variantName"][attributeIdIndex].forEach((variantName, productVariantIndex) => {
              let productVariant = {
                variantAttributeId 
              };
              
              productVariant["id"] = values["variantProductId"][attributeIdIndex][productVariantIndex];
              productVariant["name"] = variantName;
              productVariant["barcode"] = values["variantProductCode"][attributeIdIndex][productVariantIndex];
              productVariant["cost"] = values["variantProductCost"][attributeIdIndex][productVariantIndex];
              productVariant["price"] = values["variantProductPrice"][attributeIdIndex][productVariantIndex];
              productVariant["status"] = values["variantProductStatus"][attributeIdIndex][productVariantIndex];
              productVariantToProduct.push(productVariant);
            });

          });
        }

        // PREPARE DATA FOR PACKAGE PRODUCT
        const productPackageToProduct = [];
        if ("productCompositeProductId" in values && "productCompositeMarkUp" in values) {
          values["productCompositeProductId"].forEach((rawProductId, productCompositeProductIdIndex) => {
            let packageProduct = {
              rawProductId
            };
            packageProduct["id"] = values["productCompositeId"][productCompositeProductIdIndex];
            packageProduct["quantity"] = values["productCompositeMarkUp"][productCompositeProductIdIndex];
            packageProduct["status"] = values["productCompositeStatus"][productCompositeProductIdIndex];
            productPackageToProduct.push(packageProduct);
          });
        }


        // PREPARE DATA FROM DESCRIPTION
        const productDescriptions = [];

        if (values.productName) {
          values.productName.forEach((productName, index) => {
            productDescriptions.push({
              id: values.id[index],
              languageId: values.language[index],
              name: productName,
              description: values.productDescription[index]
            });
          });
        } else {
          productDescriptions.push({
            id: values["productDescriptionId"],
            languageId: this.getCurrentLanguageCode(),
            name: values["productNameDefault"],
            description: values["productDescriptionDefault"]
          });
        }

        this.Util.clearObjProperty(values, [
          "variantName",
          "variantProductCode",
          "variantProductCost",
          "variantProductPrice",
          "variantProductStatus",
          "productName",
          "language",
          "productDescription",
          "productDescriptionId",
          "productNameDefault",
          "productDescriptionDefault",
          "productCompositeId",
          "productCompositeProductId",
          "productCompositeMarkUp",
          "productCompositeStatus",
          "tagId"
        ]);

        values["id"] = this.props.productDetail.data.id;
        values["quantity"] = 0;
        values["reorderPoint"] = values["reorderPoint"] ? values["reorderPoint"] : 0;
        values["factoryCost"] = values["factoryCost"] ? values["factoryCost"] : 0;
        values["shippingFee"] = values["shippingFee"] ? values["shippingFee"] : 0;
        values["cost"] = values["cost"] ? values["cost"] : 0;
        values["markup"] = values["markup"] ? values["markup"] : 0;
        values["price"] = values["price"] ? values["price"] : 0;
        values["isAvialableSale"] = values["isAvialableSale"] ? 1 : 0;
        values["isPublic"] = values["isPublic"] ? 1 : 0;

        values["productTags"] = this.state.tagList;
        values["descriptions"] = productDescriptions;
        values["productVariants"] = productVariantToProduct;
        values["productPackages"] = productPackageToProduct;

        this.setState({
          tagList: [],
          isNotYetLoadComponentDidUpdated: true
        });

        this.dispatch(ProductAction.update(values));
      }
    });
  }
      
  handleCancel() {
    this.setState({isNotYetLoadComponentDidUpdated: true});
    this.dispatch(ProductAction.reset(Constant.RESET_DETAIL_PRODUCTS));
  }

  handleAddBrand() {
    this.dispatch(BrandAction.showForm());
    this.modal1 = <FormCreateBrand />;
  }

  handleAddProductType() {
    this.dispatch(ProductTypeAction.showForm());
    this.modal1 = <FormCreateProductType />;
  }

  handleAddVariantAttribute(key) { console.log("Current Key:", key);
    this.dispatch(VariantAttributeAction.showForm());
    this.modal1 = <FormCreateVariantAttribute />;
  }

  handleAddUnit() {
    this.dispatch(UnitAction.showForm());
    this.modal1 = <FormCreateUnit />;
  }

  handleAddTax() {
    this.dispatch(TaxAction.showForm());
    this.modal1 = <FormCreateTax />;
  }

  handleAddTag() {
    this.dispatch(TagAction.showForm());
    this.modal1 = <FormCreateTag />;
  }

  handleChangeTag(value) {
    // console.log("Tag Changes:", value);
  }

  handleSelectTag(value) {
    if (this.Util.isRecordId(value)) {
      //value: In this the data of format is id of tag
      const existTagList = this.state.tagList;
      let isNotTheSameTag = true;
      existTagList.forEach((tagValue, tagIndex) => {
        if (tagValue.tagId !== value && tagValue.status !== this.Enum.ACTIVE) {
          isNotTheSameTag = false;
          existTagList[tagIndex]["status"] = this.Enum.ACTIVE;          
        }
      });

      if (isNotTheSameTag) {
        existTagList.push({
          id: "",
          tagId: value,
          tag: "",
          status: this.Enum.ACTIVE
        });
      }

      this.setState({tagList: existTagList});
    } else {
      // ADD NEW TAG TO DB
      // value: in this case is string only
      this.dispatch(TagAction.add({tag: value}));
    }
  }

  handleDeselectTag(value) {
    const existTagList = this.state.tagList;
    if (this.Util.isRecordId(value)) {
      //value: In this the data of format is id of tag
      const tagList = [];
      existTagList.forEach(tagValue => {
        if (tagValue.tagId === value) {
          if (tagValue.id !== "") {
            tagValue["status"] = this.Enum.ARCHIVE;
            tagList.push(tagValue);
          }
        } else {
          tagList.push(tagValue);
        }
      });
      this.setState({tagList: tagList});
    } else {
      this.setState({tagList: existTagList.filter(tagValue => tagValue.tag !== value)});
    }
  }

  render() {
    const {
      productUpdate,
      productDetail,
      productLog,
      productCostLog,
      productVariantArchive,
      form,
      locale,
      dispatch,
      productsType,
      productsTypeAdd,
      brands,
      brandAdd,
      units,
      unitAdd,
      taxs,
      taxAdd,
      tags,
      tagAdd,
      variantAttributes,
      variantAttributeAdd,
      productSearch,
      storeLanguage
    } = this.props;

    this.submitLoading = productUpdate.updating;

    if (productDetail.showForm) {
      this.content = (
        <FormItem
          form={form}
          languages={storeLanguage}
          locale={locale}
          dispatch={dispatch}
          formData={productDetail.data}
          productLog={productLog}
          productCostLog={productCostLog}
          productVariantArchive={productVariantArchive}
          brands={brands}
          brandAdd={brandAdd}
          handleAddBrand={this.handleAddBrand}
          productsType={productsType}
          productsTypeAdd={productsTypeAdd}
          handleAddProductType={this.handleAddProductType}
          units={units}
          unitAdd={unitAdd}
          handleAddUnit={this.handleAddUnit}
          taxs={taxs}
          taxAdd={taxAdd}
          handleAddTax={this.handleAddTax}
          tags={tags}
          tagAdd={tagAdd}
          handleChangeTag={this.handleChangeTag}
          handleSelectTag={this.handleSelectTag}
          handleDeselectTag={this.handleDeselectTag}
          handleAddTag={this.handleAddTag}
          variantAttributes={variantAttributes}
          variantAttributeAdd={variantAttributeAdd}
          handleAddVariantAttribute={this.handleAddVariantAttribute}
          productSearch={productSearch} />
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}