import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import CurrencyAction from "../../../action/settings/currency";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Currency";
    this.addingPropReducer = "currencyAdd";
    this.dispatch = this.props.dispatch;
  }
  handleSubmit() {
    const { currencyFormAdd } = this.props;
    this.dispatch(CurrencyAction.add(currencyFormAdd.values));
  }
    
  handleCancel() {
    this.dispatch(CurrencyAction.reset());
  }
  
  render() {
    const { currencyAdd } = this.props;
    if (currencyAdd.showForm) {
      this.content = (
        <div> 
          {currencyAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText name="name" label="Name" placeholder="Please input your name" required={true} min={ 3 } max={100}/>
          <InputText type="text" name="symbol" placeholder="Symbol"  label="Symbol"/>
          <InputNumber type="number" name="value" placeholder="Value"  label="Value"/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}