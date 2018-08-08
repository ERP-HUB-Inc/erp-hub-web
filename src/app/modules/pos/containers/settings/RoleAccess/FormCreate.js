import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormCreate from "../../../components/settings/RoleAccess/FormCreate";

class RoleAccessForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    roleAccessAdd: state.reducer.roleAccess.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const roleAccessForm =  Form.create(mapPropsToFields)(RoleAccessForm);

export default connect(mapStateToProps)(roleAccessForm);