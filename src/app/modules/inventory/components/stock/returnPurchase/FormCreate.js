import React from "react";
import FormItem from "./FormItem";
import ReturnPurchaseAction from "../../../actions/stock/returnPurchase";
import Modal from "../../../../common/components/shares/Modal";

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
        <FormItem form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}