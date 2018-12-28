import React from "react";
import Modal from "../../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      isPushWithSendEmail: false,
      isRequireEmail: false,
      isAutoFocusEmail: false
    };
    this.handleOnChangeIsCheckPushToSupplierWithEmail = this.handleOnChangeIsCheckPushToSupplierWithEmail.bind(this);
  }

  handleOnChangeIsCheckPushToSupplierWithEmail(event) {
    this.setState({isPushWithSendEmail: event.target.checked});
    if (event.target.checked) {
      const {purchaseOrderDetail} = this.props;
      let supplierEmail = "";
      if (purchaseOrderDetail && purchaseOrderDetail.supplier && purchaseOrderDetail.supplier.email) {
        supplierEmail = purchaseOrderDetail.supplier.email;
      } else if (this.props.supplierDetail) {
        supplierEmail = this.props.supplierDetail.email;
      }
      this.setState({
        isRequireEmail: true,
        isAutoFocusEmail: true
      });
      this.props.form.setFieldsValue({supplierEmail});
    } else {
      this.setState({
        isRequireEmail: false,
        isAutoFocusEmail: false
      });
    }
  }

  render() {
    return (
      <this.Row>
        <this.Col md="12">
          <this.Checkboxs
            name="isCheckToPushWithEmail" 
            label={<this.Translate id="text_push_po_with_email"/>}
            onChange={this.handleOnChangeIsCheckPushToSupplierWithEmail}
            form={this.props.form}/>
        </this.Col>
        <this.Col md="12">
          <this.InputEmail
            name="supplierEmail"
            isAutoFocus={this.state.isAutoFocusEmail}
            isAutoSelect={true}
            didUpdateMakeAutoFocus={true}
            label={<this.Translate id="text_email" />}
            className={this.state.isPushWithSendEmail ? "" : "hidden"}
            placeholder={this.CATranslate("text_email", this.props.locale)}
            errorInvalid={<this.Translate id="error_supplier_email_not_valid" />}
            required={this.state.isRequireEmail}
            max={100}
            form={this.props.form}/>
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