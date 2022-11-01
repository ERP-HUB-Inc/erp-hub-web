import React from "react";
import {
  Form,
  PageHeader
} from "antd";
import sweetalert from "sweetalert";
import FormItem from "./FormItem";
import history from "../../../../common/router/history";
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
import Component from "../../../../common/components/Component";

export default class ProductCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagList: [],
      productAttributes: [],
      productVariants: []
    };
    this.title = <this.Translate id="text_product" />;
    this.width = "100%";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCallBackGetProductAttribute = this.handleCallBackGetProductAttribute.bind(this);
    this.handleCallBackGetProductVariant = this.handleCallBackGetProductVariant.bind(this);
    this.handleAddBrand = this.handleAddBrand.bind(this);
    this.handleAddVariantAttribute = this.handleAddVariantAttribute.bind(this);
    this.handleAddUnit = this.handleAddUnit.bind(this);
    this.handleAddTax = this.handleAddTax.bind(this);
    this.handleAddProductType = this.handleAddProductType.bind(this);
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
        history.goBack();
        // this.props.form.resetFields();
        // this.props.dispatch(ProductAction.reset());
      });
    }
  }

  handleCallBackGetProductTags(productTage){
    this.productTags = productTage;
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
        values["price"] = values["price"] ? values["price"] : 0;
        values["wholePrice"] = values["wholePrice"] ? values["wholePrice"] : 0;
        values["distributePrice"] = values["distributePrice"] ? values["distributePrice"] : 0;
        values["productTags"] = [];
        values["attributes"] = this.state.productAttributes;
        values["variantProducts"] = this.state.productVariants;
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

    return <div style={{marginBottom: 25}}>
      <Form autoComplete="off" onSubmit={this.handleSubmit}>
        <PageHeader
          style={{
              backgroundColor: "#f7f7f7",
              paddingLeft: 0,
              paddingRight: 0
          }}
          onBack={() => history.goBack()}
          title={<this.Translate id="text_product" />}
          subTitle={<this.Translate id="text_new_product" />}
          extra={[
            <this.Button htmlType="submit" loading={productAdd.adding} className="info" style={{marginLeft: 15}} id="btnSubmit">
              <this.Translate id="text_save" />(Ctrl+s)
            </this.Button>
          ]} />
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
          brands={brands}
          brandAdd={brandAdd}
          handleAddBrand={this.handleAddBrand}
          productsType={productsType}
          productsTypeAdd={productsTypeAdd}
          handleAddProductType={this.handleAddProductType}
          units={units}
          unitAdd={unitAdd}
          handleAddUnit={this.handleAddUnit}
          taxAdd={taxAdd}
          handleAddTax={this.handleAddTax}
          taxs={this.props.taxs}
          callBackGetProductAttribute={this.handleCallBackGetProductAttribute}
          callBackGetProductVariant={this.handleCallBackGetProductVariant}
          callBackGetProductTags={(tags) => this.handleCallBackGetProductTags(tags)}
          variantAttributes={variantAttributes}
          variantAttributeAdd={variantAttributeAdd}
          handleAddVariantAttribute={this.handleAddVariantAttribute}
          productSearch={productSearch} />
      </Form>
    </div>;
  }
}

