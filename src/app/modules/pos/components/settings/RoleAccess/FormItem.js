import React from "react";
import Modal from "../../../../common/components/shares/Modal";
import permissions from "./permission";
import {Checkbox, Divider} from "antd";

export default class FormItem extends Modal {

  constructor(props) {
    super(props);
    this.state = {
      grantPermissions: []
    };
    this.translationSuffixes = {
      en:"",
      km:"KH"
    };
  }

  componentDidMount() {
    console.log("this.props.formData",this.props.formData);
  }

  translatePermission(permission){
    return permission["name" + this.translationSuffixes[this.Util.getCurrentLanguageCode()]];
  }

  onChange = (main, code) => {
    this.setState(previousState => {
      return {
        ...previousState,
        grantPermissions: this.assignPermission(previousState.grantPermissions, main, code)
      };
    });
  };

  onCheckAllChange = (e, main) => {
    const foundAssignedModuleIndex = this.findGrantModuleIndex(main.code),
        grantPermissions = this.state.grantPermissions;
    let needToRefreshState = false;
    if (e.target.checked) {
      if (foundAssignedModuleIndex >= 0) {
        grantPermissions[foundAssignedModuleIndex].permissions = main.permissions.map(permission => permission.code);
        needToRefreshState = true;
      } else {
        this.setState(previousState => {
          return {
            ...previousState,
            grantPermissions: this.assignPermission(previousState.grantPermissions, main)
          };
        });
      }
    } else {
      grantPermissions[foundAssignedModuleIndex].permissions = [];
      needToRefreshState = true;
    }

    if (needToRefreshState) {
      this.setState({grantPermissions});

      if (this.props.callback) {
        this.props.callback(grantPermissions);
      }
    }
  };

  findGrantModuleIndex = (mainCode) => {
    return this.state.grantPermissions.findIndex(value => value.code === mainCode);
  }

  assignPermission = (grantPermissions, main, code = null) => {
    /* Find existing master assigned module */
    const foundAssignedModule = grantPermissions.find(value => value.code === main.code);
    if (foundAssignedModule) {
      // Check one by cone
      if (code) {
        const foundPrivilegeAtIndex = foundAssignedModule.permissions.findIndex(privilege => privilege === code);
        /* If already checked, unchecked it away */
        if (foundPrivilegeAtIndex >= 0) {
          foundAssignedModule.permissions.splice(foundPrivilegeAtIndex, 1);
        } else {
          foundAssignedModule.permissions.push(code);
        }
        /* Check All */
      } else {
        foundAssignedModule.permissions = main.permissions;
      }
    } else {
      if (code) {
        grantPermissions.push({ code: main.code, permissions: [code] });
      } else {
        grantPermissions.push({ code: main.code, permissions: main.permissions.map(permission => permission.code) });
      }
    }

    if (this.props.callback) {
      this.props.callback(grantPermissions);
    }
    this.props.handleCallBackGetGrantPermissions(grantPermissions);
    return grantPermissions;
  }

  isCheckedPermissionAll(mainCode, totalPrivilege)  {
    const foundAssignedModule = this.findGrantModule(mainCode);

    if (foundAssignedModule && foundAssignedModule.permissions.length === totalPrivilege) {
      return true;
    }

    return false;
  }

  isCheckedPermission = (mainCode, code) => {
    const result = this.findGrantModule(mainCode);
    if (result && Array.isArray(result.permissions)) {
      return result.permissions.includes(code);
    }
    return false;
  }

  findGrantModule = (mainCode) => {
    return this.state.grantPermissions.find(value => value.code === mainCode);
  }

  render() {
    const {formData, form, locale} = this.props;
    return (
        <div>
          <Divider style={{margin: "0"}} />
          <this.Row  style={{padding: "15px 25px 0 25px", height: "77vh", maxHeight: "100vh"}}>
            <this.Col md="12" style={{maxHeight: "30%"}}>
              <this.InputText
                  data={formData.name}
                  name="name"
                  label={<this.Translate id="text_name" />}
                  placeholder={this.CATranslate("text_name", locale)}
                  errorLenght={<this.Translate id="error_name_length" />}
                  required={true}
                  isAutoFocus={true}
                  max={100}
                  form={form}/>
            {/*<this.InputText
                data={formData.code}
                name="code"
                label={<this.Translate id="text_code" />}
                placeholder={this.CATranslate("text_code", locale)}
                max={255}
                disabled={formData.isDefault === this.Enum.IS_DEFAULT}
                form={form}/>*/}
              <this.Select
                name="status"
                label={<this.Translate id="text_status" />}
                dataSource={this.statusDataSource}
                defaultValue={formData.status}
                form={form}/>
          </this.Col>
            <this.Col md="12" style={{ marginTop: 15 , maxHeight: "68%"}}>
              <this.Row style={{ maxHeight: "100%", overflow: "auto" }}>
              {
                permissions.map((main, key) =>
                    <this.Col md="4" key={key} style={{ marginBottom: 15 }}>
                      <div style={{ borderBottom: "1px solid #E9E9E9", marginBottom: 10 }}>
                        {this.translatePermission(main)}
                      </div>
                      {
                        main.permissions.length > 1 ?
                            <Checkbox
                                onChange={e => this.onCheckAllChange(e, main)}
                                checked={this.isCheckedPermissionAll(main.code, main.permissions.length)}
                            >
                              <this.Translate id="text_select_all" />
                            </Checkbox>
                            :
                            ""
                      }
                      {
                        main.permissions.map((permission, index) =>
                            <div key={index}>
                              <Checkbox
                                  onChange={() => this.onChange(main, permission.code)}
                                  checked={this.isCheckedPermission(main.code, permission.code)}
                              >
                                {this.translatePermission(permission)}
                              </Checkbox>
                            </div>
                        )
                      }
                    </this.Col>
                )
              }
            </this.Row>
          </this.Col>
        </this.Row>
        </div>

        /*<this.TabPane tab={<this.Translate id="text_privilege" />} key="2">
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
                  locale={locale}
                  dispatch={this.props.dispatch}/> 
              }
            </this.Col> 
          </this.Row>
        </this.TabPane>*/
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