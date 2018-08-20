import React from "react";
import FormItem from "./FormItem";
import Modal from "../../shares/Modal";
import RoleAccessAction from "../../../action/settings/roleAccess";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Access Role";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {roleAccessUpdate} = this.props;
        values["id"] = roleAccessUpdate.data.id;
        this.dispatch(RoleAccessAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(RoleAccessAction.reset());
  }
  
  render() {
    const {roleAccessUpdate, locale, form} = this.props;

    this.submitLoading = roleAccessUpdate.updating;

    if (roleAccessUpdate.showForm) {
      this.content = (
        <FormItem formData={roleAccessUpdate.data} form={form} locale={locale} />
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}