import React from "react";
import { connect } from "react-redux";
import ManageEmployeeList from "../../../components/products/Brand";

class EmployeeManagement extends React.Component {
  render() {
    return (
      <ManageEmployeeList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    brand: state.reducer.brand.request,
    brandAdd: state.reducer.brand.add,
    brandArchive: state.reducer.brand.archive,
    brandUpdate: state.reducer.brand.update
  };
}

export default connect(mapStateToProps)(EmployeeManagement);