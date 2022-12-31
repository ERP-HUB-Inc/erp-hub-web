import React from "react";
import {Form} from "antd";
import "./index.css";
import Component from "../../Component";

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
    this.title = this.props.title;
    this.dispatch = this.props.dispatch;
    this.content = "";
    this.modal1 = "";
    this.width = "520px";
    // this.height = "";
    this.wrapClassName = "";
    this.responseError = "";
    this.isRepsonseBackError = "none";
    this.submitLoading = false;
    this.submitConfirmActionLoading = false;
    this.submited = false;
    this.maskClosable = false;
    this.mask = true;
    this.style = {};
    this.requiredMessage = "Error: Please make sure all data input correctly.";
    this.actionConfirmResponseMsg = "Not allow delete this record.";
    this.confirmTextAction = "Are you sure delete this record?";
    this.confirmTitle = "COMPLETED";
    this.statusDataSource = [
      {
        name: <this.Translate id="select_text_active" />,
        value: this.Enum.ACTIVE
      },
      {
        name: <this.Translate id="select_text_deactive" />,
        value: this.Enum.DEACTIVE
      }
    ];

    this.currencies = [
      {
        name: "USD",
        value: "USD"
      },
      {
        name: "KHR",
        value: "KHR"
      }
    ];

    this.isDefaultDataSource = [
      {
        name: <this.Translate id="text_yes" />,
        value: this.Enum.IS_DEFAULT
      },
      {
        name: <this.Translate id="select_text_is_default_no" />,
        value: this.Enum.NOT_DEFAULT
      }
    ];

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmitConfirmAction = this.handleSubmitConfirmAction.bind(this);
  }

  handleSubmit() {
  }

  handleSubmitConfirmAction() {
    this.setState({modalVisible: false});
  }

  handleCancelConfirmAction() {
    this.setState({modalVisible: false});
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

  renderModalConfirmAction() {
    return (
      <this.Modal
        visible={this.state.modalVisible}
        wrapClassName="confirm-delete"
        footer={null}>
        <div>
          <span className="icon-help icon-padding-right"></span>
          <span className="title text-uppercase">{this.confirmTitle}</span><br/>
          <span>{this.confirmTextAction}</span>
        </div>
        <div className="ant-modal-footer">
          <this.Button className="danger text-uppercase" onClick={() => this.handleCancelConfirmAction()}>
            <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_no" />
          </this.Button>
          <this.Button onClick={() => this.handleSubmitConfirmAction()} loading={this.submitConfirmActionLoading} className="info text-uppercase">
            <span className="icon-checked icon-padding-right"></span><this.Translate id="text_yes" />
          </this.Button>
        </div>
      </this.Modal>
    );
  }

  renderOtherAction(){}

  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button className="danger" onClick={() => this.handleCancel()}>
          <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_cancel" />
        </this.Button>  
        <this.Button htmlType="submit" loading={this.submitLoading} className="info">
          <span className="icon-save icon-padding-right"></span><span id="btnModalSave"><this.Translate id="text_save" /></span>
        </this.Button>
        {this.renderOtherAction()}
      </div>
    );
  }

  formatDate(value) {
    const setting = this.Util.getSetting();
    return this.Util.formatDate(value, setting.dateFormat);
  }

  render() {
    return (
      <div>
        {/* FOR DISPLAY SUB MODAL */}
        {this.modal1}
        
        <this.Modal
          style={this.style}
          bodyStyle={this.bodyStyle}
          mask={this.mask}
          maskClosable={this.maskClosable}
          title={this.title}
          width={this.width}
          height={this.height}
          keyboard={true}
          wrapClassName={`vertical-center-modal ${this.wrapClassName}`}
          visible={true}
          onCancel={() => this.handleCancel()}
          footer={null}>
          <Form autoComplete="off" onSubmit={this.handleSubmit}>
            <this.Alert
              style={{display: this.isRepsonseBackError}}
              message={this.requiredMessage}
              type="error"
              showIcon/>
            {this.content}
            {this.renderCrudAction()}
          </Form>
        </this.Modal>
      </div>
    );
  }
}