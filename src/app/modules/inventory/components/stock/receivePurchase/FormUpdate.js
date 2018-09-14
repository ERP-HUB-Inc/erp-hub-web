import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";
import ReceivePurchaseAction from "../../../actions/stock/receivePurchase";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };
    this.width = "65%";
    this.confirmTextAction = "Are You Want to Receive ?";
    this.dispatch = this.props.dispatch;
    this.title = <this.Translate id="update_stock_receive_purchase_title" />;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReceive = this.handleReceive.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleReceive(){
    this.setState({modalVisible: true});
    this.renderModalConfirmAction();
  }

  handleSubmitConfirmAction() {
    this.setState({modalVisible: false});
    this.handleSubmit();
  }

  handleSubmit () {
    this.props.form.validateFieldsAndScroll((err, values) => {

      if (!err) { 
        values["id"] = this.props.receivePurchaseDetail.data.id;

        // PREPARE RECEIVED ENTRIES
        const POEntries = [];

        if (values.receiveQty) {
          values.receiveQty.forEach((receiveQty, receiveQtyIndex) => {
            POEntries.push({
              id: values.receiveId[receiveQtyIndex],
              productId: values.productId[receiveQtyIndex],
              requestQuantity: values.qty[receiveQtyIndex],
              receiveQuantity: values.receiveQty[receiveQtyIndex],
              price: values.receivePrice[receiveQtyIndex],
              status: values.statusId[receiveQtyIndex],
            });

          });
        }

        this.Util.clearObjProperty(values, [
          "receiveId",
          "productId",
          "qty",
          "receiveQty",
          "receivePrice",
          "receiveDescription",
          "totalAmount"
        ]);

       
        values["shippingFee"] = this.props.receivePurchaseDetail.data.shippingFee;
        values["requestTotal"] = this.props.receivePurchaseDetail.data.requestTotal;
        values["receiveTotal"] = this.props.receivePurchaseDetail.data.receiveTotal;
        values["returnTotal"] = this.props.receivePurchaseDetail.data.returnTotal;
        values["step"] = Enum.PO_STEP.RECEIVED;
        values["type"] = this.props.receivePurchaseDetail.data.type;
        values["status"] = this.props.receivePurchaseDetail.data.status;

        values["POEntries"] = POEntries;

        // console.log("Update Values:", values);

        this.dispatch(ReceivePurchaseAction.update(values));
        const filter = JSON.stringify({step: [Enum.PO_STEP.PROCESS]});
        this.dispatch(ReceivePurchaseAction.fetch(this.pageSize, 0, "", "", filter));
      }

    });
  }

  
  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button onClick={this.handleCancel} className="danger btn-push-to-supplier">
          <span className="icon-save "></span> Cancel
        </this.Button>
        <this.Button onClick={this.handleReceive} className="info btn-push-to-supplier">
          <span className="icon-save "></span> Receive
        </this.Button>
      </div>
    );
  }

  handleCancel() {
    this.dispatch(ReceivePurchaseAction.reset());
  }

  render() {
    const {
      receivePurchaseUpdate,
      receivePurchaseDetail,
      storeLocation,
      receivePurchase,
      supplier,
      dispatch, 
      form, 
      locale
    } = this.props;
    
    this.submitLoading = receivePurchaseUpdate.updating;

    if (receivePurchaseDetail.showForm) {
      this.content = (
        <div>
          <FormItem 
            formData={receivePurchaseDetail.data} 
            storeLocation={storeLocation} 
            receivePurchase={receivePurchase} 
            supplier={supplier} 
            dispatch={dispatch} 
            form={form} 
            locale={locale}
          />
          {this.renderModalConfirmAction()}
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}