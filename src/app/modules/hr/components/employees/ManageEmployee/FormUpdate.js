import React from "react";
import FormItem from "./FormItem";
import { Modal } from "../../shares/Modal/modal";
import ManageEmployeeAction from "../../../actions/employees/manageEmployee";


export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };

    this.title = "Manage Employee:Update";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
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
        const {manageEmployeeUpdate} = this.props;
        values["id"] = manageEmployeeUpdate.data.id;
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(ManageEmployeeAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(ManageEmployeeAction.reset());
  }

  render() {
    const {manageEmployeeUpdate, form, locale} = this.props;

    if (manageEmployeeUpdate.showForm) {
      this.content = (
        <div>
          {manageEmployeeUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem formData={manageEmployeeUpdate.data} form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}