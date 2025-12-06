import React from "react";
import FormItem from "./FormItem";
import VariantAttributeAction from "../redux/action";
import BaseModal from "@layout/base-modal";

export default class FormCreate extends BaseModal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_attribute" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(VariantAttributeAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(VariantAttributeAction.reset());
  }

  render() {
    const {
      variantAttributeAdd,
      form,
      locale
    } = this.props;
    if (variantAttributeAdd.showForm) {
      this.content = (
        <FormItem form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return <div />;
    }
  }
}