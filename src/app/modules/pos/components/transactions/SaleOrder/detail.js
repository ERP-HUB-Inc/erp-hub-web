import React from "react";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { 
  PageHeader, 
  Spin, 
  Result,
  Menu,
  Dropdown,
  Icon,
  message,
  Form,
  Badge
} from "antd";
import { Link } from "react-router-dom";
import { Button } from "../../../../common/elements/ant-ui";
import history from "../../../../common/router/history";
import Enum from "../../../enums";
import Util from "../../../../common/util";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import SaleOrderService from "../../../services/transactions/SaleOrderService";
import SaleOrderInvoice from "./Invoice";

class SaleOrderDetail extends React.PureComponent{
  state = {
    loading: false,
    formData: {}
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
                <Menu.Item key={0} onClick={() => window.print()} title="Ctrl + P"><Translate id="text_print" /></Menu.Item>
                <Menu.Item key={1} onClick={() => this.handleMakeAsConfirm(formData.id)}><Translate id="text_mark_as_confirm" /></Menu.Item>
                <Menu.Item key={2}>
                  <Link target="_blank" to={`/transactions/create-invoice?saleOrderId=${formData.id}&action=convertToInvoice`}>
                    <Translate id="text_convert_to_invoice" />
                  </Link>
                </Menu.Item>
                <Menu.Item key={3} onClick={() => history.push({pathname: `/transactions/sale-order/update/${formData.id}`})}>
                  <Translate id="text_edit_sale_order" />
                </Menu.Item>
                <Menu.Item key={4}>
                  <Link target="_blank" to={`/transactions/sale-order/create?id=${formData.id}&action=clone`} >
                    <Translate id="text_clone" />
                  </Link>
                </Menu.Item>
                <Menu.Item key={5} onClick={() => this.handleVoid(formData.id)}><Translate id="text_void" /></Menu.Item>
                <Menu.Item key={6} onClick={() => this.handleDelete(formData.id)}><Translate id="text_delete" /></Menu.Item>
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
            <SaleOrderInvoice formData={formData} />
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
  
export default connect(mapStateToProps)(saleOrderDetail);