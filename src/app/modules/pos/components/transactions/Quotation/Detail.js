import React from "react";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { 
  Dropdown, 
  Menu, 
  PageHeader,
  Icon,
  message,
  Spin,
  Form,
  Badge
} from "antd";
import history from "../../../../common/router/history";
import Enum from "../../../enums";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import QuotationService from "../../../services/transactions/QuotationService";
import CAInvoice from "../Invoice/CAInvoice";
import Util from "../../../../common/util";

class Detail extends React.PureComponent {
  state = {
    formData: {},
    loading: false
  }
  QUOTATION_STATUS_STR = {
    [Enum.QUOTATION_STATUS.DRAFT]: {name: stringTranslate("text_draft", this.props.locale), color: "#d9d9d9"},
    [Enum.QUOTATION_STATUS.PROCESS]: {name: stringTranslate("text_process", this.props.locale), color: "#52c41a"},
    [Enum.QUOTATION_STATUS.CANCELLED]: {name: stringTranslate("text_cancel", this.props.locale), color: "#f50"}
  };
  util = new Util();

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({loading: true});
    QuotationService.detail2(id)
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

  render() {
    const {formData} = this.state;
    formData.transactionEntries = formData.quotationEntries;
    formData.invoiceDate = formData.quotationDate;
    formData.dueDate = formData.validDate;
    formData.invoiceNumber = formData.number;
    formData.company = formData.customer && formData.customer.company;
    formData.address = formData.customer && formData.customer.address;

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
              {formData.number}
              {
                Object.keys(formData).length && formData.status ?
                  <Badge count={this.QUOTATION_STATUS_STR[formData.status].name} style={{ backgroundColor: this.QUOTATION_STATUS_STR[formData.status].color}} />
                : null
              }
            </div>
          }
          extra={[
            <Dropdown key={1} overlay={(
              <Menu>
                <Menu.Item key={0} onClick={() => window.print()}><Translate id="text_print" /></Menu.Item>
                <Menu.Item key={1} onClick={() => this.handleShowFormEdit(formData.id, formData.status)}>
                  <Translate id="text_edit_quotation" />
                </Menu.Item>
                <Menu.Item key={2} onClick={() => this.handleConvertToInvoice(formData.id, formData.status)}>
                  <Translate id="text_convert_to_invoice" />
                </Menu.Item>
                <Menu.Item key={3}>
                  <Link target="_blank" to={`/transactions/quotation-create?id=${formData.id}&action=clone`} >
                    <Translate id="text_clone" />
                  </Link>
                </Menu.Item>
                <Menu.Item key={4}>
                  <Link target="_blank" to="/transactions/quotation-create">
                    <Translate id="text_new_proposal" />
                  </Link>
                </Menu.Item>
                <Menu.Item key={5} onClick={() => this.handleDeleteQuotation(formData.id, formData.status)}>
                  <Translate id="text_delete" />
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
          : 
          <div style={{width: 30, margin: "0 auto", paddingTop: 30}}>
            <Spin />
          </div>
        }
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