import React from "react";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { 
  Dropdown, 
  PageHeader, 
  Spin,
  Icon,
  Menu,
  Drawer,
  Form,
  message
} from "antd";
import history from "../../../../common/router/history";
import Enum from "../../../enums";
import InvoiceService from "../../../services/transactions/InvoiceService";
import CAInvoice from "./CAInvoice";
import ReceivedPayment from "../ReceivedPayment/Form";
import { InputText } from "../../../../common/elements/ant-ui";
import { stringTranslate } from "../../../../common/helper/stringTranslate";

class InvoiceDetail extends React.PureComponent {
  state = {
    formData: {},
    loading: false,
    showDrawer: false
  }
  lastId = "";

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

  handleMakeAsSent = () => {
    InvoiceService.makAsSent(this.id)
    .then(() => {
        this.setState(preState => {
            preState.formData.status = Enum.INVOICE_STATUS.SENT;
        });
        message.success("Make sent success");
    })
    .catch(() => message.error("Error!...."));
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
          title={<Translate id="text_invoice" />}
          subTitle={formData.invoiceNumber}
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
                <Menu.Item key={1} onClick={this.handleMakeAsSent}><Translate id="text_mark_as_sent" /></Menu.Item>
                <Menu.Item key={2} onClick={() => history.push({pathname: `/transactions/update-invoice/${formData.id}`})}>
                  <Translate id="text_edit_invoice" />
                </Menu.Item>
                <Menu.Item key={3} onClick={() => this.setState({showDrawer: true})}>
                  <Translate id="text_receive_payment" />
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
            onSuccess={() => message.success("Success payment")}
            form={this.props.form} />
        </Drawer>
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