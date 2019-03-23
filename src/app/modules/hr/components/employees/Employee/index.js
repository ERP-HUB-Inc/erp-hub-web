import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/employees/Employee/FormCreate";
import FormUpdate from "../../../containers/employees/Employee/FormUpdate";
import Constant from "../../../constants/employees/employee";
import EmployeeAction from "../../../actions/employees/employee";
import EmployeeService from "../../../services/employees/EmployeeService";
import "./index.css";

export default class EmployeeList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.columnFilterWithKey = ["firstName","phoneNumber"];
    this.callBackOnShowEditForm = this.showFormEdit;
    this.service = EmployeeService;
    this.action = EmployeeAction;
    this.RESET_CONSTANT = Constant.RESET_EMPLOYEE;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.update.updated) {
      this.props.dispatch(EmployeeAction.reset(Constant.RESET_UPDATE_EMPLOYEE));
      this.props.dispatch(EmployeeAction.reset(Constant.RESET_DETAIL_EMPLOYEE));
    }
  }

  componentDidUpdate() {
    if (this.props.detail.fetched) {
      this.setState({
        loadingPopup: false
      });
      this.props.dispatch(EmployeeAction.reset(Constant.PARTIAL_RESET_DETAIL_EMPLOYEE));
    }
  }

  showFormEdit(rowData) {
    this.props.dispatch(EmployeeAction.requestAndShowForm(rowData));
    this.setState({
      loadingPopup: true,
      modalConten: <FormUpdate/>
    });
  }

}


class Column extends List {
  constructor(props) {
    super(props);
    return [
      {
        title: <this.Translate id="text_full_name" />,
        dataIndex: "firstName",
        render: (text, record, index) => {
          return <span className="text-capitalize">{record.firstName} {record.lastName}</span>;
        },
        key: "firstName",
        sorter: true
      },
      {
        title: <this.Translate id="text_phone_number" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        sorter: true
      },
      {
        title: <this.Translate id="text_id_card" />,
        dataIndex: "idCard",
        key: "idCard",
        sorter: true
      },
      {
        title: <this.Translate id="text_date_of_birth" />,
        dataIndex: "dob",
        key: "dob",
        render: value => this.Util.formDateDOB(value),
        sorter: true
      },
      {
        title: <this.Translate id="text_gender" />,
        dataIndex: "gender",
        key: "gender",
        sorter: true,
        render: (gender) => gender === this.Enum.GENDER.MALE ? "Male" : "Female"
      },
      {
        title: <this.Translate id="text_address" />,
        dataIndex: "address",
        key: "address",
        sorter: true
      },
      this.columnStatus
    ];
  }
}