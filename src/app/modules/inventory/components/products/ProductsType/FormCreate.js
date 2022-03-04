import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
import ProductsTypeAction from "../../../actions/products/productsType";

export default class FormCreate extends Modal {
  title = <this.Translate id="text_category" />;

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch(ProductsTypeAction.add(values)); 
      }
    });
  }
      
  handleCancel() {
    this.props.dispatch(ProductsTypeAction.reset());
  }

  render() {
    this.submitLoading = this.props.productsTypeAdd.adding;

    if (this.props.productsTypeAdd.showForm) {
      this.content = <FormItem
        form={this.props.form}
        languages={this.props.storeLanguage}
        dispatch={this.props.dispatch}
        productsType={[]}
        locale={this.props.locale}/>;
      return super.render();
    } else {
      return <div/>;
    }
  }
}