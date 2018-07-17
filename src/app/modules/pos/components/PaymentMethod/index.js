import React from "react";
import Component from "../Component";
import columns from "./column";
import PaymentMethod from "../../action/paymentMethod";

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
    this.Message.info('Click on Yes.' + this.state.selectedRowKeys);
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
        <this.Popconfirm placement="topLeft" title={this.confirmTextDelete} onConfirm={this.confirm} okText={this.okText} cancelText={this.cancelText}>
          <this.Button type="danger"><span class="icon-bin icon-padding-right"></span>Delete</this.Button>
        </this.Popconfirm>
        <this.Table
          rowSelection={rowSelection} 
          columns={columns}
          dataSource={this.props.paymentMethods.data}
          loading={this.props.fetching} 
          onChange={this.onChange} 
          pagination={pagination}/>
      </div>
    );
  }
}