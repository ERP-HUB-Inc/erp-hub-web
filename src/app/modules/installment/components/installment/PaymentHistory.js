import React from "react";
import {
  Drawer,
  Button
} from "antd";
import { Translate } from "react-localize-redux";
import Util from "../../../common/util";

export default class PaymentHistory extends React.PureComponent {
  state = {
    visible: false
  }

  onShowDrawer = () => {
    this.setState({visible: true});
  }

  onCloseDrawer = () => {
    this.setState({visible: false});
  }

  render() {
    return (
      <Drawer 
        title="Payment history"
        width={600}
        visible={this.state.visible}
        onClose={this.onCloseDrawer}
      >
        <table border="1" style={{width: "100%", borderCollapse: "collapse", marginTop: -10}}>
          <thead>
            <tr>
              <th><Translate id="text_payment_date" /></th>
              <th><Translate id="text_amount" /></th>
              <th><Translate id="text_action" /></th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.data.length && this.props.data.map((payment, index) => 
                <tr>
                  <td>{Util.prototype.formatDate(payment.paidDate)}</td>
                  <td>{Util.prototype.formatCurrency(payment.paidAmount)}</td>
                  <td>
                    <Button>
                      <Translate id="text_edit" />
                    </Button>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </Drawer>
    );
  }
}