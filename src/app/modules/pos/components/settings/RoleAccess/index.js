import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/RoleAccess/FormCreate";
import FormUpdate from "../../../containers/settings/RoleAccess/FormUpdate";
import PrivilegeList from "../../../containers/settings/RoleAccess/PrivilegeList";
import Constant from "../../../constants/settings/roleAccess";
import RoleAccessAction from "../../../action/settings/roleAccess";
import RoleAccessService from "../../../services/settings/RoleAccessService";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.fetchingProp = "roleAccess";
    this.addingProp = "roleAccessAdd";
    this.updatingProp = "roleAccessUpdate";
    this.showListRole = "showListRole";
    this.service = RoleAccessService;
    this.action = RoleAccessAction;
    this.RESET_CONSTANT = Constant.RESET_ROLE_ACCESS;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(RoleAccessAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(RoleAccessAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  handleShowRecordDetail(rowData) {
    console.log("Row Data:", rowData);
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
      <div style={{marginTop: "15px"}}>
        { this.renderBreadCrumb()}
        <this.Row className="main-row-role-access">
          <this.Col md="8">
            { this.renderTableList(fetchingProps) }
          </this.Col>
          <this.Col md="4">
            { <PrivilegeList /> }
          </this.Col>
          
          { this.state.modalConten }

          { this.renderModalConfirmDelete() }
        </this.Row>
      </div>
    );
  }
}
