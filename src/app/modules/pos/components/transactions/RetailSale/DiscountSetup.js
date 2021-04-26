import React from "react";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";
export default class DiscountSetup extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributeIndex: 0,
      selectedDiscountType: Enum.DISCOUNT_TYPE.PERCENTAGE,
      isNotYetHasDidMount: true
    };
    this.maskClosable = true;
    this.width = 320; //px
    this.wrapClassName = "wrap-order-discount";
    this.handleOnSelectDiscount = this.handleOnSelectDiscount.bind(this);
  }

  componentDidMount() {
    if (this.state.isNotYetHasDidMount) {
      this.setState({
        isNotYetHasDidMount: false,
        selectedDiscountType: this.props.discountType
      });
    }
  }

  handleSubmit (e) {
    e.preventDefault();
    const discountValue = {
      value: this.props.form.getFieldValue("discountValue"),
      type: this.state.selectedDiscountType
    };

    if (this.props.callBack) {
      this.props.callBack(discountValue);
    }

    this.props.handleCancel();
  }
  
  updateDimensions() {
    const element = document.getElementById("wrap-payment");
    this.style = {top: element.offsetTop/2};
  }
  
  renderCrudAction() {
    return(
      <div className="ant-modal-footer">
        <this.Button type="danger" onClick={() => this.handleCancel()}>
          <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_cancel" />
        </this.Button>  
        <this.Button htmlType="submit" type="info">
          <span className="icon-add icon-padding-right"></span><this.Translate id="text_add" />
        </this.Button>
        {this.renderOtherAction()}
      </div>
    );
  }

  handleOnSelectDiscount(value) {
    this.setState({
      selectedDiscountType: value
    });

    if (this.props.handleOnSelectDiscount) {
      this.props.handleOnSelectDiscount(value);
    }
    document.getElementById("discountValue").focus();
  }

  handleCancel() {
    this.props.handleCancel();
  }
  render() {
    // const element = document.getElementById("wrap-payment");
    // const leftElement = document.getElementById("left-block");
    // const sideBarWidth = document.getElementById("sidebar").offsetWidth;
    // const additionalTop = 0;
    // const additionalSpace = 56;
    // this.style = {top: (element.offsetTop/2) + additionalTop, left: (leftElement.offsetWidth + sideBarWidth + additionalSpace) - this.width};

    const isPercentageDiscount = this.state.selectedDiscountType === Enum.DISCOUNT_TYPE.PERCENTAGE;

    this.content = (
      <div className="order-discount">
        <div className="title">
          {<this.Translate id="text_add"/>} {<this.Translate id="text_discount"/>}
        </div>
        <div className="wrap-discount-value">
          <div className="discount-type">
            <div className={`item ${isPercentageDiscount ? "selected" : ""}`} onClick={() => this.handleOnSelectDiscount(Enum.DISCOUNT_TYPE.PERCENTAGE)}>
              %
            </div>
            <div className={`item ${!isPercentageDiscount ? "selected" : ""}`} onClick={() => this.handleOnSelectDiscount(Enum.DISCOUNT_TYPE.AMOUNT)}>
              $
            </div>
          </div>
          <div className="discount-value">
            {
              isPercentageDiscount ? 
                <div className="percentage-placeholder">%</div>
                :
                <div className="amount-placeholder">$</div>
            }
            <this.InputNumber
              isAutoFocus={true}
              isAutoSelect={true}
              isHideTool={true}
              precision={0}
              name="discountValue"
              data={this.props.discountValue}
              className={`ca-input-v1 ${isPercentageDiscount ? "percentage-value-type" : "amount-value-type"}`}
              form={this.props.form}/>
          </div>
        </div>
        <div className="text-about-discount">
          <this.Translate id="text_about_discount" />
        </div>
        <div className="arrow-right"></div>
      </div>
    );
    return super.render();
  }
}

DiscountSetup.defaultProps = {
  discountValue: 0
};