import React from "react";
import OpenSalaRegisrationAction from "../../../action/transaction/openSalaRegisration";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <div>
      <div style={{marginBottom: 15}}>
        <img src="https://storeveinresource.sgp1.digitaloceanspaces.com/storeVein/register-closed-cac5b6cc7c.svg" alt=""/>
      </div>
      <div>
        <this.Translate id="text_register_closed" />
      </div>
    </div>;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch(OpenSalaRegisrationAction.open(values["open"], values["description"]));
      } 
    });
  }
    
  handleCancel() {
    this.dispatch(OpenSalaRegisrationAction.reset());
  }

  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button htmlType="submit" loading={this.submitLoading} className="info">
          <span className="icon-save icon-padding-right"></span>Open Sale Registration
        </this.Button>
      </div>
    );
  }
  
  render() {
    this.submitLoading = this.props.open.updating;
    
    this.content = (
      <div>
        <this.InputNumber
          name="open"
          label="Open Cash"
          placeholder="Open Cash"
          required={true}
          isAutoFocus={true}
          form={this.props.form}/>
        <this.InputTextArea
          name="description"
          label={<this.Translate id="text_description" />}
          max={255}
          form={this.props.form}/>
      </div>
    );
    return super.render();
  }
}