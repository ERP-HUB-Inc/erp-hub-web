import React from "react";
import { connect } from "react-redux";
import ManageCustomersList from "../../../components/customers/ManageCustomers";

class ManagementCutomer extends React.Component {
  render() {
    return (
      <ManageCustomersList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    manageCustomers: state.reducer.managementCustomers.request,
    manageCustomersAdd: state.reducer.managementCustomers.add,
    manageCustomersArchive: state.reducer.managementCustomers.archive,
    manageCustomersUpdate: state.reducer.managementCustomers.update,
    manageFetchCustomer: state.reducer.managementCustomers.fetchExpendRender,

    customerGroup: state.reducer.groupCustomers.request,
    groupCustomersAdd: state.reducer.groupCustomers.add,
    groupCustomersUpdate: state.reducer.groupCustomers.update
  };
}

export default connect(mapStateToProps)(ManagementCutomer);