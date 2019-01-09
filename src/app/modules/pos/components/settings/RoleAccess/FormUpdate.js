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
    this.title = <this.Translate id="text_access_role" />;
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
        const {roleAccessUpdate} = this.props;
        values["id"] = roleAccessUpdate.data.id;
        this.Util.clearObjProperty(values, [
          "search_name_privillege"
        ]);

        values["privileges"] = this.state.rolePrivileges;
        // console.log("Privilege:", values["privileges"]);
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
      this.content = <FormItem
        privileges={this.props.privileges}
        rolePrivileges={this.props.rolePrivileges}
        formData={roleAccessUpdate.data}
        handleCallBackGetPrivilegeList={this.handleCallBackGetPrivilegeList}
        form={form}
        locale={locale}
        dispatch={this.props.dispatch} />;
      return super.render();
    } else {
      return <div/>;
    }
  }
}