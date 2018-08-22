import React from "react";
import FormItem from "./FormItem";
import { Modal } from "../../shares/Modal/modal";
import ProductsTagAction from "../../../actions/products/productsTag";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };

    this.title = <this.Translate id="update_products_tag_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.productsTagUpdate.data.id;
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(ProductsTagAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(ProductsTagAction.reset());
  }

  render() {
    const {productsTagUpdate, form, locale} = this.props;

    if (productsTagUpdate.showForm) {
      this.content = (
        <div>
          {productsTagUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem formData={productsTagUpdate.data} form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}