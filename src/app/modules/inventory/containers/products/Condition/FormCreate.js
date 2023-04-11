import React from "react";
import FormCreateCondition from "../../../components/products/Condition/FormCreate";
import { connect } from "react-redux";
import { Form } from "antd";

class Container extends React.Component {
  render() {
    return (
      <FormCreateCondition {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    conditionAdd: state.reducer.condition.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const container =  Form.create(mapPropsToFields)(Container);

export default connect(mapStateToProps)(container);