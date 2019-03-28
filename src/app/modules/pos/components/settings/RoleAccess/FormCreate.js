import React from "react";
import FormItem from "./FormItem";
import RoleAccessAction from "../../../action/settings/roleAccess";
import Modal from "../../../../common/components/shares/Modal";
export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      rolePrivileges: []
    };
    this.title = <this.Translate id="text_role" />;
    this.style = {height: 550};
    this.wrapClassName = "modal-fix-footer";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCallBackGetPrivilegeList = this.handleCallBackGetPrivilegeList.bind(this);
  }

  handleCallBackGetPrivilegeList(rolePrivileges) {
    this.setState({rolePrivileges});
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.Util.clearObjProperty(values, ["search_name_privillege"]);
        values["privileges"] = this.state.rolePrivileges;
        values["description"] = "";
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
      this.content = <FormItem 
        form={form} 
        rolePrivileges={this.props.rolePrivileges} 
        privileges={this.props.privileges}
        handleCallBackGetPrivilegeList={this.handleCallBackGetPrivilegeList}
        rowData={this.props.rowData}
        dispatch={this.props.dispatch}
        locale={locale}/>;
      return super.render();
    } else {
      return <div/>;
    }
  }
}