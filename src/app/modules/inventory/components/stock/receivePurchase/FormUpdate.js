import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
import ReceivePurchaseAction from "../../../actions/stock/receivePurchase";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };
    // this.closeModal = this.closeModal;
    this.dispatch = this.props.dispatch;
    this.title = <this.Translate id="update_stock_receive_purchase_title" />;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReceive = this.handleReceive.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleReceive(){
    this.setState({modalVisible: true});
    this.renderModalConfirm();
  }

  handleSubmit (e) {
    e.preventDefault();
    alert("dd");
    // this.props.form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //     values["id"] = this.props.receivePurchaseUpdate.data.id;
    //     values["status"] = this.Enum.ACTIVE;
    //     this.dispatch(ReceivePurchaseAction.update(values));
    //   }
    // });
  }

  renderCrudAction(){
    return(
      <div>
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
    const {receivePurchaseUpdate,storeLocation,receivePurchase,supplier,dispatch, form, locale} = this.props;

    this.submitLoading = receivePurchaseUpdate.updating;

    if (receivePurchaseUpdate.showForm) {
      this.content = (
        <div>
          {receivePurchaseUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem formData={receivePurchaseUpdate.data} storeLocation={storeLocation} receivePurchase={receivePurchase} supplier={supplier} dispatch={dispatch} form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}