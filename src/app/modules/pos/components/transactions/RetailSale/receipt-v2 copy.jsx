import React from "react";
import styled from "styled-components";

const ReceiptWrapper = styled.div`
  @media print {
    body * {
      display: none;
    }

    #receipt-wrapper,
    #receipt-wrapper * {
      visibility: visible; /* show only receipt */
    }

    #receipt-wrapper {
      position: absolute; /* place it at the top-left for printing */
      left: 0;
      top: 0;
    }
  }
`;

class ReceiptV2 extends React.Component {
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
      return sum + item.price * item.qty;
    }, 0);
  }

  handlePrint() {
    window.print();
  }

  render() {
    var subtotal = this.calculateTotal();
    var totalInRiel = subtotal * this.state.exchangeRate;

    return (
      <ReceiptWrapper className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* <button
            onClick={this.handlePrint}
            className="mb-4 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded hover:bg-blue-700"
            style={{ display: "block" }}
          >
            Print Receipt
          </button> */}

          <div
            className="bg-white"
            style={{ fontFamily: "monospace" }}
          >
            <div className="p-6 text-center border-b-2 border-dashed border-gray-300">
              <h1 className="text-3xl font-bold mb-2">187</h1>
              <h2 className="text-lg mb-2">Byte Store Center</h2>
              <p className="text-sm">855069526809</p>
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <p className="text-2xl font-bold text-gray-800 mb-0">
                  Queue No: {this.state.queueNo}
                </p>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-center font-bold text-lg mb-4">INVOICE</h3>

              <div className="text-sm mb-4">
                <div className="flex justify-between mb-1">
                  <span>លេខបង្កាន់ដៃ/Invoice No:</span>
                  <span>{this.state.invoiceNo}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>អ្នកគិតលុយ/Cashier:</span>
                  <span>{this.state.cashier}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>កាលបរិច្ឆេទ/Date:</span>
                  <span>{this.state.date}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>អតិថិជន/Customer:</span>
                  <span>General Customer</span>
                </div>
              </div>

              <table className="w-full text-xs mb-4">
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
                  {this.state.items.map(function (item, index) {
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

              <div className="border-t-2 border-gray-400 pt-3 mb-2">
                <div className="flex justify-between font-bold mb-2">
                  <span>Sub Total($):</span>
                  <span>{subtotal.toFixed(2)}$</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Discount:</span>
                  <span>0%</span>
                  <span>0$</span>
                </div>
                <div className="flex justify-between font-bold text-lg mb-2">
                  <span>Grand total include VAT:</span>
                  <span>{subtotal.toFixed(2)}$</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>
                    Exchange rate: {this.state.exchangeRate.toLocaleString()}៛
                  </span>
                  <span>{totalInRiel.toLocaleString()}៛</span>
                </div>
              </div>

              <div className="border-t-2 border-gray-400 mt-4 pt-3 mb-2">
                <div className="flex justify-between mb-2">
                  <span>Received ($):</span>
                  <span className="font-bold">{subtotal.toFixed(2)}$</span>
                  <span>Changed ($):</span>
                  <span>0$</span>
                </div>
                <div className="flex justify-between">
                  <span>Received (៛):</span>
                  <span className="font-bold">0៛</span>
                  <span>Changed (៛):</span>
                  <span>0៛</span>
                </div>
              </div>

              <div className="mt-4 p-3 border-2 border-gray-400 text-center">
                <span className="font-bold">Payment: Cash</span>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-300 text-xs text-center">
                <p className="text-gray-600">Thank you for shopping with us.</p>
                <p className="mt-1">
                  WiFi:{" "}
                  <span className="font-semibold">{this.state.wifi.name}</span>{" "}
                  | Pass:{" "}
                  <span className="font-mono">{this.state.wifi.password}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </ReceiptWrapper>
    );
  }
}

export default ReceiptV2;
