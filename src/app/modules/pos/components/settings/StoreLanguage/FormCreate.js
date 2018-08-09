import React from "react";
import Modal from "../../shares/Modal";
import StoreLanguageAction from "../../../action/settings/storeLanguage";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { Select } from "../../../../common/elements/ant-ui/Select";

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

    this.submitLoading = storeLanguageAdd.adding;

    if (storeLanguageAdd.showForm) {
      this.content = (
        <div>
          {storeLanguageAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText form={form} name="name" label="Name" placeholder="Please input your name" required={true} min={3} min={3} />
          <InputText form={form} name="code" placeholder="Code"  label="Code"/>
          <Select
            name="status"
            label="Status"
            placeholder="Please select status"
            dataSource={this.statusDataSource}
            defaultValue={1}
            form={form}/>

        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}