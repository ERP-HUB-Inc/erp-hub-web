import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/stock/reorderPoint/FormUpdate";

class ReorderForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    reorderPointUpdate: state.reducer.reorderPoint.update,
    initialValues: state.reducer.reorderPoint.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const reorderPointForm = Form.create(mapPropsToFields)(ReorderForm);

export default connect(mapStateToProps)(reorderPointForm);