import React from "react";
import Modal from "../../../../common/components/shares/Modal";
import {Util} from "../../../../common/util";
import Enum from "../../../../common/enums";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      type: this.Enum.OPERATION_TYPE.EXPENSE
    };
    this.operationTypes = [
      {title: <this.Translate id="operation_record_expense" />, value: this.Enum.OPERATION_TYPE.EXPENSE},
      {title: <this.Translate id="operation_record_income" />, value: this.Enum.OPERATION_TYPE.INCOME}
    ];
    this.handleSelectType = this.handleSelectType.bind(this);
  }

  componentDidMount() {
    this.setState({type: this.props.formData.type});
  }

  handleSelectType(type) {
    this.props.form.setFieldsValue({type});
    this.setState({type});
  }

  render() {
    const {formData, form, locale} = this.props;
    return (
      <div>
        <this.InputText
          data={formData.name}
          name="name"
          label={<this.Translate id="text_description" />}
          placeholder={this.CATranslate("text_description", locale)}
          errorRequired={<this.Translate id="error_require_description" />}
          errorLenght={<this.Translate id="error_operation_record_name_length" />}
          required={true}
          isAutoFocus={true}
          max={100}
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
          label={<this.Translate id="text_amount" />}
          placeholder={this.CATranslate("text_amount", locale)}
          required={true}
          isAutoSelect={true}
          errorRequired={<this.Translate id="error_require_amount" />}
          form={form}/>
        <this.InputNumber
          data={formData.type}
          name="type"
          className="hidden"
          form={form}/>
        <div className="wrap-income-exp-box">
          { this.operationTypes.map((operationType, key) => 
            <div key={key} className={`text-center text-uppercase ca-box ${this.state.type === operationType.value ? "active" : ""}`} onClick={() => this.handleSelectType(operationType.value)}>
              {operationType.title}
            </div> 
          ) 
          }
        </div>
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name: "",
    registerDate: (new Util()).getCurrentDate(),
    amount: 0,
    type: Enum.OPERATION_TYPE.EXPENSE,
    status: 1
  }
};