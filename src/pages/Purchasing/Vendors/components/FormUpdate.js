import React from "react";
import FormItem from "./FormItem";
import BaseModal from "../../../../layout/BaseModal";
import Action from "../redux/action";

export default class Form extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };

    this.title = <this.Translate id="text_supplier" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.supplierUpdate.data.id;
        this.dispatch(Action.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(Action.reset());
  }

  render() {
    const {supplierUpdate, form, locale} = this.props;

    this.submitLoading = supplierUpdate.updating;

    if (supplierUpdate.showForm) {
      this.content = (
        <div>
          {supplierUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem formData={supplierUpdate.data} form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}