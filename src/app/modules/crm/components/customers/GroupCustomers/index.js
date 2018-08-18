import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/customers/GroupCustomers/FormCreate";
import FormUpdate from "../../../containers/customers/GroupCustomers/FormUpdate";
import Constant from "../../../constants/customers/groupCustomer";
import CutomerAction from "../../../actions/customers/groupCustomer";
import CutomerService from "../../../services/groupCustomers/groupCustomers";
import "./index.css";

export default class CustomerList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.title = "Group Customer";
    this.fetchingProp = "customerGroup";
    this.addingProp = "groupCustomersAdd";
    this.updatingProp = "groupCustomersUpdate";
    this.service = CutomerService;
    this.action = CutomerAction;
    this.RESET_CONSTANT = Constant.RESET_MANAGEMENT_GROUP_CUSTOMERS;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(CutomerAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(CutomerAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  render() {
    return super.render();
  }

}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      {
        title:"Name",
        dataIndex: "name",
        key: "name"
      },
      this.columnStatus
    ];
  }
}


