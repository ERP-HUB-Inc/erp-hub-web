import React from "react";
import BaseModal from "@layout/BaseModal";
import FormItem from "./form.item.jsx";
import BrandAction from "../redux/action.js";

export default class FormCreate extends BaseModal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_brand" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values["image"]) {
          values["image"] = this.getImageFromUpload(values, "image");
        }
        this.dispatch(BrandAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(BrandAction.reset());
  }

  render() {
    const {brandAdd, form, locale} = this.props;
    
    this.submitLoading = brandAdd.adding;

    if (brandAdd.showForm) {
      this.content = <FormItem form={form} locale={locale} />;
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}