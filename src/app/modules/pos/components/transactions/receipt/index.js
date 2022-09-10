import React from "react";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { PageHeader, Form } from "antd";
import TransactionService from "../../../services/transactions/TransactionService";
import ReceiptTemplateAction from "../../../../pos/action/settings/receiptTemplate";
import history from "../../../../common/router/history";
import ReceiptTemplate from "./template";

class InvoiceReceipt extends React.Component {
  state = {
    formData: {},
    loading: false
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({loading: true});
    TransactionService.detail(id)
    .then(response => {
      this.setState({formData: response.data.data});
    })
    .finally(() => false);

    this.requestSubDataAsync();
  }

  requestSubDataAsync() {
    return new Promise(() => {
      setTimeout(() => {
        //this.props.dispatch(LocationAction.fetch(100));
        this.props.dispatch(ReceiptTemplateAction.default());
      }, 2000);
    });
  }

  render() {
    const {formData} = this.state;
    formData.receiptTemplate = 2;
    return <React.Fragment>
      <PageHeader 
        style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0,
          position: "relative"
        }}
        onBack={() => history.goBack()}
        title={<Translate id="text_invoice" />}
        subTitle={formData.receiptNumber}
      />
      <div style={{width: "250mm", margin: "auto", minHeight: "297mm"}}>
        <ReceiptTemplate 
          formData={formData} 
          receiptTemplate={this.props.receiptTemplate.data}
          locale={this.props.locale} />
      </div>
    </React.Fragment>;
  }
}

function mapStateToProps(state) {
  return {
    locale: state.locale,
    receiptTemplate: state.reducer.receiptTemplate.detail,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const invoiceReceipt =  Form.create(mapPropsToFields)(InvoiceReceipt);
  
export default connect(mapStateToProps)(invoiceReceipt);