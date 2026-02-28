import React, { useState } from "react";
import {
  Drawer,
  Button,
  Checkbox,
  Divider,
  InputNumber,
  Row,
  Col,
  Typography,
  Tag,
} from "antd";

const { Title, Text } = Typography;

const mockOrder = {
  cashier: "Jason Miller",
  orderId: "000476",
  items: [{ name: "XS Max Board", qty: 1, price: 8, sku: "000476" }],
  subtotal: 8,
  tax: 0,
  total: 8,
};

export default function POSPaymentDrawer() {
  const [open, setOpen] = useState(false);
  const [printReceipt, setPrintReceipt] = useState(true);
  const [cashAmount, setCashAmount] = useState(0);
  const [cardAmount, setCardAmount] = useState(0);
  const [paid, setPaid] = useState(false);

  const change = cashAmount + cardAmount - mockOrder.total;
  const isPaidEnough = cashAmount + cardAmount >= mockOrder.total;

  const handlePay = () => {
    if (isPaidEnough) setPaid(true);
  };

  const handleReset = () => {
    setPaid(false);
    setCashAmount(0);
    setCardAmount(0);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button
        type="primary"
        size="large"
        style={{
          background: "#00897B",
          borderColor: "#00897B",
          borderRadius: 8,
          padding: "0 32px",
          height: 48,
          fontSize: 16,
        }}
        onClick={() => setOpen(true)}
      >
        ✓ Pay (End)
      </Button>

      <Drawer
        title={null}
        placement="bottom"
        closable={false}
        onClose={() => setOpen(false)}
        visible={open}
        height={520}
        bodyStyle={{
          padding: 0,
          display: "flex",
          height: "100%",
          overflow: "hidden",
        }}
        style={{ borderRadius: "20px 20px 0 0" }}
      >
        <Row style={{ width: "100%", height: "100%" }}>
          {/* LEFT: Receipt */}
          <Col
            span={9}
            style={{
              background: "#1a2332",
              color: "#fff",
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              borderRadius: "20px 0 0 0",
              fontFamily: "'Courier New', monospace",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "#90a4ae",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                Sale Receipt
              </div>
              <div style={{ fontSize: 11, color: "#607d8b", marginTop: 4 }}>
                Cashier: {mockOrder.cashier}
              </div>
              <div style={{ fontSize: 11, color: "#607d8b" }}>
                Order #{mockOrder.orderId}
              </div>
            </div>

            <Divider style={{ borderColor: "#2e3f52", margin: "8px 0" }} />

            <div style={{ flex: 1 }}>
              {mockOrder.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#eceff1",
                        fontWeight: 600,
                      }}
                    >
                      {item.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#607d8b" }}>
                      SKU: {item.sku} × {item.qty}
                    </div>
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#80cbc4", fontWeight: 700 }}
                  >
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <Divider
              dashed
              style={{ borderColor: "#2e3f52", margin: "8px 0" }}
            />

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <Text style={{ color: "#90a4ae", fontSize: 12 }}>Subtotal</Text>
                <Text style={{ color: "#eceff1", fontSize: 12 }}>
                  ${mockOrder.subtotal.toFixed(2)}
                </Text>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <Text style={{ color: "#90a4ae", fontSize: 12 }}>Tax</Text>
                <Text style={{ color: "#eceff1", fontSize: 12 }}>
                  ${mockOrder.tax.toFixed(2)}
                </Text>
              </div>
              <Divider style={{ borderColor: "#2e3f52", margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>
                  TOTAL
                </Text>
                <Text
                  style={{ color: "#4db6ac", fontSize: 18, fontWeight: 800 }}
                >
                  ${mockOrder.total.toFixed(2)}
                </Text>
              </div>
            </div>

            {paid && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Tag
                  color="#00897B"
                  style={{
                    fontSize: 13,
                    padding: "4px 16px",
                    borderRadius: 20,
                  }}
                >
                  ✓ PAID
                </Tag>
                {change > 0 && (
                  <div style={{ marginTop: 8, color: "#ffd54f", fontSize: 12 }}>
                    Change: ${change.toFixed(2)}
                  </div>
                )}
              </div>
            )}
          </Col>

          {/* RIGHT: Payment Panel */}
          <Col
            span={15}
            style={{
              background: "#fff",
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              borderRadius: "0 20px 0 0",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#90a4ae",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Amount to Pay
                </div>
                <Title
                  level={2}
                  style={{ margin: 0, color: "#1a2332", lineHeight: 1.1 }}
                >
                  ${mockOrder.total.toFixed(2)}
                </Title>
              </div>
              <Button
                shape="circle"
                icon="✕"
                size="small"
                style={{
                  border: "1px solid #e0e0e0",
                  color: "#999",
                  fontSize: 14,
                }}
                onClick={() => {
                  setOpen(false);
                  handleReset();
                }}
              >Close</Button>
            </div>

            {/* Payment Inputs */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <label
                    style={{
                      fontSize: 12,
                      color: "#607d8b",
                      display: "block",
                      marginBottom: 4,
                      fontWeight: 600,
                    }}
                  >
                    💵 Cash
                  </label>
                  <InputNumber
                    style={{ width: "100%", borderRadius: 8 }}
                    size="large"
                    min={0}
                    precision={2}
                    value={cashAmount}
                    onChange={(v) => setCashAmount(v || 0)}
                    formatter={(v) => `$ ${v}`}
                    parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <label
                    style={{
                      fontSize: 12,
                      color: "#607d8b",
                      display: "block",
                      marginBottom: 4,
                      fontWeight: 600,
                    }}
                  >
                    💳 Card
                  </label>
                  <InputNumber
                    style={{ width: "100%", borderRadius: 8 }}
                    size="large"
                    min={0}
                    precision={2}
                    value={cardAmount}
                    onChange={(v) => setCardAmount(v || 0)}
                    formatter={(v) => `$ ${v}`}
                    parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
                  />
                </div>
              </Col>
            </Row>

            {/* Quick Cash Buttons */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 12,
                  color: "#607d8b",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Quick Cash
              </div>
              <Row gutter={8}>
                {[5, 10, 20, 50].map((amt) => (
                  <Col span={6} key={amt}>
                    <Button
                      block
                      style={{
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                        fontWeight: 600,
                        color: "#1a2332",
                      }}
                      onClick={() => setCashAmount(amt)}
                    >
                      ${amt}
                    </Button>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Summary Row */}
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text style={{ fontSize: 12, color: "#90a4ae" }}>Tendered</Text>
                <div
                  style={{ fontWeight: 700, fontSize: 16, color: "#1a2332" }}
                >
                  ${(cashAmount + cardAmount).toFixed(2)}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <Text style={{ fontSize: 12, color: "#90a4ae" }}>
                  Remaining
                </Text>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: isPaidEnough ? "#00897B" : "#f44336",
                  }}
                >
                  {isPaidEnough
                    ? "$0.00"
                    : `$${(mockOrder.total - cashAmount - cardAmount).toFixed(2)}`}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Text style={{ fontSize: 12, color: "#90a4ae" }}>Change</Text>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: change > 0 ? "#ff9800" : "#ccc",
                  }}
                >
                  ${change > 0 ? change.toFixed(2) : "0.00"}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Checkbox
                checked={printReceipt}
                onChange={(e) => setPrintReceipt(e.target.checked)}
                style={{ color: "#607d8b", fontSize: 13 }}
              >
                Print Receipt
              </Checkbox>

              <div style={{ display: "flex", gap: 8 }}>
                <Button
                  size="large"
                  style={{
                    borderRadius: 8,
                    border: "1px solid #e0e0e0",
                    color: "#607d8b",
                  }}
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  size="large"
                  disabled={!isPaidEnough || paid}
                  style={{
                    background: isPaidEnough && !paid ? "#00897B" : undefined,
                    borderColor: isPaidEnough && !paid ? "#00897B" : undefined,
                    borderRadius: 8,
                    fontWeight: 700,
                    padding: "0 32px",
                  }}
                  onClick={handlePay}
                >
                  {paid ? "✓ Paid" : "Confirm Payment"}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Drawer>
    </div>
  );
}
