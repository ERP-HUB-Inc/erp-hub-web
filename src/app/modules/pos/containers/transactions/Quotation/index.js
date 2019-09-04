import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import List from "../../../components/transactions/Quotation";

class Quotation extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.quotation.request,
    customer: state.reducer.customer.request,
    add: state.reducer.quotation.add,
    update: state.reducer.quotation.update,
    quotationDetail: state.reducer.quotation.detail,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const quotation = Form.create(mapPropsToFields)(Quotation);

export default connect(mapStateToProps)(quotation);