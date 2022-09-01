import React from "react";
import {Col, Form, Row} from "antd";
import {Translate} from "react-localize-redux";
import {Button, Select, InputNumber} from "../../../../common/elements/ant-ui";
import Util from "../../../../common/util";
import Enum from "../../../enums";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import InvoiceService from "../../../services/transactions/InvoiceService";

export default function ReceivedPayment(props) {
  const [loading, setLoading] = React.useState(false);
  const util = new Util();

  const handleSubmitPayment = (e) => {
    e.preventDefault();

    if (props.formData.status === Enum.INVOICE_STATUS.PAID) {
      return util.sweetAlertMessage(stringTranslate("text_already_paid_invoice", props.locale), "warning");
    }

    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        util.sweetAlertConfirm(stringTranslate("text_are_you_sure", props.locale))
        .then(willReceived => {
          if (willReceived) {
            let paymentMethod = values.paymentMethod;
            let invoice = {
              amount: values.amount,
            };

            invoice[paymentMethod] = values.amount;
            setLoading(true);
            InvoiceService.receivedPayment(props.formData.id, invoice)
            .then(() => props.onSuccess())
            .finally(() => setLoading(false));
          }
        });
      }
    });
  };

  const {formData} = props;
  let discount = Number(formData.discount);
  return (
    <div>
      <Form onSubmit={handleSubmitPayment}>
        <Row>
          <Col md={10}>
            <label style={{marginTop: 8}}><Translate id="text_amount" /> :</label>
          </Col>
          <Col md={14}>
            <InputNumber 
              name="amount"
              data={formData.total - discount}
              disabled={true}
              inputStyle={{background: "white", color: "#565656"}}
              form={props.form} />
          </Col>

          <Col md={10}>
            <label style={{marginTop: 8}}><Translate id="text_payment_method" />
              <strong style={{color: "red"}}>*</strong> :
            </label>
          </Col>
          <Col md={14}>
            <Select 
              name="paymentMethod"
              placeholder={`${stringTranslate("text_payment_method", props.locale)}`}
              valueKey="value"
              required={true}
              dataSource={[
                {value: "tenderCash", "name": <Translate id="text_cash" />},
                {value: "tenderBank", "name": <Translate id="text_bank" />}
              ]}
              form={props.form} />
          </Col>
          <Col md={24}>
            <hr />
            <Button type="danger" style={{marginRight: 15}} onClick={props.onClose}><Translate id="text_cancel" /></Button>
            <Button type="info" htmlType="submit" loading={loading}><Translate id="text_save" /></Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

ReceivedPayment.defaultProps = {
  formData: {
    total: 0,
    paymentMethod: ""
  }
};