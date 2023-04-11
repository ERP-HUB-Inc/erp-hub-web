import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/products/Condition/FormUpdate";

class Container extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    conditionUpdate: state.reducer.condition.update,
    initialValues: state.reducer.condition.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const container = Form.create(mapPropsToFields)(Container);

export default connect(mapStateToProps)(container);