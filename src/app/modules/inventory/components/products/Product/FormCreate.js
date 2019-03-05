import React from "react";
import FormItem from "./FormItem";
import Constant from "../../../constants/products/product";
import Enum from "../../../enums";
import ProductAction from "../../../actions/products/product";
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
import ProductTagAction from "../../../actions/products/productsTag";
import FormCreateTag from "../../../containers/products/ProductsTag/FormCreate";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      tagList: [],
      productAttributes: [],
      productVariants: []
    };
    this.title = <this.Translate id="text_product" />;
    this.width = "100%";
    this.wrapClassName = "modal-product";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCallBackGetProductAttribute = this.handleCallBackGetProductAttribute.bind(this);
    this.handleCallBackGetProductVariant = this.handleCallBackGetProductVariant.bind(this);
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

  handleCallBackGetProductAttribute(productAttributes) {
    this.setState({productAttributes});
  }

  handleCallBackGetProductVariant(productVariants) {
    this.setState({productVariants});
  }

  handleSubmit (e) {
    e.preventDefault();
    if (this.props.form.getFieldValue("isFocusOnVariantInput") === 1) {
      return;
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        if (
          values.productOption === Enum.PRODUCT_VARIANT &&
          this.state.productVariants.length === 0
        ) {
          this.Message.error(this.CATranslate("error_require_variant", this.props.locale));
          return;
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
              languageId: values.language[index],
              name: productName,
              description: values.productDescription[index]
            });
          });
        } else {
          productDescriptions.push({
            languageId: this.getCurrentLanguageCode(),
            name: values["productNameDefault"],
            description: values["productDescriptionDefault"]
          });
        }

        // IF NOT ENOUGHT DESCRIPTION WITH LANGUAGE ACTIVE WE ADD DEFAULT DESCRIPTION DEFAULT FOR IT
        if (productDescriptions.length > 0 && productDescriptions.length !== this.props.storeLanguage.length) {
          this.props.storeLanguage.list.forEach(language => {
            const findExistDescription = productDescriptions.find(value => value.languageId === language.code);
            if(!findExistDescription) {
              productDescriptions.push({
                languageId: language.code,
                name: "",
                description: ""
              });
            }
          });
        }

        this.Util.clearObjProperty(values, [
          "productName",
          "language",
          "productDescription",
          "productNameDefault",
          "productDescriptionDefault",
          "productCompositeId",
          "productCompositeProductId",
          "productCompositeMarkUp",
          "productCompositeStatus",
          "tagId"
        ]);

        values["quantity"] = 0;
        values["reorderPoint"] = values["reorderPoint"] ? values["reorderPoint"] : 0;
        values["factoryCost"] = values["factoryCost"] ? values["factoryCost"] : 0;
        values["shippingFee"] = values["shippingFee"] ? values["shippingFee"] : 0;
        values["cost"] = values["cost"] ? values["cost"] : 0;
        values["markup"] = values["markup"] ? values["markup"] : 0;
        values["price"] = values["price"] ? values["price"] : 0;
        values["taxes"] = [{taxId: values["taxId"]}];
        values["productTags"] = this.state.tagList;
        values["descriptions"] = productDescriptions;
        values["attributes"] = this.state.productAttributes;
        values["variantProducts"] = this.state.productVariants;
        values["productPackages"] = productPackageToProduct;
        values["image"] = this.getImageFromUpload(values);

        this.dispatch(ProductAction.add(values));

        // RESET STATE
        this.setState({tagList: []});
      }
    });
  }
      
  handleCancel() {
    this.dispatch(ProductAction.reset(Constant.RESET_FORM_PRODUCT));
  }

  handleAddBrand() {
    this.dispatch(BrandAction.showForm());
    this.modal1 = <FormCreateBrand />;
  }

  handleAddProductType() {
    this.dispatch(ProductTypeAction.showForm());
    this.modal1 = <FormCreateProductType />;
  }

  handleAddVariantAttribute(index, callBack) {
    this.dispatch(VariantAttributeAction.showForm());
    this.modal1 = <FormCreateVariantAttribute />;
    if (callBack) {
      callBack(index);
    }
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
    this.dispatch(ProductTagAction.showForm());
    this.modal1 = <FormCreateTag />;
  }

  handleChangeTag(value) {
    // console.log("Tag Changes:", value);
  }

  handleSelectTag(value) {
    if (this.Util.isRecordId(value)) {
      //value: In this the data of format is id of tag
      const existTagList = this.state.tagList;
      const findExistingTag = existTagList.find(tagValue => tagValue.id === value);
      if (findExistingTag !== null) {
        existTagList.push({
          id: "",
          tagId: value,
          tag: "",
          status: this.Enum.ACTIVE});
      }
      this.setState({tagList: existTagList});
    } else {
      // ADD NEW TAG TO DB
      // value: in this case is string only
      this.dispatch(ProductTagAction.add({tag: value}));
    }
  }

  handleDeselectTag(value) {
    const existTagList = this.state.tagList;
    if (this.Util.isRecordId(value)) {
      //value: In this the data of format is id of tag
      this.setState({
        tagList: existTagList.filter(tagValue => tagValue.tagId !== value)
      });
    } else {
      this.setState({
        tagList: existTagList.filter(tagValue => tagValue.tag !== value)
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {tagAdd} = nextProps;
    if (tagAdd.added) {
      const existTagList = this.state.tagList;
      existTagList.push({id: tagAdd.response.data.id, tag: tagAdd.response.data.tag, status: this.Enum.ACTIVE});
      this.setState({tagList: existTagList});
      this.dispatch(ProductTagAction.reset());
    }
  }

  render() {
    const {
      form,
      locale,
      dispatch,
      productVariantArchive,
      productAdd,
      productsTypeAdd,
      brandAdd,
      unitAdd,
      taxAdd,
      tags,
      tagAdd,
      variantAttributes,
      variantAttributeAdd,
      productSearch,
      storeLanguage
    } = this.props;
    
    this.submitLoading = productAdd.adding;

    if (productAdd.showForm) {
      this.content = (
        <FormItem
          form={form}
          languages={storeLanguage.list}
          locale={locale}
          dispatch={dispatch}
          switchAutoGenerateSKU={this.props.switchAutoGenerateSKU}
          productVariantArchive={productVariantArchive}
          productVariantCheckStatus={this.props.productVariantCheckStatus}
          productAttributeCheckStatus={this.props.productAttributeCheckStatus}
          productAttributeValueCheckStatus={this.props.productAttributeValueCheckStatus}
          brandAdd={brandAdd}
          handleAddBrand={this.handleAddBrand}
          productsTypeAdd={productsTypeAdd}
          handleAddProductType={this.handleAddProductType}
          unitAdd={unitAdd}
          handleAddUnit={this.handleAddUnit}
          taxAdd={taxAdd}
          handleAddTax={this.handleAddTax}
          tags={tags}
          tagAdd={tagAdd}
          callBackGetProductAttribute={this.handleCallBackGetProductAttribute}
          callBackGetProductVariant={this.handleCallBackGetProductVariant}
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

