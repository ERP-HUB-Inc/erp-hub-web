import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { Select } from "../../../../common/elements/ant-ui/Select";
import IncomeExpenseAction from "../../../action/settings/incomeAndExpense";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Income Expense";
    this.addingPropReducer = "incomeAndExpenseAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(IncomeExpenseAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(IncomeExpenseAction.reset());
  }

  render() {
    const {incomeAndExpenseAdd, form} = this.props;

    if (incomeAndExpenseAdd.showForm) {
      this.content = (
        <div>
          {incomeAndExpenseAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText
            name="name"
            label="Name"
            placeholder="Please input your name"
            required={true}
            errorRequired="Please input your name"
            max={100}
            form={form}/>
          <InputText
            type="number"
            name="description"
            label="Description"
            placeholder="Description"
            max={255}
            form={form}/>
          <Select
            name="status"
            label="Status"
            placeholder="Please select status"
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