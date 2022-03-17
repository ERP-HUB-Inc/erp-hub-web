import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/employees/Employee/FormCreate";
import Constant from "../../../constants/employees/employee";
import EmployeeAction from "../../../actions/employees/employee";
import EmployeeService from "../../../services/employees/EmployeeService";
import "./index.css";
import history from "../../../../common/router/history";

export default class EmployeeList extends List {
  constructor(props) {
    super(props);
    this.columns = [
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
        title: <this.Translate id="text_user_account" />,
        dataIndex: "account",
        key: "account",
        render: account => account ? account.userName : this.emptyText
      },
      {
        title: <this.Translate id="text_phone_number" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        sorter: true,
        render: phoneNumber => phoneNumber ? phoneNumber : this.emptyText
      },
      {
        title: <this.Translate id="text_id_card" />,
        dataIndex: "idCard",
        key: "idCard",
        sorter: true,
        render: idCard => idCard ? idCard : this.emptyText
      },
      {
        title: <this.Translate id="text_date_of_birth" />,
        dataIndex: "dob",
        key: "dob",
        render: dob => dob ? this.Util.formDateDOB(dob) : this.emptyText,
        sorter: true
      },
      {
        title: <this.Translate id="text_gender" />,
        dataIndex: "gender",
        key: "gender",
        sorter: true,
        render: gender => gender === this.Enum.GENDER.MALE ? <this.Translate id="text_male" /> : <this.Translate id="text_female" />
      },
      {
        title: <this.Translate id="text_address" />,
        dataIndex: "address",
        key: "address",
        sorter: true,
        render: address => address ? address : this.emptyText
      },
      this.columnStatus
    ];

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

  renderButtonAddNew() {
    return (
      <this.Link to="/employees/create" className="ant-btn info" style={{marginRight: 15}}>
        <span className="icon-add icon-padding-right"></span>
        <this.Translate id="text_add_new" />
      </this.Link>
    );
  }

  showFormEdit(rowData) {
    history.push(`/employees/update/${rowData.id}`);
  }
}
