import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import SoreLanguage from "../../../action/settings/storeLanguage";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Language";
    this.addingPropReducer = "languageUpdate";
    this.dispatch = this.props.dispatch;
  }

  handleSubmit() {
    const { formUpdate } = this.props;
    this.dispatch(SoreLanguage.update(formUpdate.values));
  }
    
  handleCancel() {
    this.dispatch(SoreLanguage.reset());
  }
  
  render() {
    const { languageUpdate } = this.props;
    if (languageUpdate.showForm) {
      this.content = (
        <div>
          {languageUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText data={languageUpdate.data.name}  name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputText data={languageUpdate.data.code} type="number" name="code" label="Code"/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}