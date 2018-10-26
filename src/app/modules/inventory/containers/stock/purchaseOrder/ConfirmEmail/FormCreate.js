import React from "react";
import Create from "../../../../components/stock/PurchaseOrder/ConfirmEmail/FormCreate";
import { connect } from "react-redux";
import { Form } from "antd";

class FormList extends React.Component {
  render() {
    return (
      <Create {...this.props} />
    );
  }
}
  
function mapStateToProps(state) {
  return {
    purchaseOrderPushToSupplier: state.reducer.purchaseOrder.pushToSupplier,
    locale: state.locale,
    supplierDetail: state.reducer.supplier.detail
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formList =  Form.create(mapPropsToFields)(FormList);

export default connect(mapStateToProps)(formList);