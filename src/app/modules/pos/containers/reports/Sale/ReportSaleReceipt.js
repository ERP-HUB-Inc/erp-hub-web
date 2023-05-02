import React from "react";
import { connect } from "react-redux";
import ReportSaleReceipt from "../../../components/reports/Sale/ReportSaleReceipt";

function ReportSaleReceiptContainer(props) {
  return <ReportSaleReceipt {...props} />;
}

function mapStateToProps(state) {
  return {
    locale: state.locale
  };
}

export default connect(mapStateToProps)(ReportSaleReceiptContainer);
