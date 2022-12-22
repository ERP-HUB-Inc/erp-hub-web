import React from "react";
import {connect} from "react-redux";
import {
  Form,
  Row,
  Col,
  Icon,
  Pagination,
  Tag,
} from "antd";
import Enum from "../../enum";
import Component from "../../../common/components/Component";
import RepaymentService from "../../services/RepaymentService";
import history from "../../../common/router/history";

class RepaymentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      loading: false
    };
    this.REPAYMENT_STATUS_STR = {
      [Enum.REPAYMENT_STATUS.PENDING]: { title: "Pending", color: "#bfbfbf"},
      [Enum.REPAYMENT_STATUS.PAID]: { title: <this.Translate id="text_paid" />, color: "#52c41a"},
    };
    this.columns = [
      {
        title: <this.Translate id="text_customer" />,
        dataIndex: "firstName",
        key: "firstName",
        render: (firstName, record) => `${firstName} ${record.lastName}`
      },
      {
        title: <this.Translate id="text_phone_number" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber"
      },
      {
        title: <this.Translate id="text_received_date" />,
        dataIndex: "receiveDate",
        key: "receiveDate",
        width: 140,
        render: receiveDate => receiveDate && this.Util.formatDate(receiveDate, "DD/MM/YYYY")
      },
      {
        title: <this.Translate id="text_payment_date" />,
        dataIndex: "date",
        key: "date",
        render: date => this.Util.formatDate(date, "DD/MM/YYYY")
      },
      {
        title: <this.Translate id="text_duration" />,
        dataIndex: "duration",
        key: "duration",
        render: (duration, record) => `${duration} ${this.CATranslate(`text_${record.durationType.toLowerCase()}`, this.props.locale)}`
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "status",
        key: "status",
        width: 150,
        render: (status) => {
          const statusValue = this.REPAYMENT_STATUS_STR[status];
          const statusColor = statusValue.color;
          const stepTitle = statusValue.title;
          return <Tag color={statusColor} style={{width: 100, textAlign: "center"}}>{stepTitle}</Tag>;
        }
      },
      {
        title: <this.Translate id="text_amount" />,
        dataIndex: "payAmount",
        key: "payAmount",
        align: "right",
        render: payAmount => this.Util.formatCurrency(payAmount)
      },
      {
        title: <this.Translate id="text_balance" />,
        dataIndex: "balance",
        key: "balance",
        align: "right",
        render: balance => this.Util.formatCurrency(balance)
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "total",
        key: "total",
        align: "right",
        render: total => this.Util.formatCurrency(total)
      }
    ];
    this.pathname = "/installment/repayment/list";
    this.timer = null;
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("limit")) {
      this.pageSize = parseInt(params.get("limit"));
    }

    if (params.get("offset")) {
      this.setState({current: parseInt(params.get("offset"))});
    }

    if (params.get("search")) {
      this.props.form.setFieldsValue({search: params.get("search")});
    }

    if (params.get("date")) {
      this.props.form.setFieldsValue({date: params.get("date")});
    }

    this.fetchList(true);
  }

  fetchList(withPagination = false) {
    const params = new URLSearchParams(document.location.search);
    let limit = this.pageSize,
      offset = this.state.current,
      searchKey = "",
      date = "";

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    if (params.get("search")) {
      searchKey = params.get("search");
    }

    if (params.get("date")) {
      date = params.get("date");
    }

    offset = (offset - 1) * limit;
    if (!withPagination){
      offset = 0;
      params.delete("offset");
      this.setState({current: 1});
      this.Util.pushParamsToURL(this.pathname, params.toString());
    }

    this.setState({loading: true});
    RepaymentService.list(limit, offset, searchKey, null, date)
    .then(response => {
      this.setState({
        data: response.data.data,
        pagination: response.data.pagination
      });
    })
    .catch(err => console.log("error", err.response))
    .finally(() => this.setState({loading: false}));
  }

  handleSearch = (e) => {
    clearTimeout(this.timer);
    const value = e.target.value;
    const params = new URLSearchParams(document.location.search);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.timer = setTimeout(() => {
      this.fetchList();
    }, 600);
  }

  handleChangDate = (date) => {
    const params = new URLSearchParams(document.location.search);
    if (date) {
      params.set("date", this.Util.formatDateForMYSQL(date));
    } else {
      params.delete("date");
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onTableChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true);
  }

  renderPagination(pagination) {
    pagination = {
      total: pagination.total,
      pageSize: pagination.limit,
      current: this.state.current,
      pageSizeOptions: this.pageSizeOptions
    };

    const showTotal = total => {
      return `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`;
    };

    return( 
      pagination.total > 0 ?
        <div className="float-right">
          <Pagination 
            size="small" 
            showTotal={showTotal} 
            showSizeChanger
            defaultCurrent={this.state.current}
            defaultPageSize={this.pageSize}
            onShowSizeChange={this.onTableChange} 
            onChange={this.onTableChange} 
            {...pagination} />
        </div>
        :
        ""
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="content-list">
          <div style={{height: "100%", marginTop: 10}}>
            <div className="table-wrapper">
              <Row>
                <Col span={6} style={{marginBottom: 0}}>
                  <h3 style={{marginBottom: 0, fontWeight: 600}}><this.Translate id="text_repayment" /></h3>
                </Col>
                <Col span={18} style={{textAlign: "right", display: "flex", justifyContent: "flex-end"}}>
                  <this.InputText
                    name="search"
                    placeholder={this.CATranslate("text_search", this.props.locale)}
                    prefix={<Icon type="search" />}
                    style={{height: 32, width: 200, marginBottom: 0}}
                    allowClear={true}
                    onChange={this.handleSearch}
                    form={this.props.form}
                  />
                  <this.DatePickers 
                    name="date"
                    placeholder={`${this.CATranslate("text_date", this.props.locale)}`}
                    allowClear={true}
                    style={{width: 200, marginLeft: 15, marginBottom: 0}}
                    onChange={this.handleChangDate}
                    form={this.props.form}
                  />
                </Col>
              </Row>

              <this.Table 
                bordered={true}
                rowKey="id"
                loading={this.state.loading}
                columns={this.columns}
                onRow={record =>({
                  onDoubleClick:() => history.push(`/installment/detail/${record.installmentId}`)
                })}
                dataSource={this.state.data}
              />

              <div style={{marginTop: 15}}>
                {this.renderPagination(this.state.pagination)}
              </div>

              <this.clearFloating/>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const repaymentList =  Form.create(mapPropsToFields)(RepaymentList);
  
export default connect(mapStateToProps)(repaymentList);