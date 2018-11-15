import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import ReceivePurhaseList from "../../../components/stock/ReceivePurchase";

class ReceivePurhase extends React.Component {
  render() {
    return (
      <ReceivePurhaseList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    receivePurchase: state.reducer.receivePurchase.request,
    receivePurchaseAdd: state.reducer.receivePurchase.add,
    receivePurchaseArchive: state.reducer.receivePurchase.archive,
    receivePurchaseUpdate: state.reducer.receivePurchase.update,
    supplier: state.reducer.supplier.request,
    storeLocation: state.reducer.storeLocation.request,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const receivePurchase = Form.create(mapPropsToFields)(ReceivePurhase);

export default connect(mapStateToProps)(receivePurchase);