import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormProductLog extends Modal {
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
        title: <this.Translate id="col_product_log_name" />,
        dataIndex: "name",
        key: "name"
      },
      {
        title: <this.Translate id="col_product_log_description" />,
        dataIndex: "description",
        key: "description"
      }
    ];
  }
  render() {
    const {productLog} = this.props; 
    return (
      <this.Col md="12">
        <this.Table
          dataSource={productLog.list}
          columns={this.columns}
          loading={productLog.fetching}
          locale={{emptyText: <this.Translate id="placeholder_table_product_log" />}} />
      </this.Col>
    );
  }
}