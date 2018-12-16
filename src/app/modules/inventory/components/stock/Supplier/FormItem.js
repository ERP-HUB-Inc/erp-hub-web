import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  render() {
    const {formData} = this.props;
    return (
      <div id="scroll-layout">
        <this.Row>
          <this.Col md="12">
            <this.InputText
              name="name"
              label={<this.Translate id="text_name" />}
              data={formData.name}
              placeholder={this.CATranslate("text_name", this.props.locale)}
              errorRequired={<this.Translate id="error_require_name" />}
              required={true}
              isAutoFocus={true}
              max={100}
              form={this.props.form}/> 
          </this.Col>
          <this.Col md="12">
            <this.InputText
              name="phoneNumber"
              label={<this.Translate id="text_phone_number" />}
              data={formData.phoneNumber}
              placeholder={this.CATranslate("text_phone_number", this.props.locale)}
              errorRequired={<this.Translate id="input_error_stock_supplier_phone_number" />}
              max={100}
              form={this.props.form}/> 
          </this.Col>
          <this.Col md="12">
            <this.InputEmail
              name="email"
              label={<this.Translate id="text_email" />}
              data={formData.email}
              placeholder={this.CATranslate("text_email", this.props.locale)}
              errorRequired={<this.Translate id="input_error_stock_supplier_phone_number" />}
              form={this.props.form}/> 
          </this.Col>
          <this.Col md="12">
            <this.InputTextArea
              name="description"
              label={<this.Translate id="text_description" />}
              data={formData.description}
              placeholder={this.CATranslate("text_description", this.props.locale)}
              max={100}
              form={this.props.form}/>
          </this.Col>
          <this.Col md="12">
            <this.Select
              name="status"
              label={<this.Translate id="text_status" />}
              dataSource={this.statusDataSource}
              defaultValue={formData.status}
              form={this.props.form}/>
          </this.Col>
        </this.Row>
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    description:"",
    status: 1
  }
};