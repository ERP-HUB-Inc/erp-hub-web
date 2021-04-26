import React from "react";
import FormItem from "./FormItem";
import VariantAttributeAction from "../../../actions/products/variantAttribute";
import Modal from "../../../../common/components/shares/Modal";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_variant_attribute_title" />;
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
    const {variantAttributeAdd, form, locale} = this.props;
    
    this.submitLoading = variantAttributeAdd.adding;

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