import React from "react";
import Modal from "../../../../common/components/shares/Modal";
export default class TaxSetting extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      productTaxList: [],
      selectedAttributeIndex: 0,
      isNotYetHasDidMount: true
    };
    this.maskClosable = true;
    this.width = 320; //px
    this.wrapClassName = "wrap-order-discount";
    this.handleOnRemoveTaxFromSale = this.handleOnRemoveTaxFromSale.bind(this);
  }

  componentDidMount() {
    if (this.state.isNotYetHasDidMount) {
      this.setState({
        productTaxList: this.props.productOrderList,
        isNotYetHasDidMount: false,
        selectedDiscountType: this.props.discountType
      });
    }
  }

  handleOnRemoveTaxFromSale(taxRate) {
    const productTaxList = this.state.productTaxList.filter(value => value.rate !== taxRate);
    this.setState({productTaxList});
    if (this.props.callBack) {
      this.props.callBack(productTaxList, taxRate);
    }
  }
  
  updateDimensions() {
    const element = document.getElementById("wrap-payment");
    this.style = {top: element.offsetTop/2};
  }
  
  renderCrudAction() {
    
  }

  handleCancel() {
    this.props.handleCancel();
  }
  render() {
    const element = document.getElementById("wrap-payment");
    const leftElement = document.getElementById("left-block");
    const sideBarWidth = document.getElementById("sidebar").offsetWidth;
    const additionalTop = 30;
    const additionalSpace = 56;
    this.style = {top: (element.offsetTop/2) + additionalTop, left: (leftElement.offsetWidth + sideBarWidth + additionalSpace) - this.width};
    this.content = (
      <div className="order-discount">
        <div className="title">
          {<this.Translate id="text_remove_tax_from_sale"/>}
        </div>
        <div className="wrap-discount-value">
          <ul className="list-unstyled" style={{width: "100%"}}>
            {
              this.state.productTaxList.map((tax, index) => 
                <li key={index} style={styles.taxItem}>
                  <div className="item" style={{flex: "1"}}>{tax.name} ({tax.rate}%)</div>
                  <div className="item" style={{marginRight: 10}}>{this.formatCurrency(tax.totalTaxAmount)}</div>
                  <div className="item" onClick={() => this.handleOnRemoveTaxFromSale(tax.rate)}>
                    <div className="ca-icon-delete">
                      <span className="icon-delete"></span>
                    </div>
                  </div>
                </li>
              )
            }
          </ul>
        </div>
        <div className="arrow-right"></div>
      </div>
    );
    return super.render();
  }
}

TaxSetting.defaultProps = {
  discountValue: 0
};

const styles = {
  taxItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "11.25pt",
    color: "#093163"
  }
};