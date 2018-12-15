import React from "react";
import FormItem from "./FormItem";
import PrivilegeList from "../../../containers/settings/RoleAccess/PrivilegeList";
import RolePrivilegeAction from "../../../action/settings/rolePrivilege";
import RoleAccessAction from "../../../action/settings/roleAccess";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      rolePrivileges: []
    };
    this.title = "Access Role";
    this.width = "70%";
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
        const privileges = {privileges: this.state.rolePrivileges};
        this.dispatch(RoleAccessAction.update(values));
        this.dispatch(RolePrivilegeAction.assignPrivilege(roleAccessUpdate.data.id,privileges));
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
        <this.Tabs type="card">
          <this.TabPane tab="Create Role" key="1" style={{ height:"500px" }}> 
            <FormItem
              formData={roleAccessUpdate.data}
              handleCallBackGetPrivilegeList={this.handleCallBackGetPrivilegeList}
              form={form}
              locale={locale} />
          </this.TabPane>
          <this.TabPane tab="Role Access" key="2" style={{ height:"500px" }}>
            <this.Row>  
              <this.Col lg="12" md="12"> 
                { 
                  <PrivilegeList 
                    rolePrivileges={this.props.rolePrivileges}
                    handleCallBackGetPrivilegeList={this.props.handleCallBackGetPrivilegeList}
                    formvalue={this.props.formvalue} 
                    privileges={this.props.privileges}
                    rowData={this.props.rowData}  
                    form ={this.props.form}
                    dispatch={this.props.dispatch}
                  /> }
              </this.Col> 
            </this.Row>
          </this.TabPane>
        </this.Tabs>

      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}