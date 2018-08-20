import React from "react";
import FormItem from "./FormItem";
import { Modal } from "../../shares/Modal/modal";
import BrandAction from "../../../actions/products/brand";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };

    this.title = <this.Translate id="update_products_brand_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.brandUpdate.data.id;
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(BrandAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(BrandAction.reset());
  }

  render() {
    const {brandUpdate, form, locale} = this.props;

    if (brandUpdate.showForm) {
      this.content = (
        <div>
          {brandUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem formData={brandUpdate.data} form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}