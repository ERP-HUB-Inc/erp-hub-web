import React from "react";
import Modal from "../../shares/Modal";
import StoreLanguageAction from "../../../action/settings/storeLanguage";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { Select } from "../../../../common/elements/ant-ui/Select";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Language";
    this.addingPropReducer = "languageUpdate";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {languageUpdate} = this.props;
        values["id"] = languageUpdate.data.id;
        this.dispatch(StoreLanguageAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(StoreLanguageAction.reset());
  }
  
  render() {
    const { languageUpdate, form } = this.props;
    if (languageUpdate.showForm) {
      this.content = (
        <div>
          {languageUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText form={form} data={languageUpdate.data.name}  name="name" label="Name" placeholder="Please input your name" required={true} min={3}/>
          <InputText form={form} data={languageUpdate.data.code} type="number" name="code" placeholder="Code" label="Code"/>
          <Select
            name="status"
            label="Status"
            placeholder="Please select status"
            dataSource={this.statusDataSource}
            defaultValue={ languageUpdate.data.status }
            form={form}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}