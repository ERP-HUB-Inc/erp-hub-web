import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/customers/GroupCustomers/FormUpdate";

class GroupCustomerUpdate extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    groupCustomersUpdate: state.reducer.groupCustomers.update,
    initialValues: state.reducer.groupCustomers.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const groupCustomerUpdate = Form.create(mapPropsToFields)(GroupCustomerUpdate);

export default connect(mapStateToProps)(groupCustomerUpdate);