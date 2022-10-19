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
    this.style = {height: "98vh"};
    this.width = "80%";
    this.wrapClassName = "modal-fix-footer";
    this.dispatch = this.props.dispatch;
    this.grantPermissions = [];
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCallBackGetPrivilegeList = this.handleCallBackGetPrivilegeList.bind(this);
  }



  handleCallBackGetGrantPermissions(permissions) {
    this.grantPermissions = permissions;
  }

  handleCallBackGetPrivilegeList(rolePrivileges) {
    this.setState({rolePrivileges});
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {roleAccessDetail} = this.props;
        values["id"] = roleAccessDetail.data.id;
        this.Util.clearObjProperty(values, [
          "search_name_privillege"
        ]);
        values["metaData"]    = JSON.stringify(this.grantPermissions);
        values["privileges"]  = this.state.rolePrivileges;
        values["description"] = "";
        this.dispatch(RoleAccessAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(RoleAccessAction.reset());
  }
  
  render() {
    const {roleAccessUpdate, roleAccessDetail, locale, form} = this.props;
    this.submitLoading = roleAccessUpdate.updating;
    console.log("roleAccessUpdate", this.props);

    if (roleAccessUpdate.showForm) {
      this.content = <FormItem
        privileges={this.props.privileges}
        rolePrivileges={this.props.rolePrivileges}
        formData={roleAccessDetail.data}
        handleCallBackGetPrivilegeList={this.handleCallBackGetPrivilegeList}
        handleCallBackGetGrantPermissions={(permissions)=>this.handleCallBackGetGrantPermissions(permissions)}
        form={form}
        locale={locale}
        dispatch={this.props.dispatch} />;
      return super.render();
    } else {
      return <div/>;
    }
  }
}