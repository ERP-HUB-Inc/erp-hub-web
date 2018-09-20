import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import DiagramForm from "../../components/diagram";

class Diagram extends React.Component {
  render() {
    return (
      <DiagramForm {...this.props} />
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

const storeAccount =  Form.create(mapPropsToFields)(Diagram);

export default connect(mapStateToProps)(storeAccount);
