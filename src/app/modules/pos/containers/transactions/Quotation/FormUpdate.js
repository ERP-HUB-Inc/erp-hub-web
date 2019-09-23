import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import RetailSaleForm,{mapStateToProps} from "../../../../pos/containers/transactions/SaleWalkin";
import FormUpdate from "../../../components/transactions/Quotation/FormUpdate";

class QuotationUpdateForm extends RetailSaleForm {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToPropsChild(state) {
  return {
    ...mapStateToProps(state),
    quotationUpdate: state.reducer.quotation.update,
    quotationDetail: state.reducer.quotation.detail,
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

const quotationUpdateForm = Form.create(mapPropsToFields)(QuotationUpdateForm);

export default connect(mapStateToPropsChild)(quotationUpdateForm);