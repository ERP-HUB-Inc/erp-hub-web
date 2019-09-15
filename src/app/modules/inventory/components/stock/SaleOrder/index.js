import React from "react";
import Enum from "../../../../pos/enums";
import TransactionAction from "../../../../pos/action/transaction/transaction";
import ReceivePaymentAction from "../../../../pos/action/transaction/receivePayment";
import ReceiePaymentForm from "../../../../pos/containers/transactions/SaleHistory/ReceivePayment";
import TransactionService from "../../../../pos/services/transactions/TransactionService";
import SaleHistory from "../../../../pos/components/transactions/SaleHistory";

export default class SaleOrder extends SaleHistory {
  constructor(props){
      super(props);
      this.state = {
        ...this.state,
        transectionId: ""
      }
      this.module = "stocks";
      this.action = TransactionAction;
      this.service = TransactionService;
      this.columns.splice(2,1);
      this.columns.splice(this.columns.length - 1,1);
  }

  componentDidMount(){
    this.requestSubDataAsync();
    let status = {status: [Enum.TRANSACTION_STEP.PROCESS]}
    this.props.dispatch(TransactionAction.fetch(this.pageSize,"","","",JSON.stringify(status),"",""));
  }

  handleShowFormEdit(rowData) {
    this.props.dispatch(TransactionAction.detail({id: rowData.id}));
    this.setState({
      loadingPopup: true,
      isRequestReceivePayment: true,
      transectionId: rowData.id
    });

  }
  
  componentWillUpdate(nextProps) {
    let status = {status: [Enum.TRANSACTION_STATUS.PROCESS]}
    if (nextProps.updateReceivePayment.updated) {
      this.props.dispatch(TransactionAction.fetch(this.pageSize,"","","",JSON.stringify(status),"",""));
      nextProps.dispatch(ReceivePaymentAction.reset());
    }
  } 
 
  componentDidUpdate() {
    if(this.state.isRequestReceivePayment && this.props.detail.fetched && this.props.detail.data){
      this.props.dispatch(ReceivePaymentAction.showForm());
      this.setState({
        modalConten: 
          <ReceiePaymentForm 
            id={this.state.transectionId} 
            customer={this.props.detail.data} 
            buttonReceivePaymentTitle={ <this.Translate id="text_complete" />} 
            status={Enum.TRANSACTION_STATUS.CREDIT}
          />,
        loadingPopup: false,
        isRequestReceivePayment: false
      });
    }

  }

  renderButtonDelete(){}
  renderButtonAddNew(){}
}
