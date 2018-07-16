import React from "react";
import Component from "../Component";
import columns from "./column";

export default class List extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    
  }

  onChange(pagination, filters, sorter) {
    console.log("params", pagination, filters, sorter);
  }

  render() {
    return (
      <this.Table columns={columns} dataSource={this.props.paymentMethods.data} onChange={this.onChange} loading={this.props.fetching}/>
    );
  }
}