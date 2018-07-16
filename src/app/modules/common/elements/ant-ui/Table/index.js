import React from "react";
import { Table } from "antd";

export class CTable extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Table
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        pagination={this.props.pagination}
        loading={this.props.loading}
        onChange={this.props.onChange}
        total={10}
      />
    );
  }

}
