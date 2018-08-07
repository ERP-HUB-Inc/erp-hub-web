import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { Select } from "../../../../common/elements/ant-ui/Select";
import PaymentMethodAction from "../../../action/settings/paymentMethod";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_title" />;
    this.addingPropReducer = "paymentMethodAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(PaymentMethodAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(PaymentMethodAction.reset());
  }

  render() {

    const {paymentMethodAdd, form, locale} = this.props;

    this.submitLoading = paymentMethodAdd.adding;

    if (paymentMethodAdd.showForm) {
      this.content = (
        <div>
          {paymentMethodAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText
            name="name"
            label={<this.Translate id="input_text_name" />}
            placeholder={this.CATranslate("input_placeholder_name", locale)}
            required={true}
            errorRequired={<this.Translate id="error_require_input_name" />}
            max={100}
            form={form}/>
          <InputText
            name="description"
            label={<this.Translate id="input_text_description" />}
            placeholder={this.CATranslate("input_placeholder_description", locale)}
            max={255}
            form={form}/>
          <Select
            name="status"
            label={<this.Translate id="input_text_status" />}
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