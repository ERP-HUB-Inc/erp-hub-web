import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
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

function maPropsToFields(props) {
  return {
    form: props.form
  };
}

const managementCutomer = Form.create(maPropsToFields)(ManagementCutomer);

export default connect(mapStateToProps)(managementCutomer);