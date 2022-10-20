import React from "react";
import { 
  Col,
  Modal,
  Row,
  Form,
  Select
} from "antd";
import { Translate } from "react-localize-redux";
import { Button, InputNumber } from "../../../../common/elements/ant-ui";

export default class SerialFormDelete extends React.PureComponent {
  state = {
    isVisible: false
  }

  handleRemove = () => {
    const removeSerial = this.props.form.getFieldValue("removeSerial");
    const index = Number(this.props.form.getFieldValue("fieldIndex"));
    if (removeSerial && removeSerial.length) {
      this.props.onSuccess({
        serials: removeSerial,
        index
      });
    }
  }

  handleShowModal = () => {
    this.setState({isVisible: true});
  };

  handleCancel = () => {
    this.setState({isVisible: false});
  };

  render() {
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
            <Col md={24}>
              <Form.Item
                label="IMEI OR SERIAL"
              >
                {this.props.form.getFieldDecorator("removeSerial")(
                  <Select mode="tags" 
                    style={{width: "100%"}}
                    placeholder="SerialNo1, SerialNo2, ...."
                    dropdownStyle={{display: "none"}}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <InputNumber name="fieldIndex" style={{display: "none"}} data={this.props.index} form={this.props.form} />
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