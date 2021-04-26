import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import List from "../../../components/reports/Purchase";

class Payment extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    paymentReport: state.reducer.paymentReport.request,
    locale: state.locale,
    paymentReportAdd: state.reducer.paymentReport.add,
    paymentReportUpdate: state.reducer.paymentReport.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const payment =  Form.create(mapPropsToFields)(Payment);

export default connect(mapStateToProps)(payment);
