import React from "react";
import { connect } from "react-redux";
import GroupCustomerList from "../../../components/customers/GroupCustomers";

class ManagementCutomer extends React.Component {
  render() {
    return (
      <GroupCustomerList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    customerGroup: state.reducer.groupCustomers.request,
    groupCustomersAdd: state.reducer.groupCustomers.add,
    groupCustomersUpdate: state.reducer.groupCustomers.update
  };
}

export default connect(mapStateToProps)(ManagementCutomer);