import React from "react";
import {
  Form,
  PageHeader
} from "antd";
import sweetalert from "sweetalert";
import FormItem from "./form.item";
import Constant from "../redux/constant";
import Action from "../redux/action";
import Enum from "@enums/index";
import history from "@router/index";
import Component from "@components/BaseComponent";
import "./index.css";

export default class StockIOCreate extends Component {
  constructor(props) {
    super(props);
    this.title = "New Stock IO";
    this.width = window.innerWidth < 1400 ? window.innerWidth : 1400;
    this.dispatch = this.props.dispatch;
  }

  componentDidMount() {
    window.addEventListener("keydown", (e) => {
      if (!this.props.purchaseOrderAdd.adding) {
        const S = 83;
        if (e.keyCode === S && e.ctrlKey) {
          e.preventDefault();
          document.getElementById("btnSubmit").click();
        }
      }
    });
  }

  componentDidUpdate(nextProps) {
    if (this.props.purchaseOrderAdd.added && nextProps.purchaseOrderAdd.adding) {
      sweetalert({
        icon: "success",
        title: "Success!",
        text: "You have created purchase order!",
        buttons: false,
        timer: 1500
      })
      .then(() => {
        history.goBack();
      });
    }

    if (this.props.purchaseOrderAdd.error) {
      const errorCode = this.Util.getErrorCodeFromState(this.props.purchaseOrderAdd.error);
      let message = "Something wrong, Please contact system provider";

      if (errorCode === Enum.PO_NUMBER_NOT_ALLOW_EMPTY) {
        message = this.CATranslate("error_po_number_empty", this.props.locale);
      } else if (errorCode === Enum.LOCATION_NOT_FOUND) {
        message = this.CATranslate("error_location_not_found", this.props.locale);
      } else if (errorCode === Enum.SUPPLIER_NOT_FOUND) {
        message = this.CATranslate("error_supplier_not_found", this.props.locale);
      } else if (errorCode === Enum.PO_NUMBER_ALREADY_EXIST) {
        message = this.CATranslate("purchase_order_po_number_already_exist", this.props.locale);
      } else if (errorCode === Enum.PRODUCT_NOT_FOUND) {
        message = this.CATranslate("error_product_not_found", this.props.locale);
      } else if (errorCode === Enum.PRODUCT_UNIT_NOT_FOUND) {
        message = this.CATranslate("error_unit_not_found", this.props.locale);
      }

      this.Message.error(message);
      this.props.dispatch(Action.reset(Constant.RESET_ADD_PURCHASE_ORDER));
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const purchaseEntries = [];
        if ("productVariantId" in values) {
          values.productVariantId.forEach((productVariantId, index) => {
            purchaseEntries.push({
              id: values.purchaseEntryId[index],
              productVariantId,
              productName: values.productName[index],
              variantName: values.variantName[index],
              unitId: values.unitId[index],
              requestQuantity: parseInt(values.purchaseQty[index], 10),
              price: parseFloat(values.purchasePrice[index]),
              status: values.purchaseEntryStatus[index]
            });
          });
        } else {
          this.Message.warning(this.CATranslate("error_purchase_order_no_entry", this.props.locale), 3);
          return;
        }

        values["requestTotal"] = parseFloat(values["requestTotalValue"]);

        this.Util.clearObjProperty(values, [
          "id",
          "productVariantId",
          "purchaseQty",
          "purchasePrice",
          "purchaseEntryStatus",
          "totalPrice",
          "totalAmount",
          "totalPriceValue",
          "requestTotalValue",
          "searchProduct",
          "purchaseEntryId",
          "productName",
          "isFocusOnSearchCompositeProduct"
        ]);

        values["shippingFee"] = 0;
        values["returnTotal"] = 0;
        values["receiveTotal"] = values.isAutoReceive ? values["requestTotal"] : 0;
        values["deliveryDueDate"] = this.Util.formatDateForMYSQL(values.deliveryDueDate);
        values["payTermNumber"] = values["payTermNumber"] ? values["payTermNumber"] : 0;
        values["paymentDueDate"] = this.Util.formatDateForMYSQL(values.paymentDueDate);
        values["type"] = Enum.CLIENT_AUTO_NUMBER_TYPE.PURCHASE;
        values["status"] = this.Enum.ACTIVE;

        values["POEntries"] = purchaseEntries;
        this.dispatch(Action.add(values));

        if(this.props.isHasReOrderProductList){
          history.push("/stock/purchase/order");
        }
      }
    });
  }
      
  handleCancel() {
    history.goBack();
  }

  render() {
    const {
      purchaseOrderAdd, 
      form, 
      locale, 
      supplier,
      storeLocation, 
      productSearch, 
      requestOrderNumber,
      product,
      unit,
      dispatch
    } = this.props;

    return <div style={{marginBottom: 25, height: "100%"}}>
      <Form autoComplete="off" onSubmit={this.handleSubmit}>
        <PageHeader
          style={{
              backgroundColor: "#f7f7f7",
              paddingLeft: 0,
              paddingRight: 0
          }}
          onBack={() => history.goBack()}
          title={"New Stock IO"}
          subTitle={<this.Translate id="text_po" />}
          extra={[
            <this.Button key="1" htmlType="submit" loading={purchaseOrderAdd.adding} className="info" style={{marginLeft: 15}} id="btnSubmit">
                <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />(Ctrl+s)
              </this.Button>
          ]}
        />
            <FormItem 
                form={form} 
                supplier={supplier}
                storeLocation={storeLocation} 
                productSearch={productSearch} 
                productVariant={this.props.productVariant}
                requestOrderNumber={requestOrderNumber}
                product={product}
                unit={unit}
                productReOrderPointList={this.props.productReOrderPointList}
                dispatch={dispatch} 
                locale={locale} />
      </Form>
    </div>;
  }
}