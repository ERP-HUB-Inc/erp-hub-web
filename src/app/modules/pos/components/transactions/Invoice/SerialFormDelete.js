import React from "react";
import { 
  Col,
  Modal,
  Row,
  Form,
  Select
} from "antd";
import { Translate } from "react-localize-redux";
import BarcodeReader from "react-barcode-reader";
import { Button, InputNumber } from "../../../../common/elements/ant-ui";
import Util from "../../../../common/util";

export default class SerialFormDelete extends React.PureComponent {
  state = {
    isVisible: false,
    isScanBarcode: false,
    removeSerials: [],
    isInputFocus: false
  }
  util = new Util();

  componentDidUpdate() {
    if (this.state.isInputFocus) {
      this.removeFieldRef.focus();
      this.setState({isInputFocus: false});
    }
  }

  handleRemove = () => {
    const removeSerials = this.state.removeSerials.slice();
    const index = Number(this.props.form.getFieldValue("fieldIndex"));
    this.props.onSuccess({
      serials: removeSerials,
      index
    });
    this.props.form.setFields({removeSerial: null});
    this.setState({removeSerials: []});
  }

  handleShowModal = () => {
    this.setState({isVisible: true});
  };

  handleCancel = () => {
    this.setState({isVisible: false, removeSerials: []});
    this.props.onCanceled(this.props.formData.index);
  };

  onCloseModal = () => {
    this.setState({isVisible: false});
  }

  handleChange(values) {
    if (values && values.length) {
      this.props.form.setFields({
        removeSerial: {
          value: values
        }
      });

      const removeSerials = [];
      if (this.props.selectedSerials.length) {
        values.forEach((value, index) => {
          if (this.props.selectedSerials.includes(value)) {
            removeSerials.push({
              pVariantId: this.props.formData.pVariantId,
              number: value
            });
          } else {
            return this.props.form.setFields({
              removeSerial: {
                value: values.splice(index, 1),
                errors: [new Error("This serial number is not in this product")]
              }
            });
          }
        });
        this.setState({removeSerials});
      }

    }
  }

  handleScan = (serialNumber) => {
    const removeSerialsField = this.props.form.getFieldValue("removeSerial");
    let newRemoveSerials = [];
    let removeSerials = JSON.parse(JSON.stringify(this.state.removeSerials));
    
    if (removeSerialsField && removeSerialsField.length) {
      newRemoveSerials = removeSerialsField;
    }

    if (this.props.selectedSerials.includes(serialNumber)) {
      removeSerials.push({
        pVariantId: this.props.formData.pVariantId,
        number: serialNumber
      });
    } else {
      return this.props.form.setFields({
        removeSerial: {
          value: removeSerialsField && removeSerialsField.splice(removeSerialsField[removeSerialsField.length - 1], 1),
          errors: [new Error("This serial number is not in this product")]
        }
      });
    }

    newRemoveSerials.push(serialNumber);

    this.setState({ isScanBarcode: true, removeSerials });
    this.props.form.setFieldsValue({ removeSerial: newRemoveSerials });
  }

  handleScanError = (err) => {
    console.error(err);
  }

  render() {
    const {formData} = this.props;
    let numOfSerials = this.props.form.getFieldValue(`serials[${Number(formData.index)}]`);
    if (numOfSerials && this.util.isJsonString(numOfSerials)) {
      numOfSerials = JSON.parse(numOfSerials);
      numOfSerials = Array.isArray(numOfSerials) && numOfSerials.filter(serial => Number(serial.status) !== 3);
      numOfSerials = numOfSerials.length;
    }

    return (
      this.state.isVisible ?
        <Modal
          title={<div><Translate id="text_remove" /> <Translate id="text_serial_no" /></div>}
          visible={true}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form>
            <Row>
              <div style={{marginTop: -10, paddingBottom: 12, textAlign: "center"}}>{formData.description}</div>
              {numOfSerials && numOfSerials > formData.quantity + this.state.removeSerials.length ? 
                <label><Translate id="text_quantity_to_remove" />: {numOfSerials - formData.quantity - this.state.removeSerials.length}</label> 
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
                <Form.Item
                  label="IMEI OR SERIAL"
                  style={{position: "relative"}}
                >
                  {this.props.form.getFieldDecorator("removeSerial")(
                    <Select mode="tags" 
                      ref={ref => this.removeFieldRef = ref}
                      style={{width: "100%"}}
                      placeholder="SerialNo1, SerialNo2, ..."
                      dropdownStyle={{display: "none"}}
                      onChange={(value) => this.handleChange(value)}
                    />
                  )}
                  <div 
                    className="icon-scaner icon-clear" 
                    style={{opacity: .5, cursor: "pointer", position: "absolute", right: 7, top: 3}} 
                    onClick={() => this.setState({isInputFocus: true})} />
                </Form.Item>
              </Col>
            </Row>
            <InputNumber name="fieldIndex" style={{display: "none"}} data={this.props.formData.index} form={this.props.form} />
              <div className="ant-modal-footer">
                <Button onClick={this.handleCancel}>
                  <span className="icon-cancel icon-padding-right"></span><Translate id="text_cancel" />
                </Button>  
                <Button className="danger" htmlType="button" onClick={this.handleRemove}>
                  <span className="icon-delete icon-padding-right"></span><span><Translate id="text_remove" /></span>
                </Button>
              </div>
          </Form>
        </Modal>
      : <div />
    );
  }
}

SerialFormDelete.defaultProps = {
  formData: {
    index: 0,
    quantity: 0,
  }
};