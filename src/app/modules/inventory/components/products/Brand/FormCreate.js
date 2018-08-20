import React from "react";
import FormItem from "./FormItem";
import { Modal } from "../../shares/Modal/modal";
import BrandAction from "../../../actions/products/brand";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_products_brand_title" />;
    this.addingPropReducer = "brandAdd";
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
        <div>
          { brandAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : "" }
          <FormItem form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}