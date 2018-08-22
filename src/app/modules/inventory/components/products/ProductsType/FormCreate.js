import React from "react";
import FormItem from "./FormItem";
import { Modal } from "../../shares/Modal/modal";
import ProductsTypeAction from "../../../actions/products/productsType";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_products_products_type_title" />;
    this.addingPropReducer = "productsTypeAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        // this.dispatch(ProductsTypeAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(ProductsTypeAction.reset());
  }

  render() {
    const {productsTypeAdd, form, locale, productsType} = this.props;
    
    this.submitLoading = productsTypeAdd.adding;

    if (productsTypeAdd.showForm) {
      this.content = (
        <div>
          { productsTypeAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : "" }
          <FormItem form={form} formData={[]} productsType={[]} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}