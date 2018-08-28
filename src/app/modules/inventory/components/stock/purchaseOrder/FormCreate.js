import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_stock_purchase_order_title" />;
    this.width = "80%";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(PurchaseOrderAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(PurchaseOrderAction.reset());
  }

  render() {
    const {purchaseOrderAdd, form, locale} = this.props;
    
    this.submitLoading = purchaseOrderAdd.adding;

    if (purchaseOrderAdd.showForm) {
      this.content = (
        <div>
          { purchaseOrderAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : "" }
          <FormItem form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}