import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { Select } from "../../../../common/elements/ant-ui/Select";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import StoreLocationAction from "../../../action/settings/storeLocation";

export default class FormUpdate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Store Location:Update";
    this.addingPropReducer = "storeLocationUpdate";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {storeLocationUpdate} = this.props;
        values["id"] = storeLocationUpdate.data.id;
        this.dispatch(StoreLocationAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(StoreLocationAction.reset());
  }
  
  render() {
    const { storeLocationUpdate, form } = this.props;
    if (storeLocationUpdate.showForm) {
      this.content = (
        <div>
          {storeLocationUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText form={form} name="name" data={ storeLocationUpdate.data.name } label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputText form={form} name="address" data={ storeLocationUpdate.data.address } label="Address" placeholder="Address"/>
          <Select
            name="status"
            label="Status"
            placeholder="Please select status"
            dataSource={this.statusDataSource}
            defaultValue={storeLocationUpdate.data.status}
            form={form}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}