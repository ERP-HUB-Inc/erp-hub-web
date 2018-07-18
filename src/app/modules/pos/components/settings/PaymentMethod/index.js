import React from "react";
import Component from "../../Component";
import columns from "./column";
import PaymentMethod from "../../../action/settings/paymentMethod";

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {},
      current: 0,
      selectedRowKeys: [],
      selectedListIds: []
    };
    this.onChange = this.onChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
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
    this.setState({current: pagination.current});
    dispatch(PaymentMethod.fetchPaymentMethods(...filter));
  }

  confirm() {
    const { dispatch } = this.props;

    dispatch(PaymentMethod.archivePaymentMethods(this.state.selectedListIds));

    this.Message.info("Success");

    dispatch(PaymentMethod.fetchPaymentMethods(this.pageSize, this.state.current));
    
    this.setState({selectedRowKeys: []});
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedListIds: this.mapSelectedListIds(selectedRows),
      selectedRowKeys
    });
  }

  render() {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange
    };

    const pagination = {
      total: this.props.paymentMethods.total,
      pageSize: this.props.paymentMethods.limit
    };

    return (
      <div>
        <this.Button type="primary" className="mg-right"><span className="icon-add icon-padding-right"></span>Add</this.Button>
        <this.Popconfirm placement="topLeft" title={this.confirmTextDelete} onConfirm={this.confirm} okText={this.okText} cancelText={this.cancelText}>
          <this.Button type="danger"><span className="icon-bin icon-padding-right"></span>Delete</this.Button>
        </this.Popconfirm>
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