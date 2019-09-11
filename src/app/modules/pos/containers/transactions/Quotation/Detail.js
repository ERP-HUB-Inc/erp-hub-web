import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import Detail from "../../../../pos/components/transactions/Quotation/Detail";

class DetailForm extends React.Component {
  render() {
    return <Detail {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    detail: state.reducer.quotation.detail,
    receiptTemplate: state.reducer.receiptTemplate.detail,
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