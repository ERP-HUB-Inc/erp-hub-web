import React from "react";
import { Form } from "antd";
import Component from "../../Component";
import "./index.css";

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.title = this.props.title;
    this.dispatch = this.props.dispatch;
    this.content = "";
    this.submitLoading = false;
    this.requiredMessage = "Please input all required field.";
    this.statusDataSource = [
      {
        name: <this.Translate id="select_text_active" />,
        value: 1
      },
      {
        name: <this.Translate id="select_text_deactive" />,
        value: 0
      }
    ];
  }

  

  handleSubmit() {
    console.log("submit modal");
  }
    
  handleCancel() {}

  render() {
    return (
      <this.Modal
        title={this.title}
        wrapClassName="vertical-center-modal"
        visible={true}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit}> 
          {this.content}
          <div className="ant-modal-footer">
            <this.Button className="danger" onClick={() => this.handleCancel()}>
              <span className="icon-cancel icon-padding-right"></span><this.Translate id="button_text_cancel" />
            </this.Button>  
            <this.Button htmlType="submit" loading={this.submitLoading} className="info">
              <span className="icon-save icon-padding-right"></span><this.Translate id="button_text_save" />
            </this.Button>
          </div>
        </Form>
      </this.Modal>
    );
  }
}