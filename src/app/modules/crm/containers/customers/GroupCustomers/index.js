import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import GroupCustomerList from "../../../components/customers/GroupCustomers";

class GroupCustomer extends React.Component {
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

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const groupCustomer = Form.create(mapPropsToFields)(GroupCustomer);

export default connect(mapStateToProps)(groupCustomer);