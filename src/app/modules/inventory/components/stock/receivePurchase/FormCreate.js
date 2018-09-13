import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
import ReceivePurchaseAction from "../../../actions/stock/receivePurchase";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_stock_receive_purchase_title" />;
    this.width = "65%";
    this.addingPropReducer = "receivePurchaseAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(ReceivePurchaseAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(ReceivePurchaseAction.reset());
  }

  render() {

    const {
      receivePurchaseAdd,
      supplier,
      product,
      storeLocation,
      form,
      locale,
      dispatch
    } = this.props;
    
    this.submitLoading = receivePurchaseAdd.adding;

    if (receivePurchaseAdd.showForm) {
      this.content = (
        <FormItem 
          form={form} 
          supplier={supplier}
          product={product} 
          storeLocation={storeLocation} 
          dispatch={dispatch} 
          locale={locale}
        />
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}