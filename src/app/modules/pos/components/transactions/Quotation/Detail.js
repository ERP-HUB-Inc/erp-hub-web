import React from "react";
import Constant from "../../../constants/transactions/quotation";
import QuotationAction from "../../../action/transaction/quotation";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_quotation"/>;
    this.width = "900px";
    this.dispatch = this.props.dispatch;
    this.handleRePrint = this.handleRePrint.bind(this);
  }

  handleCancel() {
    this.dispatch(QuotationAction.reset(Constant.RESET_DETAIL_QUOTATION));
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
        {this.props.receiptContent}
      </div>;
      return super.render();
    }

    return <div />;
  }
}