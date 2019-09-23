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

  handleSubmitFilter(e) {
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let filter = {};
          let status = {status: [Enum.TRANSACTION_STEP.PROCESS]}
          filter["status"] = [status];

          if (values.locationId) {
            filter["locationId"] = [values.locationId];
          }

          if (values.userId) {
            filter["userId"] = [values.userId];
          }

          if (values.number) {
            filter["number"] = [values.number];
          }
          
          let rangFilter = "";
          if (values.createdAt && values.createdAt.length > 0) {
            rangFilter = JSON.stringify({
              column: "registerDate",
              value: [
                this.Util.formatDateForMYSQL(values.createdAt[0]) + " 00:00:00",
                this.Util.formatDateForMYSQL(values.createdAt[1]) + " 23:59:59"
              ]});
          }
          
          filter = JSON.stringify(filter);

          let searchKey = "";

          if (values.customer) {
            searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.customer});
          }


          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, rangFilter));
          this.setState({isClickFilter: true});
        }
      });
    }
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
    let status = {status: [Enum.TRANSACTION_STEP.PROCESS]}
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
            status={Enum.TRANSACTION_STEP.CREDIT} //step complete 
          />,
        loadingPopup: false,
        isRequestReceivePayment: false
      });
    }

  }

  renderButtonSearch(fetchingProps){
    return(
      <this.Col md="2" className="wrap-btn-search" style={{ marginTop: 27 }}>
        <this.Button htmlType="submit" type="info"  loading={this.state.isClickFilter && fetchingProps.fetching}>
          <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="text_search" />}
        </this.Button> 
      </this.Col>
    )
  }

  renderFilterType(){}
  renderButtonDelete(){}
  renderButtonAddNew(){}
  
}
