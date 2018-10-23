import React from "react";
import { connect } from "react-redux";
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
  };
}

export default connect(mapStateToProps)(EmployeeManagement);