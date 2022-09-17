import React from "react";
import { Icon } from "antd";
import Modal from "../../../../common/components/shares/Modal";
import Util from "../../../../common/util";
import Enum from "../../../../common/enums";

export default class FormItem extends Modal {
  categories = [
    { name: "General Expense" },
    { name: "Admin Fee" },
    { name: "Auto & Fuel" },
    { name: "Bank Fee" },
    { name: "Consulting" },
    { name: "Education" },
    { name: "Management Fee Paid" },
    { name: "Meals and Dining" },
    { name: "Medical" },
    { name: "Office Expenses" },
    { name: "Office Rent" },
    { name: "Office Suppliers" },
    { name: "Office Utilities" },
    { name: "Other" },
    { name: "Parking" },
    { name: "Salary" },
    { name: "Shipping" },
    { name: "Software" },
    { name: "Training and Certification" },
    { name: "Travel" },
    { name: "Uniforms" },
  ];
  constructor(props) {
    super(props);
    this.state = {
      type: this.Enum.OPERATION_TYPE.EXPENSE,
    };
    this.operationTypes = [
      {
        title: <this.Translate id="text_expense" />,
        value: this.Enum.OPERATION_TYPE.EXPENSE,
      },
      {
        title: <this.Translate id="operation_record_income" />,
        value: this.Enum.OPERATION_TYPE.INCOME,
      },
    ];
    this.handleSelectType = this.handleSelectType.bind(this);
  }

  componentDidMount() {
    this.setState({ type: this.props.formData.type });
  }

  handleSelectType(type) {
    this.props.form.setFieldsValue({ type });
    this.setState({ type });
  }

  render() {
    const { formData, form, locale } = this.props;
    return (
      <div>
        <this.Select
          name="category"
          label={<this.Translate id="text_category" />}
          dataSource={this.categories.map((category) => ({
            name: category.name,
            value: category.name,
          }))}
          defaultValue={
            formData.id ? formData.category : this.categories[0].name
          }
          required={true}
          form={form}
        />
        <this.InputTextArea
          data={formData.name}
          name="name"
          label={<this.Translate id="text_description" />}
          placeholder="Tell something about your income or expense..."
          errorRequired={<this.Translate id="error_require_description" />}
          errorLenght={
            <this.Translate id="error_operation_record_name_length" />
          }
          required={true}
          isAutoFocus={true}
          max={100}
          form={form}
        />
        <this.DatePickers
          name="date"
          label={<this.Translate id="input_operation_record_for" />}
          placeholder={this.CATranslate("input_operation_record_for", locale)}
          defaultValue={this.Util.formatDatePicker(formData.registerDate)}
          form={form}
        />
        <this.InputNumber
          data={formData.amount}
          name="amount"
          label={<this.Translate id="text_amount" />}
          placeholder={this.CATranslate("text_amount", locale)}
          required={true}
          isAutoSelect={true}
          errorRequired={<this.Translate id="error_require_amount" />}
          form={form}
        />
        <this.InputNumber
          data={formData.type}
          name="type"
          className="hidden"
          form={form}
        />
        <div className="wrap-income-exp-box">
          <div
            style={{ fontSize: 18, color: "#c72727" }}
            className={`text-center text-uppercase ca-box ${
              this.state.type === this.Enum.OPERATION_TYPE.EXPENSE
                ? "active"
                : ""
            }`}
            onClick={() =>
              this.handleSelectType(this.Enum.OPERATION_TYPE.EXPENSE)
            }
          >
            <Icon type="arrow-up" style={{ marginRight: 5 }} />
            <this.Translate id="text_expense" />
          </div>
          <div
            style={{ fontSize: 18, color: "#4cb64c" }}
            className={`text-center text-uppercase ca-box ${
              this.state.type === this.Enum.OPERATION_TYPE.INCOME
                ? "active"
                : ""
            }`}
            onClick={() =>
              this.handleSelectType(this.Enum.OPERATION_TYPE.INCOME)
            }
          >
            <Icon type="arrow-down" style={{ marginRight: 5 }} />
            <this.Translate id="text_income" />
          </div>
        </div>
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name: "",
    registerDate: new Util().getCurrentDate(),
    amount: 0,
    type: Enum.OPERATION_TYPE.EXPENSE,
    status: 1,
  },
};
