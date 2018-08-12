import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/employees/ManageEmployee/FormCreate";
import FormUpdate from "../../../containers/employees/ManageEmployee/FormUpdate";
import Constant from "../../../constants/employees/managementEmployee";
import ManageEmployeeAction from "../../../actions/employees/manageEmployee";
import ManageEmployeeService from "../../../services/employees/manageEmployee";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "manageEmployee";
    this.addingProp = "manageEmployeeAdd";
    this.updatingProp = "manageEmployeeUpdate";

    this.service = ManageEmployeeService;
    this.action = ManageEmployeeAction;

    this.RESET_CONSTANT = Constant.RESET_MANAGEMENT_EMPLOYEE;
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
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      {
        title: "Date",
        dataIndex:"createdAt",
        key: "createdAt", 
        sorter: true
      }, {
        title: "full Name",
        dataIndex: "firstName",
        dateIndex: "lastName",
        key: "firstName",
        sorter: true
      },
      {
        title: "Phone No",
        dataIndex: "phoneNumber",
        key: "phoneNumber"
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        sorter: true
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: true
      }
    ];
  }
}