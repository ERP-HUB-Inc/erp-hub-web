import React from "react";
import Create from "../../../components/stock/stockTransfer/FormCreate";
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
    stockTransferAdd: state.reducer.stockTransfer.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formList =  Form.create(mapPropsToFields)(FormList);

export default connect(mapStateToProps)(formList);