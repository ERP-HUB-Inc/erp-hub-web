import React from "react";
import {Table} from "antd";
import "./index.css";

export class CTable extends React.Component {
  render() {
    return (
      <Table
        rowKey={record => record.id}
        rowSelection={this.props.rowSelection}
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        pagination={false}
        loading={this.props.loading}  
        onChange={this.props.onChange}
        onRow={this.props.onRow}
        locale={this.props.locale}
        // footer={() => "Total Amount"}
      />
    );
  }
}

export class TableExpand extends React.Component {
  render() {
    return (
      <Table
        rowKey={record => record.id}
        expandedRowRender={this.props.expandedRowRender}
        rowSelection={this.props.rowSelection}
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        pagination={false}
        loading={this.props.loading}  
        onChange={this.props.onChange}
        onRow={this.props.onRow}
        locale={this.props.locale}
      />
    );
  }
}

export class SubTable extends React.Component {
  render() {
    return (
      <Table
        rowKey={record => record.id}
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        pagination={false}
        showHeader={false}
        locale={this.props.locale}
      />
    );
  }
}

