import React from "react";
import FormItem from "./FormItem";
import ProductsTagAction from "../../../actions/products/productsTag";
import Modal from "../../../../common/components/shares/Modal";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_products_tag_title" />;
    this.addingPropReducer = "productsTagAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(ProductsTagAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(ProductsTagAction.reset());
  }

  render() {
    const {productsTagAdd, form, locale} = this.props;
    
    this.submitLoading = productsTagAdd.adding;

    if (productsTagAdd.showForm) {
      this.content = <FormItem form={form} locale={locale}/>;
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}