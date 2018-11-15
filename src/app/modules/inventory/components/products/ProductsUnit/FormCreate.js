import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
import UnitAction from "../../../actions/products/productsUnit";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_unit" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(UnitAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(UnitAction.reset());
  }

  render() {
    const {productsUnitAdd, form, locale} = this.props;
    this.submitLoading = productsUnitAdd.adding;

    if (productsUnitAdd.showForm) {
      this.content = <FormItem form={form} locale={locale}/>;
      return super.render();
    } else {
      return <div/>;
    }
  }
}