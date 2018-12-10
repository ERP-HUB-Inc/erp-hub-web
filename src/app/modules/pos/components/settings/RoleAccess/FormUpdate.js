import React from "react";
import FormItem from "./FormItem";
import PrivilegeList from "../../../containers/settings/RoleAccess/PrivilegeList";
import RoleAccessAction from "../../../action/settings/roleAccess";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      rowData: null
    };
    this.title = <this.Translate id="text_access_role" />;
    this.width = "50%";
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
        <this.Row>
          <this.Col md="12"> 

            <this.Tabs type="card">
              <this.TabPane tab="Create Role" key="1" style={{ height:"500px" }}>
                <this.Row>
                  <this.Col lg="12" md="12"> 
                    <FormItem formData={roleAccessUpdate.data} form={form} locale={locale} />
                  </this.Col> 
                </this.Row>
              </this.TabPane>
                
              <this.TabPane tab="Role Access" key="2" style={{ height:"500px" }}>
                
                <this.Row>  
                  <this.Col lg="12" md="12"> 
                    { <PrivilegeList rolePrivileges={this.props.rolePrivileges} rowData={this.state.rowData}/> }
                  </this.Col> 
                </this.Row>
          
              </this.TabPane>
            </this.Tabs>

          </this.Col>
        </this.Row>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}