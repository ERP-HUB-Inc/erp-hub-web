import React from "react";
import FormCreate from "../../../components/customers/GroupCustomers/FormCreate";
import {connect} from "react-redux";
import {Form} from "antd";

class GroupCustomerCreate extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    groupCustomersAdd: state.reducer.groupCustomers.add,
    locale: state.locale
  };          
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const groupCustomerCreate =  Form.create(mapPropsToFields)(GroupCustomerCreate);

export default connect(mapStateToProps)(groupCustomerCreate);