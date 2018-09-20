import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import List from "../../../components/reports/ProfitAndLost";

class ProfitAndLost extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    profitAndLostReport: state.reducer.profitAndLostReport.request,
    locale: state.locale,
    profitAndLostReportAdd: state.reducer.profitAndLostReport.add,
    profitAndLostReportUpdate: state.reducer.profitAndLostReport.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const profitAndLost =  Form.create(mapPropsToFields)(ProfitAndLost);

export default connect(mapStateToProps)(profitAndLost);
