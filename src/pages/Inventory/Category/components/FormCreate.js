import React from "react";
import FormItem from "./FormItem";
import BaseModal from "@layout/BaseModal";
import CategoryAction from "../redux/action";

export default class FormCreate extends BaseModal {
  title = <this.Translate id="text_category" />;

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values["image"]) {
          values["image"] = this.getImageFromUpload(values, "image");
        }
        
        this.props.dispatch(CategoryAction.add(values)); 
      }
    });
  }
      
  handleCancel() {
    this.props.dispatch(CategoryAction.reset());
  }

  render() {
    this.submitLoading = this.props.productsTypeAdd.adding;

    if (this.props.productsTypeAdd.showForm) {
      this.content = <FormItem
        form={this.props.form}
        dispatch={this.props.dispatch}
        locale={this.props.locale}/>;
      return super.render();
    } else {
      return <div/>;
    }
  }
}