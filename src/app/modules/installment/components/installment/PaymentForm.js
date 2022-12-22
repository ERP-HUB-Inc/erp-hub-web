import React from "react";
import {Translate} from "react-localize-redux";
import {
  Col,
  Drawer,
  Form, 
  Row
} from "antd";
import {
  DatePickers,
  InputNumber,
  Button
} from "../../../common/elements/ant-ui";
import Util from "../../../common/util";
import {stringTranslate} from "../../../common/helper/stringTranslate";

export default class PaymentForm extends React.PureComponent {
  state = {
    loading: false,
    visible: false
  }
  util = new Util();

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.paidDate = this.util.formatDateForMYSQL(values.paidDate);
        console.log("values", values);
        this.props.form.resetFields();
        this.props.onSuccess();
      }
    });
  };

  onShowDrawer = () => {
    this.setState({visible: true});
  }

  onCloseDrawer = () => {
    this.setState({visible: false});
  }

  render() {
    const {form, locale} = this.props;
    return (
      <Drawer
        title={<Translate id="text_payment" />}
        width={520}
        closable={false}
        visible={this.state.visible}
        onClose={this.onCloseDrawer}
      >
        <Form onSubmit={this.handleSubmit} style={{marginTop: -10}}>
          <Row>
            <Col md={24}>
              <DatePickers 
                name="paidDate"
                label={<Translate id="text_payment_date" />}
                required={true}
                placeholder={`${stringTranslate("text_payment_date", locale)}`}
                form={form} />

              <InputNumber 
                name="amount"
                label={<Translate id="text_amount" />}
                required={true}
                placeholder={`${stringTranslate("text_amount", locale)}`}
                isAutoSelect={true}
                form={form} />
            </Col>
          </Row>
          <div
            style={{
              width: "100%",
              borderTop: "1px solid #e8e8e8",
              paddingTop: 14,
              textAlign: "right",
              background: "#fff",
            }}
          >
            <Button type="danger" style={{marginRight: 15}} onClick={this.onCloseDrawer}><Translate id="text_cancel" /></Button>
            <Button type="info" htmlType="submit" loading={this.state.loading}><Translate id="text_save" /></Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}