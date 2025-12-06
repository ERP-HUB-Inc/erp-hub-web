import React from "react";
import BaseModal from "@layout/base-modal";
import FormItem from "./form.item";
import CategoryAction from "../redux/action";
import Constant from "../redux/constant";


export class FormUpdate extends BaseModal {

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
        if (values["image"]) {
          values["image"] = this.getImageFromUpload(values, "image");
        }
        this.props.dispatch(CategoryAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.props.dispatch(CategoryAction.reset(Constant.RESET_DETAIL_CATEGORY));
  }

  render() {
    this.submitLoading = this.props.productsTypeUpdate.updating;
  
    if (this.props.productsTypeDetail.showForm) {
      this.content = <FormItem
        formData={this.props.productsTypeDetail.data}
        dispatch={this.props.dispatch}
        form={this.props.form}
        locale={this.props.locale}/>;

      return super.render();
    } else {
      return <div/>;
    }
  }
}