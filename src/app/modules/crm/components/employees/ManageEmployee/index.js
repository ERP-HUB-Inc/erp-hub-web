import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/employees/manageEmployee/FormCreate";
import FormUpdate from "../../../containers/employees/manageEmployee/FormUpdate";
import Constant from "../../../constants/employees/managementEmployee";
import ManageEmployeeAction from "../../../actions/employees/manageEmployee";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.fetchingProp = "manageEmployee";
    this.addingProp = "manageEmployeeAdd";
    this.updatingProp = "manageEmployeeUpdate";
    this.RESET_CONSTANT = Constant.RESET_MANAGEMENT_EMPLOYEE;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    
    dispatch(ManageEmployeeAction.fetch(this.pageSize));
  }

  onChange(pagination, filters, sorter) {
    const { dispatch } = this.props;

    super.onChange(pagination, filters, sorter);
    
    dispatch(ManageEmployeeAction.fetch(...this.filter));
  }

  onChangePagination(current, pageSize) {
    const { dispatch } = this.props;

    this.filter = [
      pageSize,
      (current - 1) * pageSize,
    ];

    dispatch(ManageEmployeeAction.fetch(...this.filter));

    this.setState({ current});
  }

  onShowSizeChange(current, pageSize) {
    const { dispatch } = this.props;

    this.filter = [
      pageSize,
      current,
    ];

    dispatch(ManageEmployeeAction.fetch(...this.filter));
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(ManageEmployeeAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(ManageEmployeeAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  handleDelete() {
    const { dispatch } = this.props;

    dispatch(ManageEmployeeAction.archive(this.state.selectedListIds));

    dispatch(ManageEmployeeAction.fetch(this.pageSize, this.state.current));
    
    this.setState({selectedRowKeys: []});

    super.handleDelete();

    this.Message.info(this.messageSuccess);
  }

  render() {
    return super.render();
  }
}
