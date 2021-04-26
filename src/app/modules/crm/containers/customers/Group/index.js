import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import GroupCustomerList from "../../../components/customers/Group";

class GroupCustomer extends React.Component {
  render() {
    return (
      <GroupCustomerList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.groupCustomers.request,
    add: state.reducer.groupCustomers.add,
    update: state.reducer.groupCustomers.update,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const groupCustomer = Form.create(mapPropsToFields)(GroupCustomer);

export default connect(mapStateToProps)(groupCustomer);