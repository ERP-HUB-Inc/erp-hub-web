import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import ManageCustomersList from "../../../components/customers/customer";

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

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const managementCutomer = Form.create(mapPropsToFields)(ManagementCutomer);

export default connect(mapStateToProps)(managementCutomer);