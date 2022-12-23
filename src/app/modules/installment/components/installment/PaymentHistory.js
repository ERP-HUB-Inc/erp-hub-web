import React from "react";
import {Translate} from "react-localize-redux";
import {
  Drawer,
  Spin
} from "antd";
import Util from "../../../common/util";
import { stringTranslate } from "../../../common/helper/stringTranslate";

export default class PaymentHistory extends React.PureComponent {
  state = {
    visible: false,
  }
  util = new Util();

  handleEditPayment(id) {

  }

  onShowDrawer = () => {
    this.setState({visible: true});
  }

  onCloseDrawer = () => {
    this.setState({visible: false});
  }

  getTotalPaid(payments) {
    let total = 0;
    payments.length && payments.forEach(payment => {
      total += this.util.floor(payment.amount);
    });

    return total;
  }

  render() {
    return (
      <Drawer 
        title="Payment history"
        width={600}
        visible={this.state.visible}
        className="drawer-payment-history"
        onClose={this.onCloseDrawer}
      >
        <table id="table-payment-history">
          <thead>
            <tr>
              <th><Translate id="text_date" /></th>
              <th><Translate id="text_amount" /></th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.loading ?
                <tr>
                  <td colSpan={3} style={{padding: 30, textAlign: "center"}}><Spin /></td>
                </tr>
              :
                this.props.data.length ? this.props.data.map((payment, index) => 
                  <tr title={`${stringTranslate("text_double_to_edit_payment", this.props.locale)}`}>
                    <td>{this.util.formatDate(payment.paidDate)}</td>
                    <td>{this.util.formatCurrency(payment.amount)}</td>
                  </tr>
                )
                :
                <tr>
                  <td colSpan={3} style={{padding: 30, textAlign: "center"}}>
                    <Translate id="no_payment_history" />
                  </td>
                </tr>
            }
          </tbody>
          {
            this.props.data.length ?
              <tfoot>
                <tr>
                  <td style={{textAlign: "right", paddingRight: 15}}><Translate id="text_total" /></td>
                  <td>{this.util.formatCurrency(this.getTotalPaid(this.props.data))}</td>
                </tr>
              </tfoot>
            : null
          }
          
        </table>
      </Drawer>
    );
  }
}