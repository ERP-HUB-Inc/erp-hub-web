import React from "react";
import moment from "moment";
import PrintSummary from "./PrintSummary";
import List from "../List";
import Enum from "../../../enums";
import FormOpen from "../../../containers/transactions/OpenSaleRegistration/FormOpen";
import Constant from "../../../constants/transactions/openSaleRegisration";
import OpenSaleRegistrationAction from "../../../action/transaction/openSalaRegisration";
import TransactionAction from "../../../action/transaction/transaction";
import PaymentMethodAction from "../../../../pos/action/settings/paymentMethod";
import ConstantPaymentMethod from "../../../../pos/constants/settings/paymentMethod";

export default class OpenSaleRegistrationList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      summaryList: [],
      totalSummary: {
        expected: 0,
        count: 0,
        difference: 0
      }
    };
    this.colorDifferenceStatus = ["#4cb64c", "#c72727"];
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
        render: expected => this.Util.formatCurrency(expected, "")
      },
      {
        title: <span><this.Translate id="text_count" /> ({currency})</span>,
        dataIndex: "count",
        key: "count",
        width: 150,
        align: "right",
        render: (text, record, index) => {
          return this.isOpenSaleRegistrationClosed() ?
            this.Util.formatCurrency(record.count, "")
            :
            <this.InputNumber
              name={`count[${index}]`}  
              data={record.count}
              className="text-right"
              isHideTool={true}
              isAutoFocus={index === 0}
              isAutoSelect={true}
              required={index === 0}
              handleKeyUp={(e) => this.handleOnChangeCount(e, index)}
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
          let colorIndex = 0;
          if (record.difference < 0) {
            colorIndex = 1;
          }
          return <this.Tag color={this.colorDifferenceStatus[colorIndex]} style={{marginRight: 0}} className="text-center label-stock-status">{this.Util.formatCurrency(record.difference, "")}</this.Tag>;
        }
      }
    ];
    this.hasDidUpdate = false;
    this.hasDidLoadSaleSummary = false;
    this.isReadyToPrint = false;
    this.fetchingProp = "paymentMethodList";
    this.action = OpenSaleRegistrationAction;
    this.RESET_CONSTANT = Constant.RESET_OPEN_SALE_REGISTRATION;
    this.handlePrintSummary = this.handlePrintSummary.bind(this);
    this.handleOnChangeCount = this.handleOnChangeCount.bind(this);
    this.handleCloseTodaySale = this.handleCloseTodaySale.bind(this);
    this.handleShowFormAdd = this.handleShowFormAdd.bind(this);
  }

  componentDidUpdate() {
    // HAS LOADED DATA OF LAST OPEN SALE REGISTER
    if (!this.hasDidLoadSaleSummary &&
      this.props.openSaleRegistration.fetched &&
      this.isValidOpenSaleRegistrationList()) {
      const lastOpenSaleRegisterDate = this.props.openSaleRegistration.list[0].createdAt;
      this.props.dispatch(TransactionAction.todaySaleSummary(moment(lastOpenSaleRegisterDate).format("YYYY-MM-DD H:mm:ss")));
      this.hasDidLoadSaleSummary = true;
    }

    if (!this.hasDidUpdate &&
      this.props.paymentMethodList.fetched &&
      this.props.openSaleRegistration.fetched &&
      this.props.todaySaleSummary.fetched) {

      const summaryList = [];
      if (this.isValidOpenSaleRegistrationList()) {
        this.props.paymentMethodList.list.forEach(value => {
          let expected = 0;
          let count = 0;
          if (value.isSystem === this.Enum.IS_SYSTEM) {
            expected = this.props.openSaleRegistration.list[0].open;
          }

          // IF OPEN SALE REGISTRATION HAS CLOSED
          if (this.isOpenSaleRegistrationClosed()) {
            this.props.openSaleRegistration.list[0].openSaleRegistrationEntries.forEach(openSaleRegistration => {
              if (openSaleRegistration.paymentMethodId === value.id) {
                expected = openSaleRegistration.expected;
                count = openSaleRegistration.count;
              }
            });
          // ELSE OPEN SALE REGISTRATION IS OPENING
          } else if (this.props.todaySaleSummary.list && Array.isArray(this.props.todaySaleSummary.list)) {
            this.props.todaySaleSummary.list.forEach(todaySaleSummary => {
              if (value.id === todaySaleSummary.paymentMethodId) {
                expected += todaySaleSummary.amount;
              }
            });
          }

          summaryList.push({
            paymentMethodId: value.id,
            name: value.name,
            expected,
            count,
            difference: this.parseValueToDiffernece(count - expected)
          });
        });
      }

      this.calculateTotalSummary(summaryList);
      this.setState({summaryList});
      this.hasDidUpdate = true;
    }

    if (this.props.open.added || this.props.close.updated) {
      this.setState({
        summaryList: [],
        totalSummary: {
          expected: 0,
          count: 0,
          difference: 0
        }
      });

      // RESET OLD DATA
      this.props.dispatch(OpenSaleRegistrationAction.reset(Constant.RESET_OPEN_SALE_REGISTRATION));
      this.props.dispatch(OpenSaleRegistrationAction.reset());
      this.props.dispatch(TransactionAction.reset());

      // LOAD NEW DATA
      this.loadData();
      this.hasDidUpdate = false;
      this.hasDidLoadSaleSummary = false;
    }

    // CHECK IS READY TO PRINT
    const element = document.getElementById("print-sale-summary");
    if (this.isReadyToPrint && element) {
      this.Util.printElem(element.innerHTML);
      this.isReadyToPrint = false;
    }
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.props.dispatch(this.action.last());
    this.props.dispatch(PaymentMethodAction.reset(ConstantPaymentMethod.RESET_PARTIAL_PAYMENT_METHOD));
    this.props.dispatch(PaymentMethodAction.fetch(100, "", "createdAt", "ASC", JSON.stringify({isEnableOnPOS: [Enum.PAYMENT_METHOD_AVIALE_ON_POS]})));
  }

  calculateTotalSummary(summaryList) {
    if (Array.isArray(summaryList)) {
      let expected = 0, count = 0, difference = 0;
      summaryList.forEach(value => {
        expected += value.expected;
        count += value.count;
        difference += value.difference;
      });
      this.setState({
        totalSummary: {
          expected,
          count,
          difference
        }
      });
    }
  }

  parseValueToDiffernece(value) {
    return value === -0 ? 0 : value;
  }

  isValidOpenSaleRegistrationList() {
    return Array.isArray(this.props.openSaleRegistration.list) &&
    this.props.openSaleRegistration.list.length > 0;
  }

  isOpenSaleRegistrationClosed() {
    if (this.isValidOpenSaleRegistrationList()) {
      return this.props.openSaleRegistration.list[0].status === Enum.OPEN_SALE_REGISTRATION_STATUS.CLOSED;
    } else {
      console.log("Open sale registration has closed");
      return true; // has no record so set true to be allow to open sale
    }
  }

  handleCloseTodaySale(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        if (this.state.summaryList && this.state.summaryList.length > 0) {
          const data = {};
          if (this.props.openSaleRegistration.list && this.props.openSaleRegistration.list.length > 0) {
            const id = this.props.openSaleRegistration.list[0].id;
            data["expected"] = this.state.totalSummary.expected;
            data["count"] = this.state.totalSummary.count;
            data["entries"] = this.state.summaryList;
            console.log("Entries:", data);
            this.props.dispatch(OpenSaleRegistrationAction.close(id, data));
          }
        } 
      }
    });
  }

  handleOnChangeCount(e, index) {
    const summaryList = this.state.summaryList;
    let value = e.target.value;
    if (value === "" || value === null) {
      value = 0;
    }
    value = parseFloat(value);
    summaryList[index]["count"] = value;
    const difference = parseFloat(value) - summaryList[index]["expected"];
    summaryList[index]["difference"] = this.parseValueToDiffernece(difference);

    this.calculateTotalSummary(summaryList);
    this.setState({summaryList});
  }

  handleShowFormAdd() {
    this.props.dispatch(OpenSaleRegistrationAction.showForm());
    this.setState({
      modalConten: <FormOpen/>
    });
  }

  handlePrintSummary() {
    let dataHeader = {};
    if (this.isValidOpenSaleRegistrationList()) {
      dataHeader = this.props.openSaleRegistration.list[0];
    }
    this.setState({
      modalConten: <PrintSummary
        dataHeader={dataHeader}
        summaryList={this.state.summaryList}
        totalSummary={this.state.totalSummary} />
    });
    this.isReadyToPrint = true;
  }

  renderPagination(fetchingProps) {}

  renderFilterRecord () {
    let data = null;
    if (this.isValidOpenSaleRegistrationList()) {
      data = this.props.openSaleRegistration.list[0];
    }
    return data ?
      <this.Row>
        <this.Col md="12">
          <h4 style={{paddingBottom: 5, borderBottom: "1px solid #ccc7c7"}}><this.Translate id="text_title_open_sale" /></h4>
        </this.Col>
        <this.Col md="3">
          <div>
            <this.Translate id="text_store"/>:
          </div>
          <div>
            {data.location.name}
          </div>
        </this.Col>
        <this.Col md="3">
          <div>
            <this.Translate id="text_register" />:
          </div>
          <div>
            {data.device.code}
          </div>
        </this.Col>
        <this.Col md="3">
          <div>
            <this.Translate id="text_open_time" />:
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
                  <this.Translate id="text_close_time" />:
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

  buttonActionCollection() {
    let isOpenedRegister = false;
    if (this.isOpenSaleRegistrationClosed()) {
      isOpenedRegister = true;
    }
    return [
      isOpenedRegister ?
        <div>
          <this.Button type="info" onClick={this.handlePrintSummary}>
            <span className="icon-print icon-padding-right text-uppercase"></span>
            <this.Translate id="text_print_summary"/>
          </this.Button>
          <this.Button loading={this.props.close.updating} type="info" className="margin-left-8" onClick={this.handleShowFormAdd}>
            <span className="icon-add icon-padding-right text-uppercase"></span><this.Translate id="text_open_register"/>
          </this.Button>
        </div>
        :
        ""
    ];
  }

  renderTable() {
    return (
      <this.Form onSubmit={this.handleCloseTodaySale}>
        <this.Table
          rowKey="paymentMethodId"
          dataSource={this.state.summaryList}
          columns={this.columns}
          locale={{emptyText: <this.Translate id="table_empty_data"/>}}
          loading={this.props.paymentMethodList.fetching}
          footer={() => <div className="wrap-table-footer">
            <div className="text-uppercase pull-left">
              <this.Translate id="text_total" />:
            </div>
            <div className="item pull-left" style={{width: 150}}>
              {this.Util.formatCurrency(this.state.totalSummary.expected, "")}
            </div>
            <div className="item pull-left" style={{width: 150}}>
              {this.Util.formatCurrency(this.state.totalSummary.count, "")}
            </div>
            <div className="item pull-left" style={{width: 150}}>
              <this.Tag color={this.colorDifferenceStatus[this.state.totalSummary.difference < 0 ? 1 : 0]} className="text-center label-stock-status" style={{marginRight: 0}}>
                {this.Util.formatCurrency(this.state.totalSummary.difference, "")}
              </this.Tag>
            </div>
            <div style={{clear: "both"}}></div>
          </div>} />
        {
          !this.isOpenSaleRegistrationClosed() ?
            <div style={{marginTop: 15}}>
              <this.Button htmlType="submit" loading={this.props.close.updating} type="info" className="pull-right">
                <span className="icon-completed icon-padding-right text-uppercase"></span>
                <this.Translate id="text_close_register"/>
              </this.Button>
            </div>
            :
            ""
        }
      </this.Form>);
  }
}
