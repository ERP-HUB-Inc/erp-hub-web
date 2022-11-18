import React from "react";
import {
  isMobile
} from "react-device-detect";
import List from "../List";
import FormCreate from "../../../containers/settings/RoleAccess/FormCreate";
import FormUpdate from "../../../containers/settings/RoleAccess/FormUpdate";
import Constant from "../../../constants/settings/roleAccess";
import RoleAccessAction from "../../../action/settings/roleAccess";
/*import RolePrivilegeAction from "../../../action/settings/rolePrivilege";*/
import RoleAccessService from "../../../services/settings/RoleAccessService";
import menuSource from "../../../../common/components/layout/SiderBar/datasource";
import StartUp from "../../../../common/components/StartUp";
import NoPermission from "../../../../common/components/shares/List/NoPermission";
import "./index.css";
import history from "../../../../common/router/history";

export default class RoleAccessList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state
    };
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.fetchingProp = "roleAccess";
    this.addingProp = "roleAccessAdd";
    this.updatingProp = "roleAccessUpdate";
    this.callBackOnShowEditForm = this.showFormEdit;
    this.columnFilterWithKey = ["name"];
    this.service = RoleAccessService;
    this.action = RoleAccessAction;
    this.RESET_CONSTANT = Constant.RESET_ROLE_ACCESS;
  }

  showFormEdit(rowData) {
    history.push(`/settings/role-update/${rowData.id}`);
  }

  handleShowFormAdd() {
    history.push("/settings/role-create");
  }

  renderFilterRecord() {
    const {form} = this.props;
    const fetchingProps = this.props[this.fetchingProp];
    return (
      form == null ?
        ""
        :
        <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout form-group">
            {this.renderFilterGeneralKey()}
            {this.renderFilterStatus()}
            <this.Col md="2" className="wrap-btn-search">
              <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
                <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
              </this.Button>
            </this.Col>
          </this.Row>
        </this.Form>
    );
  }

  renderMiniBreadCrumb() {
    // get current path of breadcrum compare with url
    const currentPath = window.location.pathname;
    return (
      <div className="breadcrumb">
        <ul className="list-unstyled">
          <li>
            <this.Link to="/"><span className="icon-home"></span></this.Link>
          </li>
          {
            menuSource[this.module]["subItems"].map((value, index) =>
              currentPath === value["route"] ? 
                <li className="fast-nav text-uppercase" key={index}>
                  <this.Link to={value["route"]}>{value["title"]}</this.Link>
                </li>
                :
                ""
            )
          }
        </ul>
      </div>
    );
  }

  render() {

    let fetchingProps = this.props[this.fetchingProp];
    const addingProps = this.props[this.addingProp];
    const updatingProps = this.props[this.updatingProp];

    // Here is repsonse from add action and combinde response data to the list.
    if (addingProps.response != null) {
      fetchingProps.list = [addingProps.response.data, ...fetchingProps.list];
      this.props.dispatch({type: this.RESET_CONSTANT});
    }

    // Here is repsonse from updating action and update response data to the list.
    if (updatingProps.response != null) {
      const updateIndex = this.Util.findArrayIndex(fetchingProps.list, "id", updatingProps.response.data.id);
      fetchingProps.list.splice(updateIndex, 1, updatingProps.response.data);
      this.props.dispatch({type: this.RESET_CONSTANT});
    }

    return (
      this.Util.isCheckingPermission(this.props) ?
        <StartUp />
        :
        this.Util.isNoPermissionProp(this.props) ?
          <NoPermission />
          :
          <div style={{marginTop: "15px", width: "100%"}}>
            { isMobile ?
              this.renderMiniBreadCrumb()
              :
              this.renderBreadCrumb()
            }
            <this.Row className="main-row-role-access" style={{height: "100%"}}>
              <this.Col md="12">
                { this.renderTableList(fetchingProps) }
              </this.Col>
          
              { this.state.modalConten }

              { this.renderModalConfirmDelete() }
            </this.Row>
          </div>
    );
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: <this.Translate id="text_code" />,
        dataIndex: "code",
        key: "code",
        sorter: true
      },
      this.columnStatus
    ];
  }
}
