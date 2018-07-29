import React from "react";
import Modal from "../../shares/Modal";
import StoreLanguageAction from "../../../action/settings/storeLanguage";
import { InputText } from "../../../../common/elements/ant-ui/InputText";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Store Language";
    this.addingPropReducer = "storeLanguageAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(StoreLanguageAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(StoreLanguageAction.reset());
  }
  
  render() {
    const { storeLanguageAdd, form } = this.props;
    if (storeLanguageAdd.showForm) {
      this.content = (
        <div>
          {storeLanguageAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText form={form} name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputText form={form} type="number" name="code" placeholder="Code"  label="Code"/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}