import React from "react";
import Modal from "../../shares/Modal";
import operationRecordAction from "../../../action/settings/operationRecord";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "operation Record:Update";
    this.addingPropReducer = "operationRecordUpdate";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {operationRecordUpdate} = this.props;
        values["id"] = operationRecordUpdate.data.id;
        values["amount"] = Number(values.amount);
        this.dispatch(operationRecordAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(operationRecordAction.reset());
  }
  
  render() {
    const { operationRecordUpdate, form } = this.props;

    this.submitLoading = operationRecordUpdate.updating;
    
    if (operationRecordUpdate.showForm) {
      this.content = (
        <div className="main-operation-record">
          {operationRecordUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <this.InputText form={form} name="name" data={ operationRecordUpdate.data.name }  label="Name" placeholder="Please input your name" required={true} min={ 3 } max={ 100 }/>
          <this.DatePickers 
            type="date"
            defaultValue= { `${ operationRecordUpdate.data.registerDate }` }
            name="registerDate"  
            label="Record For" 
            required={false } 
            placeholder="Please input your name" 
            form={form} 
          />
          <this.InputNumber 
            form={form} 
            type="number"   
            data={ operationRecordUpdate.data.amount } 
            name="amount" 
            label="Amount ($)" 
            placeholder="Amount" 
            required = { true }
          />
          {/* <this.InputTextArea form={form} name="name" label="Description" placeholder="Description" required={true} max={100}/> */}
          <this.FormGroup>
            <this.RadioRegisterGroup 
              name="type" 
              defaultValue={ `${ operationRecordUpdate.data.type }` }
              required={true}
              form={form}
            >
              <this.RadioRegister title="INCOME"  value="0"/>
              <this.RadioRegister title="Expense" value="1"/>
            </this.RadioRegisterGroup> 
          </this.FormGroup>
          <this.Select
            name="status"
            label="Status"
            placeholder="Please select status"
            dataSource={this.statusDataSource}
            defaultValue={operationRecordUpdate.data.status}
            form={form}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}