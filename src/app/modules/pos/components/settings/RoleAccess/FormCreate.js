import React from "react";
import { Translate } from "react-localize-redux";
import { Form, Icon, message, PageHeader } from "antd";
import Util from "../../../../common/util";
import FormItem from "./FormItem";
import RoleAccessService from "../../../services/settings/RoleAccessService";
import history from "../../../../common/router/history";
import { Button } from "../../../../common/elements/ant-ui";

export default class FormCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitLoading: false,
      rolePrivileges: []
    };
    this.title = <this.Translate id="text_role" />;
    this.style = {height: "98vh"};
    this.width = "80%";
    this.wrapClassName = "modal-fix-footer";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCallBackGetPrivilegeList = this.handleCallBackGetPrivilegeList.bind(this);
    this.grantPermissions = [];
    this.Util = new Util();
  }

  handleCallBackGetPrivilegeList(rolePrivileges) {
    this.setState({rolePrivileges});
  }

  handleCallBackGetGrantPermissions(permissions) {
    this.grantPermissions = permissions;
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.Util.clearObjProperty(values, ["search_name_privillege"]);
        values["privileges"]  = this.state.rolePrivileges;
        values["metaData"]    = JSON.stringify(this.grantPermissions);
        values["description"] = "";
        this.setState({submitLoading: true});
        RoleAccessService.add(values)
        .then(response => {
          console.log("response", response);
          history.push(`/settings/role-update/${response.data.data.id}?after-create=1`);
        })
        .catch(() => message.error("Something when wrong"))
        .finally(() => this.setState({submitLoading: false}));
      }
    });
  }
  
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <PageHeader
          style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0,
          position: "relative"
          }}
          onBack={() => history.goBack()}
          title={<Translate id="text_new_role" />} 
          extra={[
            <Button type="info" htmlType="submit" loading={this.state.submitLoading} key={0} style={{marginRight: 25}}>
              <Icon type="save" /> <Translate id="text_save" />
            </Button>
          ]}
        />
        <FormItem 
          form={this.props.form} 
          rolePrivileges={this.props.rolePrivileges} 
          privileges={this.props.privileges}
          handleCallBackGetPrivilegeList={this.handleCallBackGetPrivilegeList}
          handleCallBackGetGrantPermissions={(permissions)=>this.handleCallBackGetGrantPermissions(permissions)}
          rowData={this.props.rowData}
          dispatch={this.props.dispatch}
          locale={this.props.locale} />
      </Form>
    );
  }
}