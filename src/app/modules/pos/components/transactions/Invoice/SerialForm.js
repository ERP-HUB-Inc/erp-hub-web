import React from "react";
import { Translate } from "react-localize-redux";
import moment from "moment";
import { 
  Col, 
  Form, 
  Modal,
  Row
} from "antd";
import { 
  Button,
  DatePickers,
  InputNumber,
  InputText
} from "../../../../common/elements/ant-ui";
import SerialService from "../../../services/transactions/SerialService";
import { stringTranslate } from "../../../../common/helper/stringTranslate";

export default class SerialForm extends React.PureComponent  {
  state = {
    isVisible: false
  }
  timer = null;

  handleSaveSerial = () => {
    const values = this.props.form.getFieldsValue();
    if (!values.serialNumber) {
      this.props.form.setFields({
        serialNumber: {
          errors: [new Error(stringTranslate("error_serial_number_require", this.props.locale))]
        }
      });
    }

    if (!values.warrantyDate) {
      this.props.form.setFields({
        warrantyDate: {
          errors: [new Error(stringTranslate("text_warranty_date_required", this.props.locale))]
        }
      });
    }

    if (values.serialNumber && values.warrantyDate) {
      this.props.onSuccess({
        serialNumber: values.serialNumber,
        warrantyDate: values.warrantyDate,
        fieldIndex: values.fieldIndex,
        fieldIndex2: values.fieldIndex2
      });
      this.setState({isVisible: false});
    }
  };

  onChangeSerialNo = (e) => {
    clearTimeout(this.timer);
    const value = e.target.value;
    if (value) {
      this.timer = setTimeout(() => {
        SerialService.findByNumber(value)
        .then(response => {
          if (response.data && response.data.length) {
            this.props.form.setFields({
              serialNumber: {
                errors: [new Error(value + ": " + stringTranslate("text_this_serial_is_sold", this.props.locale))]
              }
            });
          }
        });
      }, 1000);
    }
  };

  handleShowModal = () => {
    this.setState({isVisible: true});
  };

  handleCancel = () => {
    this.setState({isVisible: false});
  };

  render() {
    const {formData} = this.props;
    return (
      this.state.isVisible ?
        <Modal
          title={this.props.modalTitle}
          visible={true}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form>
            <Row>
              <Col md={24}>
                <InputText 
                  name="serialNumber"
                  label="SERIAL OR IMEI"
                  data={formData.serialNo}
                  placeholder={`${stringTranslate("text_input_serial", this.props.locale)}`}
                  isAutoFocus={true}
                  required={true}
                  onChange={this.onChangeSerialNo}
                  form={this.props.form} />
              </Col>
              <Col md={24}>
                <DatePickers
                  name="warrantyDate"
                  label={<Translate id="text_warranty_date" />}
                  required={true}
                  placeholder={`${stringTranslate("text_warranty_date", this.props.locale)}`}
                  defaultValue={formData.warrantyDate ? moment(formData.warrantyDate) : null}
                  form={this.props.form} />
                </Col>
            </Row>
            <InputNumber name="fieldIndex" style={{display: "none"}} data={formData.index} form={this.props.form} />
            <InputNumber name="fieldIndex2" style={{display: "none"}} data={formData.index2} form={this.props.form} />
            <div className="ant-modal-footer">
              <Button className="danger" onClick={this.handleCancel}>
                <span className="icon-cancel icon-padding-right"></span><Translate id="text_cancel" />
              </Button>  
              <Button htmlType="button" onClick={this.handleSaveSerial} className="info">
                <span className="icon-save icon-padding-right"></span><span><Translate id="text_save" /></span>
              </Button>
            </div>
          </Form>
        </Modal>
      : <div />
    );
  }
};

SerialForm.defaultProps = {
  formData: {
    serialNo: "",
    warrantyDate: "",
    fieldName: "",
    index: null,
    index2: null
  }
};