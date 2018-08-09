import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import TaxAction from "../../../action/settings/tax";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Tax";
    this.dispatch = this.props.dispatch;
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {taxUpdate} = this.props;
        values["id"] = taxUpdate.data.id;
        this.dispatch(TaxAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(TaxAction.reset());
  }
  
  render() {
    const { taxUpdate, form } = this.props;

    this.submitLoading = taxUpdate.updating;
    
    if (taxUpdate.showForm) {
      this.content = (
        <div>
          {taxUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText form={form} data={ taxUpdate.data.name } name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputNumber form={form} data={ taxUpdate.data.rate } type="number" name="rate" label="Rate" placeholder="Rate" />
          <InputText form={form} data={ taxUpdate.data.labelOnInvoice } name="labelOnInvoice" label="Label On Invoice" placeholder="Label On Invoice" max={255}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}