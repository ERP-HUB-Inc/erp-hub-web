import React from "react";
import { Translate } from "react-localize-redux";
import {
  Form,
  Icon,
  message,
  PageHeader
} from "antd";
import { Button } from "../../../../common/elements/ant-ui";
import Util from "../../../../common/util";
import history from "../../../../common/router/history";
import FormItem from "./FormItem";
import RoleAccessService from "../../../services/settings/RoleAccessService";

export default class FormUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rolePrivileges: [],
      loading: false,
      submitLoading: false,
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
    this.Util = new Util();
  }

  componentDidMount() {
    this.fetchDetail(this.props.match.params.id);
    this.isLoadedData = true;
  }

  fetchDetail(id) {
    this.setState({loading: true});
    RoleAccessService.detail(id)
    .then(({data}) => {
      this.setState({formData : data.data});
      if (data.data.metaData){
        this.grantPermissions = JSON.parse(data.data.metaData);
      }
    })
    .finally(() => this.setState({loading: false}));
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
        values["id"] = this.state.formData.id;
        this.Util.clearObjProperty(values, [
          "search_name_privillege"
        ]);
        values["metaData"]    = JSON.stringify(this.grantPermissions);
        values["privileges"]  = this.state.rolePrivileges;
        values["description"] = "";
        values["status"] = 1;
        this.setState({submitLoading: true});
        RoleAccessService.update(values)
        .then(() => this.fetchDetail(this.state.formData.id))
        .catch(() => message.error("Some thing when wrong"))
        .finally(() => this.setState({submitLoading: false}));
      }
    });
  }

  handleCancel() {
    this.resetFormData();
  }

  onGoBack = () => {
    const afterCreate = new URLSearchParams(document.location.search).get("after-create");
    if (afterCreate) {
      return history.push("/settings/role");
    } 
    history.goBack();
  }

  resetFormData(){
    this.setState({formData: null});
    this.isLoadedData = false;
    this.grantPermissions = [];
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
          onBack={this.onGoBack}
          title={<Translate id="text_update_role" />} 
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
          formData={this.state.formData}
          dispatch={this.props.dispatch}
          loading={this.state.loading}
          locale={this.props.locale} />
      </Form>
    );
  }
}