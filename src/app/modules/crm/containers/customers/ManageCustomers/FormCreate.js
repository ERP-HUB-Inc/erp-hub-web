import React from "react";
import CreateEmployee from "../../../components/customers/ManageCustomers/FormCreate";
import { connect } from "react-redux";
import { Form } from "antd";


class ManagementEmployeeForm extends React.Component {
  render() {
    return (
      <CreateEmployee {...this.props} />
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

const managementEmployeeForm =  Form.create(mapPropsToFields)(ManagementEmployeeForm);

export default connect(mapStateToProps)(managementEmployeeForm);