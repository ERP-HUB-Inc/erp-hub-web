import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormCostLog extends Modal {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: <this.Translate id="col_product_cost_log_date" />,
        dataIndex: "createdAt",
        width: 200,
        key: "createdAt"
      },
      {
        title: <this.Translate id="col_product_cost_log_user" />,
        dataIndex: "user",
        key: "user",
        render: user => user !== null ? user.userName : this.emptyText
      },
      {
        title: <this.Translate id="col_product_cost_log_po_number" />,
        dataIndex: "purchaseOrder",
        key: "purchaseOrder",
        render: purchaseOrder => purchaseOrder !== null ? purchaseOrder.number : this.emptyText
      },
      {
        title: <this.Translate id="col_product_cost_log_cost" />,
        dataIndex: "cost",
        key: "cost",
        render: cost => this.formatCurrency(cost)
      }
    ];
  }
  render() {
    const {productCostLog} = this.props; 
    return (
      <this.Col md="12">
        <this.Table
          dataSource={productCostLog.list}
          columns={this.columns}
          loading={productCostLog.fetching}
          locale={{emptyText: <this.Translate id="placeholder_table_product_cost_log" />}} />
      </this.Col>
    );
  }
}