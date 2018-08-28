import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
import StockTransferAction from "../../../actions/stock/stockTransfer";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_stock_purchase_order_title" />;
    this.addingPropReducer = "stockTransferAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(StockTransferAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(StockTransferAction.reset());
  }

  render() {
    const {stockTransferAdd, form, locale} = this.props;
    
    this.submitLoading = stockTransferAdd.adding;

    if (stockTransferAdd.showForm) {
      this.content = (
        <div>
          { stockTransferAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : "" }
          <FormItem form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}