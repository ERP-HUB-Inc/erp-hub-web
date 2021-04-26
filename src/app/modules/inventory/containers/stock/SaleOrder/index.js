import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import SaleOrderList from "../../../components/stock/SaleOrder";
import SaleHistory,{mapStateToProps} from "../../../../pos/containers/transactions/SaleHistory";

class SaleOrder extends SaleHistory {
  render() {
    return (
      <SaleOrderList {...this.props} />
    );
  }
}

function mapStateToPropsChild(state) {
  return {
    ...mapStateToProps(state)
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const saleOrder = Form.create(mapPropsToFields)(SaleOrder);

export default connect(mapStateToPropsChild)(saleOrder);