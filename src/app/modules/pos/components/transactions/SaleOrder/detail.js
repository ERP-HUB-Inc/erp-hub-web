import React from "react";
import { Translate } from "react-localize-redux";
import { 
  PageHeader, 
  Spin, 
  Result,
  Menu,
  Dropdown,
  Icon,
  message
} from "antd";
import { Link } from "react-router-dom";
import { Button } from "../../../../common/elements/ant-ui";
import history from "../../../../common/router/history";
import Enum from "../../../enums";
import SaleOrderService from "../../../services/transactions/SaleOrderService";
import SaleOrderInvoice from "./Invoice";

export default class SaleOrderDetail extends React.PureComponent{
  state = {
    loading: false,
    formData: {}
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({loading: true});
    SaleOrderService.detail(id)
    .then(response => this.setState({formData: response.data}))
    .catch(() => this.setState({formData: {}}))
    .finally(() => this.setState({loading: false}));
  }

  handleMakeAsConfirm(id) {
    SaleOrderService.makAsConfirm(id)
    .then(() => {
      message.success("Make confirm success");
      this.setState(preState => {
        preState.formData.status = Enum.SALE_ORDER_STATUS.CONFIRMED;
        return preState;
      });
    })
    .catch(() => message.error("Error!....."));
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
          subTitle={formData.number} 
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
                <Menu.Item key={2} onClick={() => history.push({pathname: `/transactions/sale-order/update/${formData.id}`})}>
                  <Translate id="text_edit_sale_order" />
                </Menu.Item>
                <Menu.Item key={3}>
                  <Link target="_blank" to={`/transactions/sale-order/create?id=${formData.id}&action=clone`} >
                    <Translate id="text_clone" />
                  </Link>
                </Menu.Item>
                <Menu.Item key={6}><Translate id="text_void" /></Menu.Item>
                <Menu.Item><Translate id="text_delete" /></Menu.Item>
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