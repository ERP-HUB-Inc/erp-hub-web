import React from "react";
import Modal from "../../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      isPushWithSendEmail: false
    };
    this.handleOnChangeIsCheckPushToSupplierWithEmail = this.handleOnChangeIsCheckPushToSupplierWithEmail.bind(this);
  }

  handleOnChangeIsCheckPushToSupplierWithEmail(event) {
    this.setState({isPushWithSendEmail: event.target.checked});
  }

  render() {
    const {form, locale, supplierDetail} = this.props;
    return (
      <this.Row>
        <this.Col md="12">
          <this.Checkboxs
            name="isCheckToPushWithEmail" 
            label={<this.Translate id="checkbox_stock_purchase_order_push_with_send_email"/>}
            onChange={this.handleOnChangeIsCheckPushToSupplierWithEmail}
            form={form}/>
        </this.Col>
        {
          this.state.isPushWithSendEmail ?
            <this.Col md="12">
              <this.InputEmail
                name="supplierEmail"
                label={<this.Translate id="input_stock_purchase_order_send_mail_email" />}
                data={supplierDetail.list.email}
                placeholder={this.CATranslate("input_stock_purchase_order_send_mail_email", locale)}
                errorInvalid={<this.Translate id="error_supplier_email_not_valid" />}
                required={true}
                max={100}
                form={form}/>
            </this.Col>
            :
            ""
        }
      </this.Row>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:""
  }
};