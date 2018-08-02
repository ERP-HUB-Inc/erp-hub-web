import React from "react";
import columns from "./column";
// import List from "../../List";
import List from "./List";
import FormCreate from "../../../containers/settings/PaymentMethod/FormCreate";
import FormUpdate from "../../../containers/settings/PaymentMethod/FormUpdate";
import ListRoleAccess from "../../../containers/settings/RoleAccess/ListRoleAccess";
// import ListRoleAccess from "./ListRoleAccess";
import Constant from "../../../constants/settings/roleAccess";
import RoleAccessAction from "../../../action/settings/roleAccess";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);

    this.columns = columns;
    this.fetchingProp = "roleAccess";
    this.addingProp = "roleAccessAdd";
    this.updatingProp = "roleAccessUpdate";
    this.showListRole = "showListRole";
    this.Layout = "6";
    this.RESET_CONSTANT = Constant.RESET_ROLE_ACCESS;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    
    this.setState({
      ListRoles: <ListRoleAccess/>
    });

    dispatch(RoleAccessAction.fetch(this.pageSize));
  }

  onChange(pagination, filters, sorter) {
    const { dispatch } = this.props;

    super.onChange(pagination, filters, sorter);
    
    dispatch(RoleAccessAction.fetch(...this.filter));
  }

  onChangePagination(current, pageSize) {
    const { dispatch } = this.props;

    this.filter = [
      pageSize,
      (current - 1) * pageSize,
    ];

    dispatch(RoleAccessAction.fetch(...this.filter));

    this.setState({ current});
  }

  onShowSizeChange(current, pageSize) {
    const { dispatch } = this.props;

    this.filter = [
      pageSize,
      current,
    ];

    dispatch(RoleAccessAction.fetch(...this.filter));
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

  handleDelete() {
    const { dispatch } = this.props;

    dispatch(RoleAccessAction.archive(this.state.selectedListIds));

    dispatch(RoleAccessAction.fetch(this.pageSize, this.state.current));
    
    this.setState({selectedRowKeys: []});

    super.handleDelete();

    this.Message.info(this.messageSuccess);
  }

  render() {
    return super.render();
  }
}
