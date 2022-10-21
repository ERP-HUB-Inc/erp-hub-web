import React from "react";
import { Translate } from "react-localize-redux";
import BarcodeReader from "react-barcode-reader";
import moment from "moment";
import { 
  Col, 
  Form, 
  Input, 
  Modal,
  Row
} from "antd";
import { 
  Button,
  InputNumber,
  InputText,
  Select
} from "../../../../common/elements/ant-ui";
import Util from "../../../../common/util";
import Enum from "../../../../common/enums";
import SerialService from "../../../services/transactions/SerialService";
import { stringTranslate } from "../../../../common/helper/stringTranslate";

export default class SerialForm extends React.PureComponent  {
  state = {
    isVisible: false,
    isScanBarcode: false
  }
  timer = null;
  util = new Util();

  handleSaveSerial = () => {
    const values = this.props.form.getFieldsValue();
    if (!values.serialNumber) {
      this.props.form.setFields({
        serialNumber: {
          errors: [new Error(stringTranslate("error_serial_number_require", this.props.locale))]
        }
      });
    }

    if (!values.numberWarranty) {
      this.props.form.setFields({
        numberWarranty: {
          errors: [new Error(stringTranslate("text_warranty_date_required", this.props.locale))]
        }
      });
    }

    if (values.serialNumber && values.numberWarranty) {
      let warrantyDate = null;
      let currentDate = this.util.formatDate(this.props.formData.invoiceDate);
      const durationType = values.durationType;

      warrantyDate = this.util.calculateWarrantyDate(currentDate, Number(values.numberWarranty), durationType);

      this.props.onSuccess({
        serialNumber: values.serialNumber,
        warrantyDate,
        durationType, 
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

  handleScan = (serialNumber) => {
    this.setState({ isScanBarcode: true });
    this.props.form.setFieldsValue({ serialNumber });
  }

  handleScanError = (err) => {
    console.error(err);
  }

  render() {
    const {formData} = this.props;
    let warrantyNumber = 1;
    formData.invoiceDate = this.util.formatDate(formData.invoiceDate);
    if (formData.warrantyDate) {
      warrantyNumber = this.util.calculateDurationNumber(formData.invoiceDate, formData.durationType, formData.warrantyDate);
    }

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
                <BarcodeReader
                  minLength={4}
                  onError={this.handleScanError}
                  onScan={this.handleScan}
                  preventDefault={true}
                  avgTimeByChar={40}
                  endChar={[13]}
                  timeBeforeScanTest={200}
                />
                <InputText 
                  name="serialNumber"
                  label="SERIAL OR IMEI"
                  data={formData.number}
                  placeholder={`${stringTranslate("text_input_serial", this.props.locale)}`}
                  isAutoFocus={true}
                  required={true}
                  onChange={this.onChangeSerialNo}
                  form={this.props.form} />
              </Col>
              <Col md={24}>
                <label><Translate id="text_warranty_duration" />:</label>
                <Row>
                  <Col md={12}>
                    <InputNumber
                      name="numberWarranty"
                      required={true}
                      precision={0}
                      isAutoSelect={true}
                      data={warrantyNumber}
                      form={this.props.form} />
                  </Col>
                  <Col md={12}>
                    <Select 
                      name="durationType"
                      required={true}
                      defaultValue={formData.durationType}
                      dataSource={[
                        {name: <Translate id="text_day" />, value: Enum.DURATION_TYPE.DAY},
                        {name: <Translate id="text_week" />, value: Enum.DURATION_TYPE.WEEK},
                        {name: <Translate id="text_month" />, value: Enum.DURATION_TYPE.MONTH},
                        {name: <Translate id="text_year" />, value: Enum.DURATION_TYPE.YEAR}
                      ]}
                      form={this.props.form} />
                  </Col>
                </Row>
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
    number: "",
    warrantyDate: "",
    durationType: "month",
    fieldName: "",
    index: null,
    index2: null
  }
};