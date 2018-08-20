import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/employees/ManageEmployee/FormUpdate";

class ManagementEmployeeForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    manageEmployeeUpdate: state.reducer.managementEmployee.update,
    initialValues: state.reducer.managementEmployee.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const managementEmployeeForm = Form.create(mapPropsToFields)(ManagementEmployeeForm);

export default connect(mapStateToProps)(managementEmployeeForm);