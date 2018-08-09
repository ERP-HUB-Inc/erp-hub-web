import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { Select } from "../../../../common/elements/ant-ui/Select";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import CurrencyAction from "../../../action/settings/currency";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Update Currency";
    this.addingPropReducer = "currencyUpdate";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {currencyUpdate} = this.props;
        values["id"] = currencyUpdate.data.id;
        values["value"] = Number(values.value);
        this.dispatch(CurrencyAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(CurrencyAction.reset());
  }
  
  render() {
    const { currencyUpdate, form } = this.props;
    if (currencyUpdate.showForm) {
      this.content = (
        <div> 
          {currencyUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText form={form} name="name" data={ currencyUpdate.data.name } label="Name" placeholder="Please input your name" required={true} min={ 3 } max={100}/>
          <InputText form={form} type="text" data={ currencyUpdate.data.symbol } name="symbol" placeholder="Symbol"  label="Symbol"/>
          <InputNumber form={form} type="number" data={ currencyUpdate.data.value } name="value" placeholder="Value"  label="Value"/>
          <Select
            name="status"
            label="Status"
            placeholder="Please select status"
            dataSource={this.statusDataSource}
            defaultValue={currencyUpdate.data.status}
            form={form}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}