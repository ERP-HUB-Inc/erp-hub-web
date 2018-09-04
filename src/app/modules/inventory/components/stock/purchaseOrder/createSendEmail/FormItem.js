import React from "react";
import Modal from "../../../../../common/components/shares/Modal";

export default class FormItem extends Modal {

  render() {
    const { form,locale,supplierDetail } = this.props;
    return (
      <div>
        <this.Row>
          <this.Col md="12">
            <this.InputEmail
              name="name"
              label={<this.Translate id="input_stock_purchase_order_send_mail_email" />}
              data={supplierDetail.list.email}
              placeholder={this.CATranslate("input_stock_purchase_order_name", locale)}
              required={true}
              max={100}
              min={3}
              form={form}/> 
          </this.Col>
        </this.Row>
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:""
  }
};