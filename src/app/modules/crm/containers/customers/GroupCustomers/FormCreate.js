import React from "react";
import Create from "../../../components/customers/GroupCustomers/FormCreate";
import { connect } from "react-redux";
import { Form } from "antd";

class GroupEmployeeForm extends React.Component {
  render() {
    return (
      <Create {...this.props} />
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

const groupCustomerForm =  Form.create(mapPropsToFields)(GroupEmployeeForm);

export default connect(mapStateToProps)(groupCustomerForm);