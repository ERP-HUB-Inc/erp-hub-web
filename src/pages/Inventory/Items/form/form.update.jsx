import React from "react";
import {
  Button,
  Form,
  Spin,
  PageHeader
} from "antd";
import sweetalert from "sweetalert";
import FormCreateOption from "@inventories/Option/FormCreate";
import FormCreateTax from "@settings/Tax/FormCreate";
import BaseComponent from "@components/BaseComponent";
import FormItem from "./form.item";
import history from "@router/index";
import { Translate } from "@redux/index";
import ProductAction from "../redux/action";
import Enum from "@enums/index";
import Exchange from "./exchange-money-func";
import FormItem404 from "./form.item.404";

export class ItemFormUpdate extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      productAttributes: [],
      productVariants: [],
      productArchiveVariants: [],
      productArchiveAttributes: [],
      exchangeRate: 1,
    };

    this.title = <Translate id="text_item" />;
    this.dispatch = this.props.dispatch;
    this.productTags = [];
    this.exchangeRate= 1;
  }

  componentDidMount() {
    const { id } = this.props.match.params,
    params = new URLSearchParams(this.props.location.search);
    this.props.dispatch(ProductAction.requestAndShowForm({id, productOption: params.get("productOption")}));
    this.props.dispatch(ProductAction.fetchLocation());

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
        text: "You have saved item!",
        buttons: false,
        timer: 1500
      });
      this.props.dispatch(ProductAction.reset());
    }
    if (this.props.productDetail.fetched){
      this.productTags = this.props.productDetail.data && this.props.productDetail.data.tag ? this.props.productDetail.data.tag.split(",") : [];
    }
  }

  handleCallBackGetProductAttribute = (productAttributes) => {
    this.setState({productAttributes});
  }

  handleCallBackGetProductVariant = (productVariants) => {
    this.setState({productVariants});
  }

  handleCallBackGetArchiveProductVariant = (productArchiveVariants) => {
    this.setState({productArchiveVariants});
  }

  handleCallBackGetArchiveProductAttributes = (productArchiveAttributes) => {
    this.setState({productArchiveAttributes});
  }

  onSubmit = (e) => {
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
        values["tag"] = this.productTags.toString();
        values["cost"] = values["cost"];
        values["markup"] = values["markup"];

        if (values["price"]) {
          values["price"] = Exchange.rielToDollar(values["price"], this.exchangeRate);
        }

        if (values["wholePrice"]) {
          values["wholePrice"] = Exchange.rielToDollar(values["wholePrice"], this.exchangeRate);
        }

        if (values["distributePrice"]) {
          values["distributePrice"] = Exchange.rielToDollar(values["distributePrice"], this.exchangeRate);
        }

        if (values["taxId"]) {
          values["taxes"] = [{ taxId: values["taxId"] }];
        }

        values["attributes"] = this.state.productArchiveAttributes.concat(this.state.productAttributes);

        values["productVariants"] = values?.variantId?.map((variantId, index) => {
          return {
            id: variantId,
            name: values.variantName[index],
            price: values.variantRetailPrice[index],
            wholePrice: values?.variantWholePrice?.[index],
            distributePrice: values?.variantDistributePrice?.[index],
            barcode: values.variantBarcode?.[index],
            sku: values.variantSku?.[index],
            reorderPoint: values?.variantReorderPoint?.[index],
            status: values?.variantStatus?.[index],
          }
        });

        // In case for production non-variant
        values.productVariantId = this.props.productDetail?.data?.productVariants?.[0]?.id ?? null;

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

  handleAddVariantAttribute = (index, callBack) => {
    this.dispatch(ProductAction.showVariantOptionForm());
    this.modal1 = <FormCreateOption />;
    if (callBack) {
      callBack(index);
    }
  }

  handleAddTax = () => {
    this.dispatch(ProductAction.showTaxForm());
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

    return (
      <div style={{ marginBottom: 25 }}>
        {productDetail.fetched ? (
          <Form autoComplete="off" onSubmit={this.onSubmit}>
            <PageHeader
              style={{
                paddingLeft: 25,
                paddingRight: 25,
                marginTop: 15,
              }}
              onBack={() => history.goBack()}
              title={<Translate id="text_item" />}
              subTitle={<Translate id="text_edit_item" />}
              extra={[
                <Button
                  size="large"
                  key="1"
                  htmlType="submit"
                  title="Ctrl + s"
                  loading={this.props.productUpdate.updating}
                  type="primary"
                  style={{ marginLeft: 15 }}
                  id="btnSubmit"
                >
                  Save Changes
                </Button>,
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
                locations={this.props.locations}
                switchAutoGenerateSKU={this.props.switchAutoGenerateSKU}
                productVariantArchive={this.props.productVariantArchive}
                productVariantCheckStatus={this.props.productVariantCheckStatus}
                productAttributeCheckStatus={
                  this.props.productAttributeCheckStatus
                }
                productAttributeValueCheckStatus={
                  this.props.productAttributeValueCheckStatus
                }
                brands={brands}
                brandAdd={brandAdd}
                productsType={productsType}
                productsTypeAdd={productsTypeAdd}
                units={units}
                unitAdd={unitAdd}
                taxs={taxs}
                taxAdd={taxAdd}
                handleAddTax={this.handleAddTax}
                setExchangeRateCallBack={(rate) => (this.exchangeRate = rate)}
                callBackGetProductAttribute={
                  this.handleCallBackGetProductAttribute
                }
                callBackGetProductVariant={this.handleCallBackGetProductVariant}
                handleCallBackGetArchiveProductVariant={
                  this.handleCallBackGetArchiveProductVariant
                }
                handleCallBackGetArchiveProductAttributes={
                  this.handleCallBackGetArchiveProductAttributes
                }
                callBackGetProductTags={(tags) =>
                  this.handleCallBackGetProductTags(tags)
                }
                variantAttributes={variantAttributes}
                variantAttributeAdd={variantAttributeAdd}
                handleAddVariantAttribute={this.handleAddVariantAttribute}
                productSearch={productSearch}
              />
          </Form>
        ) : (
          productDetail.fetching ?
            <div style={{ width: 30, margin: "0 auto" }}>
              <Spin />
            </div>
          :
          <FormItem404 />
        )}
      </div>
    );
  }
}