import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import ItemReportPage from "../../../components/reports/Item/index";

class ItemReport extends React.Component {
  render() {
    return (
      <ItemReportPage {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.productReport.request,
    supplier: state.reducer.supplier.request,
    locations: state.reducer.location.request,
    brands: state.reducer.brand.request,
    productsType: state.reducer.productsType.request,
    purchaseOrder: state.reducer.purchaseOrder.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const itemReportPage =  Form.create(mapPropsToFields)(ItemReport);

export default connect(mapStateToProps)(itemReportPage);
