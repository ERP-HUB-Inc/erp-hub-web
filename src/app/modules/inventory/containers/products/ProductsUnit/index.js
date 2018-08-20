import React from "react";
import { connect } from "react-redux";
import ManageEmployeeList from "../../../components/products/ProductsUnit";

class EmployeeManagement extends React.Component {
  render() {
    return (
      <ManageEmployeeList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    productsUnit: state.reducer.productsUnit.request,
    productsUnitAdd: state.reducer.productsUnit.add,
    productsUnitArchive: state.reducer.productsUnit.archive,
    productsUnitUpdate: state.reducer.productsUnit.update
  };
}

export default connect(mapStateToProps)(EmployeeManagement);