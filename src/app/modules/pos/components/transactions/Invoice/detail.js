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
import InvoiceService from "../../../services/transactions/InvoiceService";
import CAInvoice from "./CAInvoice";
import ReceivedPayment from "../ReceivedPayment/Form";

class InvoiceDetail extends React.PureComponent {
  state = {
    formData: {},
    loading: false,
    showDrawer: false
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({loading: true});
    InvoiceService.detail(id)
    .then(response => {
      this.setState({formData: response && response.data});
    })
    .finally(() => this.setState({loading: false}));
  }

  handlePrint = () => {
    window.print();
  }

  render() {
    const {formData} = this.state;
    return (
      this.state.loading && !(Object.keys(formData).length) ?
        <div style={{width: 30, margin: "0 auto", paddingTop: 30}}>
          <Spin />
        </div>
      :
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
            <Dropdown key={1} overlay={(
              <Menu>
                <Menu.Item key={0} onClick={this.handlePrint} title="Ctrl + P"><Translate id="text_print" /></Menu.Item>
                <Menu.Item key={1} onClick={() => history.push({pathname: `/transactions/update-invoice/${this.props.match.params.id}`})}>
                  <Translate id="text_edit_invoice" />
                </Menu.Item>
                <Menu.Item key={2} onClick={() => this.setState({showDrawer: true})}>
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

        <div className="invoice-page">
          <CAInvoice formData={formData} />
        </div>

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