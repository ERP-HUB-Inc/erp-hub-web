import React from "react";
import {Table} from "antd";
import "./index.css";

export class CTable extends React.Component {
  render() {
    return (
      <Table
        bordered={this.props.bordered}
        rowKey={record => record[this.props.rowKey]}
        rowClassName={this.props.rowClassName}
        rowSelection={this.props.rowSelection}
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        pagination={false}
        loading={this.props.loading}  
        onChange={this.props.onChange}
        onRow={this.props.onRow}
        locale={this.props.locale}
        footer={this.props.footer}/>
    );
  }
}

CTable.defaultProps = {
  rowKey: "id"
};

export class TableExpand extends React.Component {
  render() {
    return (
      <Table
        bordered={this.props.bordered}
        rowKey={record => record.id}
        rowClassName={this.props.rowClassName}
        expandedRowRender={this.props.expandedRowRender}
        rowSelection={this.props.rowSelection}
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        pagination={false}
        loading={this.props.loading}  
        onChange={this.props.onChange}
        onRow={this.props.onRow}
        locale={this.props.locale}/>
    );
  }
}

export class SubTable extends React.Component {
  render() {
    return (
      <Table
        rowKey={record => record.id}
        rowClassName={this.props.rowClassName}
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        pagination={false}
        showHeader={false}
        locale={this.props.locale}/>
    );
  }
}

