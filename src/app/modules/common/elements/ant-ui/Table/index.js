import React, { Component } from "react";
import { Table } from "antd";
import reqwest from "reqwest";

// const data = [{
//   key: "1",
//   name: "John Brown",
//   age: 32,
//   address: "New York No. 1 Lake Park",
// }, {
//   key: "2",
//   name: "Joe Black",
//   age: 42,
//   address: "London No. 1 Lake Park",
// }, {
//   key: "3",
//   name: "Jim Green",
//   age: 32,
//   address: "Sidney No. 1 Lake Park",
// }, {
//   key: "4",
//   name: "Jim Red",
//   age: 32,
//   address: "London No. 2 Lake Park",
// }];

const columns = [{
  title: "Name",
  dataIndex: "name",
  sorter: true,
  render: name => `${name.first} ${name.last}`,
  width: "20%",
}, {
  title: "Gender",
  dataIndex: "gender",
  filters: [
    { text: "Male", value: "male" },
    { text: "Female", value: "female" },
  ],
  width: "20%",
}, {
  title: "Email",
  dataIndex: "email",
}];

const pagination = { position: "both" };

export class CTable extends React.Component {
  
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
      pagination: pager,
    });
    console.log("field",sorter.field);
    console.log("Filter:", filters);
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
    
  }

  fetch (params = {}) {
    console.log("params:", params);
    this.setState({ loading: true });
    reqwest({
      url: "https://randomuser.me/api",
      method: "get",
      data: {
        results: 10,
        ...params,
      },
      type: "json",
    }).then((data) => {
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 200;
      this.setState({
        loading: false,
        data: data.results,
        pagination,
      });
    });
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    return (
      <Table
        columns={columns}
        rowKey={record => record.login.uuid}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
    );
  }

}
