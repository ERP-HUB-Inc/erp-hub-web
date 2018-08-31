import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
import SupplierAction from "../../../actions/stock/reorderPoint";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };

    this.title = <this.Translate id="update_stock_reorderPoint_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.reorderPointUpdate.data.id;
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(SupplierAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(SupplierAction.reset());
  }

  render() {
    const {reorderPointUpdate, form, locale} = this.props;

    this.submitLoading = reorderPointUpdate.updating;

    if (reorderPointUpdate.showForm) {
      this.content = (
        <div>
          {reorderPointUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem formData={reorderPointUpdate.data} form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}