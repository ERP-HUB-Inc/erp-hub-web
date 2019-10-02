import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import RetailSaleForm,{mapStateToProps} from "../../../../pos/containers/transactions/SaleWalkin";
import FormReturn from "../../../components/transactions/SaleHistory/Return";

class ReturnForm extends RetailSaleForm {
  render() {
    return (
      <FormReturn {...this.props} />
    );
  }
}

function mapStateToPropsChild(state) {
  return {
    ...mapStateToProps(state),
    // quotationUpdate: state.reducer.quotation.update,
    transactionDetail: state.reducer.transaction.detail,
    customer: state.reducer.customer.add,
    initialValues: state.reducer.quotation.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const returnForm = Form.create(mapPropsToFields)(ReturnForm);

export default connect(mapStateToPropsChild)(returnForm);