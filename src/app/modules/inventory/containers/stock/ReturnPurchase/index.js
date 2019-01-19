import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import List from "../../../components/stock/ReturnPurchase";

class ReturnPurchase extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    returnPurchase: state.reducer.returnPurchase.request,
    returnPurchaseAdd: state.reducer.returnPurchase.add,
    returnPurchaseArchive: state.reducer.returnPurchase.archive,
    returnPurchaseUpdate: state.reducer.returnPurchase.update,
    storeLocation: state.reducer.location.request,
    supplier: state.reducer.supplier.request,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const returnPurchase = Form.create(mapPropsToFields)(ReturnPurchase);

export default connect(mapStateToProps)(returnPurchase);