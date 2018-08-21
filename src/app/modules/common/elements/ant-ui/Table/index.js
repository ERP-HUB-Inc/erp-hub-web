import React from "react";
import { Table } from "antd";
import "./index.css";

export class CTable extends React.Component {
  render() {
    return (
      <Table
        rowSelection={this.props.rowSelection}
        expandedRowRender={this.props.expandedRowRender}
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        pagination={this.props.pagination}
        loading={this.props.loading}  
        onChange={this.props.onChange}
        onRow={this.props.onRow}
        scroll={this.props.scroll}
        locale={this.props.locale}
        showHeader={this.props.showHeader}
      />
    );
  }

}
