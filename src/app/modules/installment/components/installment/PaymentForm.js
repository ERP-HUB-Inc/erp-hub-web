import React from "react";
import {Translate} from "react-localize-redux";
import moment from "moment";
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
            <Col md={10}>
              <label style={{marginTop: 8}}><Translate id="text_payment_date" /></label>
            </Col>
            <Col md={14} style={{display: "flex", lineHeight: "35px"}}>
              : <DatePickers
                  name="paidDate"
                  placeholder={`${stringTranslate("text_payment_date", locale)}`}
                  defaultValue={moment()}
                  style={{paddingLeft: 10, width: "100%"}}
                  form={form} /> 
            </Col>
            <Col md={10}>
              <label style={{marginTop: 8}}><Translate id="text_amount" /></label>
            </Col>
            <Col md={14} style={{display: "flex", lineHeight: "35px"}}>
              : <InputNumber 
                  name="amount"
                  inputStyle={{background: "white", color: "#565656"}}
                  isAutoSelect={true}
                  style={{paddingLeft: 10, width: "100%"}}
                  form={form} />
            </Col>

          </Row>
          <div
            style={{
              width: "100%",
              borderTop: "1px solid #e8e8e8",
              paddingTop: 14,
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