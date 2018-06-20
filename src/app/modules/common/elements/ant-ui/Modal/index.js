import React, { Component } from "react";
import { Modal, Button } from "antd";

export class CModal extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };

    this.showModal = () => {
      this.setState({
        visible: true,
      });
    };

    this.handleOk = (e) => {
      this.setState({
        visible: false,
      });
    };
    
    this.handleCancel = (e) => {
      this.setState({
        visible: false,
      });
    };
  }

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>Open</Button>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}