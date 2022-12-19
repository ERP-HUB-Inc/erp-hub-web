import React from "react";
import {Translate} from "react-localize-redux";
import {
  Col,
  Form, 
  Row
} from "antd";
import {
  DatePickers,
  InputNumber,
  Button
} from "../../../common/elements/ant-ui";
import { stringTranslate } from "../../../common/helper/stringTranslate";

export default function PaymentForm(props) {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("values", values);
      }
    });
  };

  const {form, locale} = props;
  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={10}>
          <label><Translate id="text_payment_date" /></label>
        </Col>
        <Col md={14}>
          <DatePickers 
            name="paidDate"
            placeholder={`${stringTranslate("text_payment_date", locale)}`}
            form={form} />
        </Col>

        <Col md={10}>
          <label><Translate id="text_amount" /></label>
        </Col>
        <Col md={14}>
          <InputNumber 
            name="amount"
            placeholder={`${stringTranslate("text_amount", locale)}`}
            isAutoSelect={true}
            form={form} />
        </Col>

        <Col md={24}>
          <hr />
          <Button type="danger" style={{marginRight: 15}} onClick={props.onClose}><Translate id="text_cancel" /></Button>
          <Button type="info" htmlType="submit" loading={loading}><Translate id="text_save" /></Button>
        </Col>
      </Row>
    </Form>
  );
}