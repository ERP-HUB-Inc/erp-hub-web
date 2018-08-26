import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/stock/stockTransfer/FormUpdate";

class Forms extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    stockTransferUpdate: state.reducer.stockTransfer.update,
    initialValues: state.reducer.stockTransfer.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const form = Form.create(mapPropsToFields)(Forms);

export default connect(mapStateToProps)(form);