import React from "react";
import {
  Form,
  Spin,
  PageHeader
} from "antd";
import sweetalert from "sweetalert";
import FormItem from "./FormItem";
import history from "../../../../common/router/history";
import ProductAction from "../../../actions/products/product";
import Enum from "../../../enums";
import VariantAttributeAction from "../../../actions/products/variantAttribute";
import FormCreateVariantAttribute from "../../../containers/products/VariantAttribute/FormCreate";
import TaxAction from "../../../../pos/action/settings/tax";
import FormCreateTax from "../../../../pos/containers/settings/Tax/FormCreate";
import Component from "../../../../common/components/Component";

export default class ProductUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productAttributes: [],
      productVariants: [],
      productArchiveVariants: [],
      productArchiveAttributes: []
    };

    this.title = <this.Translate id="text_product" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCallBackGetProductAttribute = this.handleCallBackGetProductAttribute.bind(this);
    this.handleCallBackGetProductVariant = this.handleCallBackGetProductVariant.bind(this);
    this.handleCallBackGetArchiveProductVariant = this.handleCallBackGetArchiveProductVariant.bind(this);
    this.handleCallBackGetArchiveProductAttributes = this.handleCallBackGetArchiveProductAttributes.bind(this);
    this.handleAddVariantAttribute = this.handleAddVariantAttribute.bind(this);
    this.handleAddTax = this.handleAddTax.bind(this);
    this.productTags = [];
  }

  componentDidMount() {
    const { id } = this.props.match.params,
    params = new URLSearchParams(this.props.location.search);
    this.props.dispatch(ProductAction.requestAndShowForm({id, productOption: params.get("productOption")}));

    window.addEventListener("keydown", (e) => {
      if (!this.props.productUpdate.updating) {
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
    if (this.props.productUpdate.updated && nextProps.productUpdate.updating) {
      sweetalert({
        icon: "success",
        title: "Success!",
        text: "You have saved product!",
        buttons: false,
        timer: 1500
      });
      this.props.dispatch(ProductAction.reset());
    }
    if (this.props.productDetail.fetched){
      this.productTags = this.props.productDetail.data && this.props.productDetail.data.tag ? this.props.productDetail.data.tag.split(",") : [];
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

  handleSubmit(e) {
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
          "variantProductCode",
          "variantProductCost",
          "variantProductPrice",
          "variantProductStatus",
          "attributeId",
          "productName",
          "language",
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
        values["tag"] = this.productTags.toString();
        values["cost"] = values["cost"] ? values["cost"] : 0;
        values["markup"] = values["markup"] ? values["markup"] : 0;
        values["price"] = values["price"] ? values["price"] : 0;
        values["wholePrice"] = values["wholePrice"] ? values["wholePrice"] : 0;
        values["distributePrice"] = values["distributePrice"] ? values["distributePrice"] : 0;
        values["taxes"] = [{taxId: values["taxId"]}];
        values["attributes"] = this.state.productArchiveAttributes.concat(this.state.productAttributes);
        values["variantProducts"] = this.state.productArchiveVariants.concat(this.state.productVariants);
        values["productPackages"] = productPackageToProduct;
        values["image"] = this.getImageFromUpload(values);
        this.dispatch(ProductAction.update(values));
      }
    });
  }

  handleCallBackGetProductTags(productTage){
    this.productTags = productTage;
  }
      
  handleCancel() {
    history.goBack();
  }

  handleAddVariantAttribute(index, callBack) {
    this.dispatch(VariantAttributeAction.showForm());
    this.modal1 = <FormCreateVariantAttribute />;
    if (callBack) {
      callBack(index);
    }
  }

  handleAddTax() {
    this.dispatch(TaxAction.showForm());
    this.modal1 = <FormCreateTax />;
  }

  render() {
    const {
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
      variantAttributes,
      variantAttributeAdd,
      productSearch,
      storeLanguage
    } = this.props;

    return <div style={{marginBottom: 25}}>
      {
        productDetail.fetched ?
        <Form autoComplete="off" onSubmit={this.handleSubmit}>
          <PageHeader
            style={{
                backgroundColor: "#f7f7f7",
                paddingLeft: 0,
                paddingRight: 0
            }}
            onBack={() => history.goBack()}
            title={<this.Translate id="text_product" />}
            subTitle={<this.Translate id="text_edit_product" />}
            extra={[
              <this.Button key="1" htmlType="submit" loading={this.props.productUpdate.updating} className="info" style={{marginLeft: 15}} id="btnSubmit">
                <this.Translate id="text_save" />(Ctrl+s)
              </this.Button>
            ]}
        />
          <FormItem
            form={form}
            languages={storeLanguage}
            locale={locale}
            dispatch={dispatch}
            formData={productDetail.data}
            productLog={productLog}
            productCostLog={productCostLog}
            switchAutoGenerateSKU={this.props.switchAutoGenerateSKU}
            productVariantArchive={this.props.productVariantArchive}
            productVariantCheckStatus={this.props.productVariantCheckStatus}
            productAttributeCheckStatus={this.props.productAttributeCheckStatus}
            productAttributeValueCheckStatus={this.props.productAttributeValueCheckStatus}
            brands={brands}
            brandAdd={brandAdd}
            productsType={productsType}
            productsTypeAdd={productsTypeAdd}
            units={units}
            unitAdd={unitAdd}
            taxs={taxs}
            taxAdd={taxAdd}
            handleAddTax={this.handleAddTax}
            callBackGetProductAttribute={this.handleCallBackGetProductAttribute}
            callBackGetProductVariant={this.handleCallBackGetProductVariant}
            handleCallBackGetArchiveProductVariant={this.handleCallBackGetArchiveProductVariant}
            handleCallBackGetArchiveProductAttributes={this.handleCallBackGetArchiveProductAttributes}
            callBackGetProductTags={(tags) => this.handleCallBackGetProductTags(tags)}
            variantAttributes={variantAttributes}
            variantAttributeAdd={variantAttributeAdd}
            handleAddVariantAttribute={this.handleAddVariantAttribute}
            productSearch={productSearch} />
      </Form>
      :
      <div style={{width: 30, margin: "0 auto"}}>
        <Spin />
      </div>
    }
    </div>;
  }
}