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
    list: state.reducer.customer.request,
    add: state.reducer.customer.add,
    update: state.reducer.customer.update,

    customerGroup: state.reducer.groupCustomers.request,
    groupCustomersAdd: state.reducer.groupCustomers.add,
    groupCustomersUpdate: state.reducer.groupCustomers.update,
    
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const managementCutomer = Form.create(mapPropsToFields)(ManagementCutomer);

export default connect(mapStateToProps)(managementCutomer);