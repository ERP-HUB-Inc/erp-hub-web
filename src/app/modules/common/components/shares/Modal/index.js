import React from "react";
import {Form} from "antd";
import Component from "../../Component";
import ConstantAuth from "../../../constants/authentication";
import "./index.css";

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
    this.width = "";
    this.responseError = "";
    this.isRepsonseBackError = "none";
    this.isRepsonseBackErrorOfAction = "none";
    this.submitLoading = false;
    this.submitConfirmActionLoading = false;
    this.submited = false;
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

    this.isDefaultDataSource = [
      {
        name: <this.Translate id="select_text_is_default_yes" />,
        value: this.Enum.IS_DEFAULT
      },
      {
        name: <this.Translate id="select_text_is_default_no" />,
        value: this.Enum.NOT_DEFAULT
      }
    ];

    this.handleSubmit = this.handleSubmit.bind(this);
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

  formatCurrency(value) {
    const setting = this.Util.getSetting(ConstantAuth.ACCESS_TOKEN);
    return this.Util.formatCurrency(value, setting.currency, setting.currencyPosition);
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
        footer={null}    
      >
        <this.Alert style={{display: this.isRepsonseBackErrorOfAction}} message={this.actionConfirmResponseMsg} type="error" showIcon/>
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

  renderOtherAction(){

  }

  renderCrudAction(){
    return(
      <div>
        <this.Button className="danger" onClick={() => this.handleCancel()}>
          <span className="icon-cancel icon-padding-right"></span><this.Translate id="button_text_cancel" />
        </this.Button>  
        <this.Button htmlType="submit" loading={this.submitLoading} className="info">
          <span className="icon-save icon-padding-right"></span><this.Translate id="button_text_save" />
        </this.Button>
        {this.renderOtherAction()}
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* FOR DISPLAY SUB MODAL */}
        {this.modal1}
        
        <this.Modal
          title={this.title}
          width={this.width}
          wrapClassName="vertical-center-modal"
          visible={true}
          footer={null}
        >
          <Form autoComplete="off" onSubmit={this.handleSubmit}>
            <this.Alert style={{display: this.isRepsonseBackError}} message={this.requiredMessage} type="error" showIcon/>
            {this.content}
            <div className="ant-modal-footer">
              {this.renderCrudAction()}
            </div>
          </Form>
        </this.Modal>
      </div>
    );
  }
}