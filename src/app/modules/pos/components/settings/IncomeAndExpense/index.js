import React from "react";
import columns from "./column";
import List from "../../List";

export default class IncomeAndExpenseList extends List {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(pagination, filters, sorter) {
    console.log("params", pagination, filters, sorter);
  }

  render() {
    return (
      <div>
        <this.Table columns={columns} dataSource={this.props.paymentMethods.data} onChange={this.onChange} loading={this.props.fetching}/>
      </div>
    );
  }
}