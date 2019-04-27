import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import Detail from "../../../components/transactions/SaleHistory/Detail";

class DetailForm extends React.Component {
  render() {
    return <Detail {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    detail: state.reducer.transaction.detail,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const detail = Form.create(mapPropsToFields)(DetailForm);

export default connect(mapStateToProps)(detail);