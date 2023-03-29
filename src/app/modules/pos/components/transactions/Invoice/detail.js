import React from "react";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import swal from "sweetalert";
import moment from "moment";
import { 
  Dropdown,
  Divider,
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
import CAInvoice from "./CAInvoice";
import EditShipping from "./EditShipping";
import Util from "../../../../common/util";
import history from "../../../../common/router/history";
import Enum from "../../../enums";
import InvoiceService from "../../../services/transactions/InvoiceService";
import TransactionService from "../../../services/transactions/TransactionService";
import SaleOrderService from "../../../services/transactions/SaleOrderService";
import PackingSlip from "../SaleOrder/Invoice/PackingSlip";
import DeliveryNote from "../SaleOrder/Invoice/DeliveryNote";
import ReceivedPayment from "../ReceivedPayment/Form";
import { InputText } from "../../../../common/elements/ant-ui";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import ReceiptTemplate from "../receipt/template";

class InvoiceDetail extends React.PureComponent {
   state = {
      formData: {},
      salesOrder: null,
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
   editShippingRef = React.createRef();

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

   async fetchSalesOrderById(id) {
      const formData = await SaleOrderService.detail(id);
      this.setState({salesOrder: formData.data});
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

  handleDeleteInvoice(record) {
      this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
      .then(willDelete => {
         if (willDelete) {
            InvoiceService.delete(record.id)
            .then(() => {
               message.success("Delete invoice success");
               history.push("/transactions/invoice");
            });
         }
      });
  }

  handleReturn(rowData) {
    swal({
      title: this.CATranslate("text_confirm_return_invoice", this.props.locale),
      text: this.CATranslate("text_message_return_invoice", this.props.locale),
      icon: "warning",
      buttons: [this.CATranslate("text_cancel", this.props.locale), this.CATranslate("text_yes", this.props.locale)],
      dangerMode: true,
    })
    .then(ok => {
        if (ok) {
        InvoiceService.makAsReturn(rowData.id)
        .then(() => {
          swal({
            icon: "success",
            title: "Success!",
            text: "Your invoice has been returned",
            buttons: false,
            timer: 1500
          })
          .then(() => {
            history.push("/transactions/invoice");
          });
        });
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
         <div style={{display: "none"}}>
            <PackingSlip ref={el => this.packingSlipRef = el} formData={this.state.salesOrder} />
            <DeliveryNote ref={el => this.deliveryNoteRef = el} formData={this.state.salesOrder} />
            <EditShipping ref={f => this.editShippingRef = f} callback={() => this.componentDidMount()} />
         </div>
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
                     <Menu.Item key={3} onClick={() => history.push({pathname: `/transactions/update-invoice/${formData.id}`})}>
                        <Icon type="edit" style={{marginRight: 10}} /> <Translate id="text_edit" />
                     </Menu.Item>
                     <Divider style={{marginTop: 4, marginBottom: 4}} />
                     <Menu.Item key={2} onClick={this.handleMakeAsSent}>
                        <Icon type="check" style={{marginRight: 10}} /> <Translate id="text_mark_as_sent" />
                     </Menu.Item>
                     <Menu.Item key={4} onClick={() => this.setState({showDrawer: true})}>
                        <Icon type="dollar" style={{marginRight: 10}} /> <Translate id="text_receive_payment" />
                     </Menu.Item>
                     <Divider style={{marginTop: 4, marginBottom: 4}} />
                     <Menu.Item key={2} onClick={() => this.editShippingRef.showDrawer(formData.id)}>
                        <Icon type="car" style={{marginRight: 10}} /> <Translate id="text_edit_shipping" />
                     </Menu.Item>
                     <Menu.Item key={3}>
                        <ReactToPrint
                           trigger={() => {
                              return (
                                 <div>
                                    <Icon type="file-protect" style={{marginRight: 10}} />
                                    <Translate id="text_packing_slip" />
                                 </div>
                              );
                           }}
                           content={() => this.packingSlipRef}
                           onBeforeGetContent={() => this.fetchSalesOrderById(formData.id)}
                        />
                     </Menu.Item>
                     <Menu.Item key={4}>
                        <ReactToPrint
                           trigger={() => {
                              return (
                                 <div>
                                    <Icon type="file-text" style={{marginRight: 10}} />
                                    <Translate id="text_delivery_note" />
                                 </div>
                              );
                           }}
                           content={() => this.deliveryNoteRef}
                           onBeforeGetContent={() => this.fetchSalesOrderById(formData.id)}
                        />
                     </Menu.Item>
                     <Divider style={{marginTop: 4, marginBottom: 4}} />
                     <Menu.Item key={5} title="Ctrl + P">
                        <div>
                           <ReactToPrint
                              content={() => this.invoiceRef}
                              trigger={() => {
                                 return (
                                 <div>
                                    <Icon type="printer" style={{marginRight: 10}} /> <Translate id="text_print" /> - A5
                                 </div>
                                 );
                              }}
                           />
                        </div>
                     </Menu.Item>
                     <Menu.Item key={6} onClick={() => window.print()} title="Ctrl + P">
                        <Icon type="printer" style={{marginRight: 10}} /> <Translate id="text_print" /> - A4
                     </Menu.Item>
                     <Menu.Item key={7} disabled={formData.status !== Enum.INVOICE_STATUS.PAID}>
                        <ReactToPrint
                        onBeforeGetContent={() => this.getReceiptData(formData.id)}
                        trigger={() => <button style={{background: "none", border: "none", paddingLeft: 0}}><Icon type="printer" style={{marginRight: 10}} /><Translate id="text_receipt" /></button>}
                        content={() => this.receiptRef}
                        />
                     </Menu.Item>
                     <Divider style={{marginTop: 4, marginBottom: 4}} />
                     <Menu.Item onClick={() => this.handleReturn(formData)} key={8} disabled={formData.status !== Enum.INVOICE_STATUS.PAID}>
                        <Icon type="close" style={{marginRight: 10}} /> <Translate id="text_void" />
                     </Menu.Item>
                     <Menu.Item key={10} onClick={() => this.handleDeleteInvoice(formData)} disabled={formData.status === Enum.INVOICE_STATUS.PAID}>
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
            !this.state.loading ?
            <div className="invoice-page">
               <CAInvoice formData={formData} />
               
               <div style={{display: "none"}}>
                  <CAInvoice ref={ref => this.invoiceRef = ref} formData={formData} paperSize="A5" />
               </div>
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