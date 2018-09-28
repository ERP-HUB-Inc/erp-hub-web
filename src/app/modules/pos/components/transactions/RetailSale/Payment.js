import React from "react";
import Modal from "../../../../common/components/shares/Modal";
import "./Payment.css";

export default class Payment extends Modal {
  constructor(props) {
    super(props);
    this.wrapClassName = "pos-payment";
    this.width = "70%";
  }
  renderCrudAction() {
  }

  handleCancel() {
    this.props.handleCancel();
  }

  render() {
    this.content = (
      <this.Row>
        <this.Col md="5" className="sale-summary">
          <div className="title text-uppercase">Sale Summary</div>
          <ul className="list-unstyled list-order-summary">
            {
              this.props.productOrderList.map((productOrder, productOrderIndex) => 
                <li key={productOrderIndex}>
                  <div className="title">{productOrder.name}</div>
                  <div className="quantity">{productOrder.quantity}x</div>
                  <div className="price">{this.Util.formatCurrency(productOrder.price)}</div>
                </li>   
              )
            }
          </ul>
          <ul className="list-unstyled total-order-summary">
            <li>
              <div className="sub-total-title">
                Sub-total
              </div>
              <div className="sub-total-value">
                {this.Util.formatCurrency(1.75)}
              </div>
            </li>
            <li>
              <div className="sub-total-title">
                Tax
              </div>
              <div className="sub-total-value">
                {this.Util.formatCurrency(0)}
              </div>
            </li>
          </ul>
          <ul className="list-unstyled grand-total">
            <li>
              <div className="text-uppercase grand-total-title">
                Total
              </div>
              <div className=" grand-total-value">
                {this.Util.formatCurrency(139.8)}
              </div>
            </li>
          </ul>
        </this.Col>
        <this.Col md="7" className="wrap-payment-tool">
          <div  className="payment-tool">
            <div className="amount-to-pay">
              <div className="title">Pay</div>
              <this.InputText
                name="amountToPay"
                className="ca-input-v1 text-right"
                isAutoFocus={true}
                data={this.Util.formatCurrency(139.8, "")}
                form={this.props.form}/>
            </div>
            <div className="action-button-to-pay">
              <this.Button type="info" className="mg-right">
                <this.Translate id="text_cash" />
              </this.Button>
              <this.Button type="info" onClick={this.handleOnMakePayment}>
                <this.Translate id="text_credit_card" />
              </this.Button>
            </div>
          </div>
        </this.Col>
      </this.Row>
    );
    return super.render();
  }
}

Payment.defaultProps = {
  productOrderList: []
};