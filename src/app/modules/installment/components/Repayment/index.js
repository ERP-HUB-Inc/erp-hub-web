import React from "react";
import {connect} from "react-redux";
import moment from "moment";
import {
  Form,
  Row,
  Col,
  Pagination,
  Tag,
  Dropdown,
  Menu,
  Card,
  Statistic
} from "antd";
import Enum from "../../enum";
import Component from "../../../common/components/Component";
import RepaymentService from "../../services/RepaymentService";
import PaymentForm from "../installment/PaymentForm";
import InstallmentService from "../../services/InstallmentService";

class RepaymentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      summary: {},
      pagination: {},
      loading: false,
      showCustomerOverdue: false,
      detail: {}
    };
    this.REPAYMENT_STATUS_STR = {
      [Enum.REPAYMENT_STATUS.PENDING]: { title: <this.Translate id="text_pending" />, color: "#ffa940"},
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
        key: "phoneNumber",
        width: 300,
        render: (phoneNumber, record) => {
          const menu = (
            <Menu>
              <Menu.Item>
                <this.Link to={`/installment/detail/${record.installmentId}`}>
                  <this.Icon type="eye" style={{marginRight: 10}} /> <this.Translate id="text_view_detail" />
                </this.Link>
              </Menu.Item>
              <Menu.Item onClick={() => this.handlePayment(record)}>
                <this.Icon type="dollar" style={{marginRight: 10}} /> <this.Translate id="text_pay" />
              </Menu.Item>
              {
                record.status === Enum.REPAYMENT_STATUS.PAID ?
                  <Menu.Item onClick={() => this.handleEditPayment(record)}>
                    <this.Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_edit_payment" />
                  </Menu.Item>
                : null
              }
            </Menu>
          );
          return <div className="wrap-product-name" style={{display: "flex"}}>
            {phoneNumber}
            <Dropdown className="product-row-option" overlay={menu}>
              {/* eslint-disable-next-line */}
              <a className="ant-dropdown-link" href="#" onClick={e => e.preventDefault()} style={{marginLeft: 10}}>
                <this.Translate id="text_option" /> <this.Icon type="down" />
              </a>
            </Dropdown>
          </div>;
        }
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
        render: (status, record) => {
          const statusValue = this.REPAYMENT_STATUS_STR[status];
          let statusColor = statusValue.color;
          let statusTitle = statusValue.title;
          if (status === Enum.REPAYMENT_STATUS.PENDING && 
            moment(record.date).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")
          ) {
            statusColor = "#f5222d";
            statusTitle = `${this.CATranslate("text_expired_pay_date", this.props.locale)} (${this.getExpiredDate(record.date)} ${this.CATranslate("text_day", this.props.locale)})`;
          }
          return <Tag color={statusColor} style={{width: 120, textAlign: "center"}}>{statusTitle}</Tag>;
        }
      },
      {
        title: <this.Translate id="text_amount_to_pay" />,
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

    if (params.get("overdue-from")) {
      this.setState({showCustomerOverdue: true});
    }

    if (!params.toString()) {
      params.set("start", moment().format("YYYY-MM-DD"));
      params.set("end", moment().format("YYYY-MM-DD"));
      this.Util.pushParamsToURL(this.pathname, params.toString());
    }

    this.fetchList(true);
  }

  fetchList(withPagination = false) {
    const params = new URLSearchParams(document.location.search);
    let limit = this.pageSize,
      offset = this.state.current,
      searchKey = "",
      filter = {},
      dateRange = "";

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    if (params.get("search")) {
      searchKey = params.get("search");
    }

    if (params.get("overdue-filter")) {
      let overdueFilter = params.get("overdue-filter");
      if (overdueFilter === "custom") {
        overdueFilter = [params.get("overdue-from"), params.get("overdue-to")];
      }
      filter = JSON.stringify({overdue: overdueFilter});
    }

    if (params.get("start")) {
      dateRange = JSON.stringify({column: "date", value: [params.get("start"), params.get("end")]});
    }

    offset = (offset - 1) * limit;
    if (!withPagination){
      offset = 0;
      params.delete("offset");
      this.setState({current: 1});
      this.Util.pushParamsToURL(this.pathname, params.toString());
    }

    this.setState({loading: true});
    RepaymentService.list(limit, offset, searchKey, null, filter, dateRange)
    .then(response => {
      this.setState({
        data: response.data.data,
        pagination: response.data.pagination
      });
    })
    .catch(err => console.log("error", err.response))
    .finally(() => this.setState({loading: false}));

    RepaymentService.getSummary(searchKey, filter, dateRange)
    .then(response => {
      this.setState({summary: response.data.data});
    });
  }

  getExpiredDate(date) {
    let diff = moment(moment()).diff(moment(date), "days");
    return diff;
  }

  handlePayment(record) {
    const {detail} = this.state;
    detail.id = record.installmentId;
    InstallmentService.detail(record.installmentId)
    .then(response => {
      Object.assign(detail, response.data.data);
      detail.payment = {
        paymentScheduleId: record.id,
        amount: record.payAmount,
        paidDate: moment().format("YYYY-MM-DD"),
        disableSchedule: true
      };
      this.setState({detail}, () => {
        this.paymentRef.onShowDrawer();
      });
    });
  }

  handleEditPayment(record) {
    const {detail} = this.state;
    RepaymentService.detailSchedule(record.id)
    .then(response => {
      const data = response.data.data;
      detail.id = record.installmentId;
      detail.isEditPayment = true;
      detail.payment = {
        id: data.repaymentId,
        paymentScheduleId: data.id,
        amount: data.amount,
        paidDate: data.paidDate,
        disableSchedule: true
      };
      detail.paymentSchedule = [{
        id: record.id,
        date: record.date,
        payAmount: record.payAmount,
        balance: record.balance
      }];
      this.setState({detail}, () => {
        this.paymentRef.onShowDrawer();
      });
    });
  }

  handleAfterPayment = (id) => {
    console.log("updated");
    const params = new URLSearchParams(document.location.search);
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true);
    this.setState({detail: {}});
    this.paymentRef.onCloseDrawer();
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

  handleChangeOverFilter = (option) => {
    const params = new URLSearchParams(document.location.search);
    if (option) {
      params.delete("start");
      params.delete("end");
      this.props.form.setFieldsValue({dates: []});
      if (option === "custom") {
        params.set("overdue-filter", option);
        this.Util.pushParamsToURL(this.pathname, params.toString());
        return this.setState({showCustomerOverdue: true});
      } else {
        params.set("overdue-filter", option);
      }
    } else {
      params.delete("overdue-filter");
      params.delete("overdue-from");
      params.delete("overdue-to");
    }
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
    this.setState({showCustomerOverdue: false});
  }

  handleChangeOverdue = (dates) => {
    const params = new URLSearchParams(document.location.search);
    if (dates.length) {
      params.set("overdue-from", moment(dates[0]).format("YYYY-MM-DD"));
      params.set("overdue-to", moment(dates[1]).format("YYYY-MM-DD"));
    } else {
      params.delete("overdue-from");
      params.delete("overdue-to");
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  handleChangDate = (dates) => {
    const params = new URLSearchParams(document.location.search);
    if (dates.length) {
      params.set("start", moment(dates[0]).format("YYYY-MM-DD"));
      params.set("end", moment(dates[1]).format("YYYY-MM-DD"));
    } else {
      params.delete("start");
      params.delete("end");
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
    const {data, summary} = this.state;
    const params = new URLSearchParams(document.location.search);
    return (
      <React.Fragment>
        <div className="content-list">
          <div style={{height: "100%", marginTop: 10}}>
            <div className="table-wrapper">
              <Row>
                <Col span={6} style={{marginBottom: 0}}>
                  <h3 style={{marginBottom: 0, fontWeight: 600}}><this.Translate id="text_payment" /></h3>
                </Col>
                <Col span={18} style={{display: "flex", justifyContent: "flex-end"}}>
                  <this.InputText
                    name="search"
                    placeholder={this.CATranslate("text_search", this.props.locale)}
                    prefix={<this.Icon type="search" />}
                    style={{height: 32, width: 200, marginBottom: 0}}
                    allowClear={true}
                    data={params.get("search") ? params.get("search") : ""}
                    onChange={this.handleSearch}
                    form={this.props.form}
                  />
                  <this.Select
                    name="overdueFilter"
                    placeholder={`${this.CATranslate("text_overdue", this.props.locale)}`}
                    allowClear={true}
                    style={{marginBottom: 0, marginLeft: 15, width: 200}}
                    defaultValue={params.get("overdue-filter") ? params.get("overdue-filter") : null}
                    dataSource={[
                      {name: `7 ${this.CATranslate("text_day", this.props.locale)}`, value: "7days"},
                      {name: `15 ${this.CATranslate("text_day", this.props.locale)}`, value: "15days"},
                      {name: `30 ${this.CATranslate("text_day", this.props.locale)}`, value: "30days"},
                      {name: this.CATranslate("text_custom", this.props.locale), value: "custom"},
                    ]}
                    onChange={this.handleChangeOverFilter}
                    form={this.props.form}
                  />
                  {
                    this.state.showCustomerOverdue && 
                    <this.DateRangePicker
                      name="overdueRange"
                      placeholder={[this.CATranslate("text_start_date", this.props.locale), this.CATranslate("text_end_date", this.props.locale)]}
                      ranges={[]}
                      dateFormat="DD-MM-YYYY"
                      style={{width: 260, marginBottom: 0}}
                      defaultValue={params.get("overdue-from") ? [moment(params.get("overdue-from")), moment(params.get("overdue-to"))] : []}
                      onChange={this.handleChangeOverdue}
                      form={this.props.form}
                    />
                  }
                  <this.DateRangePicker 
                    name="dates"
                    placeholder={[this.CATranslate("text_start_date", this.props.locale), this.CATranslate("text_end_date", this.props.locale)]}
                    allowClear={true}
                    ranges={{
                      [`${this.CATranslate("text_today", this.props.locale)}`]: [moment(), moment()],
                      [`${this.CATranslate("text_this_week", this.props.locale)}`]: [moment().startOf("isoWeek"), moment().endOf("isoWeek")]
                    }}
                    defaultValue={params.get("start") ? [moment(params.get("start")), moment(params.get("end"))] : []}
                    dateFormat="DD-MM-YYYY"
                    style={{width: 260, marginLeft: 15, marginBottom: 0}}
                    onChange={this.handleChangDate}
                    form={this.props.form}
                  />
                </Col>
              </Row>

              <Row gutter={16} style={{marginTop: 9}}>
                <Col span={8}>
                  <Card>
                    <Statistic 
                      title={<this.Translate id="text_paid"/>}
                      value={summary && summary.paid}
                      valueStyle={{color: "#52c41a"}}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title={<this.Translate id="text_unpaid"/>}
                      value={summary && summary.unpaid}
                      valueStyle={{color: "#ffa940"}}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title={<this.Translate id="text_overdue"/>}
                      value={summary && summary.overdue}
                      valueStyle={{color: "#f5222d"}}
                    />
                  </Card>
                </Col>
              </Row>

              <this.Table 
                bordered={true}
                rowKey="id"
                loading={this.state.loading}
                columns={this.columns}
                dataSource={data}
              />

              <div style={{marginTop: 15}}>
                {this.renderPagination(this.state.pagination)}
              </div>

              <this.clearFloating/>

              <PaymentForm 
                ref={ref => this.paymentRef = ref}
                formData={this.state.detail}
                onSuccess={this.handleAfterPayment}
                onSuccessUpdate={this.handleAfterPayment}
                locale={this.props.locale}
                form={this.props.form} />
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