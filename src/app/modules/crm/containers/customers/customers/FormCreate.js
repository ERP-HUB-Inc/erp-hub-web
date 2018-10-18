import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormCreate from "../../../components/customers/customer/FormCreate";


class CustomerCreate extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    manageCustomersAdd: state.reducer.managementCustomers.add,
    groupCustomersAdd: state.reducer.groupCustomers.add,
    groupCustomers: state.reducer.groupCustomers.request,
    locale: state.locale
  };
}


function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const customerCreate =  Form.create(mapPropsToFields)(CustomerCreate);

export default connect(mapStateToProps)(customerCreate);