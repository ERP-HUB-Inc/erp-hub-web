import React from "react";
import FormItem from "./FormItem";
import VariantAttribute from "../../../actions/products/variantAttribute";
import Modal from "../../../../common/components/shares/Modal";

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
        this.dispatch(VariantAttribute.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(VariantAttribute.reset());
  }

  render() {
    const {brandUpdate, form, locale} = this.props;

    this.submitLoading = brandUpdate.updating;

    if (brandUpdate.showForm) {
      this.content = (
        <FormItem formData={brandUpdate.data} form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}