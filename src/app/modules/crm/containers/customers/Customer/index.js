import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import ManageCustomersList from "../../../components/customers/Customer";

class ManagementCutomer extends React.Component {
  render() {
    return (
      <ManageCustomersList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    manageCustomers: state.reducer.customer.request,
    manageCustomersAdd: state.reducer.customer.add,
    manageCustomersArchive: state.reducer.customer.archive,
    manageCustomersUpdate: state.reducer.customer.update,
    manageFetchCustomer: state.reducer.customer.fetchExpendRender,

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