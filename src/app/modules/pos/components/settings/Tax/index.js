import React from "react";
import Component from "../../Component";
import columns from "./column";

export default class List extends Component {
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
        <this.Table 
          columns={columns} 
          dataSource={this.props.tax.data} 
          onChange={this.onChange} 
          loading={this.props.fetching}
        />
      </div>
    );
  }
}