import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
import ReturnPurchaseAction from "../../../actions/stock/returnPurchase";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_stock_return_purchase_title" />;
    this.addingPropReducer = "returnPurchaseAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(ReturnPurchaseAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(ReturnPurchaseAction.reset());
  }

  render() {
    const {returnPurchaseAdd, form, locale} = this.props;
    
    this.submitLoading = returnPurchaseAdd.adding;

    if (returnPurchaseAdd.showForm) {
      this.content = (
        <div>
          { returnPurchaseAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : "" }
          <FormItem form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}