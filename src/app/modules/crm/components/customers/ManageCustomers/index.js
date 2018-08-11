import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/customers/ManageCustomers/FormCreate";
import FormUpdate from "../../../containers/customers/ManageCustomers/FormUpdate";
import Constant from "../../../constants/customers/managementCutomers";
import CutomerAction from "../../../actions/customers/manageCustomers";
import CutomerService from "../../../services/customers/manageCustomer";
import "./index.css";

export default class CustomerList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.ColumnExpend = new ColumnExpend(); 
    this.fetchingProp = "manageCustomers";
    this.addingProp = "manageCustomersAdd";
    this.updatingProp = "manageCustomersUpdate";
    this.service = CutomerService;
    this.action = CutomerAction;

    this.actionFetchColumnExpend = CutomerAction;

    this.RESET_CONSTANT = Constant.RESET_MANAGEMENT_CUTOMERS;
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

class ColumnExpend extends List {
  constructor(props) {
    super(props);
    return [
      {
        dataIndex: "firstName",
        key: "firstName",
        render: (text,row) => text + " " + row.lastName
      },
      {
        dataIndex: "email",
        key: "email",
      },
      {
        dataIndex: "phoneNumber",
        key: "phoneNumber"
      },
      {
        dataIndex: "description",
        key: "description",
      },
      {
        dataIndex: "address",
        key: "address"
      },
      {
        dataIndex: "desc",
        key: "desc",
      },
      {
        dataIndex: "status",
        key: "status",
      }
    ];
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      {
        title: <this.Translate id="col_management_customer_name" />,
        dataIndex: "firstName",
        sorter: true,
        render: (text,row) => text + " " + row.lastName
      },
      {
        title: <this.Translate id="col_management_customer_email" />,
        dataIndex: "email",
        key: "email",
        sorter: true
      },
      {
        title: <this.Translate id="col_management_customer_phoneno" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        sorter: true
      },
      {
        title: <this.Translate id="col_management_customer_description" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      {
        title: <this.Translate id="col_management_customer_group_address" />,
        dataIndex: "address",
        key: "address",
        sorter: true
      },
      {
        title: <this.Translate id="col_management_customer_group_cutomer" />,
        dataIndex: "desc",
        key: "desc",
        sorter: true
      },
      this.columnStatus
    ];
  }
}


