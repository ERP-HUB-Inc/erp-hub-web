import React from "react";
import Modal from "../../shares/Modal";
import "./index.css"; 
import operationRecordAction from "../../../action/settings/operationRecord";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "operation Record";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.operationTypes = [
      {title: <this.Translate id="operation_record_income" />, value: this.Enum.OPERATION_TYPE.INCOME},
      {title: <this.Translate id="operation_record_expense" />, value: this.Enum.OPERATION_TYPE.EXPENSE}
    ];
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
          <this.InputNumber form={form} name="amount" label="Amount ($)" placeholder="Amount" required/>
          {/* <this.InputTextArea form={form} name="name" label="Description" placeholder="Description" required={true} max={100}/> */}
          <this.FormGroup>
            <this.RadioBox  
              class_main_radio="main-radio-acc"
              name="type"
              defaultValue={this.Enum.OPERATION_TYPE.INCOME}
              required={true}
              type="radio"
              form={form}
            >
              { this.operationTypes.map( (operationType, key) => 
                <this.RadioChildBox
                  key={key}
                  title={operationType.title}
                  value={operationType.value} /> 
              ) 
              }
            </this.RadioBox> 
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