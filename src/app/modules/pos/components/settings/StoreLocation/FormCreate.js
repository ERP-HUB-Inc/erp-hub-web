import React from "react";
import Modal from "../../shares/Modal";
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

    this.submitLoading = storeLocationAdd.adding;

    if (storeLocationAdd.showForm) {
      this.content = (
        <div>
          {storeLocationAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <this.InputText form={form} name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <this.InputText form={form} name="address" placeholder="Address" label="Address"/>
          <this.Select
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