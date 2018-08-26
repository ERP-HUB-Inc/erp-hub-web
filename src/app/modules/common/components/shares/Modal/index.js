import React from "react";
import {Form} from "antd";
import Component from "../../Component";
import "./index.css";

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.title = this.props.title;
    this.dispatch = this.props.dispatch;
    this.content = "";
    this.modal1 = "";
    this.width = "";
    this.responseError = "";
    this.isRepsonseBackError = "none";
    this.submitLoading = false;
    this.submited = false;
    this.requiredMessage = "Error: Please make sure all data input correctly.";
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
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    
  }
    
  handleCancel() {

  }

  validatorAddRecord(responseAdd) {
    if (
      responseAdd.error != null 
      && "error" in responseAdd.error 
      && responseAdd.error.error.code === 400) {
      this.isRepsonseBackError = "";
    }
  }

  validatorUpdateRecord(responseUpdate) {
    if (
      responseUpdate.error != null 
      && "data" in responseUpdate.error 
      && responseUpdate.error.data.error.code === 400) {
      this.isRepsonseBackError = "";
    }
  }

  render() {
    return (
      <div>
        {this.modal1}
        <this.Modal
          title={this.title}
          width={this.width}
          wrapClassName="vertical-center-modal"
          visible={true}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit}>
            <this.Alert style={{display: this.isRepsonseBackError}} message={this.requiredMessage} type="error" showIcon/>
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
      </div>
    );
  }
}