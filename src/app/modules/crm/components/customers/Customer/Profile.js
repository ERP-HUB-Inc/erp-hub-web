import React from "react";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
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
  Table
} from "antd";
import CustomerService from "../../../services/customers/CustomerService";
import InvoiceService from "../../../../pos/services/transactions/InvoiceService";
import { Button } from "../../../../common/elements/ant-ui";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";

const {TabPane} = Tabs;

class Profile extends React.Component {
  state = {
    detail: {},
    ordersHistory: [],
    loading: false
  }
  util = new Util();
  
  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({loading: true});
    CustomerService.detail(id)
    .then(response => {
      this.setState({detail: response.data.data});
    })
    .finally(() => this.setState({loading: false}));

    InvoiceService.lists(1000, 0, "", "", JSON.stringify({customerId: id}))
    .then(response => {
      console.log("response", response);
      this.setState({ordersHistory: response.data});
    });
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
        <Row gutter={24} style={{paddingLeft: 24}}>
          <Col md={6}>
            <Card className="customer-profile-card">
              <div style={{textAlign: "center", paddingTop: 15}}>
                <div className="profile-avatar">
                  {detail.firstName.substring(0, 1)}
                  {detail.lastName ? detail.lastName.substring(0, 1) : detail.firstName.substring(1, 1)}
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
              <Tabs defaultActiveKey="1">
                <TabPane style={{textTransform: "capitalize"}} tab={<Translate id="text_order_history" />} key="1">
                  <OrderHistory ordersHistory={this.state.ordersHistory} />
                </TabPane>
                <TabPane style={{textTransform: "capitalize"}} tab={<Translate id="text_loyalty_program" />} key="2">
                  <LoyaltyProgram detail={detail} />
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
          extra={<Button type="info" onClick><Translate id="text_back" /></Button>}
        />
        }
      </div>
      :
      <div style={{width: 30, margin: "0 auto", paddingTop: 30}}><Spin /></div>
    );
  }
}

function OrderHistory(props) {
  const util = new Util();

  function getTotalSpent() {
    const {ordersHistory} = props;
    let total = 0;
    if (ordersHistory.data && ordersHistory.data.length) {
      ordersHistory.data.forEach(order => {
        total += Number(order.total);
      });
    }

    return total;
  }

  function getTotalCredit() {
    const totalOrder = getTotalSpent();
    const {ordersHistory} = props;
    let total = 0;
    let totalTender = 0;
    
    if (ordersHistory.data && ordersHistory.data.length) {
      ordersHistory.data.forEach(order => {
        totalTender += Number(order.tenderBank) + Number(order.tenderCash);
      });
    }
    total = totalOrder - totalTender;
    return total;
  }

  return (
    <div>
      <Row gutter={25} style={{padding: "3px 20px"}}>
        <Col span={8}>
          <Card>
            <Statistic
              style={{padding: 15}}
              title={<Translate id="text_total_spent" />}
              value={getTotalSpent()}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              style={{padding: 15}}
              title={<Translate id="text_total_credit" />}
              value={getTotalCredit()}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
      </Row>
      <Row style={{padding: "3px 20px 2px 20px"}}>
        <Col md={24}>
        <Table
          rowKey="id"
          columns={[
            {
              title: <Translate id="text_date" />,
              dataIndex: "invoiceDate",
              key: "invoiceDate",
              render: (invoiceDate) => invoiceDate ? util.formatDate(invoiceDate) : ""
            },
            {
              title: <Translate id="text_status" />,
              dataIndex: "status",
              key: "status"
            },
            {
              title: <Translate id="text_invoice_no" />,
              dataIndex: "invoiceNumber",
              key: "invoiceNumber"
            },
            {
              title: <Translate id="text_sub_total" />,
              dataIndex: "totalExcludeTax",
              key: "totalExcludeTax",
              render: (totalExcludeTax) => util.formatCurrency(totalExcludeTax)
            },
            {
              title: <Translate id="text_discount" />,
              dataIndex: "discount",
              key: "discount",
              render: (discount) => util.formatCurrency(discount)
            },
            {
              title: <Translate id="text_vat" />,
              dataIndex: "total",
              key: "vat",
              render: (total, row) => util.formatCurrency(total - row.totalExcludeTax)
            },
            {
              title: <Translate id="text_grand_total" />,
              dataIndex: "total",
              key: "total",
              render: (total) => util.formatCurrency(total)
            }
          ]}
          bordered
          dataSource={props.ordersHistory.data}
        />
        </Col>
      </Row>

    </div>
  );
}

function LoyaltyProgram(props) {
  return (
    <div>
      <Row gutter={25} style={{padding: "3px 20px"}}>
        <Col md={8}>
          <Card>
            <Statistic
              title={<Translate id="text_redeemed_point" />}
              value={300}
              style={{padding: 15}}
            />
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Statistic
              title={<Translate id="text_available_point" />}
              value={props.detail.rewardPoint}
              style={{padding: 15}}
            />
          </Card>
        </Col>
      </Row>
      <Row style={{padding: "3px 20px 20px 20px"}}>
        <Col md={16}>
          <Table
            rowKey="id"
            style={{paddingRight: 8}}
            columns={[
              {
                title: <Translate id="text_gift_name" />,
                dataIndex: "name",
                key: "name"
              },
              {
                title: <Translate id="text_action" />,
                dataIndex: "id",
                key: "action",
                render: (id) => <Button><Translate id="text_redeem" /></Button>
              }
            ]}
            bordered
            dataSource={props.gifts}
            pagination={false}
          />
        </Col>
      </Row>
    </div>
  );
}

LoyaltyProgram.defaultProps = {
  gifts: [
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