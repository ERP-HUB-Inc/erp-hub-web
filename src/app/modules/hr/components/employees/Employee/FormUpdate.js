import React from "react";
import FormItem from "./FormItem";
import ManageEmployeeAction from "../../../actions/employees/employee";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      locations: []
    };

    this.wrapClassName = "modal-fix-footer";
    this.title = <this.Translate id="text_employee"/>;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getAccessLocation = this.getAccessLocation.bind(this);
  }

  getAccessLocation(locations) {
    this.setState({locations});
  }

  onChange(checked){
    this.setState({
      disabled : checked === 1 
    });
    this.props.form.setFieldsValue({password: ""});
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.update.data.id;
        values["photo"] = this.getImageFromUpload(values, "photo");
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(ManageEmployeeAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(ManageEmployeeAction.reset());
  }

  render() {
    this.submitLoading = this.props.update.adding;

    if (this.props.detail.showForm) {
      this.content = <FormItem
        formData={this.props.update.data}
        roles={this.props.roles.list}
        locations={this.props.locations.list}
        callBack={this.getAccessLocation}
        dispatch={this.props.dispatch}
        form={this.props.form}
        locale={this.props.locale}/>;
      return super.render();
    } else {
      return <div/>;
    }
  }
}