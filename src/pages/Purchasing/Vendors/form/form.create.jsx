import React from "react";
import FormItem from "./form.item";
import BaseModal from "@layout/base-modal";
import Action from "../redux/action";

export default class FormCreate extends BaseModal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_supplier" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(Action.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(Action.reset());
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