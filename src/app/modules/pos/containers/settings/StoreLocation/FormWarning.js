import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormWarning from "../../../components/settings/StoreLocation/FormWarning";

class WarningForm extends React.Component {
  render() {
    return (
      <FormWarning {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    storeLocationAdd: state.reducer.location.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const warningForm = Form.create(mapPropsToFields)(WarningForm);

export default connect(mapStateToProps)(warningForm);