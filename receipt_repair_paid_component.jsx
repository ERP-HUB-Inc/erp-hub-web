import React from "react";

class Receipt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiptType: "repair_claim", // 'repair_claim' or 'sales'
      showPaidWatermark: false, // Set to true to show PAID watermark

      // Repair Job Details
      jobNumber: "RJ-2025-00173",
      customerName: "Sok Dara",
      customerPhone: "012 345 678",
      deviceBrand: "iPhone",
      deviceModel: "13 Pro",
      deviceColor: "Blue",
      imei: "356789012345678",
      password: "****",
      issue: "Cracked screen, not charging properly",
      accessories: "Charger, Phone case",
      deviceCondition: "Minor scratches on back",

      // Service Details
      services: [
        {
          description: "Screen Replacement (Original)",
          price: 85.0,
          deposit: 30.0,
        },
        { description: "Charging Port Repair", price: 25.0, deposit: 10.0 },
      ],

      // Dates
      dropOffDate: "2025-01-11 16:58:52",
      estimatedReadyDate: "2025-01-13",
      estimatedReadyTime: "17:00",

      // Staff
      receivedBy: "Nhaaa",

      // Store Info
      storeName: "TechFix Mobile",
      storePhone: "855069526809",
      storeAddress: "St. 123, Phnom Penh",

      // Payment
      exchangeRate: 4100,

      // Terms
      terms: [
        "ការធានា 30 ថ្ងៃ លើសេវាជួសជុល / 30 days warranty on repairs",
        "សូមយកបង្កាន់ដៃនេះមកពេលទទួលទូរស័ព្ទ / Please bring this receipt to claim device",
        "យើងមិនទទួលខុសត្រូវចំពោះទិន្នន័យដែលបាត់ / Not responsible for data loss",
        "ប្រសិនបើមិនមកទទួលក្នុងរយៈពេល 30 ថ្ងៃ យើងនឹងបោះបង់ / Unclaimed after 30 days will be disposed",
      ],
    };
    this.handlePrint = this.handlePrint.bind(this);
    this.togglePaidWatermark = this.togglePaidWatermark.bind(this);
  }

  togglePaidWatermark() {
    this.setState({
      showPaidWatermark: !this.state.showPaidWatermark,
    });
  }

  calculateTotalEstimate() {
    return this.state.services.reduce(function (sum, service) {
      return sum + service.price;
    }, 0);
  }

  calculateTotalDeposit() {
    return this.state.services.reduce(function (sum, service) {
      return sum + service.deposit;
    }, 0);
  }

  handlePrint() {
    window.print();
  }

  render() {
    var totalEstimate = this.calculateTotalEstimate();
    var totalDeposit = this.calculateTotalDeposit();
    var balance = totalEstimate - totalDeposit;
    var totalEstimateInRiel = totalEstimate * this.state.exchangeRate;
    var totalDepositInRiel = totalDeposit * this.state.exchangeRate;

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
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <button
              onClick={this.handlePrint}
              style={{
                flex: 1,
                backgroundColor: "#4299e1",
                color: "white",
                fontWeight: "bold",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
              className="no-print"
            >
              🖨️ Print
            </button>
            <button
              onClick={this.togglePaidWatermark}
              style={{
                flex: 1,
                backgroundColor: this.state.showPaidWatermark
                  ? "#48bb78"
                  : "#718096",
                color: "white",
                fontWeight: "bold",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
              className="no-print"
            >
              {this.state.showPaidWatermark ? "✓ PAID" : "Mark PAID"}
            </button>
          </div>

          <div
            style={{
              backgroundColor: "white",
              fontFamily: "monospace",
              fontSize: "12px",
              position: "relative",
            }}
          >
            {/* PAID Watermark */}
            {this.state.showPaidWatermark && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(-45deg)",
                  fontSize: "80px",
                  fontWeight: "bold",
                  color: "rgba(34, 197, 94, 0.15)",
                  border: "8px solid rgba(34, 197, 94, 0.15)",
                  padding: "20px 60px",
                  borderRadius: "20px",
                  zIndex: 10,
                  pointerEvents: "none",
                  letterSpacing: "10px",
                }}
              >
                PAID
              </div>
            )}

            {/* Header */}
            <div
              style={{
                padding: "16px",
                textAlign: "center",
                borderBottom: "2px solid #000",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                🔧 {this.state.storeName}
              </div>
              <div style={{ fontSize: "11px", marginBottom: "2px" }}>
                ការជួសជុលទូរស័ព្ទ / Phone Repair Service
              </div>
              <div style={{ fontSize: "10px" }}>☎️ {this.state.storePhone}</div>
              <div style={{ fontSize: "10px", marginTop: "2px" }}>
                {this.state.storeAddress}
              </div>
            </div>

            {/* Job Number - Prominent */}
            <div
              style={{
                padding: "12px",
                backgroundColor: "#000",
                color: "#fff",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "10px", marginBottom: "4px" }}>
                លេខការងារ / JOB NUMBER
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                }}
              >
                {this.state.jobNumber}
              </div>
            </div>

            <div style={{ padding: "16px" }}>
              {/* Customer Information */}
              <div
                style={{
                  marginBottom: "12px",
                  padding: "8px",
                  border: "1px solid #000",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "6px",
                    fontSize: "12px",
                    borderBottom: "1px solid #000",
                    paddingBottom: "4px",
                  }}
                >
                  ព័ត៌មានអតិថិជន / CUSTOMER INFO
                </div>
                <div style={{ fontSize: "11px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "3px",
                    }}
                  >
                    <span>ឈ្មោះ/Name:</span>
                    <span style={{ fontWeight: "bold" }}>
                      {this.state.customerName}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "3px",
                    }}
                  >
                    <span>លេខទូរស័ព្ទ/Phone:</span>
                    <span style={{ fontWeight: "bold" }}>
                      {this.state.customerPhone}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "3px",
                    }}
                  >
                    <span>កាលបរិច្ចេទទុក/Drop-off:</span>
                    <span>{this.state.dropOffDate}</span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>អ្នកទទួល/Received by:</span>
                    <span style={{ fontWeight: "bold" }}>
                      {this.state.receivedBy}
                    </span>
                  </div>
                </div>
              </div>

              {/* Device Information */}
              <div
                style={{
                  marginBottom: "12px",
                  padding: "8px",
                  border: "1px solid #000",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "6px",
                    fontSize: "12px",
                    borderBottom: "1px solid #000",
                    paddingBottom: "4px",
                  }}
                >
                  ព័ត៌មានទូរស័ព្ទ / DEVICE INFO
                </div>
                <div style={{ fontSize: "11px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "3px",
                    }}
                  >
                    <span>ម៉ាក/Brand:</span>
                    <span style={{ fontWeight: "bold" }}>
                      {this.state.deviceBrand}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "3px",
                    }}
                  >
                    <span>ម៉ូដែល/Model:</span>
                    <span style={{ fontWeight: "bold" }}>
                      {this.state.deviceModel}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "3px",
                    }}
                  >
                    <span>ពណ៌/Color:</span>
                    <span>{this.state.deviceColor}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "3px",
                    }}
                  >
                    <span>IMEI:</span>
                    <span style={{ fontFamily: "monospace", fontSize: "10px" }}>
                      {this.state.imei}
                    </span>
                  </div>
                  {this.state.password && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "3px",
                      }}
                    >
                      <span>លេខសម្ងាត់/Password:</span>
                      <span>{this.state.password}</span>
                    </div>
                  )}
                  {this.state.accessories && (
                    <div
                      style={{
                        marginTop: "6px",
                        paddingTop: "6px",
                        borderTop: "1px dashed #ccc",
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "2px" }}>
                        គ្រឿងបន្លាស់/Accessories:
                      </div>
                      <div>{this.state.accessories}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Issue Description */}
              <div
                style={{
                  marginBottom: "12px",
                  padding: "8px",
                  border: "1px solid #000",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "6px",
                    fontSize: "12px",
                    borderBottom: "1px solid #000",
                    paddingBottom: "4px",
                  }}
                >
                  បញ្ហា / REPORTED ISSUE
                </div>
                <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
                  {this.state.issue}
                </div>
                {this.state.deviceCondition && (
                  <div
                    style={{
                      marginTop: "6px",
                      paddingTop: "6px",
                      borderTop: "1px dashed #ccc",
                      fontSize: "10px",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>
                      ស្ថានភាព/Condition:{" "}
                    </span>
                    {this.state.deviceCondition}
                  </div>
                )}
              </div>

              {/* Services & Pricing */}
              <div
                style={{
                  marginBottom: "12px",
                  padding: "8px",
                  border: "2px solid #000",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "6px",
                    fontSize: "12px",
                    borderBottom: "1px solid #000",
                    paddingBottom: "4px",
                  }}
                >
                  សេវាកម្ម និង តម្លៃ / SERVICES & PRICING
                </div>
                <table style={{ width: "100%", fontSize: "11px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #000" }}>
                      <th style={{ textAlign: "left", padding: "4px 0" }}>
                        សេវា/Service
                      </th>
                      <th style={{ textAlign: "right", padding: "4px 0" }}>
                        តម្លៃ/Price
                      </th>
                      <th style={{ textAlign: "right", padding: "4px 0" }}>
                        ប្រាក់កក់/Deposit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.services.map(function (service, index) {
                      return (
                        <tr
                          key={index}
                          style={{ borderBottom: "1px dotted #ccc" }}
                        >
                          <td style={{ padding: "6px 0" }}>
                            {service.description}
                          </td>
                          <td style={{ textAlign: "right", padding: "6px 0" }}>
                            ${service.price.toFixed(2)}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              padding: "6px 0",
                              fontWeight: "bold",
                            }}
                          >
                            ${service.deposit.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div
                  style={{
                    marginTop: "8px",
                    paddingTop: "8px",
                    borderTop: "2px solid #000",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11px",
                      marginBottom: "3px",
                    }}
                  >
                    <span>តម្លៃសរុប/Total Estimate:</span>
                    <span style={{ fontWeight: "bold" }}>
                      ${totalEstimate.toFixed(2)} (
                      {totalEstimateInRiel.toLocaleString()}៛)
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "3px",
                    }}
                  >
                    <span>ប្រាក់កក់/Deposit Paid:</span>
                    <span>
                      ${totalDeposit.toFixed(2)} (
                      {totalDepositInRiel.toLocaleString()}៛)
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                      fontWeight: "bold",
                      padding: "6px",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    <span>នៅសល់/Balance Due:</span>
                    <span>${balance.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Estimated Ready Date */}
              <div
                style={{
                  marginBottom: "12px",
                  padding: "10px",
                  border: "2px dashed #000",
                  textAlign: "center",
                  backgroundColor: "#fffbeb",
                }}
              >
                <div style={{ fontSize: "11px", marginBottom: "4px" }}>
                  ថ្ងៃរំពឹងថាត្រៀមរួច / ESTIMATED READY
                </div>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {this.state.estimatedReadyDate} @{" "}
                  {this.state.estimatedReadyTime}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    marginTop: "4px",
                    fontStyle: "italic",
                  }}
                >
                  យើងនឹងទូរស័ព្ទជូនដំណឹងពេលរួច / We will call when ready
                </div>
              </div>

              {/* Terms & Conditions */}
              <div
                style={{
                  marginBottom: "8px",
                  padding: "8px",
                  border: "1px solid #000",
                  fontSize: "9px",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "4px",
                    textAlign: "center",
                  }}
                >
                  លក្ខខណ្ឌ / TERMS & CONDITIONS
                </div>
                {this.state.terms.map(function (term, index) {
                  return (
                    <div
                      key={index}
                      style={{ marginBottom: "3px", lineHeight: "1.3" }}
                    >
                      • {term}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div
                style={{
                  textAlign: "center",
                  paddingTop: "8px",
                  borderTop: "2px dashed #000",
                  fontSize: "10px",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  សូមរក្សាបង្កាន់ដៃនេះដើម្បីយកទូរស័ព្ទ
                </div>
                <div>KEEP THIS RECEIPT TO CLAIM YOUR DEVICE</div>
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
