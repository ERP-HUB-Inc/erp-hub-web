import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import { Select } from "../../../../common/elements/ant-ui/Select";
import StoreLocationAction from "../../../action/settings/storeLocation";

export default class FormStoreLocationCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Store Location";
    this.addingPropReducer = "storeLocationAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(StoreLocationAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(StoreLocationAction.reset());
  }
  
  render() {
    const { storeLocationAdd, form } = this.props;
    if (storeLocationAdd.showForm) {
      this.content = (
        <div>
          {storeLocationAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText form={form} name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputText form={form} type="text" name="address" placeholder="Address" label="Address"/>
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