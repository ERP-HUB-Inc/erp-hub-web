import React from "react";
import { Modal, Form, Button, Input, InputNumber } from "antd";
import { Translate } from "@redux/index";
import styled from "styled-components";
import SalesUtil from "../../../utils";
import Enum from "../../../enums";
import { formatCurrency } from "@helper/sales";

const PreviewBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  color: #607d8b;
`;

const DiscountAmount = styled.span`
  color: #e53935;
  font-weight: 700;
`;

const NewTotalAmount = styled.span`
  color: #00897b;
  font-weight: 800;
  font-size: 16px;
`;

const DividerPreviewBar = styled(PreviewBar)`
  margin-top: 8px;
  padding-top: 8px;
`;

// Container for preset buttons
const PresetsContainer = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 15px;
`;

// Individual preset button
const PresetButton = styled.button`
  flex: 1;
  min-width: calc(33% - 4px);
  padding: 8px 0;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #1a2332;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #e0f2ff;
    border-color: #90caf9;
  }

  &.active {
    background: #2196f3;
    color: #fff;
    border-color: #1976d2;
  }
`;

export class DiscountSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      presets: [5, 10, 15, 20, 25, 50],
      selectedPreset: null,
      selectedAttributeIndex: 0,
      isNotYetHasDidMount: true,
      visible: false,
      discountType: Enum.DISCOUNT_TYPE.PERCENTAGE,
      discountValue: 0,
      discountAmount: 0,
    };
  }

  open = () => {
    this.setState({ visible: true });
  };

  close = () => {
    this.setState({ visible: false });
  };

  /**
   * Props:
   * - presets: array of numbers (default [5, 10, 15, 20, 25, 50])
   * - selected: currently selected value
   * - currency: "KHR" | "USD" | "PERCENT"
   * - khrMultiplier: for converting preset to KHR amount (e.g., 1000, 5000)
   * - onSelect: callback(value)
   */
  formatLabel = (value, discountType) => {
    switch (discountType) {
      case "PERCENTAGE":
        return `${value}%`;
      case "KHR":
        return `${(value * 1000).toLocaleString()}៛`;
      case "USD":
        return `$${value}`;
      default:
        return value;
    }
  };

  handleApplyDiscount = () => {
    if (this.props.callBack) {
      this.props.callBack({
        type: this.state.discountType,
        value: this.state.discountValue,
      });
      this.close();
    }
  };

  handleOnSelectDiscount = (value) => {
    this.setState({
      discountType: value,
      discountValue: 0,
      discountAmount: 0,
      selectedPreset: null,
    });

    if (this.props.handleOnSelectDiscount) {
      this.props.handleOnSelectDiscount(value);
    }
  };

  handleOnChangeDiscountValue = (discountValue) => {
    // Destructure subtotal from the summaryTotal prop
    const { subTotal } = this.props.summaryTotal;

    // Initialize the calculated discount amount
    let discountAmount = 0;

    // Check if the discount type is percentage
    if (this.state.discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
      // Ensure the percentage discount does not exceed 100%
      if (discountValue > 100) discountValue = 100;

      // Calculate discount amount as a percentage of the subtotal
      discountAmount = (subTotal * discountValue) / 100;
    } else if (this.state.discountType === Enum.DISCOUNT_TYPE.AMOUNT) {
      // For fixed discounts (KHR or USD)
      // Ensure the discount value does not exceed the subtotal
      // Discount amount is the fixed value entered by the user
      discountAmount = discountValue > subTotal ? subTotal : discountValue;
    } else if (this.state.discountType === Enum.DISCOUNT_TYPE.AMOUNT_KHR) {
      const subtotalInKHR = subTotal * this.props.exchangeRate.sellRate; // Convert subtotal to KHR for comparison
      // For fixed discounts in KHR
      // Ensure the discount value does not exceed the subtotal
      // Discount amount is the fixed value entered by the user
      discountAmount = (discountValue > subtotalInKHR ? subtotalInKHR : discountValue) / this.props.exchangeRate.sellRate; // Convert discount back to USD for calculation
    }

    // Update component state with the current discount value and the calculated discount amount
    this.setState({
      discountValue,
      discountAmount,
    });
  };

  handleOnSelectPreset = (presetValue) => {
    this.setState({
      selectedPreset: presetValue,
    });

    presetValue = this.state.discountType === Enum.DISCOUNT_TYPE.AMOUNT_KHR ? presetValue * 1000 : presetValue;
    this.handleOnChangeDiscountValue(presetValue);
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      discountType: Enum.DISCOUNT_TYPE.PERCENTAGE,
      discountValue: 0,
      discountAmount: 0,
      selectedPreset: null,
    });
  };

  getDiscountSymbol = (discountType) => {
    switch (discountType) {
      case Enum.DISCOUNT_TYPE.PERCENTAGE:
        return "%";

      case Enum.DISCOUNT_TYPE.AMOUNT_KHR:
        return "៛";

      case Enum.DISCOUNT_TYPE.AMOUNT:
        return "$";

      default:
        return "";
    }
  };

  render() {
    const { discountType, discountAmount } = this.state;
    const { subTotal } = this.props.summaryTotal;
    const { sellRate } = this.props.exchangeRate;
    return (
      <Modal width={400} height={this.height} keyboard={true} wrapClassName="vertical-center-modal wrap-order-discount" visible={this.state.visible} footer={null}>
        <Form autoComplete="off" onSubmit={this.handleSubmit}>
          <div className="order-discount">
            <div className="flex items-center" style={{ marginBottom: 15 }}>
              <div className="title">&#127991; {<Translate id="text_add_discount" />}</div>
              <Button
                shape="circle"
                icon="close"
                style={{
                  border: "1px solid #e0e0e0",
                  color: "#999",
                  fontSize: 14,
                  position: "absolute",
                  right: 10,
                  borderRadius: "50%",
                }}
                onClick={this.handleCancel}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button type={discountType === Enum.DISCOUNT_TYPE.PERCENTAGE ? "primary" : "default"} size="large" style={{ borderRadius: 8, flex: 1 }} onClick={() => this.handleOnSelectDiscount(Enum.DISCOUNT_TYPE.PERCENTAGE)}>
                % Percent
              </Button>

              <Button type={discountType === Enum.DISCOUNT_TYPE.AMOUNT_KHR ? "primary" : "default"} size="large" style={{ borderRadius: 8, flex: 1 }} onClick={() => this.handleOnSelectDiscount(Enum.DISCOUNT_TYPE.AMOUNT_KHR)}>
                ៛ KHR
              </Button>

              <Button type={discountType === Enum.DISCOUNT_TYPE.AMOUNT ? "primary" : "default"} size="large" style={{ borderRadius: 8, flex: 1 }} onClick={() => this.handleOnSelectDiscount(Enum.DISCOUNT_TYPE.AMOUNT)}>
                $ USD
              </Button>
            </div>
            <PresetsContainer>
              {this.state.presets.map((value) => (
                <PresetButton key={value} className={this.state.selectedPreset === value ? "active" : ""} onClick={() => this.handleOnSelectPreset(value)}>
                  {this.formatLabel(value, discountType)}
                </PresetButton>
              ))}
            </PresetsContainer>
            <div className="wrap-discount-value">
              <div className="discount-type">
                <div className="item">{this.getDiscountSymbol(discountType)}</div>
              </div>
              <div className="discount-value" style={{ flex: 1 }}>
                <InputNumber size="large" isAutoFocus={true} isAutoSelect={true} precision={discountType === Enum.DISCOUNT_TYPE.AMOUNT ? 2 : 0} name="discountValue" value={this.state.discountValue} onChange={this.handleOnChangeDiscountValue} />
              </div>
            </div>
            <div className="arrow-right"></div>

            {discountAmount > 0 && (
              <>
                <PreviewBar style={{ marginTop: 15 }}>
                  <span>Discount</span>
                  <DiscountAmount>
                    - {formatCurrency({ amount: discountAmount * sellRate, currency: "៛" })} ({formatCurrency({ amount: discountAmount, currency: "$" })})
                  </DiscountAmount>
                </PreviewBar>

                <DividerPreviewBar>
                  <span style={{ fontWeight: 600 }}>New Total</span>
                  <NewTotalAmount>
                    {formatCurrency({ amount: (subTotal - discountAmount) * sellRate, currency: "៛" })} ({formatCurrency({ amount: subTotal - discountAmount, currency: "$" })})
                  </NewTotalAmount>
                </DividerPreviewBar>
              </>
            )}

            <Input type="text" name="discountReason" size="large" placeholder="Reason (optional, e.g. VIP, Staff)" style={{ marginTop: 15 }} />

            <div className="text-about-discount">
              <Translate id="text_about_discount" />
            </div>
          </div>
          <div className="ant-modal-footer" style={{ display: "flex", paddingLeft: 0, paddingRight: 0, borderWidth: 0 }}>
            <Button type="default" size="large" onClick={this.handleCancel} style={{ borderRadius: 8 }}>
              <Translate id="text_cancel" />
            </Button>
            <Button size="large" type="primary" style={{ flex: 1, borderRadius: 8 }} onClick={this.handleApplyDiscount}>
              <Translate id="text_apply_discount" />
            </Button>
          </div>
        </Form>
      </Modal>
    );
  }
}