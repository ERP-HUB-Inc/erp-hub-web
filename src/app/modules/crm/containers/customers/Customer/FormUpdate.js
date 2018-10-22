import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/customers/Customer/FormUpdate";

class CustomerUpdate extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    customerUpdate: state.reducer.customer.update,
    customerDetail: state.reducer.customer.detail,
    groupCustomers: state.reducer.groupCustomers.request,
    groupCustomersAdd: state.reducer.groupCustomers.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const customerUpdate = Form.create(mapPropsToFields)(CustomerUpdate);

export default connect(mapStateToProps)(customerUpdate);