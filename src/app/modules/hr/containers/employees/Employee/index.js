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
    manageEmployee: state.reducer.employee.request,
    manageEmployeeAdd: state.reducer.employee.add,
    manageEmployeeArchive: state.reducer.employee.archive,
    manageEmployeeUpdate: state.reducer.employee.update
  };
}

export default connect(mapStateToProps)(EmployeeManagement);