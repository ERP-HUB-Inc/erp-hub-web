import React from "react";
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Select } from "antd";
import Util from "@helper/util";
import { CHARGE_TYPES, calculatePurchaseOrderTotals, newCharge } from "./purchaseOrderCostUtils";

const { Option } = Select;
const formatAmount = (amount) => new Util().formatCurrency(amount);
const amountRules = [{ type: "number", min: 0, message: "Enter a non-negative amount" }];

const PurchaseOrderCosts = ({ form, items, costs, onCostsChange, charges, onChargesChange }) => {
  const totals = calculatePurchaseOrderTotals(items, costs, charges);
  const discountRules = [
    ...amountRules,
    {
      validator: (rule, value, callback) => {
        if (Number(value || 0) > totals.subtotal) callback("Discount cannot exceed items subtotal");
        else callback();
      },
    },
  ];
  const updateCharge = (key, field, value) => onChargesChange(
    charges.map((charge) => charge.key === key ? { ...charge, [field]: value } : charge)
  );
  const summaryRow = (label, amount, strong = false) => (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
      <span style={{ fontWeight: strong ? 600 : 400 }}>{label}</span>
      <span style={{ fontWeight: strong ? 600 : 400 }}>{formatAmount(amount)}</span>
    </div>
  );

  return (
    <div>
      <h3>Order costs</h3>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Discount" extra="Amount deducted from the supplier's item total.">
            {form.getFieldDecorator("discount", { initialValue: costs.discount, rules: discountRules })(
              <InputNumber min={0} precision={2} style={{ width: "100%" }} onChange={(discount) => onCostsChange({ ...costs, discount })} />
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Shipping fee" extra="Shipping charged by the supplier.">
            {form.getFieldDecorator("shippingFee", { initialValue: costs.shippingFee, rules: amountRules })(
              <InputNumber min={0} precision={2} style={{ width: "100%" }} onChange={(shippingFee) => onCostsChange({ ...costs, shippingFee })} />
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Purchase tax amount" extra="Enter the supplier's tax amount.">
            {form.getFieldDecorator("tax", { initialValue: costs.tax, rules: amountRules })(
              <InputNumber min={0} precision={2} style={{ width: "100%" }} onChange={(tax) => onCostsChange({ ...costs, tax })} />
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Tax treatment">
            {form.getFieldDecorator("taxInclusive", { initialValue: costs.taxInclusive, valuePropName: "checked" })(
              <Checkbox onChange={(event) => onCostsChange({ ...costs, taxInclusive: event.target.checked })}>
                Tax is included in item prices
              </Checkbox>
            )}
          </Form.Item>
        </Col>
      </Row>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Additional charges</h3>
        <Button type="dashed" icon="plus" onClick={() => onChargesChange([...charges, newCharge()])}>
          Add charge
        </Button>
      </div>
      {charges.map((charge, index) => (
        <Row gutter={12} key={charge.key} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={12} md={5}>
            <label htmlFor={`charge-type-${charge.key}`}>Charge {index + 1} type</label>
            <Select id={`charge-type-${charge.key}`} aria-label={`Charge ${index + 1} type`} value={charge.type} placeholder="Select type" style={{ width: "100%" }} onChange={(type) => updateCharge(charge.key, "type", type)}>
              {CHARGE_TYPES.map((type) => <Option key={type.value} value={type.value}>{type.label}</Option>)}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <label htmlFor={`charge-amount-${charge.key}`}>Amount</label>
            <InputNumber id={`charge-amount-${charge.key}`} aria-label={`Charge ${index + 1} amount`} min={0.01} precision={2} value={charge.amount} style={{ width: "100%" }} onChange={(amount) => updateCharge(charge.key, "amount", amount)} />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <label htmlFor={`charge-payee-${charge.key}`}>Paid to</label>
            <Select id={`charge-payee-${charge.key}`} aria-label={`Charge ${index + 1} payee`} value={charge.payee} style={{ width: "100%" }} onChange={(payee) => updateCharge(charge.key, "payee", payee)}>
              <Option value="SUPPLIER">Supplier</Option>
              <Option value="THIRD_PARTY">Third party</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            {charge.type === "OTHER" && (
              <div>
                <label htmlFor={`charge-description-${charge.key}`}>Description</label>
                <Input id={`charge-description-${charge.key}`} value={charge.description} maxLength={100} onChange={(event) => updateCharge(charge.key, "description", event.target.value)} />
              </div>
            )}
            <Checkbox checked={charge.includeInInventoryCost} onChange={(event) => updateCharge(charge.key, "includeInInventoryCost", event.target.checked)}>
              Include in inventory cost
            </Checkbox>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button type="danger" icon="delete" aria-label={`Remove charge ${index + 1}`} onClick={() => onChargesChange(charges.filter((entry) => entry.key !== charge.key))}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}

      <Row type="flex" justify="end" style={{ marginTop: 20 }}>
        <Col xs={24} md={10} lg={8}>
          {summaryRow("Items subtotal", totals.subtotal)}
          {summaryRow("Discount", -totals.discount)}
          {summaryRow("Shipping fee", totals.shippingFee)}
          {summaryRow("Supplier charges", totals.supplierCharges)}
          {summaryRow(costs.taxInclusive ? "Tax (included)" : "Tax", totals.tax)}
          {summaryRow("Supplier payable", totals.supplierPayable, true)}
          {summaryRow("Third-party charges", totals.thirdPartyCharges)}
          {summaryRow("Estimated total cost", totals.estimatedTotalCost, true)}
        </Col>
      </Row>
    </div>
  );
};

export default PurchaseOrderCosts;
