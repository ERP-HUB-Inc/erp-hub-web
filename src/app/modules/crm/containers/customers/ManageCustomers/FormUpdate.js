import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/customers/ManageCustomers/FormUpdate";

class ManagementEmployeeForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    manageCustomersUpdate: state.reducer.managementCustomers.update,
    initialValues: state.reducer.managementCustomers.update.data
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const managementEmployeeForm = Form.create(mapPropsToFields)(ManagementEmployeeForm);

export default connect(mapStateToProps)(managementEmployeeForm);