import React from "react";
import { Table } from "antd";
import reqwest from "reqwest";
import columns from "./column";
import "./index.css";

const pagination = { position: "both" };

export default class List extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination,
      loading: false,
    };
    this.handleTableChange = this.handleTableChange.bind(this);
  }
  
  handleTableChange (pagination, filters, sorter)  {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
    
  }

  fetch (params = {}) {
    this.setState({ loading: true });
    reqwest({
      url: "https://randomuser.me/api",
      method: "get",
      data: {
        results: 10,
        page:2,
        ...params,
      },
      type: "json",
    }).then((data) => {

      const pagination = { ...this.state.pagination };

      pagination.total = data.totalCount;
      pagination.total = 200;

      this.setState({
        loading: false,
        data: data.results,
        pagination,
        total: 200
      });
    });
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === "Disabled User", // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          total={10}
        />
      </div>
    );
  }

}
