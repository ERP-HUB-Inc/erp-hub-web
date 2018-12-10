import React from "react";
import List from "../List";
import FormCreate from "../../../containers/settings/RoleAccess/FormCreate";
import FormUpdate from "../../../containers/settings/RoleAccess/FormUpdate";
import Constant from "../../../constants/settings/roleAccess";
import RoleAccessAction from "../../../action/settings/roleAccess";
import RolePrivilegeAction from "../../../action/settings/rolePrivilege";
import RoleAccessService from "../../../services/settings/RoleAccessService";
import StartUp from "../../../../common/components/StartUp";
import NoPermission from "../../../../common/components/shares/List/NoPermission";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state
    };
    this.columns = new Column();
    this.fetchingProp = "roleAccess";
    this.addingProp = "roleAccessAdd";
    this.updatingProp = "roleAccessUpdate";
    this.columnFilterWithKey = ["name"];
    this.service = RoleAccessService;
    this.action = RoleAccessAction;
    this.RESET_CONSTANT = Constant.RESET_ROLE_ACCESS;
  }

  handleShowFormAdd() {
    const {dispatch} = this.props;
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

  renderFilterRecord() {
    const {form} = this.props;
    const fetchingProps = this.props[this.fetchingProp];
    return (
      form == null ?
        ""
        :
        <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout form-group">
            <this.Col md="4">
              <this.InputText
                name="key"
                label="Search"
                placeholder="Search for code, name and address"
                form={form}
              />
            </this.Col>
            <this.Col md="3">
              <this.Select
                name="status"
                label={<this.Translate id="text_status" />}
                placeholder="Please select status"
                dataSource={this.statusList}
                defaultValue={this.Enum.ALL_STATE}
                form={form}
              />
            </this.Col>
            <this.Col md="2" className="wrap-btn-search">
              <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
                <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
              </this.Button>
            </this.Col>
          </this.Row>
        </this.Form>
    );
  }

  handleShowRecordDetail(rowData) {
    const {dispatch} = this.props;
    dispatch(RolePrivilegeAction.fetch(rowData.id));
    this.setState({rowData});
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
            { this.renderBreadCrumb()}
            <this.Row className="main-row-role-access">
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
      this.columnCreatedAt,
      this.columnNo,
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: <this.Translate id="col_role_code" />,
        dataIndex: "code",
        key: "code",
        sorter: true
      },
      this.columnStatus
    ];
  }
}
