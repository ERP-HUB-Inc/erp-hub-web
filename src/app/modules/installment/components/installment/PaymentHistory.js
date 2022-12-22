import React from "react";
import {Translate} from "react-localize-redux";
import {
  Drawer,
  Button,
  Table,
  Icon
} from "antd";
import Util from "../../../common/util";

export default class PaymentHistory extends React.PureComponent {
  state = {
    visible: false
  }

  handleEditPayment(id) {

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
        className="drawer-payment-history"
        onClose={this.onCloseDrawer}
      >
        <Table 
          rowKey="id"
          columns={[
            {
              title: <Translate id="text_payment_date" />,
              dataIndex: "paidDate",
              key: "paidDate",
              render: (paidDate) => Util.prototype.formatDate(paidDate)
            },
            {
              title: <Translate id="text_amount" />,
              dataIndex: "amount",
              key: "amount",
              render: (amount) => Util.prototype.formatCurrency(amount)
            },
            {
              title: <Translate id="text_action" />,
              dataIndex: "id",
              key: "id",
              render: (id) => {
                return <Button onClick={() => this.handleEditPayment(id)}>
                  <Icon type="edit" /> <Translate id="text_edit" />
                </Button>;
              }
            }
          ]}
          dataSource={this.props.data}
          loading={this.props.loading}
        />
      </Drawer>
    );
  }
}