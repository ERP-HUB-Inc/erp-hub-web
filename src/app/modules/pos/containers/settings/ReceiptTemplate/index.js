import React from "react";
import { connect } from "react-redux";
import ReceiptTemplateList from "../../../components/settings/ReceiptTemplate";

class PaymentMethod extends React.Component {
  render() {
    return (
      <ReceiptTemplateList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    receipt: state.reducer.receiptTemplate.request,
    receiptAdd: state.reducer.receiptTemplate.add,
    receiptArchive: state.reducer.receiptTemplate.archive,
    receiptUpdate: state.reducer.receiptTemplate.update
  };
}

export default connect(mapStateToProps)(PaymentMethod);