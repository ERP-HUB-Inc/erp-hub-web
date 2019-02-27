import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormCreate from "../../../components/stock/StockAdjustmentApprove/FormCreate";

class FormList extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}
  
function mapStateToProps(state) {
  return {
    stockAdjustmentApproveAdd: state.reducer.stockAdjustmentApprove.add,
    accessLocation: state.reducer.location.requestAccessLocation,
    storeLocation: state.reducer.location.request,
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formList =  Form.create(mapPropsToFields)(FormList);

export default connect(mapStateToProps)(formList);