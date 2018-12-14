import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";
import ReturnPurchaseAction from "../../../actions/stock/returnPurchase";
import "../ReceivePurchase/index.css";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.wrapClassName = "wrap-modal-po";
    this.title = <this.Translate id="text_return_purchase" />;
    this.confirmTextAction = <this.Translate id="text_confirm_return_po"/>;
    this.confirmTitle = <this.Translate id="text_confirm_return_po_title"/>;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

  }

  handleSubmit () {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) { 
        // PREPARE RECEIVED ENTRIES
        const POEntries = [];

        if (values.returnQuantity) {
          values.returnQuantity.forEach((returnQuantity, index) => {
            POEntries.push({
              id: values.purchaseOrderEntryId[index],
              productVariantId: values.productVariantId[index],
              returnQuantity,
              price: values.price[index]
            });

          });
        }

        this.Util.clearObjProperty(values, [
          "purchaseOrderEntryId",
          "productVariantId",
          "price",
          "returnQuantity"
        ]);

        values["id"] = this.props.returnPurchaseDetail.data.id;
        values["referenceId"] = this.props.returnPurchaseDetail.data.referenceId;
        values["shippingFee"] = 0;
        values["requestTotal"] = 0;
        values["receiveTotal"] = 0;
        values["returnTotal"] = parseFloat(values.returnTotalValue);
        values["step"] = Enum.PO_STEP.RETURN;
        values["type"] = this.props.returnPurchaseDetail.data.type;
        values["status"] = this.props.returnPurchaseDetail.data.status;

        values["POEntries"] = POEntries;

        this.dispatch(ReturnPurchaseAction.update(values));
      }
     
    });
  }

  handleReturn(){
    let tractReturnQTYInputOrNot = 0;
    const values = this.props.form.getFieldsValue();
    if (values.returnQuantity && Array.isArray(values.returnQuantity)) {
      values.returnQuantity.forEach(returnQuantity => {
        tractReturnQTYInputOrNot += returnQuantity;
      });
    }
    if (!(tractReturnQTYInputOrNot > 0)) {
      this.Message.warning(this.CATranslate("text_warning_no_item_return", this.props.locale));
      return;
    }

    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        this.setState({modalVisible: true});
        this.renderModalConfirmAction();
      }
    });
  }

  handleSubmitConfirmAction() {
    this.setState({modalVisible: false});
    this.handleSubmit();
  }

  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button onClick={this.handleCancel} className="danger btn-push-to-supplier">
          <span className="icon-cancel"></span> <this.Translate id="text_cancel"/>
        </this.Button>
        <this.Button onClick={this.handleReturn} className="info btn-push-to-supplier">
          <span className="icon-stock-return"></span> <this.Translate id="text_return"/>
        </this.Button>
      </div>
    );
  }
    
  handleCancel() {
    this.dispatch(ReturnPurchaseAction.reset());
  }

  render() {
    const {
      returnPurchaseUpdate, 
      returnPurchaseDetail, 
      supplier,
      product,
      storeLocation,
      form, 
      locale,
      dispatch
    } = this.props;

    this.submitConfirmActionLoading = returnPurchaseUpdate.updating;

    if (returnPurchaseDetail.showForm) {
      this.content = (
        <div>
          <FormItem 
            formData={returnPurchaseDetail.data} 
            supplier={supplier}
            product={product}
            storeLocation={storeLocation}
            form={form} 
            dispatch={dispatch}
            locale={locale}/>
          {this.renderModalConfirmAction()}
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}