import React from "react";

class Receipt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { description: "Mask lucaci pink", qty: 1, price: 4.2, discount: 0 },
        { description: "Miss", qty: 1, price: 5.3, discount: 0 },
        { description: "Sun Serum Miss", qty: 1, price: 8.8, discount: 0 },
        { description: "VHE", qty: 1, price: 3.4, discount: 0 },
        { description: "R Miss", qty: 1, price: 4.0, discount: 0 },
        { description: "SB strawberry", qty: 1, price: 4.35, discount: 0 },
        { description: "Miss", qty: 1, price: 2.1, discount: 0 },
        { description: "Nose Essential Oil", qty: 1, price: 1.5, discount: 0 },
        { description: "150$", qty: 1, price: 1.5, discount: 0 },
        { description: "Item", qty: 1, price: 1.0, discount: 0 },
        { description: "Item", qty: 1, price: 0.5, discount: 0 },
        { description: "Item", qty: 1, price: 1.5, discount: 0 },
      ],
      invoiceNo: "011730",
      cashier: "Nhaaa",
      date: "2025-01-11 16:58:52",
      exchangeRate: 4100,
      queueNo: "A-017",
      wifi: {
        name: "TaTa17Store_Guest",
        password: "tata2025",
      },
    };
    this.handlePrint = this.handlePrint.bind(this);
  }

  calculateTotal() {
    return this.state.items.reduce(function (sum, item) {
      var itemTotal = item.price * item.qty;
      var discountAmount = itemTotal * (item.discount / 100);
      var finalTotal = itemTotal - discountAmount;
      return sum + finalTotal;
    }, 0);
  }

  handlePrint() {
    window.print();
  }

  render() {
    var subtotal = this.calculateTotal();
    var totalInRiel = subtotal * this.state.exchangeRate;

    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#1a202c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <button
            onClick={this.handlePrint}
            style={{
              width: "100%",
              backgroundColor: "#4299e1",
              color: "white",
              fontWeight: "bold",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginBottom: "16px",
              fontSize: "16px",
            }}
            className="no-print"
          >
            🖨️ Print Receipt
          </button>

          <div
            style={{
              backgroundColor: "white",
              fontFamily: "monospace",
              fontSize: "12px",
            }}
          >
            <div
              style={{
                padding: "16px",
                textAlign: "center",
                borderBottom: "2px dashed #000",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                187
              </div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                TaTa17Store
              </div>
              <div style={{ fontSize: "11px", marginTop: "4px" }}>
                855069526809
              </div>
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px",
                  border: "2px solid #000",
                }}
              >
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  លេខជួរ/Queue: {this.state.queueNo}
                </div>
              </div>
            </div>

            <div style={{ padding: "16px" }}>
              <div
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "12px",
                }}
              >
                វិក័យប័ត្រ/INVOICE
              </div>

              <div style={{ fontSize: "11px", marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span>លេខបង្កាន់ដៃ/Invoice No:</span>
                  <span style={{ fontWeight: "bold" }}>
                    {this.state.invoiceNo}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span>អ្នកគិតលុយ/Cashier:</span>
                  <span style={{ fontWeight: "bold" }}>
                    {this.state.cashier}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span>កាលបរិច្ឆេទ/Date:</span>
                  <span>{this.state.date}</span>
                </div>
              </div>

              <table
                style={{
                  width: "100%",
                  fontSize: "11px",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderTop: "1px solid #000",
                      borderBottom: "1px solid #000",
                    }}
                  >
                    <th
                      style={{
                        textAlign: "left",
                        padding: "6px 0",
                        fontWeight: "bold",
                      }}
                    >
                      <div>ទំនិញ</div>
                      <div style={{ fontSize: "9px", fontWeight: "normal" }}>
                        Item
                      </div>
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "6px 4px",
                        fontWeight: "bold",
                      }}
                    >
                      <div>ចំនួន</div>
                      <div style={{ fontSize: "9px", fontWeight: "normal" }}>
                        Qty
                      </div>
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "6px 0",
                        fontWeight: "bold",
                      }}
                    >
                      <div>តម្លៃ</div>
                      <div style={{ fontSize: "9px", fontWeight: "normal" }}>
                        Price
                      </div>
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "6px 4px",
                        fontWeight: "bold",
                      }}
                    >
                      <div>បញ្ចុះ</div>
                      <div style={{ fontSize: "9px", fontWeight: "normal" }}>
                        Dis.
                      </div>
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "6px 0",
                        fontWeight: "bold",
                      }}
                    >
                      <div>សរុប</div>
                      <div style={{ fontSize: "9px", fontWeight: "normal" }}>
                        Total
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.items.map(function (item, index) {
                    var itemTotal = item.price * item.qty;
                    var discountAmount = itemTotal * (item.discount / 100);
                    var finalTotal = itemTotal - discountAmount;
                    return (
                      <tr
                        key={index}
                        style={{ borderBottom: "1px dotted #ccc" }}
                      >
                        <td style={{ padding: "4px 0" }}>{item.description}</td>
                        <td style={{ textAlign: "center", padding: "4px" }}>
                          {item.qty}
                        </td>
                        <td style={{ textAlign: "right", padding: "4px 0" }}>
                          {item.price.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "center", padding: "4px" }}>
                          {item.discount}%
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            padding: "4px 0",
                            fontWeight: "bold",
                          }}
                        >
                          {finalTotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div
                style={{
                  borderTop: "2px solid #000",
                  marginTop: "12px",
                  paddingTop: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                    fontSize: "11px",
                  }}
                >
                  <span>សរុបរង/Subtotal:</span>
                  <span style={{ fontWeight: "bold" }}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    borderTop: "1px solid #000",
                    paddingTop: "8px",
                  }}
                >
                  <span>សរុបសរុប/TOTAL (USD):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "10px",
                  }}
                >
                  <span>
                    សរុបសរុប/TOTAL (៛) @{" "}
                    {this.state.exchangeRate.toLocaleString()}៛:
                  </span>
                  <span style={{ fontWeight: "bold" }}>
                    {totalInRiel.toLocaleString()}៛
                  </span>
                </div>
              </div>

              <div
                style={{
                  marginTop: "12px",
                  padding: "8px",
                  border: "1px solid #000",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                ទូទាត់/PAYMENT: CASH
              </div>

              <div
                style={{
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px dashed #000",
                  textAlign: "center",
                  fontSize: "10px",
                }}
              >
                <div style={{ marginBottom: "4px" }}>
                  អរគុណសម្រាប់ការទិញទំនិញ/Thank you for shopping with us!
                </div>
                <div>
                  WiFi: {this.state.wifi.name} | Pass:{" "}
                  {this.state.wifi.password}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .no-print {
              display: none !important;
            }
            > div {
              background: white !important;
              padding: 0 !important;
              min-height: 0 !important;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default Receipt;
