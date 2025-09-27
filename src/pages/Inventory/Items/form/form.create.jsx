import React from "react";
import {
  Button,
  Form,
  PageHeader
} from "antd";
import sweetalert from "sweetalert";
import { Translate } from "@redux/index";
import BaseComponent from "@components/BaseComponent";
import FormItem from "./form.item";
import history from "@router/index";
import Enum from "@enums/index";
import ProductAction from "../redux/action";
import FormCreateBrand from "@settings/Modules/Brand/form.create";
import FormCreateCategory from "@settings/Modules/Category/form.create";
import FormCreateOption from "@inventories/Option/FormCreate";
import FormCreateUnit from "@inventories/Unit/FormCreate";
import FormCreateTax from "@settings/Tax/FormCreate";
import Exchange from "./ExchangeMoneyFunc";

export default class ProductCreate extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      tagList: [],
      productAttributes: [],
      productVariants: []
    };
    this.title = <Translate id="text_product" />;
    this.width = "100%";
    this.dispatch = this.props.dispatch;
    this.exchangeRate = 1;
    this.handleCallBackGetProductVariant = this.handleCallBackGetProductVariant.bind(this);
    this.handleAddBrand = this.handleAddBrand.bind(this);
    this.handleAddUnit = this.handleAddUnit.bind(this);
    this.handleAddTax = this.handleAddTax.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.productTags = [];
  }

  componentDidMount() {
    window.addEventListener("keydown", (e) => {
      if (!this.props.productAdd.adding) {
        const S = 83;
        if (e.keyCode === S && e.ctrlKey) {
          e.preventDefault();
          document.getElementById("btnSubmit").click();
        }
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", null);
  }

  componentDidUpdate(nextProps) {
    if (this.props.productAdd.added && nextProps.productAdd.adding) {
      sweetalert({
        icon: "success",
        title: "Success!",
        text: "You have saved product!",
        buttons: false,
        timer: 1500
      })
      .then(() => {
        // this.props.form.resetFields();
        // this.props.dispatch(ProductAction.reset());
        window.location.reload();
      });
    }
  }

  handleCallBackGetProductTags(productTage){
    this.productTags = productTage;
  }

  handleCallBackGetProductAttribute = (productAttributes) => {
    this.setState({productAttributes});
  }

  handleCallBackGetProductVariant(productVariants) {
    this.setState({productVariants});
  }

  handleSubmit = (e) => {
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

        /**
         * @ Note
         * revove image variant from form
         * 
        */

        if (this.state.productVariants.length > 0) {
          for(let i = 0; i < this.state.productVariants.length; i++) {
            delete values[`image${i}`];
          }
        }

        this.Util.clearObjProperty(values, [
          "productName",
          "language",
          "productCompositeId",
          "productCompositeProductId",
          "productCompositeMarkUp",
          "productCompositeStatus",
          "tagId"
        ]);

        values["tag"] = this.productTags.toString();
        values["isAutoGenerateBarcode"] = values["barcode"] ? this.Enum.GENERATE_PRODUCT_CODE.MANAUL : this.Enum.GENERATE_PRODUCT_CODE.AUTO;
        values["quantity"] = 0;
        values["reorderPoint"] = values["reorderPoint"] ? values["reorderPoint"] : 0;
        values["factoryCost"] = values["factoryCost"] ? values["factoryCost"] : 0;
        values["shippingFee"] = values["shippingFee"] ? values["shippingFee"] : 0;
        values["cost"] = values["cost"] ? values["cost"] : 0;
        values["markup"] = values["markup"] ? values["markup"] : 0;
        values["price"] = Exchange.rielToDollar(values["price"], this.exchangeRate);
        values["wholePrice"] = Exchange.rielToDollar(values["wholePrice"], this.exchangeRate);
        values["distributePrice"] = Exchange.rielToDollar(values["distributePrice"], this.exchangeRate);
        values["productTags"] = [];
        values["attributes"] = this.state.productAttributes;
        const productVariants = this.state.productVariants;
        productVariants.map( (variant) => {
          variant.price           = Exchange.rielToDollar(variant.price, this.exchangeRate);
          variant.distributePrice = Exchange.rielToDollar(variant.distributePrice, this.exchangeRate);
          variant.wholePrice      = Exchange.rielToDollar(variant.wholePrice, this.exchangeRate);
          return variant;
        });
        values["variantProducts"] = productVariants;
        values["productPackages"] = productPackageToProduct;
        values["image"] = this.getImageFromUpload(values);
        this.dispatch(ProductAction.add(values));
      }
    });
  }
      
  handleCancel() {
    history.goBack();
  }

  handleAddBrand() {
    this.dispatch(ProductAction.showBrandForm());
    this.modal1 = <FormCreateBrand />;
  }

  handleAddCategory() {
    this.dispatch(ProductAction.showCategoryForm());
    this.modal1 = <FormCreateCategory />;
  }

  handleAddOption = (index, callBack) => {
    this.dispatch(ProductAction.showVariantOptionForm());
    this.modal1 = <FormCreateOption />;
    if (callBack) {
      callBack(index);
    }
  }

  handleAddUnit() {
    this.dispatch(ProductAction.showUnitForm());
    this.modal1 = <FormCreateUnit />;
  }

  handleAddTax() {
    this.dispatch(ProductAction.showTaxForm());
    this.modal1 = <FormCreateTax />;
  }

  render() {
    const {
      form,
      locale,
      dispatch,
      productVariantArchive,
      productAdd,
      productsType,
      productsTypeAdd,
      brands,
      brandAdd,
      units,
      unitAdd,
      taxAdd,
      variantAttributes,
      variantAttributeAdd,
      productSearch,
      storeLanguage
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return <div style={{marginBottom: 25}}>
      <Form autoComplete="off" onSubmit={this.handleSubmit}>
        <PageHeader
          style={{
              paddingLeft: 0,
              paddingRight: 0
          }}
          onBack={() => history.goBack()}
          title={<this.Translate id="text_product" />}
          subTitle={<this.Translate id="text_new_product" />}
          extra={[
            <Button size="large" htmlType="submit" loading={productAdd.adding} key={0} type="primary" style={{marginLeft: 15}} id="btnSubmit">
              <this.Translate id="text_save" />(Ctrl+s)
            </Button>
          ]} />
          
        <FormItem
          form={form}
          languages={storeLanguage.list}
          locations={this.props.locations}
          locale={locale}
          dispatch={dispatch}
          switchAutoGenerateSKU={this.props.switchAutoGenerateSKU}
          productVariantArchive={productVariantArchive}
          productVariantCheckStatus={this.props.productVariantCheckStatus}
          productAttributeCheckStatus={this.props.productAttributeCheckStatus}
          productAttributeValueCheckStatus={this.props.productAttributeValueCheckStatus}
          brands={brands}
          brandAdd={brandAdd}
          handleAddBrand={this.handleAddBrand}
          productsType={productsType}
          productsTypeAdd={productsTypeAdd}
          handleAddCategory={this.handleAddCategory}
          units={units}
          unitAdd={unitAdd}
          handleAddUnit={this.handleAddUnit}
          taxAdd={taxAdd}
          handleAddTax={this.handleAddTax}
          taxs={this.props.taxs}
          setExchangeRateCallBack={(rate) => this.exchangeRate = rate}
          callBackGetProductAttribute={this.handleCallBackGetProductAttribute}
          callBackGetProductVariant={this.handleCallBackGetProductVariant}
          callBackGetProductTags={(tags) => this.handleCallBackGetProductTags(tags)}
          variantAttributes={variantAttributes}
          variantAttributeAdd={variantAttributeAdd}
          handleAddVariantAttribute={this.handleAddOption}
          productSearch={productSearch}
        />
      </Form>
    </div>;
  }
}

