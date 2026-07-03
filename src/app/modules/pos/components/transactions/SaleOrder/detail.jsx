import React from "react";
import moment from "moment";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { 
  PageHeader, 
  Spin, 
  Result,
  Menu,
  Dropdown,
  Divider,
  Icon,
  message,
  Form,
  Badge,
  Row,
  Col,
  Tabs
} from "antd";
import { Link } from "react-router-dom";
import { Button } from "../../../../common/elements/ant-ui";
import history from "../../../../common/router/history";
import Enum from "../../../enums";
import Util from "../../../../common/util";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import SaleOrderService from "../../../services/transactions/SaleOrderService";
import SaleOrderInvoice from "./Invoice";
import CAInvoice from "../Invoice/CAInvoice";
import PackingSlipTem from "./Invoice/packing-slip";
import DeliveryNote from "./Invoice/delivery-note";

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: "22px",
      marginBottom: 7,
      color: "rgba(0,0,0,0.65)",
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: "inline-block",
        color: "rgba(0,0,0,0.85)",
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

const tabs = {
  SALE_ORDER: 1,
  INVOICE: 2,
  PACKING_SLIP: 3,
  DELIVERY_NOTE: 4
};

class SaleOrderDetail extends React.PureComponent{
  state = {
    loading: false,
    formData: {},
    invoiceDetail: {},
    activeKey: 1,
    loadingTab: false
  }
  SALE_ORDER_STATUS_STR = {
    [Enum.SALE_ORDER_STATUS.DRAFT]: { title: stringTranslate("text_draft", this.props.locale), color: "#bfbfbf" },
    [Enum.SALE_ORDER_STATUS.CONFIRMED]: { title: stringTranslate("text_confirm", this.props.locale), color: "#1890ff" },
    [Enum.SALE_ORDER_STATUS.CLOSED]: { title: stringTranslate("text_closed", this.props.locale), color: "#f50"},
    [Enum.SALE_ORDER_STATUS.VOID]: {title: stringTranslate("text_void", this.props.locale), color: "#d9d9d9"}
  };
  util = new Util();

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({loading: true});
    SaleOrderService.detail(id)
    .then(response => this.setState({formData: response.data}))
    .catch(() => this.setState({formData: {}}))
    .finally(() => this.setState({loading: false}));
  }

  handleMakeAsConfirm(id) {
    SaleOrderService.markAsConfirm(id)
    .then(() => {
      message.success("Make confirm success");
      this.setState(preState => {
        preState.formData.status = Enum.SALE_ORDER_STATUS.CONFIRMED;
        return preState;
      });
    })
    .catch(() => message.error("Error!....."));
  }

  handleVoid(id) {
    this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
    .then(willVoid => {
      if (willVoid) {
        SaleOrderService.void(id)
        .then(() => message.success("Void success"))
        .catch(() => message.error("Error!......"));
      }
    });
  }

  handleDelete(id) {
    this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
    .then(willDelete => {
      if (willDelete) {
        SaleOrderService.delete(id)
        .then(() => {
          message.success("Delete invoice success");
          history.goBack();
        })
        .catch(() => message.error("Error!......"));
      }
    });
  }

  getInvoiceData = () => {
    const {invoiceDetail} = this.state;
    if (!Object.keys(invoiceDetail).length) {
      SaleOrderService.getInvoiceBySaleOrderId(this.state.formData.id)
      .then(response => {
        this.setState({invoiceDetail: response.data});
      });
    }
  } 

  onChangeTab = (key) => {
    key = parseInt(key);
    const id = this.props.match.params.id;
    if (key === tabs.INVOICE) {
      this.setState({loadingTab: true});
      SaleOrderService.getInvoiceBySaleOrderId(id)
      .then(response => {
        this.setState({invoiceDetail: response.data});
      })
      .finally(() => this.setState({loadingTab: false}));
    }
  }

  render() {
    const {formData} = this.state;

    return (
      <div style={{marginBottom: 25}}>
        <PageHeader
          style={{
            backgroundColor: "#f7f7f7",
            paddingLeft: 0,
            paddingRight: 0,
            position: "relative"
          }}
          onBack={() => history.goBack()}
          title={<Translate id="text_sale_order" />}
          subTitle={
            <div>
              {formData.number}
              {
                Object.keys(formData).length ?
                  <Badge count={this.SALE_ORDER_STATUS_STR[formData.status].title} style={{ backgroundColor: this.SALE_ORDER_STATUS_STR[formData.status].color}} />
                : null
              }
            </div>
          } 
          extra={[
            <Dropdown key={1} overlay={(
              <Menu>
                <Menu.Item key={3} onClick={() => history.push({pathname: `/transactions/sale-order/update/${formData.id}`})}>
                  <Icon type="edit" style={{marginRight: 10}} /> <Translate id="text_edit" />
                </Menu.Item>
                <Menu.Item key={4}>
                  <Link target="_blank" to={`/transactions/sale-order/create?id=${formData.id}&action=clone`} >
                    <Icon type="copy" style={{marginRight: 10}} /> <Translate id="text_clone" />
                  </Link>
                </Menu.Item>
                <Menu.Item key={2}>
                  <Link target="_blank" to={`/transactions/create-invoice?saleOrderId=${formData.id}&action=convertToInvoice`}>
                    <Icon type="retweet" style={{marginRight: 10}} /> <Translate id="text_convert_to_invoice" />
                  </Link>
                </Menu.Item>
                <Divider style={{marginTop: 4, marginBottom: 4}} />
                <Menu.Item key={1} onClick={() => this.handleMakeAsConfirm(formData.id)} disabled={formData.status === Enum.SALE_ORDER_STATUS.CLOSED ? true : false}>
                  <Icon type="check" style={{marginRight: 10}} /> <Translate id="text_mark_as_confirm" />
                </Menu.Item>
                <Divider style={{marginTop: 4, marginBottom: 4}} />
                <Menu.Item key={5} onClick={() => window.print()} title="Ctrl + P">
                  <Icon type="printer" style={{marginRight: 10}} />
                  <Translate id="text_print" />
                </Menu.Item>
                <Menu.Item key={6} onClick={() => window.print()} title="Ctrl + P">
                  <Icon type="file-protect" style={{marginRight: 10}} />
                  <Translate id="text_packing_slip" />
                </Menu.Item>
                <Menu.Item key={6} onClick={() => window.print()} title="Ctrl + P">
                  <Icon type="file-text" style={{marginRight: 10}} />
                  <Translate id="text_delivery_note" />
                </Menu.Item>
                <Divider style={{marginTop: 4, marginBottom: 4}} />
                <Menu.Item key={7} onClick={() => this.handleVoid(formData.id)}>
                  <Icon type="close" style={{marginRight: 10}} /> <Translate id="text_void" />
                </Menu.Item>
                <Menu.Item key={8} onClick={() => this.handleDelete(formData.id)}>
                  <Icon type="delete" style={{marginRight: 10}} /> <Translate id="text_delete" />
                </Menu.Item>
              </Menu>
            )}>
              <button className="ant-btn ant-dropdown-link" onClick={e => e.preventDefault()}>
                <Translate id="text_option" /> <Icon type="down" />
              </button>
            </Dropdown>
          ]}
        />

        {
          this.state.loading ?
            <div style={{width: 30, margin: "0 auto", paddingTop: 30}}>
              <Spin />
            </div>
          : 
          Object.keys(this.state.formData).length ?
            <React.Fragment>
              <div className="detail-invoice-description">
                <h5 style={{marginBottom: 30, lineHeight: 1.4}}><Translate id="text_sale_order_no" />: {formData.number}</h5>
                <Row>
                  <Col span={8}>
                    <DescriptionItem title={<Translate id="text_compnay" />} content={<Link to={`/customer-profile/${formData.customerId}`}>{formData.company}</Link>} />
                  </Col>
                  <Col span={8}>
                    <DescriptionItem title={<Translate id="text_customer_name" />} content={<Link to={`/customer-profile/${formData.customerId}`}>{formData.firstName} {formData.lastName}</Link>} />
                  </Col>
                  <Col span={8}>
                    <DescriptionItem title={<Translate id="text_phone_number" />} content={formData.phoneNumber} />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <DescriptionItem title="លេខអត្តសញ្ញាណកម្ម អតប (VATTIN)" content={formData.VATNo} />
                  </Col>
                  <Col span={8}>
                    <DescriptionItem title={<Translate id="text_date" />} content={moment().format("dddd MM, YYYY")} />
                  </Col>
                  <Col span={8}>
                    <DescriptionItem title={<Translate id="text_valid_till" />} content={moment(formData.validDate).format("dddd MM, YYYY")} />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title={<Translate id="text_address" />}
                      content={formData.address}
                    />
                  </Col>
                </Row>
              </div>
              <Row>
                <Col span={24}>
                  <Tabs onChange={this.onChangeTab} type="card" className="invoice-detail-tab">
                    <Tabs.TabPane tab={<Translate id="text_sale_order" />} key="1">
                      <SaleOrderInvoice formData={formData} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<Translate id="text_invoice" />} key="2">
                      <div className="invoice-page">
                        {this.state.loadingTab ? 
                          <LoadingComponent /> 
                          : 
                          <CAInvoice 
                            formData={this.state.invoiceDetail} 
                            ref={ref => this.invoiceRef = ref}
                            notFoundContent={<Translate id="text_sale_order_is_closed" />}
                          />
                        }
                      </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<Translate id="text_packing_slip" />} key="3">
                      <div style={{display: "flex", justifyContent: "center"}}>
                        <div style={{padding: 20, width: "fit-content", background: "white"}}>
                          <PackingSlipTem formData={formData} ref={ref => (this.packingSlipRef = ref)} />
                        </div>
                      </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<Translate id="text_delivery_note" />} key="4">
                      <div style={{display: "flex", justifyContent: "center"}}>
                        <div style={{padding: 20, width: "fit-content", background: "white"}}>
                          <DeliveryNote formData={formData} ref={ref => (this.deliveryNoteRef = ref)} />
                        </div>
                      </div>
                    </Tabs.TabPane>
                  </Tabs>
                </Col>
              </Row>
            </React.Fragment>
          :
            <Result  
              status={404}
              title="404"
              subTitle="Invoice found"
              extra={<Button type="info"><Translate id="text_back" /></Button>}
            />
        }
      </div>
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

const saleOrderDetail =  Form.create(mapPropsToFields)(SaleOrderDetail);

function LoadingComponent() {
  return <div style={{textAlign: "center", padding: "30px 0"}}>
    <Spin />
  </div>;
}
  
export default connect(mapStateToProps)(saleOrderDetail);