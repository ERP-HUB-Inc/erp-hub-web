import React from "react";
import { Table } from "antd";
import "./index.css";

export class CTable extends React.Component {
  render() {
    return (
      <Table
        rowSelection={this.props.rowSelection}
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        pagination={this.props.pagination}
        loading={this.props.loading}
        onChange={this.props.onChange}
        onRow={this.props.onRow}
        scroll={this.props.scroll}
      />
    );
  }

}
