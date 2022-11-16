import React from "react";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import moment from "moment";
import { 
  Dropdown, 
  PageHeader, 
  Spin,
  Icon,
  Menu,
  Drawer,
  Form,
  message,
  Badge
} from "antd";
import ReactToPrint from "react-to-print";
import Util from "../../../../common/util";
import history from "../../../../common/router/history";
import Enum from "../../../enums";
import InvoiceService from "../../../services/transactions/InvoiceService";
import TransactionService from "../../../services/transactions/TransactionService";
import CAInvoice from "./CAInvoice";
import ReceivedPayment from "../ReceivedPayment/Form";
import { InputText } from "../../../../common/elements/ant-ui";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import ReceiptTemplate from "../receipt/template";

class InvoiceDetail extends React.PureComponent {
  state = {
    formData: {},
    loading: false,
    showDrawer: false,
    receipt: {}
  }
  INVOICE_STATUS_STR = {
    [Enum.INVOICE_STATUS.DRAFT]: { title: stringTranslate("text_draft", this.props.locale), color: "#bfbfbf" },
    [Enum.INVOICE_STATUS.SENT]: { title: stringTranslate("text_sent", this.props.locale), color: "#1890ff" },
    [Enum.INVOICE_STATUS.PARTIAL]: { title: stringTranslate("text_partial_pay", this.props.locale), color: "#52c41a"},
    [Enum.INVOICE_STATUS.PAID]: { title: stringTranslate("text_paid", this.props.locale), color: "#52c41a"},
    [Enum.INVOICE_STATUS.VOID]: { title: stringTranslate("text_void", this.props.locale), color: "#d9d9d9"},
  };
  lastId = "";
  util = new Util();

  componentDidMount() {
    const id = this.props.match.params.id;
    this.lastId = id;
    this.setState({loading: true});
    InvoiceService.detail(id)
    .then(response => {
      this.setState({formData: response && response.data});
    })
    .finally(() => this.setState({loading: false}));
  }

  componentDidUpdate() {
    const id = this.props.match.params.id;
    if (id && id !== this.lastId) {
      this.lastId = id;
      this.setState({loading: true});
      InvoiceService.detail(id)
      .then(response => {
        this.setState({formData: response && response.data});
      })
      .finally(() => this.setState({loading: false}));
    }
  }

  handleSearchInvoice = (e) => {
    const value = e.target.value;
    if (value) {
      this.setState({loading: true});
      InvoiceService.searchInvoice(e.target.value)
      .then(response => {
        this.setState({formData: response && response.data});
      })
      .catch(() => this.setState({formData: {}}))
      .finally(() => {
        this.setState({loading: false});
        history.push({
          pathname: `/transactions/detail-invoice/${this.state.formData.id}`,
          search: `search=${value}`
        });
      });
    }
  }

  async getReceiptData(invoiceId) {
    const result = (await TransactionService.detail(invoiceId)).data.data;
    if (!result) {
      return;
    }
    this.setState({receipt: result});
  }

  handlePrintA5 = () => {
    document.getElementById("invoice-content").classList.add("invoice-A5");
    setTimeout(() => {
      window.print();
    }, 500);
  }

  handleAfterPayment = () => {
    message.success("Success Payment");
    this.setState({loading: true});
    InvoiceService.detail(this.state.formData.id)
    .then(response => {
      this.setState({formData: response && response.data});
    })
    .finally(() => this.setState({loading: false}));
  }

  handleMakeAsSent = () => {
    if (Number(this.state.formData.status) === Enum.INVOICE_STATUS.SENT) {
      return this.util.sweetAlertMessageV2("Warning!", "This invoice already sent");
    }

    if (Number(this.state.formData.status) !== Enum.INVOICE_STATUS.DRAFT) {
      return this.util.sweetAlertMessageV2("Warning!", "Can't mark sent invoice in this step");
    }

    this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
    .then(willSent => {
      if (willSent) {
        InvoiceService.makAsSent(this.state.formData.id)
        .then(() => {
            this.setState(preState => {
                preState.formData.status = Enum.INVOICE_STATUS.SENT;
            });
            message.success("Make sent success");
        })
        .catch(() => message.error("Error!...."));
      }
    });
  }

  renderPageHeaderSubTitle(formData) {
    let statusColor = formData.status >= 0 && this.INVOICE_STATUS_STR[formData.status].color;
    let statusTitle = formData.status >= 0 && this.INVOICE_STATUS_STR[formData.status].title;

    if (formData.status === Enum.INVOICE_STATUS.SENT && moment(formData.dueDate).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")) {
        statusColor = "#f5222d";
        statusTitle = stringTranslate("text_expired", this.props.locale);
    }

    return <div>
      {formData.invoiceNumber}
      {Object.keys(formData).length && formData.status >= 0 ?<Badge count={statusTitle} style={{ backgroundColor: statusColor}} />: null}
    </div>;
  }

  render() {
    const {formData} = this.state;

    onafterprint = (() => {
      document.getElementById("invoice-content").classList.remove("invoice-A5");
    });

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
          title={<Translate id="text_invoice" />}
          subTitle={this.renderPageHeaderSubTitle(formData)}
          extra={[
            <InputText
              key={0}
              name="search"
              style={{width: 230, float: "left", marginTop: -4}}
              placeholder={`${stringTranslate("text_invoice_no", this.props.locale)}`}
              handlePressEnter={this.handleSearchInvoice}
              form={this.props.form}
            />,
            <Dropdown key={1} overlay={(
              <Menu>
                <Menu.Item key={0} onClick={() => window.print()} title="Ctrl + P"><Translate id="text_print" /></Menu.Item>
                <Menu.Item key={1} onClick={this.handlePrintA5}><Translate id="text_print" /> A5</Menu.Item>
                <Menu.Item key={2} onClick={this.handleMakeAsSent}><Translate id="text_mark_as_sent" /></Menu.Item>
                <Menu.Item key={3} onClick={() => history.push({pathname: `/transactions/update-invoice/${formData.id}`})}>
                  <Translate id="text_edit_invoice" />
                </Menu.Item>
                <Menu.Item key={4} onClick={() => this.setState({showDrawer: true})}>
                  <Translate id="text_receive_payment" />
                </Menu.Item>
                {formData.status === Enum.INVOICE_STATUS.PAID ?
                  <Menu.Item key={5}>
                    <ReactToPrint
                      onBeforeGetContent={() => this.getReceiptData(formData.id)}
                      trigger={() => <button style={{background: "none", border: "none", paddingLeft: 0}}><Translate id="text_print_receipt" /></button>}
                      content={() => this.receiptRef}
                    />
                  </Menu.Item>
                  : null
                }
              </Menu>
            )}>
              <button className="ant-btn ant-dropdown-link" onClick={e => e.preventDefault()}>
                <Translate id="text_option" /> <Icon type="down" />
              </button>
            </Dropdown>
          ]}
        />

        {
          !this.state.loading ?
            <div className="invoice-page">
            <CAInvoice formData={formData} />
          </div>
          : 
          <div style={{width: 30, margin: "0 auto", paddingTop: 30}}>
            <Spin />
          </div>
        }

        <Drawer
          title={<Translate id="text_receive_payment" />}
          width={520}
          visible={this.state.showDrawer}
          onClose={() => this.setState({showDrawer: false})}
        >
          <ReceivedPayment 
            formData={formData}
            locale={this.props.locale}
            onClose={() => this.setState({showDrawer: false})}
            onSuccess={this.handleAfterPayment}
            form={this.props.form} />
        </Drawer>

        <div style={{display: "none"}}>
          <ReceiptTemplate formData={this.state.receipt} ref={re => this.receiptRef = re} locale={this.props.locale} />
        </div>
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

const invoiceDetail =  Form.create(mapPropsToFields)(InvoiceDetail);
  
export default connect(mapStateToProps)(invoiceDetail);