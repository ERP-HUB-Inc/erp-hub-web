import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";
import ReceivePurchaseAction from "../../../actions/stock/receivePurchase";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.wrapClassName = "wrap-modal-po";
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

        if (values.receiveQuantity) {
          values.receiveQuantity.forEach((receiveQuantity, index) => {
            POEntries.push({
              id: values.purchaseOrderEntryId[index],
              productId: values.productId[index],
              receiveQuantity: parseInt(receiveQuantity, 10)
            });
          });
        }

        this.Util.clearObjProperty(values, [
          "purchaseOrderEntryId",
          "productId",
          "receiveQuantity",
          "price"
        ]);

        
        values["referenceId"] = this.props.receivePurchaseDetail.data.referenceId;
        values["requestTotal"] = this.props.receivePurchaseDetail.data.requestTotal;
        values["receiveTotal"] = parseFloat(values.receiveTotalValue);
        values["returnTotal"] = this.props.receivePurchaseDetail.data.returnTotal;
        values["step"] = Enum.PO_STEP.RECEIVED;
        values["type"] = this.props.receivePurchaseDetail.data.type;
        values["status"] = this.props.receivePurchaseDetail.data.status;
        values["POEntries"] = POEntries;

        this.dispatch(ReceivePurchaseAction.update(values));
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