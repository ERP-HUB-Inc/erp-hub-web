import React from "react";
import Modal from "../../../../common/components/shares/Modal";
import {Util} from "../../../../common/util";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.operationTypes = [
      {title: <this.Translate id="operation_record_income" />, value: this.Enum.OPERATION_TYPE.INCOME},
      {title: <this.Translate id="operation_record_expense" />, value: this.Enum.OPERATION_TYPE.EXPENSE}
    ];
  }
  render() {
    const {formData, form, locale} = this.props;
    return (
      <div>
        <this.InputText
          data={formData.name}
          name="name"
          label={<this.Translate id="text_name" />}
          placeholder={this.CATranslate("text_name", locale)}
          required={true}
          isAutoFocus={true}
          min={3}
          max={100}
          errorLenght={<this.Translate id="error_operation_record_name_length" />}
          form={form}/>
        <this.DatePickers
          name="registerDate"  
          label={<this.Translate id="input_operation_record_for" />}
          placeholder={this.CATranslate("input_operation_record_for", locale)}
          defaultValue={this.Util.formatDatePicker(formData.registerDate)} 
          form={form}/>
        <this.InputNumber
          data={formData.amount}
          name="amount"
          label={<this.Translate id="input_operation_record_amount" />}
          placeholder={this.CATranslate("input_operation_record_amount", locale)}
          required={true}
          isAutoSelect={true}
          form={form}/>
        <this.FormGroup style={{width: "100%"}}>
          <this.RadioBox  
            class_main_radio="main-radio-acc"
            name="type"
            defaultValue={formData.type}
            required={true}
            type="radio"
            form={form}>
            { this.operationTypes.map( (operationType, key) => 
              <this.RadioChildBox
                key={key}
                title={operationType.title}
                value={operationType.value} /> 
            ) 
            }
          </this.RadioBox> 
        </this.FormGroup>
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name: "",
    registerDate: (new Util()).getCurrentDate(),
    amount: 0,
    type: 0,
    status: 1
  }
};