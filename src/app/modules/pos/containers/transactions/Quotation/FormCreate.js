import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import RetailSaleForm,{mapStateToProps} from "../../../../pos/containers/transactions/SaleWalkin";
import FormCreate from "../../../components/transactions/Quotation/FormCreate";

class QuotationForm extends RetailSaleForm {
  render() {
    return (
      <FormCreate {...this.props}  />
    );
  }
}

function mapStateToPropsChild(state) {
  return {
    ...mapStateToProps(state),
    quotationAdd: state.reducer.quotation.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const quotationForm = Form.create(mapPropsToFields)(QuotationForm);

export default connect(mapStateToPropsChild)(quotationForm);