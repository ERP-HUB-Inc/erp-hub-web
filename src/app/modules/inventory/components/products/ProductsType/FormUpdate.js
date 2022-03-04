import React from "react";
import FormItem from "./FormItem";
import ProductsTypeAction from "../../../actions/products/productsType";
import Constant from "../../../constants/products/productsType";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {

  title = <this.Translate id="text_category" />;

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.productsTypeDetail.data.id;
        this.props.dispatch(ProductsTypeAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.props.dispatch(ProductsTypeAction.reset(Constant.RESET_DETAIL_PRODUCTS_TYPE));
  }

  render() {
    this.submitLoading = this.props.productsTypeUpdate.updating;

    if (this.props.productsTypeDetail.showForm) {
      this.content = <FormItem
        formData={this.props.productsTypeDetail.data}
        languages={this.props.storeLanguage}
        dispatch={this.props.dispatch}
        productsType={this.props.productsTypeUpdate}
        form={this.props.form}
        locale={this.props.locale}/>;

      return super.render();
    } else {
      return <div/>;
    }
  }
}