import React from "react";
import { Table } from "antd";
import reqwest from "reqwest";
import { Pagination } from "antd";


const columns = [{
  title: "Name",
  dataIndex: "name",
  sorter: true,
  render: name => `${name.first} ${name.last}`,
  filters: [
    { text: "jesus sanz", value: "jesus sanz" },
    { text: "liliosa da mota", value: "liliosa da mota" },
  ],
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
  
  // get value from column field
  handleTableChange (pagination, filters, sorter)  {
    console.log("pagination",pagination);
    console.log("sorter",sorter);
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
        results: 5,
        page:2,
        ...params,
      },
      type: "json",
    }).then((data) => {

      console.log("get data",data);

      const pagination = { ...this.state.pagination };
      // Read total count from server
      pagination.total = data.totalCount;
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
      <div>
        <Table
          columns={columns}
          // rowKey={record => record.login.uuid}
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
