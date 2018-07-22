import React from "react";
import columns from "./column";
import List from "../../List";

export default class ReceiptTemplateList extends List {
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
        <this.Table columns={columns}  onChange={this.onChange} loading={this.props.fetching}/>
      </div>
    );
  }
}