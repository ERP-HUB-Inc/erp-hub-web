import React from "react";
import { connect } from "react-redux";
import ReportSaleByProduct from "../../../components/reports/Sale/ReportSaleByProduct";

function ReportSaleByProductContainer(props) {
    return <ReportSaleByProduct {...props} />;
}

function mapStateToProps(state) {
  return {
    locale: state.locale
  };
}

export default connect(mapStateToProps)(ReportSaleByProductContainer);
