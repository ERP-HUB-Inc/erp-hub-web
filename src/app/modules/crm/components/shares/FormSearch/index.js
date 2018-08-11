import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormSearch from "./form";

class FormSearchs extends React.Component {
  render() {
    return (
      <FormSearch {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formSearchs =  Form.create(mapPropsToFields)(FormSearchs);

export default connect(mapStateToProps)(formSearchs);