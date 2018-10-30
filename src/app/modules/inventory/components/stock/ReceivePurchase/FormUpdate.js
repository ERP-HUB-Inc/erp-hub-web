import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";
import ReceivePurchaseAction from "../../../actions/stock/receivePurchase";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.width = "70%";
    this.confirmTextAction = <this.Translate id="text_confirm_receive"/>;
    this.confirmTitle = <this.Translate id="text_confirm_receive_title"/>;
    this.dispatch = this.props.dispatch;
    this.title = <this.Translate id="text_receive_order" />;
  }


  componentWillUpdate(nextProps) {
    if (nextProps.receivePurchaseUpdate.updated) {
      this.setState({modalVisible: false});
      this.props.dispatch(ReceivePurchaseAction.reset());
    }
  }

  handleSubmitConfirmAction() {
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
              requestQuantity: parseInt(values.qty[receiveQtyIndex], 10),
              receiveQuantity: parseInt(values.receiveQty[receiveQtyIndex], 10),
              price: parseFloat(values.receivePrice[receiveQtyIndex]),
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
          "totalPrice",
          "totalAmount"
        ]);

        
        values["referenceId"] = this.props.receivePurchaseDetail.data.referenceId;
        values["requestTotal"] = parseFloat(this.props.receivePurchaseDetail.data.requestTotal);
        values["receiveTotal"] = parseFloat(values.requestTotalValue);
        values["returnTotal"] = this.props.receivePurchaseDetail.data.returnTotal;
        values["step"] = Enum.PO_STEP.RECEIVED;
        values["type"] = this.props.receivePurchaseDetail.data.type;
        values["status"] = this.props.receivePurchaseDetail.data.status;
    
        values["POEntries"] = POEntries;

        this.dispatch(ReceivePurchaseAction.update(values));
        // const filter = JSON.stringify({step: [Enum.PO_STEP.PROCESS]});
        // this.dispatch(ReceivePurchaseAction.fetch(this.pageSize, 0, "", "", filter));
      }
    });
  }

  handleSubmit (e) {
    e.preventDefault();
    this.setState({modalVisible: true});
    this.renderModalConfirmAction();
  }

  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button onClick={this.handleCancel} className="danger btn-push-to-supplier">
          <span className="icon-save "></span> <this.Translate id="text_cancel"/>
        </this.Button>
        <this.Button htmlType="submit" className="info btn-push-to-supplier">
          <span className="icon-save "></span> <this.Translate id="text_receive"/>
        </this.Button>
      </div>
    );
  }

  handleCancel() {
    this.setState({modalVisible: false});
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
    
    this.submitConfirmActionLoading = receivePurchaseUpdate.updating;

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