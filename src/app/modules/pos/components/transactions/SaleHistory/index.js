import React from "react";
import List from "../List";
import Constant from "../../../constants/transactions/saleHistory";
import CurrencyAction from "../../../action/transaction/saleHistory";
import CurrencyService from "../../../services/settings/CurrencyService";

export default class CurrencyList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.title = "Currency";
    this.fetchingProp = "saleHistory";
    this.addingProp = "saleHistoryAdd";
    this.updatingProp = "saleHistoryUpdate";
    this.columnFilterWithKey = ["name"];
    this.service = CurrencyService;
    this.action = CurrencyAction;
    this.RESET_CONSTANT = Constant.RESET_CURRENCY;
  }


  render() {
    return super.render();
  }

  renderActionButton(){
    return(
      <this.Button htmlType="submit" type="info" >
        <span className="icon-print icon-padding-right text-uppercase"></span>Print
      </this.Button>
    );
  }

  renderFilterRecord() {
    const {form,locale} = this.props;
    return(
      <div>
        <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout profit-and-lose form-group"> 

            <this.Col md="2" className="reorder-point-button-search">
              <this.Select
                name="type"
                placeholder={this.CATranslate("place_holder_profit_and_lost_report_type", locale)}
                dataSource={this.statusList}
                label={<this.Translate id="text_status" />}
                defaultValue={this.Enum.ALL_STATE}
                form={form}
              />
            </this.Col>
            <this.Col md="2" className="reorder-point-button-search">
              <this.Select
                name="type"
                placeholder={this.CATranslate("place-holder-sale-history-store", locale)}
                dataSource={this.statusList}
                label={<this.Translate id="input-sale-history-store" />}
                defaultValue={this.Enum.ALL_STATE}
                form={form}
              />
            </this.Col>
            <this.Col md="2" className="reorder-point-button-search">
              <this.Select
                name="type"
                placeholder={this.CATranslate("place-holder-sale-history-employee", locale)}
                dataSource={this.statusList}
                label={<this.Translate id="input-sale-history-employee" />}
                defaultValue={this.Enum.ALL_STATE}
                form={form}
              />
            </this.Col>
            <this.Col md="2" className="reorder-point-button-search">
              <this.DatePickers
                name="createdAt"
                label={<this.Translate id="input_inventory_report_date" />}
                form={form}
              />
            </this.Col>
            <this.Col md="2" className="reorder-point-button-search">
              <this.InputText
                name="customer"
                placeholder={this.CATranslate("place-holder-sale-history-for-customer", locale)}
                label={<this.Translate id="input-sale-history-customer" />}
                form={form}
              />
            </this.Col>
            <this.Col md="2" className="reorder-point-button-search">
              <this.InputText
                name="saleNumber"
                placeholder={this.CATranslate("place-holder-sale-history-for-sale-no", locale)}
                label={<this.Translate id="input-sale-history-sale-number" />}
                form={form}
              />
            </this.Col>
            <this.Col md="2" className="reorder-point-button-search">
              <this.InputText
                name="serialnumber"
                placeholder={this.CATranslate("place-holder-sale-history-serial-number", locale)}
                label={<this.Translate id="input-sale-history-serial-number" />}
                form={form}
              />
            </this.Col>
            
            <this.Col md="2" className="reorder-point-button-search report-button">
              <this.Button htmlType="submit" type="info" >
                <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="button_stock_reorder_search" />}
              </this.Button> 
            </this.Col>
            
          </this.Row>
        </this.Form>
      </div>
    );
  }

}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      this.columnNo,
      {
        title: <this.Translate id="col-sale-history-sold-by" />,
        dataIndex: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col-sale-history-customer" />,
        dataIndex: "symbol",
        sorter: true
      },
      {
        title: <this.Translate id="col-sale-history-notation" />,
        dataIndex: "value",
        sorter: true
      },
      {
        title: <this.Translate id="col-sale-history-sub-total" />,
        dataIndex: "value",
        sorter: true
      },
      {
        title: <this.Translate id="col-sale-history-tax" />,
        dataIndex: "value",
        sorter: true
      },
      {
        title: <this.Translate id="col-sale-history-sale-total" />,
        dataIndex: "value",
        sorter: true
      },
      this.columnStatus
    ];
  }
}