import React from "react";
import FormItem from "./FormItem";
import BrandAction from "../../../actions/products/brand";
import Modal from "../../../../common/components/shares/Modal";

export default class FormCreate extends Modal {
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
      this.content = (
        <FormItem form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}