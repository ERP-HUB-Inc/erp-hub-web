import React from "react";
import Constant from "../../../constants/transactions/openSaleRegisration";
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
    this.dispatch(OpenSalaRegisrationAction.reset(Constant.RESET_OPEN_SALE_REGISTRATION));
  }

  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button htmlType="submit" loading={this.props.open.adding} className="info">
          <span className="icon-save icon-padding-right"></span>Open Sale Registration
        </this.Button>
      </div>
    );
  }
  
  render() {
    if (this.props.open.showForm) {
      this.content = (
        <div>
          <this.InputNumber
            name="open"
            label="Open Cash"
            placeholder="Open Cash"
            required={true}
            isAutoFocus={true}
            isAutoSelect={true}
            form={this.props.form}/>
          <this.InputTextArea
            name="description"
            label={<this.Translate id="text_description" />}
            max={255}
            form={this.props.form}/>
        </div>
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}