import React from "react";
import moment from "moment";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { 
  PageHeader,
  Form,
  Row,
  Col,
  Card,
  Divider,
  Icon,
  Tabs,
  Result,
  Spin,
  Statistic,
  Table,
  Tag,
  Pagination
} from "antd";
import CustomerMicroService from "../../../services/customers/CustomerMicroService";
import RewardHistoryService from "../../../services/customers/RewardHistoryService";
import InvoiceService from "../../../../pos/services/transactions/InvoiceService";
import LoyaltyProgramService from "../../../../inventory/services/products/LoyaltyProgramService";
import QuotationService from "../../../../pos/services/transactions/QuotationService";
import SaleOrderService from "../../../../pos/services/transactions/SaleOrderService";
import { Button, DateRangePicker } from "../../../../common/elements/ant-ui";
import history from "../../../../common/router/history";
import {stringTranslate} from "../../../../common/helper/stringTranslate";
import EnumInvoice from "../../../../pos/enums";
import Util from "../../../../common/util";

const {TabPane} = Tabs;

class Profile extends React.Component {
  state = {
    detail: {},
    ordersHistory: [],
    rewards: [],
    rewardsHistory: [],
    loading: false,
    activeTab: 1,
    orderLoading: false
  }
  util = new Util();
  pathname = `/customer-profile/${this.props.match.params.id}`;
  
  componentDidMount() {
    const id = this.props.match.params.id;
    const params = new URLSearchParams(document.location.search);
    this.getDetailCustomer(id);

    LoyaltyProgramService.getReward(50)
    .then(response => {
      this.setState({
        rewards: response.data
      });
    });

    this.getRewardsPointHistory(id);

    if (params.get("active-tab")) {
      this.setState({activeTab: Number(params.get("active-tab"))});
    }
  }

  getDetailCustomer(id) {
    this.setState({loading: true});
    CustomerMicroService.detail(id)
    .then(response => {
      this.setState({detail: response.data.data});
    })
    .finally(() => this.setState({loading: false}));
  }

  getRewardsPointHistory(customerId) {
    RewardHistoryService.lists(customerId)
    .then(response => {
      this.setState({rewardsHistory: response.data});
    });
  }

  onChangeTab = (key) => {
    const params = new URLSearchParams(document.location.search);
    if (Number(key) === 1) {
      params.delete("active-tab");
    } else {
      params.set("active-tab", key);
    }
    params.delete("limit");
    params.delete("offset");
    this.util.pushParamsToURL(this.pathname, params.toString());
  }

  onAfterRedeem(id) {
    this.getDetailCustomer(id);
    this.getRewardsPointHistory(id);
    this.setState({activeTab: 2});
  }

  render() {
    const {detail} = this.state;
    return (
      !this.state.loading ?
      <div>
        <PageHeader
          style={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
          onBack={() => history.goBack()}
          title={<Translate id="text_customer_profile" />}
        />

        {Object.keys(detail).length ?
        <Row gutter={24} style={{paddingLeft: 24, display: "flex", paddingBottom: 20}}>
          <Col md={6}>
            <Card className="customer-profile-card">
              <div style={{textAlign: "center", paddingTop: 15}}>
                <div className="profile-avatar">
                  {detail.firstName && detail.firstName.substr(0, 1)}
                  {detail.lastName ? detail.lastName.substr(0, 1) : detail.firstName && detail.firstName.substr(1, 1)}
                </div>
                <h4>{detail.firstName} {detail.lastName}</h4>
                <span><Translate id="text_detail_dealer" /></span>
              </div>
              <Divider style={{marginBottom: 10}} />
              <div style={{paddingLeft: 16}}>
                <h6><Translate id="text_contact_detail" /></h6>
                <ul style={{listStyle: "none", padding: 0, marginTop: 13}}>
                  <li className="contact-list">
                    <div className="customer-contact-icon"><Icon type="mail" /></div>
                    <div>
                      <div><Translate id="text_email" /></div>
                      <div>{detail.email}</div>
                    </div>
                  </li>
                  <li className="contact-list">
                    <div className="customer-contact-icon"><Icon type="phone" /></div>
                    <div>
                      <div><Translate id="text_phone_number" /></div>
                      <div>{this.util.formatPhonenoWithCountryCode(detail.phoneNumber)}</div>
                    </div>
                  </li>
                  <li className="contact-list">
                    <div className="customer-contact-icon"><Icon type="environment" /></div>
                    <div>
                      <div><Translate id="text_address" /></div>
                      <div>{detail.address}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </Card>
          </Col>
          <Col md={18}>
            <Card className="customer-profile-card">
              <Tabs defaultActiveKey={`${this.state.activeTab}`} type="card" onChange={this.onChangeTab}>
                <TabPane style={{textTransform: "capitalize"}} tab={<Translate id="text_quotation" />} key="1">
                  <QuotationList 
                    customerId={detail.id}
                    locale={this.props.locale}
                    pathname={this.pathname}
                  />
                </TabPane>
                <TabPane style={{textTransform: "capitalize"}} tab={<Translate id="text_order_history" />} key="2">
                  <OrderHistory
                    locale={this.props.locale}
                    customerId={detail.id}
                    pathname={this.pathname}
                    form={this.props.form} />
                </TabPane>
                <TabPane style={{textTransform: "capitalize"}} tab={<Translate id="text_sale_order" />} key="3">
                  <SaleOrderList 
                    customerId={detail.id}
                    locale={this.props.locale}
                    pathname={this.pathname}
                  />
                </TabPane>
                <TabPane style={{textTransform: "capitalize"}} tab={<Translate id="text_loyalty_rewards" />} key="4">
                  <LoyaltyProgram 
                    detail={detail} 
                    rewards={this.state.rewards} 
                    onSuccess={() => this.onAfterRedeem(detail.id)} 
                    locale={this.props.locale} />
                </TabPane>
                <TabPane style={{textTransform: "capitalize"}} tab={<Translate id="text_reward_point_history" />} key="5">
                  <RewardPointHistory 
                    locale={this.props.locale} 
                    rewardsHistory={this.state.rewardsHistory} />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
        :
        <Result 
          status={404}
          title="404"
          subTitle="Customer not found"
          extra={<Button type="info" onClick={() => history.goBack()}><Translate id="text_back" /></Button>}
        />
        }
      </div>
      :
      <div style={{width: 30, margin: "0 auto", paddingTop: 30}}><Spin /></div>
    );
  }
}

function RenderPagination(props) {
  const {pagination, locale} = props;
  return (
    pagination.total ?
      <div className="float-right" style={{marginRight: 12, paddingBottom: 18}}>
        <Pagination 
          total={pagination.total}
          showTotal={(total) => `${stringTranslate("text_total", locale)} ${total} ${stringTranslate("text_records", locale)}`}
          pageSize={pagination.limit}
          current={props.offset}
          size="small"
          showSizeChanger
          pageSizeOptions={["10", "20", "40", "50"]}
          onShowSizeChange={props.onShowSizeChange}
          onChange={props.onChange}
        />
      </div>
    : <div />
  );
}

function OrderHistory(props) {
  const [data, setData] = React.useState([]);
  const [pagination, setPagination] = React.useState({});
  const [totalSpent, setTotalSpent] = React.useState(0);
  const [totalCredit, setTotalCredit] = React.useState(0);
  const [current, setCurrent] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const util = new Util();
  let limit = 50;
  const INVOICE_STATUS_STR = {
    [EnumInvoice.INVOICE_STATUS.DRAFT]: {title: <Translate id="text_draft" />, color: "#bfbfbf"},
    [EnumInvoice.INVOICE_STATUS.SENT]: {title: <Translate id="text_sent" />, color: "#1890ff"},
    [EnumInvoice.INVOICE_STATUS.PARTIAL]: {title: <Translate id="text_partial_pay" />, color: "#52c41a"},
    [EnumInvoice.INVOICE_STATUS.PAID]: {title: <Translate id="text_paid" />, color: "#52c41a"},
    [EnumInvoice.INVOICE_STATUS.VOID]: {title: <Translate id="text_void" />, color: "#d9d9d9"},
  };

  function fetchHistory() {
    let offset = current;
    let range = "";
    const params = new URLSearchParams(document.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    if (params.get("start")) {
      range = JSON.stringify({column: "invoiceDate", value: [params.get("start"), params.get("end")]});
    }

    offset = (offset - 1) * limit;
    setLoading(true);
    InvoiceService.lists(limit, offset, "", "", JSON.stringify({customerId: props.customerId}), "", range)
    .then(response => {
      setData(response.data.data);
      setPagination(response.data.pagination);
    })
    .finally(() => setLoading(false));
  }

  const onChangeDateFilter = dates => {
    const params = new URLSearchParams(document.location.search);
    if (dates.length) {
      params.set("start", moment(dates[0]).format("YYYY-MM-DD"));
      params.set("end", moment(dates[1]).format("YYYY-MM-DD"));
    } else {
      params.delete("start");
      params.delete("end");
    }

    util.pushParamsToURL(props.pathname, params.toString());
    fetchHistory();
  };

  const onChangePagination = (currentPage, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", currentPage);
    setCurrent(currentPage);
    util.pushParamsToURL(props.pathname, params.toString());
    fetchHistory(true);
  };

  React.useEffect(() => {
    CustomerMicroService.getTotalSpent(props.customerId)
    .then(response => {
      setTotalSpent(response.data && response.data.data.total);
    });

    CustomerMicroService.getTotalCredit(props.customerId)
    .then(response => {
      setTotalCredit(response.data && response.data.data.total);
    });

    const params = new URLSearchParams(document.location.search);
    if (params.get("offset")) {
      setCurrent(Number(params.get("offset")));
    }

    fetchHistory();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Row gutter={25} style={{padding: "3px 20px"}}>
        <Col span={12}>
          <Card>
            <Statistic
              style={{padding: 15}}
              title={<Translate id="text_total_spent" />}
              value={util.floor(totalSpent)}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              style={{padding: 15}}
              title={<Translate id="text_total_credit" />}
              value={util.floor(totalCredit)}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={25} style={{padding: "13px 20px 0"}}>
        <Col md={8}>
          <DateRangePicker
            name="dates"
            onChange={onChangeDateFilter}
            style={{marginBottom: 0}}
            key={1}
            form={props.form} />
        </Col>
      </Row>
      <Row style={{padding: "0px 20px 2px 20px"}}>
        <Col md={24}>
        <Table
          rowKey="id"
          style={{marginTop: -10, paddingBottom: 15}}
          rowClassName="customer-order-history-table-row"
          columns={[
            {
              title: <Translate id="text_date" />,
              dataIndex: "invoiceDate",
              key: "invoiceDate",
              render: (invoiceDate) => invoiceDate ? util.formatDate(invoiceDate, "DD/MM/YYYY") : ""
            },
            {
              title: <Translate id="text_status" />,
              dataIndex: "status",
              key: "status",
              filters: [
                {text: <Translate id="text_draft" />, value: EnumInvoice.INVOICE_STATUS.DRAFT},
                {text: <Translate id="text_sent" />, value: EnumInvoice.INVOICE_STATUS.SENT},
                {text: <Translate id="text_partial_pay" />, value: EnumInvoice.INVOICE_STATUS.PARTIAL},
                {text: <Translate id="text_paid" />, value: EnumInvoice.INVOICE_STATUS.PAID},
                {text: <Translate id="text_void" />, value: EnumInvoice.INVOICE_STATUS.VOID}
              ],
              onFilter: (value, record) => record.status === value,
              locale: {
                filterConfirm: stringTranslate("text_ok", props.locale),
                filterReset: stringTranslate("text_reset", props.locale)
              },
              render: (status) => {
                if(status || status >= 0){
                  const statusValue = INVOICE_STATUS_STR[status];
                  const statusColor = statusValue.color;
                  const statusTitle = statusValue.title;
                  return <Tag color={statusColor} style={{width: 100, textAlign: "center", margin: 0}}>{statusTitle}</Tag>;
                }
              }
            },
            {
              title: <Translate id="text_invoice_no" />,
              dataIndex: "invoiceNumber",
              key: "invoiceNumber",
              className: "invoice-number-column",
              render: (invoiceNumber, row) => <Link to={`/transactions/detail-invoice/${row.id}`}>{invoiceNumber}</Link>
            },
            {
              title: <Translate id="text_sub_total" />,
              dataIndex: "totalExcludeTax",
              key: "totalExcludeTax",
              align: "right",
              render: (totalExcludeTax) => util.formatCurrency(totalExcludeTax)
            },
            {
              title: <Translate id="text_discount" />,
              dataIndex: "discount",
              key: "discount",
              align: "right",
              render: (discount) => util.formatCurrency(discount)
            },
            {
              title: <Translate id="text_vat" />,
              dataIndex: "total",
              key: "vat",
              align: "right",
              render: (total, row) => util.formatCurrency(total - row.totalExcludeTax)
            },
            {
              title: <Translate id="text_grand_total" />,
              dataIndex: "total",
              key: "total",
              align: "right",
              render: (total, row) => util.formatCurrency(total - row.discount)
            }
          ]}
          pagination={false}
          bordered
          dataSource={data}
          loading={loading}
        />
        </Col>
      </Row>

      <RenderPagination 
        pagination={pagination}
        locale={props.locale}
        offset={current}
        onShowSizeChange={onChangePagination}
        onChange={onChangePagination} />
    </div>
  );
}

function LoyaltyProgram(props) {
  const util = new Util();

  function handleRedeemPoint(id) {
    const data = {
      rewardId: id,
      customerId: props.detail.id
    };
    RewardHistoryService.create(data)
    .then(() => {
      util.sweetAlertMessageV2(
        stringTranslate("text_congratulation", props.locale),
        stringTranslate("text_you_got_this_gift", props.locale),
        "success",
        stringTranslate("text_ok", props.locale)
      );
      props.onSuccess();
    })
    .catch(err => {
      const error = err.response && err.response.data && err.response.data.error;
      if (error && error.message) {
        let message = "Internal Server Error!";
        if (error.code === 403) {
          message = stringTranslate("text_not_enough_point", props.locale);
        }
        util.sweetAlertMessageV2(stringTranslate("text_sorry", props.locale), message, "error");
      }
    });
  }

  return (
    <div>
      <Row gutter={25} style={{padding: "3px 20px"}}>
        <Col md={12}>
          <Card>
            <Statistic
              title={<Translate id="text_redeemed_point" />}
              value={Number(props.detail.redeemedPoint)}
              style={{padding: 15}}
            />
          </Card>
        </Col>
        <Col md={12}>
          <Card>
            <Statistic
              title={<Translate id="text_available_point" />}
              value={Number(props.detail.rewardPoint)}
              style={{padding: 15}}
            />
          </Card>
        </Col>
      </Row>
      <Row style={{padding: "3px 20px 20px 20px"}}>
        <Col md={24}>
          <Table
            rowKey="id"
            style={{paddingRight: 8}}
            columns={[
              {
                title: <Translate id="text_gift_name" />,
                dataIndex: "name",
                key: "name",
                width: "64%"
              },
              {
                title: <Translate id="text_cost" />,
                dataIndex: "cost",
                key: "cost",
                align: "right"
              },
              {
                title: <Translate id="text_action" />,
                dataIndex: "id",
                key: "action",
                render: (id) => <Button type="info" onClick={() => handleRedeemPoint(id)}>
                  <Translate id="text_redeem" />
                </Button>
              }
            ]}
            pagination={false}
            bordered
            dataSource={props.rewards.data}
          />
        </Col>
      </Row>
    </div>
  );
}

LoyaltyProgram.defaultProps = {
  loyaltyPrograms: [
    {
      id: "aaaaa",
      name: "Special gift"
    },
    {
      id: "bbbbb",
      name: "Smart Water"
    },
    {
      id: "ccccc",
      name: "New Year reward"
    }
  ]
};

function RewardPointHistory(props) {
  const util = new Util();
  return (
    <div>
      <Row gutter={25} style={{padding: "0px 20px 20px 20px"}}>
        <Col md={24}>
          <Table
            style={{marginTop: -11}}
            rowKey={((row, index) => index)}
            columns={[
              {
                title: <Translate id="text_date" />,
                dataIndex: "createAt",
                key: "date",
                render: (createdAt) => util.formatDate(createdAt, "DD/MM/YYYY")
              },
              {
                title: <Translate id="text_rewards" />,
                dataIndex: "name",
                key: "name"
              },
              {
                title: <Translate id="text_reward_cost" />,
                dataIndex: "cost",
                key: "cost",
                align: "right"
              }
            ]}
            dataSource={props.rewardsHistory.data}
          />
        </Col>
      </Row>
    </div>
  );
}

function QuotationList(props) {
  const [data, setData] = React.useState([]);
  const [pagination, setPagination] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [current, setCurrent] = React.useState(1);
  let limit = 50;

  function fetchQuotation() {
    let offset = current;
    const params = new URLSearchParams(document.location.search);
    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    offset = (offset - 1) * limit;
    setLoading(true);
    QuotationService.lists(limit, offset, "", "", JSON.stringify({customerId: props.customerId}))
    .then(response => {
      setData(response.data.data);
      setPagination(response.data.pagination);
    })
    .finally(() => setLoading(false));
  }

  const onChangePagination = (currentPage, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", currentPage);
    setCurrent(currentPage);
    Util.prototype.pushParamsToURL(props.pathname, params.toString());
    fetchQuotation(true);
  };

  React.useEffect(() => {
    const params = new URLSearchParams(document.location.search);

    if (params.get("offset")) {
      setCurrent(Number(params.get("offset")));
    }

    fetchQuotation();
    // eslint-disable-next-line
  }, []);

  const STATUS_STR = {
    [EnumInvoice.QUOTATION_STATUS.DRAFT]: {name: <Translate id="text_draft" />, color: "#d9d9d9"},
    [EnumInvoice.QUOTATION_STATUS.SENT]: {name: <Translate id="text_sent" />, color: "#108ee9"},
    [EnumInvoice.QUOTATION_STATUS.APPROVED]: {name: <Translate id="text_approved" />, color: "#87d068"},
    [EnumInvoice.QUOTATION_STATUS.CLOSED]: {name: <Translate id="text_closed" />, color: "#52c41a"}
  };

  return (
    <div>
      <Row gutter={25} style={{padding: "0 20px 20px 20px"}}>
        <Col md={24}>
          <Table
            rowKey={((row, index) => index)}
            columns={[
              {
                title: <Translate id="text_date" />,
                dataIndex: "quotationDate",
                key: "quotationDate",
                render: (quotationDate) => Util.prototype.formatDate(quotationDate)
              },
              {
                title: <Translate id="text_status" />,
                dataIndex: "status",
                key: "status",
                render: (status, record) => {
                  const quotation_status = {
                    name: STATUS_STR[Number(status)].name,
                    color: STATUS_STR[Number(status)].color
                  };
        
                  if (status === EnumInvoice.QUOTATION_STATUS.SENT && record.validDate && moment(moment(record.validDate).format("YYYY-MM-DD")).isBefore(moment(moment().format("YYYY-MM-DD")))) {
                    quotation_status.name = <Translate id="text_expired" />;
                    quotation_status.color = "#f5222d";
                  }
                  return status in STATUS_STR ? <Tag color={quotation_status.color} style={{width: 100, textAlign: "center", margin: 0}}>{quotation_status.name}</Tag> : "N/A";
                }
              },
              {
                title: <Translate id="text_quotation_no" />,
                dataIndex: "number",
                key: "number",
                className: "invoice-number-column",
                render: (number, record) => <Link to={`/transactions/quotation-detail/${record.id}`}>{number}</Link>
              },
              {
                title: <Translate id="text_sub_total" />,
                dataIndex: "totalExcludeTax",
                key: "subTotal",
                align: "right",
                render: (totalExcludeTax) => Util.prototype.formatCurrency(totalExcludeTax)
              },
              {
                title: <Translate id="text_discount" />,
                dataIndex: "discount",
                key: "discount",
                align: "right",
                render: (discount) => Util.prototype.formatCurrency(discount)
              },
              {
                title: <Translate id="text_vat" />,
                dataIndex: "totalExcludeTax",
                key: "totalExcludeTax",
                align: "right",
                render: (totalExcludeTax, record) => Util.prototype.formatCurrency(record.total - totalExcludeTax)
              },
              {
                title: <Translate id="text_total" />,
                dataIndex: "total",
                key: "total",
                align: "right",
                render: (total, record) => Util.prototype.formatCurrency(total - Util.prototype.floor(record.discount))
              }
            ]}
            loading={loading}
            dataSource={data}
            pagination={false}
            style={{marginTop: -11}}
          />
        </Col>
      </Row>

      <RenderPagination 
        pagination={pagination}
        locale={props.locale}
        offset={current}
        onShowSizeChange={onChangePagination}
        onChange={onChangePagination} />
    </div>
  );
}

function SaleOrderList(props) {
  const [data, setData] = React.useState([]);
  const [pagination, setPagination] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [current, setCurrent] = React.useState(1);
  let limit = 50;
  const STATUS_STR = {
    [EnumInvoice.SALE_ORDER_STATUS.DRAFT]: { title: <Translate id="text_draft" />, color: "#bfbfbf" },
    [EnumInvoice.SALE_ORDER_STATUS.CONFIRMED]: { title: <Translate id="text_confirm" />, color: "#1890ff" },
    [EnumInvoice.SALE_ORDER_STATUS.CLOSED]: { title: <Translate id="text_closed" />, color: "#f50"},
    [EnumInvoice.SALE_ORDER_STATUS.VOID]: {title: <Translate id="text_void"/>, color: "#d9d9d9"}
  };

  function fetchSaleOrders() {
    let offset = current;
    const params = new URLSearchParams(document.location.search);
    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    offset = (offset - 1) * limit;
    setLoading(true);
    SaleOrderService.lists(limit, offset, "", "", JSON.stringify({customerId: props.customerId}))
    .then(response => {
      setData(response.data.data);
      setPagination(response.data.pagination);
    })
    .finally(setLoading(false));
  }

  const onChangePagination = (currentPage, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", currentPage);
    setCurrent(currentPage);
    Util.prototype.pushParamsToURL(props.pathname, params.toString());
    fetchSaleOrders();
  };

  React.useEffect(() => {
    fetchSaleOrders();

    const params = new URLSearchParams(document.location.search);
    if (params.get("offset")) {
      setCurrent(Number(params.get("offset")));
    }

    //eslint-disable-next-line
  }, []);

  return (
    <div>
      <Row gutter={25} style={{padding: "0 20px 20px 20px"}}>
        <Col md={24}>
          <Table
            rowKey="id"
            columns={[
              {
                title: <Translate id="text_date" />,
                dataIndex: "registerDate",
                key: "registerDate",
                width: 140,
                render: (registerDate) => Util.prototype.formatDate(registerDate, "DD/MM/YYYY")
              },
              {
                title: <Translate id="text_status" />,
                dataIndex: "status",
                key: "status",
                width: 120,
                render: (status) => {
                  const statusValue = STATUS_STR[status];
                  const statusColor = statusValue.color;
                  const stepTitle = statusValue.title;
                  return <Tag color={statusColor} style={{width: 100, textAlign: "center"}}>{stepTitle}</Tag>;
                }
              },
              {
                title: <Translate id="text_sale_order_no" />,
                dataIndex: "number",
                key: "number",
                className: "invoice-number-column",
                render: (number, record) => <Link to={`/transactions/sale-order/detail/${record.id}`}>{number}</Link>
              },
              {
                title: <Translate id="text_expected_shipment_date" />,
                dataIndex: "expectedShipmentDate",
                key: "expectedShipmentDate",
                width: 200,
                render: (expectedShipmentDate) => Util.prototype.formatDate(expectedShipmentDate, "DD/MM/YYYY")
              },
              {
                title: <Translate id="text_total_items" />,
                dataIndex: "totalItem",
                key: "totalItem",
                align: "center",
                render: totalItem => totalItem
              },
              {
                title: <Translate id="text_deposit" />,
                dataIndex: "deposit",
                key: "deposit",
                align: "right",
                render: deposit => Util.prototype.formatCurrency(Number(deposit))
              },
              {
                title: <Translate id="text_sub_total" />,
                dataIndex: "totalExcludeTax",
                key: "totalExcludeTax",
                align: "right",
                render: (totalExcludeTax, record) => {
                  if (!totalExcludeTax) {
                    totalExcludeTax = record.total;
                  }
                  return Util.prototype.formatCurrency(totalExcludeTax);
                }
              },
              {
                title: <Translate id="text_vat" />,
                dataIndex: "tax",
                key: "tax",
                align: "right",
                render: (text, record) => {
                  if (!record.totalExcludeTax) record.totalExcludeTax = record.total;
                  return Util.prototype.formatCurrency(record.total - record.totalExcludeTax);
                }
              },
              {
                title: <Translate id="text_discount" />,
                dataIndex: "discount",
                key: "discount",
                align: "right",
                render: (discount, record) => Util.prototype.formatCurrency(discount)
              },
              {
                title: <Translate id="text_sale_total" />,
                dataIndex: "total",
                key: "totalSale",
                align: "right",
                render: (total, record) => {
                  total = total - Util.prototype.floor(Util.prototype.floor(record.discount));
                  if (total < 0) total = 0;
                  return Util.prototype.formatCurrency(total);
                }
              },
            ]}
            loading={loading}
            dataSource={data}
            bordered={true}
            pagination={false}
            style={{marginTop: -11}}
          />
        </Col>
      </Row>

      <RenderPagination 
        pagination={pagination}
        locale={props.locale}
        offset={current}
        onShowSizeChange={onChangePagination}
        onChange={onChangePagination} />
    </div>
  );
}

//Redux function
function mapStateToProps(state) {
  return {
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const profile = Form.create(mapPropsToFields)(Profile);

export default connect(mapStateToProps)(profile);