import React from "react";
import {Table} from "antd";
import "./index.css";

export class CTable extends React.Component {
  render() {
    return (
      <Table
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

export class TableExpand extends React.Component {
  render() {
    return (
      <Table
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
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        pagination={false}
        showHeader={false}
        locale={this.props.locale}
      />
    );
  }
}

