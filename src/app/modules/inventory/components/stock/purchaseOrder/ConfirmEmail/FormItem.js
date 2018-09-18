import React from "react";
import Modal from "../../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      isPushWithSendEmail: false,
      isRequireEmail: false
    };
    this.handleOnChangeIsCheckPushToSupplierWithEmail = this.handleOnChangeIsCheckPushToSupplierWithEmail.bind(this);
  }

  handleOnChangeIsCheckPushToSupplierWithEmail(event) {
    this.setState({isPushWithSendEmail: event.target.checked});
    if (event.target.checked) {
      const {form, supplierDetail, purchaseOrderDetail} = this.props;
      let supplierEmail = "";
      if (purchaseOrderDetail && purchaseOrderDetail.supplier && purchaseOrderDetail.supplier.email) {
        supplierEmail = purchaseOrderDetail.supplier.email;
      } else if (supplierDetail.data) {
        supplierEmail = supplierDetail.data.email;
      }
      this.setState({isRequireEmail: true});
      form.setFieldsValue({supplierEmail});
    }
  }

  render() {
    const {form, locale} = this.props;
  
    return (
      <this.Row>
        <this.Col md="12">
          <this.Checkboxs
            name="isCheckToPushWithEmail" 
            label={<this.Translate id="checkbox_stock_purchase_order_push_with_send_email"/>}
            onChange={this.handleOnChangeIsCheckPushToSupplierWithEmail}
            form={form}/>
        </this.Col>
        <this.Col md="12">
          <this.InputEmail
            name="supplierEmail"
            label={<this.Translate id="input_stock_purchase_order_send_mail_email" />}
            className={this.state.isPushWithSendEmail ? "" : "hidden"}
            placeholder={this.CATranslate("input_stock_purchase_order_send_mail_email", locale)}
            errorInvalid={<this.Translate id="error_supplier_email_not_valid" />}
            required={this.state.isRequireEmail}
            max={100}
            form={form}/>
        </this.Col>
      </this.Row>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:""
  }
};