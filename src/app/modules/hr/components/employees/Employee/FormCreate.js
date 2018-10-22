import React from "react";
import FormItem from "./FormItem";
import ManageEmployeeAction from "../../../actions/employees/employee";
import Modal from "../../../../common/components/shares/Modal";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      locations: []
    };
    this.wrapClassName = "modal-fix-footer";
    this.title = <this.Translate id="text_employee"/>;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getAccessLocation = this.getAccessLocation.bind(this);
  }

  handleCancel() {
    this.dispatch(ManageEmployeeAction.reset());
  }

  getAccessLocation(locations) {
    this.setState({locations});
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["isPasswordExpired"] = this.Util.checkValueSwitch(values.isPasswordExpired);
        values["isMustChangePWNextLogin"] = this.Util.checkValueSwitch(values.isMustChangePWNextLogin);
        values["photo"] = this.getImageFromUpload(values, "photo");
        values["status"] = this.Enum.ACTIVE;
        values["locations"] = this.state.locations;
        this.dispatch(ManageEmployeeAction.add(values));   
      }

    });
  }

  render() {
    this.submitLoading = this.props.manageEmployeeAdd.adding;

    if (this.props.manageEmployeeAdd.showForm) {
      this.content = <FormItem
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