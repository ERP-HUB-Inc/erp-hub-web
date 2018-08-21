import React from "react";
import FormItem from "./FormItem";
import { Modal } from "../../shares/Modal/modal";
import BrandAction from "../../../actions/products/productsType";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };

    this.title = <this.Translate id="update_products_products_type_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.productsTypeUpdate.data.id;
        values["status"] = this.Enum.ACTIVE;
        console.log(values);
        // this.dispatch(BrandAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(BrandAction.reset());
  }

  render() {
    const {productsTypeUpdate, form, locale, productsType} = this.props;
    if (productsTypeUpdate.showForm) {
      this.content = (
        <div>
          {productsTypeUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem formData={productsType} productsType={productsType} form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}