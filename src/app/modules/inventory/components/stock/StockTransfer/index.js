import React from "react";
import List from "../List";
import Enum from "../../../enums";
import FormCreate from "../../../containers/stock/StockTransfer/FormCreate";
import FormUpdate from "../../../containers/stock/StockTransfer/FormUpdate";
import Constant from "../../../constants/stock/stockTransfer";
import StockTransferAction from "../../../actions/stock/stockTransfer";
import StockTransferService from "../../../services/stock/StockTransferService";
import StoreLoctionAction from "../../../../pos/action/settings/storeLocation";
import SupplierAction from "../../../actions/stock/supplier";
import "./index.css";

export default class Lists extends List {
  constructor(props) {
    super(props);
    this.formCreate = <FormCreate/>;
    this.columns = [
      this.columnCreatedAt,
      {
        title: <this.Translate id="text_no" />,
        dataIndex: "number",
        key: "number",
        sorter: true
      },
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="text_description" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      {
        title: <this.Translate id="text_from_location" />,
        dataIndex: "fromLocation",
        key: "fromLocation",
        sorter: true,
        render: fromLocation => fromLocation.name
      },
      {
        title: <this.Translate id="text_to_location" />,
        dataIndex: "toLocation",
        key: "toLocation",
        sorter: true,
        render: toLocation => toLocation.name
      },
      {
        title: <this.Translate id="text_transfer_by" />,
        dataIndex: "user",
        key: "user",
        sorter: true,
        render: user => user.fullName
      },
      {
        title: <this.Translate id="text_receive_by" />,
        dataIndex: "receiver",
        key: "receiver",
        sorter: true,
        render: receiver => receiver ? receiver.fullName : ""
      },
      {
        title: <this.Translate id="text_step" />,
        dataIndex: "step",
        key: "step",
        sorter: true,
        width: 100,
        render: step => step in this.STOCK_STRANSFER_STEP_STR ? <this.Tag color={this.STOCK_STRANSFER_STEP_STR[step].color} className="text-uppercase text-center po-step-tag">{this.STOCK_STRANSFER_STEP_STR[step].name}</this.Tag> : ""
      },
      this.columnStatus
    ];
    this.STOCK_STRANSFER_STEP_STR = {
      [Enum.STOCK_STRANSFER_STEP.TRANSFER]: {name: <this.Translate id="text_transfered" />, color: this.Enum.STOCK_TRANSFER_STEP_COLOR.TRANSFER},
      [Enum.STOCK_STRANSFER_STEP.RECEIVED]: {name: <this.Translate id="text_received" />, color:  this.Enum.STOCK_TRANSFER_STEP_COLOR.RECEIVED}
    };
    this.service = StockTransferService;
    this.columnFilterWithKey = ["name"];
    this.action = StockTransferAction;
    this.locationList = [{name: <this.Translate id="text_all_store"/>, id: 0}];
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;

  }

  handleShowFormEdit(rowData) {
    this.props.dispatch(StockTransferAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  buttonActionCollection() {
    return [
      this.renderButtonAddNew(),
      this.renderButtonExportCSV()
    ];
  }

  componentDidMount() {
    super.componentDidMount();
    this.props.dispatch(SupplierAction.fetch(100));
    this.props.dispatch(StoreLoctionAction.fetch(100));
  }


  renderFilterRecord() {
    const {form} = this.props;
    return(
      <div>
        { form == null ?
          ""
          :
          <this.Form onSubmit={this.handleSubmitFilter}>
            <this.Row className="main-search-layout">
              <this.Col md="2">
                <this.InputText
                  name="key"
                  label={<this.Translate id="stock_transfer_search_key_place_holder" />}
                  placeholder={this.CATranslate("stock_transfer_search_key_place_holder", this.props.locale)}
                  isAutoFocus={true}
                  form={form}/>
              </this.Col>
              <this.Col md="2">
                <this.Select
                  name="locationId"
                  label={<this.Translate id="text_store" />}
                  dataSource={this.locationList.concat(this.props.storeLocation.list)}
                  valueKey="id"
                  nameKey="name"
                  form={form}
                  defaultValue={this.locationList[0].id}/>
              </this.Col>
              <this.Col md="2">
                <this.Select
                  name="status"
                  label={<this.Translate id="text_status" />}
                  dataSource={this.statusList}
                  defaultValue={this.Enum.ALL_STATE}
                  form={form}
                />
              </this.Col>
              <this.Col md="2" className="wrap-btn-search">
                <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                  <label htmlFor="status" className="" title="">Filter</label>
                </div>
                <this.Button htmlType="submit" type="info" >
                  <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="text_search" />
                </this.Button>
              </this.Col>
            </this.Row>
          </this.Form>
        }
      </div>
    );
  }
}
