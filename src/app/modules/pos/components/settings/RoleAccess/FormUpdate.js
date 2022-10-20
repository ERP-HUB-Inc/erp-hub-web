import React from "react";
import Modal from "../../../../common/components/shares/Modal";
import FormItem from "./FormItem";
import RoleAccessService from "../../../services/settings/RoleAccessService";
import RoleAccessAction from "../../../action/settings/roleAccess";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      rolePrivileges: [],
      formData: null
    };
    this.title = <this.Translate id="text_role" />;
    this.style = {height: "98vh"};
    this.width = "80%";
    this.wrapClassName = "modal-fix-footer";
    this.dispatch = this.props.dispatch;
    this.grantPermissions = [];
    this.isLoadedData = false;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCallBackGetPrivilegeList = this.handleCallBackGetPrivilegeList.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.roleAccessUpdate.showForm && !this.isLoadedData){
      RoleAccessService.detail(props.rowData.id).then(({data})=>{
        this.setState({formData : data.data});
        if (data.data.metaData){
          this.grantPermissions = JSON.parse(data.data.metaData);
        }
      });
      this.isLoadedData = true;
    }

    if (this.submitLoading){
      this.resetFormData();
    }
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
    this.resetFormData();
  }

  resetFormData(){
    this.setState({formData: null});
    this.isLoadedData = false;
    this.grantPermissions = [];
  }
  
  render() {

    const {roleAccessUpdate, locale, form} = this.props;
    this.submitLoading = roleAccessUpdate.updating;

    if (roleAccessUpdate.showForm) {
      this.content = <FormItem
        privileges={this.props.privileges}
        rolePrivileges={this.props.rolePrivileges}
        formData={this.state.formData}
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