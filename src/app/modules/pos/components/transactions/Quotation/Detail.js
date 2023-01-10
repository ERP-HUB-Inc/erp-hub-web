import React from "react";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Divider,
  Dropdown, 
  Menu, 
  PageHeader,
  Icon,
  message,
  Spin,
  Tabs,
  Form,
  Col,
  Row,
  Badge
} from "antd";
import moment from "moment";
import _ from "lodash";
import history from "../../../../common/router/history";
import Enum from "../../../enums";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import QuotationService from "../../../services/transactions/QuotationService";
import CAInvoice from "../Invoice/CAInvoice";
import Util from "../../../../common/util";

const { TabPane } = Tabs;

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

class Detail extends React.PureComponent {
  state = {
    formData: {},
    invoice: {},
    invoiceLoading: false,
    loading: false
  }
  QUOTATION_STATUS_STR = {
    [Enum.QUOTATION_STATUS.DRAFT]: {name: stringTranslate("text_draft", this.props.locale), color: "#d9d9d9"},
    [Enum.QUOTATION_STATUS.SENT]: {name: stringTranslate("text_sent", this.props.locale), color: "#108ee9"},
    [Enum.QUOTATION_STATUS.APPROVED]: {name: stringTranslate("text_approved", this.props.locale), color: "#87d068"},
    [Enum.QUOTATION_STATUS.CLOSED]: {name: stringTranslate("text_closed", this.props.locale), color: "#52c41a"}
  };
  util = new Util();

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({loading: true});
    QuotationService.detail(id)
    .then(response => {
      this.setState({formData: response && response.data.data});
    })
    .finally(() => this.setState({loading: false}));
  }

  handleShowFormEdit(id, status) {
    if (status !== Enum.QUOTATION_STATUS.DRAFT) {
      return message.warning(stringTranslate("text_error_allow_update_only_draft_step", this.props.locale));
    }
    history.push(`/transactions/quotation-update/${id}`);
  }

  handleConvertToInvoice(id, status) {
    if (status !== Enum.QUOTATION_STATUS.DRAFT) {
      return message.warning(stringTranslate("text_this_quotation_already_convert", this.props.locale));
    }
    history.push(`/transactions/create-invoice?quotationId=${id}&action=convertToInvoice`);
  }

  handleDeleteQuotation(id, status) {
    if (status !== Enum.QUOTATION_STATUS.DRAFT) {
      return message.warning(stringTranslate("text_error_allow_only_delete_draft_step", this.props.locale));
    }
    this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
    .then(willDelete => {
      if (willDelete) {
        QuotationService.deleteQuotation(id)
        .then(() => {
          message.success("Delete success!");
          history.goBack();
        })
        .catch(() => message.error("Error!..."));
      }
    });
  }

  onTabChangge = (key) => {
    if (key === "invoice" && _.isEmpty(this.state.invoice)) {
      this.setState({invoiceLoading: true});
      QuotationService.getInvoiceByQuoteId(this.state.formData.id)
      .then(response => {
        if (response.data) {
          this.setState({invoice: response.data.find(value => value)});
        }
      })
      .finally(() => {
        this.setState({invoiceLoading: false});
      });
    }
  }

  render() {
    const {formData} = this.state;
    formData.transactionEntries = formData.quotationEntries;
    formData.invoiceDate = formData.quotationDate;
    formData.dueDate = formData.validDate;
    formData.invoiceNumber = formData.number;
    formData.status = Number(formData.status);
    formData.phoneNumber = formData.customer && formData.customer.phoneNumber;
    formData.VATNo = formData.customer && formData.customer.VATNo;
    formData.address = formData.customer && formData.customer.address;

    if (this.state.loading) {
      return <div style={{width: 30, margin: "0 auto", paddingTop: 30}}>
      <Spin />
    </div>;
    } 
    
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
          title={<Translate id="text_quotation" />}
          subTitle={  
            <div>
              {
                Object.keys(formData).length && formData.status >= 0 ?
                  <Badge count={this.QUOTATION_STATUS_STR[formData.status].name} style={{ backgroundColor: this.QUOTATION_STATUS_STR[formData.status].color}} />
                : null
              }
            </div>
          }
          extra={[
            <Dropdown key={1} overlay={(
              <Menu>
                <Menu.Item disabled={formData.status !== Enum.QUOTATION_STATUS.DRAFT} key={1} onClick={() => this.handleShowFormEdit(formData.id, formData.status)}>
                  <Icon type="edit" style={{marginRight: 10}} />  <Translate id="text_edit" />
                </Menu.Item>
                <Menu.Item key={2} onClick={() => this.handleConvertToInvoice(formData.id, formData.status)}>
                  <Icon type="retweet" style={{marginRight: 10}} /> <Translate id="text_convert_to_invoice" />
                </Menu.Item>
                <Menu.Item key={3}>
                  <Link target="_blank" to={`/transactions/quotation-create?id=${formData.id}&action=clone`} >
                    <Icon type="copy" style={{marginRight: 10}} /> <Translate id="text_clone" />
                  </Link>
                </Menu.Item>
                <Menu.Item key={4}>
                  <Link target="_blank" to="/transactions/quotation-create">
                    <Icon type="plus" style={{marginRight: 10}} /> <Translate id="text_new_proposal" />
                  </Link>
                </Menu.Item>
                <Divider style={{marginTop: 4, marginBottom: 4}} />
                <Menu.Item key={0} onClick={() => window.print()}>
                  <Icon type="printer" style={{marginRight: 10}} /> <Translate id="text_print" />
                </Menu.Item>
                <Divider style={{marginTop: 4, marginBottom: 4}} />
                <Menu.Item disabled={formData.status !== Enum.QUOTATION_STATUS.DRAFT} key={5} onClick={() => this.handleDeleteQuotation(formData.id, formData.status)}>
                  <Icon type="delete" style={{marginRight: 12}} /> <Translate id="text_delete" />
                </Menu.Item>
              </Menu>
            )}>
              <button className="ant-btn ant-dropdown-link" onClick={e => e.preventDefault()}>
                <Translate id="text_option" /> <Icon type="down" />
              </button>
            </Dropdown>
          ]}
        />
        <div className="detail-invoice-description">
          <h5 style={{marginBottom: 30, lineHeight: 1.4}}><Translate id="text_quotation_no" />: {formData.number}</h5>
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
          <Tabs onChange={this.onTabChangge} type="card" className="invoice-detail-tab">
            <TabPane tab={<Translate id="text_details" />} key="detail" style={{paddingTop: 25, paddingBottom: 25}}>
              <div className="invoice-page">
                <CAInvoice
                  invoiceTitle="Quotation"
                  invoiceTaxTitleKH="សម្រង់តម្លៃអាករ"
                  invoiceNoTitle="Quote No"
                  invoiceNoTitleKH="លេខសម្រង់តម្លៃ"
                  numberTitle="Quote Number"
                  invoiceDateTitle="Quote Date"
                  dueDateTitle="Valid till Date"
                  formData={formData}
                />
              </div>
            </TabPane>
            <TabPane tab={<Translate id="text_invoice" />} key="invoice">
              {
                this.state.invoiceLoading ?
                <Spin style={{display: "flex", justifyContent: "center"}} />
                :
                <div className="invoice-page" style={{paddingTop: 25, paddingBottom: 25}}>
                  <CAInvoice formData={this.state.invoice} />
                </div>
              }
            </TabPane>
          </Tabs>
          </Col>
        </Row>
      </div>
    );
  }
}

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

const detail =  Form.create(mapPropsToFields)(Detail);
  
export default connect(mapStateToProps)(detail);