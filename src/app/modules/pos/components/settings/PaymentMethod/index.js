import React from "react";
import Component from "../../Component";
import columns from "./column";
import PaymentMethod from "../../../action/settings/paymentMethod";

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: []
    };
    this.onChange = this.onChange.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(PaymentMethod.fetchPaymentMethods(this.pageSize));
  }

  onChange(pagination, filters, sorter) {
    const { dispatch } = this.props;
    const filter = [
      this.pageSize,
      (pagination.current - 1) * this.pageSize,
      sorter.field,
      this.sortOrder(sorter.order)
    ];
    dispatch(PaymentMethod.fetchPaymentMethods(...filter));
  }

  confirm() {
    const { dispatch } = this.props;
    dispatch(PaymentMethod.archivePaymentMethods(1234));
    this.Message.info("Click on Yes." + this.state.selectedRowKeys);
  }

  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys
        });
        console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
      }
    };

    const pagination = {
      total: this.props.paymentMethods.total,
      pageSize: this.props.paymentMethods.limit
    };

    return (
      <div>
        <this.Table
          rowSelection={rowSelection}
          dataSource={this.props.paymentMethods.data}
          columns={columns}
          pagination={pagination}
          onChange={this.onChange} 
          loading={this.props.fetching}/>
      </div>
    );
  }
}