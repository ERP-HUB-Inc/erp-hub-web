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
      logo:
        "https://scontent.fpnh5-1.fna.fbcdn.net/v/t39.30808-1/585200543_1696626621729123_1170232857674237820_n.jpg?stp=c78.0.617.618a_dst-jpg_tt6&cstp=mx617x618&ctp=s480x480&_nc_cat=103&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=j4RdVHXc7cIQ7kNvwEjTUOv&_nc_oc=Adq2btxGfo6WP-lOmUwHIg3X49pz--PvNvioZlAp1ZJjoQGB0K-o85FBnzYdblr8Ji8&_nc_zt=24&_nc_ht=scontent.fpnh5-1.fna&_nc_gid=AeHEwPCIlndz4FdxTE-aIg&_nc_ss=7b2a8&oh=00_AQMfQbxqOKVQCz2SDtsxJWwkjQwwc7_0CtctKDHODthQkg&oe=6AC954AC",
      wifi: {
        name: "TaTa17Store_Guest",
        password: "tata2025",
      },
    };
    this.handlePrint = this.handlePrint.bind(this);
  }

  formatDate(value) {
    if (!value) return this.state.date;
    var date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  }

  getReceiptData() {
    var data = this.props.data || {};
    return {
      items: data.items && data.items.length ? data.items.map(function (item) {
        var price = Number(item.unitPrice || item.newPrice || item.price || item.retailPrice || 0);
        var qty = Number(item.quantity || item.qty || 1);
        return {
          description: item.itemName || item.name || item.description || "Item",
          qty: qty,
          price: price,
          discount: Number(item.discount || 0),
        };
      }) : this.state.items,
      invoiceNo: data.invoiceNo || this.state.invoiceNo,
      cashier: data.cashier || this.state.cashier,
      date: this.formatDate(data.date),
      customerName: data.customerName || "General Customer",
      exchangeRate: Number(data.exchangeRate || this.state.exchangeRate),
      queueNo: data.queueNo || this.state.queueNo,
      logo: data.logo || this.state.logo,
      wifi: data.wifi || this.state.wifi,
      discountAmount: Number(data.discountAmount || 0),
      taxAmount: Number(data.taxAmount || 0),
      grandTotalUSD: Number(data.grandTotalUSD || 0),
      tenderUSD: Number(data.tenderUSD || 0),
      tenderKHR: Number(data.tenderKHR || 0),
      changeUSD: Number(data.changeUSD || 0),
      changeKHR: Number(data.changeKHR || 0),
    };
  }

  calculateTotal(items) {
    return items.reduce(function (sum, item) {
      return sum + item.price * item.qty;
    }, 0);
  }

  handlePrint() {
    window.print();
  }

  render() {
    var receipt = this.getReceiptData();
    var subtotal = this.calculateTotal(receipt.items);
    var grandTotal = receipt.grandTotalUSD || subtotal + receipt.taxAmount - receipt.discountAmount;
    var totalInRiel = grandTotal * receipt.exchangeRate;
    var receiptPageClassName = this.props.embedded
      ? "receipt-page receipt-page-embedded min-h-screen bg-gray-900 flex items-center justify-center p-4"
      : "receipt-page min-h-screen bg-gray-900 flex items-center justify-center p-4";

    return (
      <div className={receiptPageClassName}>
        <div className="w-full max-w-md">
          {!this.props.embedded ? (
            <button
              onClick={this.handlePrint}
              className="no-print mb-4 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded hover:bg-blue-700"
              style={{ display: "block" }}
            >
              Print Receipt
            </button>
          ) : null}

          <div
            className="receipt-print-area bg-white shadow-2xl"
            style={{ fontFamily: "monospace" }}
          >
            <div className="receipt-header p-6 text-center border-b-2 border-dashed border-gray-300">
              <img
                src={receipt.logo}
                alt="Store logo"
                className="receipt-logo mx-auto mb-2 rounded-full object-cover"
              />
              <h1 className="text-3xl font-bold mb-2">187</h1>
              <h2 className="text-lg mb-2">TaTa17Store</h2>
              <p className="text-sm">855069526809</p>
              <div className="receipt-queue mt-3 px-3 py-2 bg-gray-100 rounded">
                <p className="text-2xl font-bold text-gray-800 leading-none mb-0">
                  Queue No: {receipt.queueNo}
                </p>
              </div>
            </div>

            <div className="receipt-body p-6">
              <h3 className="receipt-title text-center font-bold text-lg mb-4">
                វិក្កយបត្រ/Receipt
              </h3>

              <div className="receipt-meta text-sm mb-4">
                <div className="flex justify-between mb-1">
                  <span>លេខបង្កាន់ដៃ/Invoice No:</span>
                  <span>{receipt.invoiceNo}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>អ្នកគិតលុយ/Cashier:</span>
                  <span>{receipt.cashier}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>កាលបរិច្ឆេទ/Date:</span>
                  <span>{receipt.date}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>អតិថិជន/Customer:</span>
                  <span>{receipt.customerName}</span>
                </div>
              </div>

              <table className="receipt-items w-full text-xs mb-4">
                <thead className="border-t border-b border-gray-400">
                  <tr>
                    <th className="text-left py-2">Description</th>
                    <th className="text-center">QTY</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Dis.</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {receipt.items.map(function (item, index) {
                    return (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-2">{item.description}</td>
                        <td className="text-center">{item.qty}</td>
                        <td className="text-right">{item.price.toFixed(2)}</td>
                        <td className="text-right">{item.discount}%</td>
                        <td className="text-right">
                          {(item.price * item.qty).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="receipt-summary border-t-2 border-gray-400 pt-3 mb-2">
                <div className="receipt-row flex justify-between font-bold mb-2">
                  <span>សរុបរង/Sub Total($):</span>
                  <span>{subtotal.toFixed(2)}$</span>
                </div>
                <div className="receipt-row flex justify-between text-sm mb-2">
                  <span>បញ្ចុះតម្លៃ/Discount:</span>
                  <span>{receipt.discountAmount.toFixed(2)}$</span>
                </div>
                {receipt.taxAmount > 0 ? (
                  <div className="receipt-row flex justify-between text-sm mb-2">
                    <span>ពន្ធ/Tax:</span>
                    <span>{receipt.taxAmount.toFixed(2)}$</span>
                  </div>
                ) : null}
                <div className="receipt-row receipt-total-row flex justify-between font-bold text-lg mb-2">
                  <span>សរុបរួម /Grand Total:</span>
                  <span>{grandTotal.toFixed(2)}$</span>
                </div>
                <div className="receipt-row flex justify-between text-sm">
                  <span>
                    អត្រាប្តូរប្រាក់/Exchange:{" "}
                    {receipt.exchangeRate.toLocaleString()}៛
                  </span>
                  <span>{totalInRiel.toLocaleString()}៛</span>
                </div>
              </div>

              <div className="receipt-payment border-t-2 border-gray-400 mt-4 pt-3 mb-2">
                <div className="receipt-row flex justify-between mb-2">
                  <span>ប្រាក់ទទួល ($)/Received:</span>
                  <span className="font-bold">{receipt.tenderUSD.toFixed(2)}$</span>
                </div>
                <div className="receipt-row flex justify-between mb-2">
                  <span>ប្រាក់អាប់ ($)/Changed:</span>
                  <span>{receipt.changeUSD.toFixed(2)}$</span>
                </div>
                <div className="receipt-row flex justify-between mb-2">
                  <span>ប្រាក់ទទួល (៛)/Received:</span>
                  <span className="font-bold">{receipt.tenderKHR.toLocaleString()}៛</span>
                </div>
                <div className="receipt-row flex justify-between">
                  <span>ប្រាក់អាប់ (៛)/Changed:</span>
                  <span>{receipt.changeKHR.toLocaleString()}៛</span>
                </div>
              </div>

              <div className="mt-4 p-3 border-2 border-gray-400 text-center">
                <span className="font-bold">ទូទាត់/Payment: Cash</span>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-300 text-xs text-center">
                <p className="text-gray-600">Thank you for shopping with us.</p>
                <p className="mt-1">
                  WiFi:{" "}
                  <span className="font-semibold">{receipt.wifi.name}</span>{" "}
                  | Pass:{" "}
                  <span className="font-mono">{receipt.wifi.password}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .receipt-logo {
            height: 56px;
            width: 56px;
          }

          .receipt-page-embedded {
            height: 0 !important;
            min-height: 0 !important;
            overflow: hidden !important;
            padding: 0 !important;
            position: fixed !important;
            width: 0 !important;
          }

          @media print {
            @page {
              margin: 0;
              size: 80mm auto;
            }

            html,
            body {
              background: #fff !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 80mm;
            }

            body * {
              visibility: hidden !important;
            }

            .receipt-print-area,
            .receipt-print-area * {
              visibility: visible !important;
            }

            .receipt-page {
              align-items: flex-start !important;
              background: #fff !important;
              display: block !important;
              height: auto !important;
              justify-content: flex-start !important;
              min-height: 0 !important;
              overflow: visible !important;
              padding: 0 !important;
              position: static !important;
              width: 80mm !important;
            }

            .receipt-page-embedded {
              height: auto !important;
              overflow: visible !important;
              position: static !important;
              width: 80mm !important;
            }

            .receipt-page > div {
              max-width: none !important;
              width: 80mm !important;
            }

            .receipt-print-area {
              box-shadow: none !important;
              font-size: 11px !important;
              left: 0;
              position: absolute;
              top: 0;
              width: 80mm !important;
            }

            .receipt-header,
            .receipt-body {
              padding: 10px 12px !important;
            }

            .receipt-logo {
              height: 48px !important;
              width: 48px !important;
            }

            .receipt-title {
              font-size: 15px !important;
              line-height: 1.2 !important;
              margin-bottom: 10px !important;
              white-space: nowrap !important;
            }

            .receipt-queue {
              margin-top: 8px !important;
              padding: 6px 8px !important;
            }

            .receipt-queue p {
              font-size: 18px !important;
            }

            .receipt-meta,
            .receipt-summary,
            .receipt-payment {
              font-size: 11px !important;
              line-height: 1.35 !important;
            }

            .receipt-row,
            .receipt-meta .flex {
              align-items: baseline !important;
              gap: 8px !important;
              white-space: nowrap !important;
            }

            .receipt-row span:first-child,
            .receipt-meta .flex span:first-child {
              overflow: hidden !important;
              text-overflow: ellipsis !important;
            }

            .receipt-row span:last-child,
            .receipt-meta .flex span:last-child {
              flex-shrink: 0 !important;
              text-align: right !important;
            }

            .receipt-total-row {
              font-size: 13px !important;
            }

            .receipt-items {
              font-size: 10px !important;
              table-layout: fixed !important;
            }

            .receipt-items th,
            .receipt-items td {
              padding-bottom: 4px !important;
              padding-top: 4px !important;
            }

            .no-print {
              display: none !important;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default Receipt;
