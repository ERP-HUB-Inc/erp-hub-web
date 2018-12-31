import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import ManageEmployeeList from "../../../components/employees/Employee";

class EmployeeManagement extends React.Component {
  render() {
    return (
      <ManageEmployeeList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.employee.request,
    add: state.reducer.employee.add,
    update: state.reducer.employee.update,
    detail: state.reducer.employee.detail,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const employeeManagement =  Form.create(mapPropsToFields)(EmployeeManagement);

export default connect(mapStateToProps)(employeeManagement);