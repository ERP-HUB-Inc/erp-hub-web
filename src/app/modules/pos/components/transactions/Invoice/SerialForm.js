import React from "react";
import { Translate } from "react-localize-redux";
import BarcodeReader from "react-barcode-reader";
import { 
  Col, 
  Form, 
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
    isScanBarcode: false,
    isInputFocus: false
  }
  timer = null;
  util = new Util();

  componentDidUpdate() {
    if (this.state.isInputFocus) {
      this.setState({isInputFocus: false});
    }
  }

  handleSaveSerial = () => {
    const values = this.props.form.getFieldsValue();

    if (!values.serialNumber) {
      this.props.form.setFields({
        serialNumber: {
          errors: [new Error(stringTranslate("error_serial_number_require", this.props.locale))]
        }
      });
    }

    if (!values.numOfWarranty) {
      this.props.form.setFields({
        numberWarranty: {
          errors: [new Error(stringTranslate("text_warranty_date_required", this.props.locale))]
        }
      });
    }

    if (values.serialNumber && values.numOfWarranty) {
      const durationType = values.durationType;
      this.props.onSuccess({
        id: this.props.formData.id,
        serialNumber: values.serialNumber,
        oldSerial: this.props.formData.number,
        numOfWarranty: values.numOfWarranty,
        durationType, 
        fieldIndex: values.fieldIndex,
        fieldIndex2: values.fieldIndex2
      });

      this.props.form.setFieldsValue({
        serialNumber: "",
        numOfWarranty: 0,
        durationType: ""
      });

    }
  };

  onChangeSerialNo = (e) => {
    clearTimeout(this.timer);
    const value = e.target.value;
    if (value && value !== this.props.formData.number) {
      this.timer = setTimeout(() => {
        if (this.props.selectedSerials.length && this.props.selectedSerials.includes(value)) {
          return this.props.form.setFields({
            serialNumber: {
              errors: [new Error("This serial number already selected")]
            }
          });
        }
        
        SerialService.findByNumber(value, this.props.formData.pVariantId)
        .then(response => {
          if (response.data && response.data.length) {
            this.props.form.setFields({
              serialNumber: {
                errors: [new Error(value + ": " + stringTranslate("text_this_serial_is_sold", this.props.locale))]
              }
            });
          }
        })
        .catch(e => console.log("error ========", e.response));
      }, 600);
    }
  };

  onChangeNumberWarranty = (value) => {
    const warrantyDate = document.getElementById("warranty-date");
    const durationType = this.props.form.getFieldValue("durationType");
    warrantyDate.innerText = this.util.formatDate(this.util.calculateWarrantyDate(this.props.formData.invoiceDate, value, durationType), "DD-MM-YYYY");
  }

  onChangeDurationType = (value) => {
    const warrantyDate = document.getElementById("warranty-date");
    const numOfWarranty = this.props.form.getFieldValue("numOfWarranty");
    warrantyDate.innerText = this.util.formatDate(this.util.calculateWarrantyDate(this.props.formData.invoiceDate, numOfWarranty, value), "DD-MM-YYYY");
  }

  handleShowModal = () => {
    this.setState({isVisible: true});
  };

  onCloseModal = () => {
    this.setState({isVisible: false});
  }

  handleCancel = () => {
    this.setState({isVisible: false});
    this.props.onCanceled(this.props.formData.index);
  };

  handleScan = (value) => {
    this.setState({ isScanBarcode: true });
    if (this.props.selectedSerials.length && this.props.selectedSerials.includes(value)) {
      return this.props.form.setFields({
        serialNumber: {
          errors: [new Error("This serial number already selected")]
        }
      });
    }

    SerialService.findByNumber(value, this.props.formData.pVariantId)
    .then(response => {
      if (response.data && response.data.length) {
        return this.props.form.setFields({
          serialNumber: {
            errors: [new Error(value + ": " + stringTranslate("text_this_serial_is_sold", this.props.locale))]
          }
        });
      }
    });

    this.props.form.setFieldsValue({serialNumber: value});
  }

  handleScanError = (err) => {
    console.error(err);
  }

  render() {
    const {formData} = this.props;
    formData.invoiceDate = this.util.formatDate(formData.invoiceDate);
    let numOfSerials = this.props.form.getFieldValue(`serials[${Number(formData.index)}]`);
    if (this.util.isJsonString(numOfSerials)) {
      numOfSerials = JSON.parse(numOfSerials);
      numOfSerials = Array.isArray(numOfSerials) && numOfSerials.length;
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
              <div style={{marginTop: -10, paddingBottom: 12, textAlign: "center"}}>{formData.description}</div>
              {
                numOfSerials && numOfSerials < formData.quantity ?
                  <label>Please input {formData.quantity - numOfSerials} more serials </label>
                : null
              }
              
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
                  suffix={<div className="icon-scaner icon-clear" style={{opacity: .5, cursor: "pointer"}} onClick={() => this.setState({isInputFocus: true})} />}
                  placeholder={`${stringTranslate("text_input_serial", this.props.locale)}`}
                  isAutoFocus={true}
                  didUpdateMakeAutoFocus={this.state.isInputFocus}
                  required={true}
                  onChange={this.onChangeSerialNo}
                  form={this.props.form} />
              </Col>
              <Col md={24}>
                <label><Translate id="text_warranty_duration" />:</label>
                <Row gutter={12}>
                  <Col md={12}>
                    <InputNumber
                      name="numOfWarranty"
                      required={true}
                      precision={0}
                      isAutoSelect={true}
                      data={formData.numOfWarranty}
                      min={0}
                      onChange={this.onChangeNumberWarranty}
                      form={this.props.form} />
                  </Col>
                  <Col md={12}>
                    <Select 
                      name="durationType"
                      required={true}
                      defaultValue={formData.durationType}
                      onChange={this.onChangeDurationType}
                      dataSource={[
                        {name: <Translate id="text_day" />, value: Enum.DURATION_TYPE.DAY},
                        {name: <Translate id="text_week" />, value: Enum.DURATION_TYPE.WEEK},
                        {name: <Translate id="text_month" />, value: Enum.DURATION_TYPE.MONTH},
                        {name: <Translate id="text_year" />, value: Enum.DURATION_TYPE.YEAR}
                      ]}
                      form={this.props.form} />
                  </Col>
                  <Col md={24}>
                    <label>
                      <Translate id="text_warranty_date" />: 
                      <span style={{marginLeft: 8, textDecoration: "underline"}} id="warranty-date">
                        {this.util.formatDate(this.util.calculateWarrantyDate(formData.invoiceDate, formData.numOfWarranty, formData.durationType), "DD-MM-YYYY")}
                      </span>
                    </label>
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
    numOfWarranty: 1,
    durationType: Enum.DURATION_TYPE.DAY,
    fieldName: "",
    index: null,
    index2: null
  }
};