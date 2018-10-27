import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
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
        <FormItem form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}