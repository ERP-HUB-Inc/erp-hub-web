import React from "react";
import FormItem from "./FormItem";
import { Modal } from "../../shares/Modal/modal";
import StockManagementAction from "../../../actions/stock/stockManagement";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_stock_stockManagement_title" />;
    this.addingPropReducer = "brandAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(StockManagementAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(StockManagementAction.reset());
  }

  render() {
    const {stockManagementAdd, form, locale} = this.props;
    
    this.submitLoading = stockManagementAdd.adding;

    if (stockManagementAdd.showForm) {
      this.content = (
        <div>
          { stockManagementAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : "" }
          <FormItem form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}