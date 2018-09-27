import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import List from "../../../components/stock/returnPurchase";

class Supplier extends React.Component {
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
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const returnPurchase = Form.create(mapPropsToFields)(Supplier);

export default connect(mapStateToProps)(returnPurchase);