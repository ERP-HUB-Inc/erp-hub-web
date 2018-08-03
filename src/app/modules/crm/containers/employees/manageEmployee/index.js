import React from "react";
import { connect } from "react-redux";
import ManageEmployeeList from "../../../components/employees/ManageEmployee";

class EmployeeManagement extends React.Component {
  render() {
    return (
      <ManageEmployeeList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    manageEmployee: state.reducer.managementEmployee.request,
    manageEmployeeAdd: state.reducer.managementEmployee.add,
    manageEmployeeArchive: state.reducer.managementEmployee.archive,
    manageEmployeeUpdate: state.reducer.managementEmployee.update
  };
}

export default connect(mapStateToProps)(EmployeeManagement);