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
        this.dispatch(RoleAccessAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(RoleAccessAction.reset());
  }
  
  render() {
    const {roleAccessAdd, locale, form} = this.props;

    this.submitLoading = roleAccessAdd.adding;

    if (roleAccessAdd.showForm) {
      this.content = (
        <FormItem form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}