import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import CurrencyAction from "../../../action/settings/currency";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Update Currency";
    this.addingPropReducer = "currencyUpdate";
    this.dispatch = this.props.dispatch;
  }
  handleSubmit() {
    const { formUpdate } = this.props;
    this.dispatch(CurrencyAction.update(formUpdate.values));
  }
    
  handleCancel() {
    this.dispatch(CurrencyAction.reset());
  }
  
  render() {
    const { currencyUpdate } = this.props;
    if (currencyUpdate.showForm) {
      this.content = (
        <div> 
          {currencyUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText name="name" data={ currencyUpdate.data.name } label="Name" placeholder="Please input your name" required={true} min={ 3 } max={100}/>
          <InputText type="text" data={ currencyUpdate.data.symbol } name="symbol" placeholder="Symbol"  label="Symbol"/>
          <InputNumber type="number" data={ currencyUpdate.data.value } name="value" placeholder="Value"  label="Value"/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}