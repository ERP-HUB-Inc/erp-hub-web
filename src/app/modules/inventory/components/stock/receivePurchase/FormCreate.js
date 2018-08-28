import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
import ReceivePurchaseAction from "../../../actions/stock/receivePurchase";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_stock_supplier_title" />;
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
    const {supplierAdd, form, locale} = this.props;
    
    this.submitLoading = supplierAdd.adding;

    if (supplierAdd.showForm) {
      this.content = (
        <div>
          { supplierAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : "" }
          <FormItem form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}