import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/employees/Employee/FormUpdate";

class EmployeeForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    update: state.reducer.employee.update,
    detail: state.reducer.employee.detail,
    roles: state.reducer.roleAccess.request,
    locations: state.reducer.location.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const employeeForm = Form.create(mapPropsToFields)(EmployeeForm);

export default connect(mapStateToProps)(employeeForm);