import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
import StockTransferAction from "../../../actions/stock/stockTransfer";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_stock_transfer" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.stockTransferUpdate.data.id;
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(StockTransferAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(StockTransferAction.reset());
  }

  render() {
    const {stockTransferUpdate, form, locale} = this.props;

    this.submitLoading = stockTransferUpdate.updating;

    if (stockTransferUpdate.showForm) {
      this.content = (
        <div>
          {stockTransferUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem formData={stockTransferUpdate.data} form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}