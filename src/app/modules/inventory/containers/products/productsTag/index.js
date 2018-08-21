import React from "react";
import { connect } from "react-redux";
import ManageEmployeeList from "../../../components/products/ProductsTag";

class EmployeeManagement extends React.Component {
  render() {
    return (
      <ManageEmployeeList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    productsTag: state.reducer.productsTag.request,
    productsTagAdd: state.reducer.productsTag.add,
    productsTagArchive: state.reducer.productsTag.archive,
    productsTagUpdate: state.reducer.productsTag.update
  };
}

export default connect(mapStateToProps)(EmployeeManagement);