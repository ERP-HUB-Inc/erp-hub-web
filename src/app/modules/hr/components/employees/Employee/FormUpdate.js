import React from "react";
import FormItem from "./FormItem";
import Constant from "../../../constants/employees/employee";
import EmployeeAction from "../../../actions/employees/employee";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      locations: [],
      locationId: ""
    };

    this.wrapClassName = "modal-fix-footer";
    this.title = <this.Translate id="text_employee"/>;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getAccessLocation = this.getAccessLocation.bind(this);
    this.getDefaultLocation = this.getDefaultLocation.bind(this);
  }

  getAccessLocation(locations) {
    this.setState({locations});
  }

  getDefaultLocation(locationId) {
    this.setState({locationId});
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
        values["id"] = this.props.detail.data.id;
        values["userId"] = this.props.detail.data.userId; 
        values["photo"] = this.getImageFromUpload(values, "photo");
        values["locationId"] = this.state.locationId;
        values["locations"] = this.state.locations;
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(EmployeeAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(EmployeeAction.reset(Constant.RESET_DETAIL_EMPLOYEE));
  }

  render() {
    this.submitLoading = this.props.update.updating;
    if (this.props.detail.showForm) {
      this.content = <FormItem
        formData={this.props.detail.data}
        roles={this.props.roles.list}
        locations={this.props.locations.list}
        callBack={this.getAccessLocation}
        callBackDefaultLocation={this.getDefaultLocation}
        dispatch={this.props.dispatch}
        form={this.props.form}
        locale={this.props.locale}/>;
      return super.render();
    } else {
      return <div/>;
    }
  }
}