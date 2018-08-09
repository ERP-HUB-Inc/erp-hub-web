import React from "react";
import Modal from "../../shares/Modal";
import "./index.css"; 
import operationRecordAction from "../../../action/settings/operationRecord";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "operation Record";
    this.addingPropReducer = "operationRecordAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  } 

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["amount"] = Number(values.amount);
        this.dispatch(operationRecordAction.add(values));
      }
    }); 
  }
    
  handleCancel() {
    this.dispatch(operationRecordAction.reset());
  }
  
  render() {
    const { operationRecordAdd, form } = this.props;

    this.submitLoading = operationRecordAdd.adding;
    
    if (operationRecordAdd.showForm) {
      this.content = (
        <div className="main-operation-record">
          {operationRecordAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <this.InputText form={form} name="name" label="Name" placeholder="Please input your name" required={true} min={ 3 } max={ 100 }/>
          <this.DatePickers form={form} name="registerDate" label="Record For" required={false } placeholder="Please input your name" />
          <this.InputNumber form={form} name="amount" label="Amount ($)" placeholder="Amount" />
          {/* <this.InputTextArea form={form} name="name" label="Description" placeholder="Description" required={true} max={100}/> */}
          <this.FormGroup>
            <this.RadioRegisterGroup  
              class_main_radio="main-radio-acc"
              name="type" 
              required={ true }
              type="radio"
              form={form}
            >
              <this.RadioRegister title="INCOME"  value="0"/>
              <this.RadioRegister title="Expense" value="1"/>
            </this.RadioRegisterGroup> 
          </this.FormGroup>
          <this.Select
            name="status"
            label="Status"
            defaultValue={ 1 }
            placeholder="Please select status"
            dataSource={this.statusDataSource}
            form={form}/>
        </div>  
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}