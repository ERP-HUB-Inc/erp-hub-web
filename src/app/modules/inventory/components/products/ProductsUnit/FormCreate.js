import React from "react";
import FormItem from "./FormItem";
import { Modal } from "../../shares/Modal/modal";
import ManageEmployeeAction from "../../../actions/products/productsUnit";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_products_unit_title" />;
    this.addingPropReducer = "productsUnitAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(ManageEmployeeAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(ManageEmployeeAction.reset());
  }

  render() {
    const {productsUnitAdd, form, locale} = this.props;
    console.log("Product Unit Loading");
    this.submitLoading = productsUnitAdd.adding;

    if (productsUnitAdd.showForm) {
      this.content = (
        <FormItem form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}