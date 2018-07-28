import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import TaxAction from "../../../action/settings/tax";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Tax";
    this.addingPropReducer = "TaxAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(TaxAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(TaxAction.reset());
  }
  
  render() {
    const { TaxAdd, form } = this.props;
    if (TaxAdd.showForm) {
      this.content = (
        <div>
          {TaxAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText form={form} name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputNumber form={form} type="number" name="rate" label="Rate" placeholder="Rate" />
          <InputText form={form} name="labelOnInvoice" label="Label On Invoice" placeholder="Label On Invoice" max={255}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}