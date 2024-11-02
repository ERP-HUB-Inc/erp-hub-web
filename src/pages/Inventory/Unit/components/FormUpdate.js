import React from "react";
import FormItem from "./FormItem";
import BaseModal from "@layout/BaseModal";
import UnitAction from "../redux/action";


export default class Form extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };

    this.title = <this.Translate id="text_unit" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.productsUnitUpdate.data.id;
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(UnitAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(UnitAction.reset());
  }

  render() {
    const {productsUnitUpdate, form, locale} = this.props;

    this.submitLoading  = productsUnitUpdate.updating;

    if (productsUnitUpdate.showForm) {
      this.content = (
        <div>
          {productsUnitUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem formData={productsUnitUpdate.data} form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}