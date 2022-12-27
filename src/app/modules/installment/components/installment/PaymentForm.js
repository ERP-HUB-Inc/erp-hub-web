import React from "react";
import {Translate} from "react-localize-redux";
import moment from "moment";
import {
  Col,
  Drawer,
  Form, 
  Row,
  Select
} from "antd";
import {
  DatePickers,
  InputNumber,
  Button
} from "../../../common/elements/ant-ui";
import Util from "../../../common/util";
import {stringTranslate} from "../../../common/helper/stringTranslate";
import RepaymentService from "../../services/RepaymentService";

const errStatus = {
  notFound: 404,
  alreadyPaid: 611,
  completed: 610,
};

export default class PaymentForm extends React.PureComponent {
  state = {
    loading: false,
    visible: false
  }
  util = new Util();

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      if (values.amount < values.amountToPaid) {
        return this.props.form.setFields({
          amount: {
            value: values.amount,
            errors: [new Error("Your input amount is not enough")]
          }
        });
      }

      this.util.sweetAlertConfirm("", stringTranslate("text_are_you_sure", this.props.locale))
      .then(willPay => {
        if (willPay) {
          values.installmentId = this.props.formData.id;
          values.paidDate = this.util.formatDateForMYSQL(values.paidDate);
          delete values.amountToPaid;
          this.save(values);
        }
      });
    });
  };

  save(data) {
    this.setState({loading: true});
    if (this.props.formData.payment) {
      const paymentId = this.props.formData.payment.id;
      data.id = paymentId;
      RepaymentService.update(data, paymentId)
      .then(() => {
        this.util.sweetAlertMessageV2("Success", "Payment updated", "success");
        this.props.onSuccessUpdate(this.props.formData.id);
        this.props.form.resetFields();
      })
      .catch(() => this.util.sweetAlertMessageV2("Error", "Something went wrong", "error"))
      .finally(() => this.setState({loading: false}));
    } else {
      RepaymentService.create(data)
      .then(() => {
        this.util.sweetAlertMessageV2("Success", "Payment received", "success");
        this.props.onSuccess(this.props.formData.id);
        this.props.form.resetFields();
      })
      .catch(err => {
        const error = err.response && err.response.data && err.response.data.error;
        let message = "";
        if (error.code === errStatus.notFound) {
          message = "Installment not found";
        } else if (error.code === errStatus.alreadyPaid) {
          message = "This schedule already paid. Please select another schedule";
        } else if (error.code === errStatus.completed) {
          message = "This installment has completed";
        }
        if (message) {
          this.util.sweetAlertMessageV2("Sorry", message, "warning");
        }
      })
      .finally(() => this.setState({loading: false}));
    }
  }

  handleChangeMonth = (value, row) => {
    if (value) {
      this.props.form.setFieldsValue({
        amount: row.props.object.payAmount,
        amountToPaid: row.props.object.payAmount
      });
    }
  }

  onShowDrawer = () => {
    this.setState({visible: true});
  }

  onCloseDrawer = () => {
    this.setState({visible: false});
    if (this.props.formData.payment) {
      this.props.onGoBackHistory();
    }
  }

  getDefaultSchedule(formData) {
    let result = {
      id: "",
      payAmount: 0,
      paidDate: moment()
    };
    if (formData.payment) {
      result.id = formData.payment.paymentScheduleId;
      result.payAmount = formData.payment.amount;
      result.paidDate = moment(formData.payment.paidDate);
    } else {
      const currentMonth = formData.paymentSchedule && formData.paymentSchedule.find(schedule => moment(schedule.date).format("YYYY-MM") === moment().format("YYYY-MM"));
      if (currentMonth) {
        result.id = currentMonth.id;
        result.payAmount = currentMonth.payAmount;
      }
    }

    return result;
  }

  render() {
    const {formData, form, locale} = this.props;
    return (
      <Drawer
        title={<Translate id={`${formData.payment ? "text_edit_payment" : "text_payment"}`} />}
        width={520}
        closable={false}
        visible={this.state.visible}
        onClose={this.onCloseDrawer}
      >
        {this.state.visible ?
          <Form onSubmit={this.handleSubmit} style={{marginTop: -10}}>
            <Row>
              <Col md={10}>
                <label style={{marginTop: 8}}><Translate id="text_pay_for_month" /> <span style={{color: "red"}}>*</span></label>
              </Col>
              <Col md={14} style={{display: "flex", lineHeight: "35px"}}>
                : <Form.Item
                    style={{paddingLeft: 10, width: "100%"}}
                  >
                    {
                      form.getFieldDecorator("paymentScheduleId", {
                        initialValue: this.getDefaultSchedule(formData).id,
                        rules: [
                          {
                            required: true,
                            message: "Please select schedule"
                          }
                        ]
                      })(
                        <Select placeholder="Select schedule" allowClear onChange={this.handleChangeMonth}>
                          {
                            formData.paymentSchedule && formData.paymentSchedule.map((schedule, index) => 
                              <Select.Option key={index} value={schedule.id} object={schedule}>
                                {moment(schedule.date).format("MM-YYYY")}
                              </Select.Option>
                            )
                          }
                        </Select>
                      )
                    }
                  </Form.Item>
              </Col>
              <Col md={10}>
                <label style={{marginTop: 8}}><Translate id="text_payment_date" /> <span style={{color: "red"}}>*</span></label>
              </Col>
              <Col md={14} style={{display: "flex", lineHeight: "35px"}}>
                : <DatePickers
                    name="paidDate"
                    placeholder={`${stringTranslate("text_payment_date", locale)}`}
                    defaultValue={this.getDefaultSchedule(formData).paidDate}
                    required={true}
                    style={{paddingLeft: 10, width: "100%"}}
                    form={form} /> 
              </Col>
              <Col md={10}>
                <label style={{marginTop: 8}}><Translate id="text_amount" /> <span style={{color: "red"}}>*</span></label>
              </Col>
              <Col md={14} style={{display: "flex", lineHeight: "35px"}}>
                : <InputNumber 
                    name="amount"
                    data={this.getDefaultSchedule(formData).payAmount}
                    inputStyle={{background: "white", color: "#565656"}}
                    isAutoSelect={true}
                    required={true}
                    style={{paddingLeft: 10, width: "100%"}}
                    form={form} />
                  <InputNumber
                    name="amountToPaid"
                    data={this.getDefaultSchedule(formData).payAmount}
                    style={{display: "none"}}
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
          : null
        }
      </Drawer>
    );
  }
}