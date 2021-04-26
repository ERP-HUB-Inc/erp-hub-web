import React from "react";
import Constant from "../../../constants/transactions/transaction";
import TransactionAction from "../../../action/transaction/transaction";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <div style={{ visibility: "hidden" }}><this.Translate id="text_receipt" /></div>;
    this.width = "850px";
    this.dispatch = this.props.dispatch;
    this.handleRePrint = this.handleRePrint.bind(this);
  }

  handleCancel() {
    this.dispatch(TransactionAction.reset(Constant.RESET_DETAIL_TRANSACTION));
  }

  handleRePrint() {
    const element = document.getElementById("pos-receipt-preview");
    if (element) {
      this.Util.printElem(element.innerHTML);
    }
  }

  renderCrudAction() {
    return(
      <div className="ant-modal-footer">
        <this.Button type="info" onClick={this.handleRePrint}>
          <span className="icon-print icon-padding-right text-uppercase"></span><this.Translate id="text_print"/>
        </this.Button>
      </div>
    );
  }
  
  render() {
    if (this.props.detail.showForm) {
      this.content = <div style={{maxHeight: window.innerHeight - 150, overflow: "auto"}}>
        {this.props.reprintReceiptContent}
        {this.props.receiptContent}
      </div>;
      return super.render();
    }

    return <div />;
  }
}