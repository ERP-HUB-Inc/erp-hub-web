import React from "react";
import Modal from "../../../../common/components/shares/Modal";
import PrivilegeList from "../../../components/settings/RoleAccess/ListPrivilege";

export default class FormItem extends Modal {
  render() {
    const {formData, form, locale} = this.props;
    return (
      <this.Tabs type="card">
        <this.TabPane tab="general" key="1"> 
          <this.Row>
            <this.Col md="12"> 
              <this.InputText
                data={formData.name}
                name="name"
                label={<this.Translate id="text_name" />}
                placeholder={this.CATranslate("text_name", locale)}
                errorLenght={<this.Translate id="error_role_name_length" />}
                required={true}
                isAutoFocus={true}
                max={100}
                form={form}/>
              <this.InputText
                data={formData.code}
                name="code"
                label={<this.Translate id="place_holder_role_code" />}
                placeholder={this.CATranslate("place_holder_role_code", locale)}
                max={255}
                disabled={formData.isDefault === this.Enum.IS_DEFAULT}
                form={form}/>
              <this.Select
                name="status"
                label={<this.Translate id="text_status" />}
                dataSource={this.statusDataSource}
                defaultValue={formData.status}
                form={form}/>
            </this.Col> 
          </this.Row>
        </this.TabPane>
        <this.TabPane tab="privilege" key="2">
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
                  dispatch={this.props.dispatch}/> 
              }
            </this.Col> 
          </this.Row>
        </this.TabPane>
      </this.Tabs>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name: "",
    code: "",
    status: 1
  }
};