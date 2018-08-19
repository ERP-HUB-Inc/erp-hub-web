import React from "react";
import CreateEmployee from "../../../components/employees/ManageEmployee/FormCreate";
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
    manageEmployeeAdd: state.reducer.managementEmployee.add,
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