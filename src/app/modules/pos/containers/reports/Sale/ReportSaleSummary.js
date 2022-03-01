import React from "react";
import { connect } from "react-redux";
import ReportSaleSummary from "../../../components/reports/Sale/ReportSaleSummary";

function ReportSaleSummaryContainer(props) {
    return <ReportSaleSummary {...props} />;
}

function mapStateToProps(state) {
  return {
    locale: state.locale
  };
}

export default connect(mapStateToProps)(ReportSaleSummaryContainer);
