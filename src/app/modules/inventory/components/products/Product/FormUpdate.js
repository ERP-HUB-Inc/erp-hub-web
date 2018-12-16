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
import FormCreateTag from "../../../containers/products/ProductsTag/FormCreate";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      isNotYetLoadComponentDidUpdated: true,
      tagList: [],
      productAttributes: [],
      productVariants: [],
      productArchiveVariants: [],
      productArchiveAttributes: []
    };

    this.tagList = [];

    this.title = <this.Translate id="text_product" />;
    this.width = "100%";
    this.wrapClassName = "modal-product";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCallBackGetProductAttribute = this.handleCallBackGetProductAttribute.bind(this);
    this.handleCallBackGetProductVariant = this.handleCallBackGetProductVariant.bind(this);
    this.handleCallBackGetArchiveProductVariant = this.handleCallBackGetArchiveProductVariant.bind(this);
    this.handleCallBackGetArchiveProductAttributes = this.handleCallBackGetArchiveProductAttributes.bind(this);
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

  componentDidUpdate() {
    const {productDetail} = this.props;
    if (productDetail.fetched) {
      if (productDetail.data) {
        const tagList = [];
        productDetail.data.tags.forEach(productTag => {
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
        this.dispatch(ProductAction.reset(Constant.PARTIAL_RESET_DETAIL_PRODUCTS));
      }
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

  handleCallBackGetProductAttribute(productAttributes) {
    this.setState({productAttributes});
  }

  handleCallBackGetProductVariant(productVariants) {
    this.setState({productVariants});
  }

  handleCallBackGetArchiveProductVariant(productArchiveVariants) {
    this.setState({productArchiveVariants});
  }

  handleCallBackGetArchiveProductAttributes(productArchiveAttributes) {
    this.setState({productArchiveAttributes});
  }

  handleSubmit (e) {
    e.preventDefault();

    if (this.props.form.getFieldValue("isFocusOnVariantInput") === 1) {
      return;
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
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
          "variantProductCode",
          "variantProductCost",
          "variantProductPrice",
          "variantProductStatus",
          "attributeId",
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
        values["reorderPoint"] = values["reorderPoint"] ? values["reorderPoint"] : 0;
        values["factoryCost"] = values["factoryCost"] ? values["factoryCost"] : 0;
        values["shippingFee"] = values["shippingFee"] ? values["shippingFee"] : 0;
        values["cost"] = values["cost"] ? values["cost"] : 0;
        values["markup"] = values["markup"] ? values["markup"] : 0;
        values["price"] = values["price"] ? values["price"] : 0;
        values["taxes"] = [{taxId: values["taxId"]}];
        values["productTags"] = this.state.tagList;
        values["descriptions"] = productDescriptions;
        values["attributes"] = this.state.productArchiveAttributes.concat(this.state.productAttributes);
        values["variantProducts"] = this.state.productArchiveVariants.concat(this.state.productVariants);
        values["productPackages"] = productPackageToProduct;
        values["image"] = this.getImageFromUpload(values);

        this.setState({
          tagList: [],
          isNotYetLoadComponentDidUpdated: true
        });

        console.log("Values Update:", values);

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
          if (tagValue.id) {
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
          productVariantArchive={this.props.productVariantArchive}
          productVariantCheckStatus={this.props.productVariantCheckStatus}
          productAttributeCheckStatus={this.props.productAttributeCheckStatus}
          productAttributeValueCheckStatus={this.props.productAttributeValueCheckStatus}
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
          callBackGetProductAttribute={this.handleCallBackGetProductAttribute}
          callBackGetProductVariant={this.handleCallBackGetProductVariant}
          handleCallBackGetArchiveProductVariant={this.handleCallBackGetArchiveProductVariant}
          handleCallBackGetArchiveProductAttributes={this.handleCallBackGetArchiveProductAttributes}
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