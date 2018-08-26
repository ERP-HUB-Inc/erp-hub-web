import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import SupplierList from "../../../components/stock/receivePurchase";

class Supplier extends React.Component {
  render() {
    return (
      <SupplierList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    receivePurchase: state.reducer.receivePurchase.request,
    receivePurchaseAdd: state.reducer.receivePurchase.add,
    receivePurchaseArchive: state.reducer.receivePurchase.archive,
    receivePurchaseUpdate: state.reducer.receivePurchase.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const receivePurchase = Form.create(mapPropsToFields)(Supplier);

export default connect(mapStateToProps)(receivePurchase);