import React from "react";
import {
  Form,
  PageHeader,
  Badge,
  Spin
} from "antd";
import sweetalert from "sweetalert";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import history from "../../../../common/router/history";
import Constant from "../../../constants/stock/purchaseOrder";
import Component from "../../../../common/components/Component";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";
import FormCreatePurchseOrderSendEmail from "../../../containers/stock/PurchaseOrder/ConfirmEmail/FormCreate";

export default class PurchaseOrderUpdate extends Component {
  constructor(props) {
    super(props);
    this.wrapClassName = `${this.wrapClassName} wrap-modal-po  modal-po-full-screen`;
    this.width = window.innerWidth < 1400 ? window.innerWidth : 1400;
    this.PO_STEP_STR = {
      [Enum.PO_STEP.DRAFT]: {name: this.CATranslate("text_draft", this.props.locale), color: this.Enum.PO_STEP_COLOR.DRAFT},
      [Enum.PO_STEP.PROCESS]: {name: this.CATranslate("text_process", this.props.locale), color:  this.Enum.PO_STEP_COLOR.PROCESS},
      [Enum.PO_STEP.RECEIVED]: {name: this.CATranslate("text_received", this.props.locale), color:  this.Enum.PO_STEP_COLOR.RECEIVE},
      [Enum.PO_STEP.CANCEL]: {name: this.CATranslate("text_cancel", this.props.locale), color:  this.Enum.PO_STEP_COLOR.CANCEL},
      [Enum.PO_STEP.RETURN]: {name: this.CATranslate("text_return", this.props.locale), color:  this.Enum.PO_STEP_COLOR.RETURN},
      [Enum.PO_STEP.PAID]: {name: this.CATranslate("purchase_order_step_paid", this.props.locale), color:  this.Enum.PO_STEP_COLOR.PAID}
    };
    this.title = <this.Translate id="text_po" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePushToSupplier = this.handlePushToSupplier.bind(this);
    this.prepareFormDataForUpdate = this.prepareFormDataForUpdate.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.dispatch(PurchaseOrderAction.detail({id}));

    window.addEventListener("keydown", (e) => {
      if (!this.props.purchaseOrderUpdate.updating) {
        const S = 83;
        if (e.keyCode === S && e.ctrlKey) {
          e.preventDefault();
          document.getElementById("btnSubmit").click();
        }
      }
    });
  }

  componentDidUpdate(nextProps) {
    if (this.props.purchaseOrderUpdate.updated && nextProps.purchaseOrderUpdate.updating) {
      sweetalert({
        icon: "success",
        title: "Success!",
        text: "You have saved purchase order!",
        buttons: false,
        timer: 1500
      })
      .then(() => {
        history.goBack();
      });
    }

    if (this.props.purchaseOrderDetail.fetched) {
      const step = this.props.purchaseOrderDetail.data.step;
      this.title = <div><this.Translate id="text_po" /> {step in this.PO_STEP_STR ? <this.Tag color={this.PO_STEP_STR[step].color} className="text-uppercase text-center po-step-tag">{this.PO_STEP_STR[step].name}</this.Tag> : ""}</div>;
    }
  }

  handleSubmit (e) {
    e.preventDefault();
    if (this.props.purchaseOrderDetail.data.step !== Enum.PO_STEP.DRAFT) {
      sweetalert({
        icon: "error",
        title: "Warning!",
        text: "This PO already received!",
        buttons: false,
        timer: 1500
      });
      return;
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values = this.prepareFormDataForUpdate(values);

        if (values["POEntries"].length > 0) {
          this.dispatch(PurchaseOrderAction.update(values)); 
        } else {
          // HAVE NO PURCHASE ENTRY INCLUDE
          this.Message.warning(this.CATranslate("error_purchase_order_no_entry", this.props.locale), 3);
        }
      }
      
    });
  }

  prepareFormDataForUpdate(values) {
    values["id"] = this.props.purchaseOrderDetail.data.id;

    // PREPARE PO ENTRIES
    const purchaseEntries = [];
    if (values.purchaseQty) {
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
    }

    values["requestTotal"] = parseFloat(values["requestTotalValue"]);

    this.Util.clearObjProperty(values, [
      "productVariantId",
      "purchaseEntryId",
      "unitId",
      "productName",
      "variantName",
      "purchaseQty",
      "purchasePrice",
      "purchaseEntryStatus",
      "totalPrice",
      "totalAmount",
      "totalPriceValue",
      "searchProduct",
      "isFocusOnSearchCompositeProduct"
    ]);

    values["deliveryDueDate"] = this.Util.formatDateForMYSQL(values.deliveryDueDate);
    values["referenceId"] = this.props.purchaseOrderDetail.data.referenceId;
    values["shippingFee"] = this.props.purchaseOrderDetail.data.shippingFee;
    values["receiveTotal"] = this.props.purchaseOrderDetail.data.receiveTotal;
    values["returnTotal"] = this.props.purchaseOrderDetail.data.returnTotal;
    values["type"] = this.props.purchaseOrderDetail.data.type;
    values["status"] = this.props.purchaseOrderDetail.data.status;

    values["POEntries"] = purchaseEntries;

    return values;
  }

  handlePushToSupplier(){
    let values = this.props.form.getFieldsValue();
    values = this.prepareFormDataForUpdate(values);
    
    if (values["POEntries"].length > 0) {
      const supplier = this.Util.getDBFromLocalStorageById(Enum.LOCAL_SCHEMA.SUPPLIER, values["supplierId"]);
      this.dispatch(PurchaseOrderAction.showForm(null, Constant.SHOW_PUSH_PURCHASE_ORDER_TO_SUPPLIER_FORM));
      this.modal1 = <FormCreatePurchseOrderSendEmail
        formvalue={values}
        purchaseOrderDetail={this.props.purchaseOrderDetail.data}
        supplier={supplier}
        callBackGetEmail={this.props.callBackGetEmail}/>;
      
      // APPEND MORE DATA FOR EMAIL PO
      values["number"] = this.props.purchaseOrderDetail.data.number;
      values["referenceNumber"] = this.props.purchaseOrderDetail.data.reference ? this.props.purchaseOrderDetail.data.reference.number : null;
      values["supplier"] = supplier;
      values["location"] = this.Util.getDBFromLocalStorageById(Enum.LOCAL_SCHEMA.LOCATION, values["locationId"]);
      values["employee"] = this.props.purchaseOrderDetail.data.user;
      if (this.props.callBackGetEmailData) {
        this.props.callBackGetEmailData(values);
      }
    } else {
      // HAVE NO PURCHASE ENTRY INCLUDE
      this.Message.warning(this.CATranslate("error_purchase_order_no_entry", this.props.locale), 3);
    }
  }

  renderOtherAction(){
    
    if(this.props.purchaseOrderDetail.data == null) {
      return;
    }

    return (
      this.props.purchaseOrderDetail.data.step === Enum.PO_STEP.DRAFT ?
        <this.Button onClick={this.handlePushToSupplier} className="info btn-push-to-supplier">
          <span className="icon-push-button"></span> <this.Translate id="button_stock_purchase_order_push_to_supplier" />
        </this.Button>
        :
        ""
    );
  }
  
  handleCancel() {
    history.goBack();
  }

  render() {
    const {
      purchaseOrderUpdate, 
      form, 
      locale, 
      supplier,
      unit,
      storeLocation,
      productSearch,
      requestOrderNumber,
      purchaseOrderDetail,
      dispatch,
      buttonPushToSupplier
    } = this.props;
    
    let step = 0;

    if (this.props.purchaseOrderDetail.data) {
      step = this.props.purchaseOrderDetail.data.step;
    }

    return <div style={{marginBottom: 25, height: "100%"}}>
      <PageHeader
        style={{
            backgroundColor: "#f7f7f7",
            paddingLeft: 0,
            paddingRight: 0
        }}
        onBack={() => history.goBack()}
        title={<this.Translate id="text_po" />}
        subTitle={<div><this.Translate id="text_po" /><Badge count={this.PO_STEP_STR[step].name} style={{ backgroundColor: this.PO_STEP_STR[step].color}} /></div>}
        extra={[]}
      />
      {
        purchaseOrderDetail.fetched ?
        <Form autoComplete="off" onSubmit={this.handleSubmit} style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
          <FormItem 
            form={form} 
            formData={purchaseOrderDetail.data}
            supplier={supplier}
            unit={unit}
            productVariant={this.props.productVariant}
            storeLocation={storeLocation} 
            productSearch={productSearch}
            requestOrderNumber={requestOrderNumber}
            dispatch={dispatch} 
            buttonPushToSupplier={buttonPushToSupplier}
            reportProduct={this.props.reportProduct}
            locale={locale} />
          <this.Row style={{justifyContent: "center", marginTop: 25, marginBottom: 25}}>
            <this.Button className="danger" onClick={this.handleCancel}>
              <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_back" />
            </this.Button>  
            <this.Button htmlType="submit" loading={purchaseOrderUpdate.updating} className="info" style={{marginLeft: 15}} id="btnSubmit">
              <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />(Ctrl+s)
            </this.Button>
          </this.Row>
        </Form>
        :
        <div style={{width: 30, margin: "0 auto"}}>
          <Spin />
        </div>
      }
    </div>;
  }

  renderv2() {
    const {
      purchaseOrderUpdate, 
      form, 
      locale, 
      supplier,
      unit,
      storeLocation,
      productSearch,
      requestOrderNumber,
      purchaseOrderDetail,
      dispatch,
      buttonPushToSupplier
    } = this.props;

    this.submitLoading = purchaseOrderUpdate.updating;

    if (purchaseOrderDetail.showForm) {
      this.content = (
        <FormItem 
          form={form} 
          formData={purchaseOrderDetail.data}
          supplier={supplier}
          unit={unit}
          productVariant={this.props.productVariant}
          storeLocation={storeLocation} 
          productSearch={productSearch}
          requestOrderNumber={requestOrderNumber}
          dispatch={dispatch} 
          buttonPushToSupplier={buttonPushToSupplier}
          reportProduct={this.props.reportProduct}
          locale={locale} />
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}