import React from "react";
import Modal from "../../shares/Modal";
import TaxAction from "../../../action/settings/tax";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Tax";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["rate"] = Number(values.rate);
        this.dispatch(TaxAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(TaxAction.reset());
  }
  
  render() {
    const { TaxAdd, form } = this.props;

    this.submitLoading = TaxAdd.adding;
    
    if (TaxAdd.showForm) {
      this.content = (
        <div>
          {TaxAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <this.InputText form={form} name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <this.InputNumber form={form} type="number" name="rate" label="Rate" placeholder="Rate" />
          <this.InputText form={form} name="labelOnInvoice" label="Label On Invoice" placeholder="Label On Invoice" max={255}/>
          <this.Select
            name="status"
            label="Status"
            dataSource={this.statusDataSource}
            defaultValue={1}
            form={form}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}