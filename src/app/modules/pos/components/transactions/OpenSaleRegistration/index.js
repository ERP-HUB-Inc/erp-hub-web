import React from "react";
import List from "../List";
import Enum from "../../../enums";
import FormCreate from "../../../containers/settings/Currency/FormCreate";
import Constant from "../../../constants/transactions/openSaleRegisration";
import OpenSaleRegistrationAction from "../../../action/transaction/openSalaRegisration";
import PaymentMethodAction from "../../../../pos/action/settings/paymentMethod";

export default class OpenSaleRegistrationList extends List {
  constructor(props) {
    super(props);
    const currentUser = this.Util.getSetting();
    let currency = "";
    if (currentUser) {
      currency = currentUser.currency;
    }
    this.columns = [
      {
        title: <this.Translate id="text_payment_method" />,
        dataIndex: "name",
        key: "name"
      },
      {
        title: <span><this.Translate id="text_expected" /> ({currency})</span>,
        dataIndex: "expected",
        key: "expected",
        width: 150,
        align: "right",
        render: (text, record) => {
          return this.formatCurrency(0);
        }
      },
      {
        title: <span><this.Translate id="text_count" /> ({currency})</span>,
        dataIndex: "count",
        key: "count",
        width: 150,
        align: "right",
        render: (text, record, index) => {
          return <this.InputNumber
            name={`count[${index}]`}  
            data={record.count}
            className="text-right"
            isHideTool={true}
            isAutoFocus={index === 0}
            isAutoSelect={true}
            handleKeyUp={(e) => this.handleOnChangeQuantity(e, index)}
            form={this.props.form} />;
        }
      },
      {
        title: <span><this.Translate id="text_difference" /> ({currency})</span>,
        dataIndex: "difference",
        key: "difference",
        width: 150,
        align: "right",
        render: (text, record) => {
          return this.formatCurrency(0);
        }
      }
    ];
    this.rowSelection = false;
    this.fetchingProp = "paymentMethodList";
    this.action = OpenSaleRegistrationAction;
    this.RESET_CONSTANT = Constant.RESET_OPEN_SALE_REGISTRATION;
    this.handleOnChangeQuantity = this.handleOnChangeQuantity.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(this.action.last());
    this.props.dispatch(PaymentMethodAction.fetch(100, "", "createdAt", "ASC", JSON.stringify({isEnableOnPOS: [Enum.PAYMENT_METHOD_AVIALE_ON_POS]})));
  }

  handleOnChangeQuantity(e, index) {

  }

  renderPagination(fetchingProps) {}

  renderFilterRecord () {
    let data = null;
    if (this.props.openSaleRegistration.list.length > 0) {
      data = this.props.openSaleRegistration.list[0];
    }
    return data ?
      <this.Row>
        <this.Col md="3">
          <div>
            Store
          </div>
          <div>
            {data.location.name}
          </div>
        </this.Col>
        <this.Col md="3">
          <div>
            Register
          </div>
          <div>
            {data.device.code}
          </div>
        </this.Col>
        <this.Col md="3">
          <div>
            Open time
          </div>
          <div>
            {this.Util.formatDateTime(data.createdAt)}
          </div>
        </this.Col>
        <this.Col md="3">
          {
            data.status === Enum.OPEN_SALE_REGISTRATION_STATUS.CLOSED ?
              <div>
                <div>
                  Close time
                </div>
                <div>
                  {this.Util.formatDateTime(data.updatedAt)}
                </div>
              </div>
              :
              ""
          }
        </this.Col>
      </this.Row>
      :
      "";
  }

  renderActionButton() {
    return(
      <this.Button type="info">
        <span className="icon-print icon-padding-right text-uppercase"></span><this.Translate id="text_print"/>
      </this.Button>
    );
  }

  handleShowFormAdd() {
    this.props.dispatch(OpenSaleRegistrationAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }
}
