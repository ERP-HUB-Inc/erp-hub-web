import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/employees/Employee/FormCreate";
import FormUpdate from "../../../containers/employees/Employee/FormUpdate";
import Constant from "../../../constants/employees/employee";
import EmployeeAction from "../../../actions/employees/employee";
import EmployeeService from "../../../services/employees/EmployeeService";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "manageEmployee";
    this.addingProp = "manageEmployeeAdd";
    this.updatingProp = "manageEmployeeUpdate";
    this.service = EmployeeService;
    this.action = EmployeeAction;
    this.RESET_CONSTANT = Constant.RESET_EMPLOYEE;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(EmployeeAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(EmployeeAction.requestAndShowForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      {
        title: <this.Translate id="col_hr_employee_full_name" />,
        render: (text, record, index) => {
          return <span className="text-capitalize">{record.firstName} {record.lastName}</span>;
        },
        key: "firstName",
        sorter: true
      },
      {
        title: <this.Translate id="col_hr_employee_phone_no" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        sorter: true
      },
      {
        title: <this.Translate id="col_hr_employee_id_card" />,
        dataIndex: "idCard",
        key: "idCard"
      },
      {
        title: <this.Translate id="col_hr_employee_dob" />,
        dataIndex: "dob",
        key: "dob",
        render: value => this.Util.formDateDOB(value),
        sorter: true
      },
      {
        title: <this.Translate id="col_hr_employee_gender" />,
        dataIndex: "gender",
        key: "gender",
        sorter: true,
        render: (gender) => gender === this.Enum.GENDER.MALE ? "Male" : "Female"
      },
      {
        title: <this.Translate id="col_hr_employee_address" />,
        dataIndex: "address",
        key: "address",
        sorter: true
      },
      this.columnStatus
    ];
  }
}