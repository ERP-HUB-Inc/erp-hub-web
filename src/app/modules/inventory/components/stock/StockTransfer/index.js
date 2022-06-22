import React from "react";
import List from "../List";
import Enum from "../../../enums";
import history from "../../../../common/router/history";
import FormCreate from "../../../containers/stock/StockTransfer/FormCreate";
import FormUpdate from "../../../containers/stock/StockTransfer/FormUpdate";
import Constant from "../../../constants/stock/stockTransfer";
import StockTransferAction from "../../../actions/stock/stockTransfer";
import StockTransferService from "../../../services/stock/StockTransferService";
import LoctionAction from "../../../../pos/action/settings/location";
import "./index.css";

export default class StockTransferList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      setDefaultDate: []
    };
    this.formCreate = <FormCreate />;
    this.formUpdate = <FormUpdate />;
    this.columns = [
      this.columnCreatedAt,
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
        title: <this.Translate id="text_step" />,
        dataIndex: "step",
        key: "step",
        sorter: true,
        width: 100,
        render: step => step in this.STOCK_STRANSFER_STEP_STR ? <this.Tag color={this.STOCK_STRANSFER_STEP_STR[step].color} className="text-uppercase text-center po-step-tag">{this.STOCK_STRANSFER_STEP_STR[step].name}</this.Tag> : ""
      }
    ];
    this.rowSelection = false;
    this.STOCK_STRANSFER_STEP_STR = {
      [Enum.STOCK_STRANSFER_STEP.PROCESS]: {name: <this.Translate id="text_process" />, color: this.Enum.STOCK_TRANSFER_STEP_COLOR.PROCESS},
      [Enum.STOCK_STRANSFER_STEP.RECEIVED]: {name: <this.Translate id="text_received" />, color:  this.Enum.STOCK_TRANSFER_STEP_COLOR.RECEIVED},
      [Enum.STOCK_STRANSFER_STEP.CANCEL]: {name: <this.Translate id="text_canceled" />, color:  this.Enum.STOCK_TRANSFER_STEP_COLOR.CANCEL}
    };
    this.service = StockTransferService;
    this.action = StockTransferAction;
    this.callBackOnShowEditForm = this.showFormEdit;
    this.columnFilterWithKey = ["name", "description", "number"];
    this.locationList = [{name: <this.Translate id="text_all_store"/>, id: 0}];
    this.RESET_CONSTANT = Constant.RESET_STOCK_TRANSFER;
  }

  renderButtonAddNew() {
    return (
      <this.Link to="/stocks/transfer/create" className="ant-btn info" style={{marginRight: 15}}>
        <span className="icon-add icon-padding-right"></span>
        <this.Translate id="text_add_new" />
      </this.Link>
    );
  }

  showFormEdit(rowData){
    history.push(`/stocks/transfer/update/${rowData.id}`);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.update.updated) {
      nextProps.dispatch(StockTransferAction.fetch(this.pageSize));
      nextProps.dispatch(StockTransferAction.reset(Constant.REQUEST_STOCK_TRANSFER_DETAIL_FULL_RESET));
      nextProps.dispatch(StockTransferAction.reset(Constant.RESET_UPDATE_STOCK_TRANSFER));
    } else if (nextProps.add.added) {
      nextProps.dispatch(StockTransferAction.fetch(this.pageSize));
      nextProps.dispatch(StockTransferAction.reset(Constant.RESET_ADD_STOCK_TRANSFER));
    } else if (nextProps.cancel.updated) {
      this.setState({loadingPopup: false});
      nextProps.dispatch(StockTransferAction.fetch(this.pageSize));
      nextProps.dispatch(StockTransferAction.reset(Constant.RESET_CANCEL_STOCK_TRANSFER));
    }
  }

  componentDidUpdate() {
    if (this.props.detail.fetched) {
      this.setState({loadingPopup: false});
      this.props.dispatch(StockTransferAction.reset(Constant.REQUEST_STOCK_TRANSFER_DETAIL_RESET));
    }

    let errorResponse = null;
    if (this.props.add.error) {
      errorResponse = this.props.add.error;
    } else if (this.props.update.error) {
      errorResponse = this.props.update.error;
    } else if (this.props.cancel.error) {
      errorResponse = this.props.cancel.error;
    }

    if (errorResponse) {
      let errorCode = this.Util.getErrorCodeFromState(errorResponse);

      let message = "Something wrong, Please contact system provider";

      if (errorCode === Enum.LOCATION_NOT_FOUND) {
        message = this.CATranslate("error_location_not_found", this.props.locale);
      } else if (errorCode === Enum.INVALID_TRANSFER_TO_SAME_LOCATION) {
        message = this.CATranslate("error_the_same_location", this.props.locale);
      } else if (errorCode === Enum.TRANSFER_NUMBER_EXIST) {
        message = this.CATranslate("text_transfer_number_exist", this.props.locale);
      } else if (errorCode === Enum.PRODUCT_NOT_FOUND) {
        message = this.CATranslate("error_product_not_found", this.props.locale);
      } else if (errorCode === Enum.PRODUCT_QTY_NOT_ENOUGHT) {
        message = this.CATranslate("text_transfer_qty_warning", this.props.locale);
      } else if (errorCode === Enum.TRANSFER_NOT_FOUND) {
        message = this.CATranslate("error_transfer_not_found", this.props.locale);
      } else if (errorCode === Enum.PRODUCT_UNIT_NOT_FOUND) {
        message = this.CATranslate("error_unit_not_found", this.props.locale);
      } else if (errorCode === Enum.INVALID_LOCATION_FOR_RECEIVE) {
        message = this.CATranslate("invalid_location_for_receive", this.props.locale);
      } else if (errorCode === Enum.FORBIDEN_STEP_PROCESS) {
        message = this.CATranslate("error_receive_invalid_step", this.props.locale);
      }

      this.Message.error(message);

      this.props.dispatch(StockTransferAction.reset(Constant.RESET_ADD_PARTIAL_STOCK_TRANSFER));
      this.props.dispatch(StockTransferAction.reset(Constant.RESET_UPDATE_PARTIAL_STOCK_TRANSFER));
      this.props.dispatch(StockTransferAction.reset(Constant.RESET_CANCEL_STOCK_TRANSFER));
      this.props.dispatch(StockTransferAction.reset(Constant.RESET_APPROVE_STOCK_TRANSFER));
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.props.dispatch(LoctionAction.fetch(100));
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let filter = {};
          let rangFilter = {};

          if (values.step !== -1) {
            filter["step"] = [values.step];
          }

          if (values.locationId !== 0) {
            filter["fromLocationId"] = [values.locationId];
          }

          if (values.createdAt && values.createdAt.length > 0) {
            rangFilter = JSON.stringify({
              column: "createdAt",
              value: [
                this.Util.formatDateForMYSQL(values.createdAt[0]) + " 00:00:00",
                this.Util.formatDateForMYSQL(values.createdAt[1]) + " 23:59:59"
              ]});
          }
    
          filter = JSON.stringify(filter);

          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, rangFilter));
          this.setState({isClickFilter: true});
        }
      
      }); 
    } 
  }

  renderFilterRecord() {
    const {form} = this.props;

    const STOCK_STRANSFER_STEP_STR_LIST = Object.keys(this.STOCK_STRANSFER_STEP_STR).map((prop) => {
      return {name: this.STOCK_STRANSFER_STEP_STR[prop].name, value: prop};
    });
    STOCK_STRANSFER_STEP_STR_LIST.unshift({name: <this.Translate id="text_all_step"/>, value: -1});

    return(
      <div>
        { form == null ?
          ""
          :
          <this.Form onSubmit={this.handleSubmitFilter}>
            <this.Row className="main-search-layout">
              <this.Col md="3">
                <this.InputText
                  name="key"
                  label={<this.Translate id="text_search" />}
                  placeholder={this.CATranslate("text_po_return_general_search", this.props.locale)}
                  isAutoFocus={true}
                  form={form}/>
              </this.Col>
              <this.Col md="2">
                <this.DateRangePicker
                  name="createdAt"
                  defaultValue={this.state.setDefaultDate}
                  label={<this.Translate id="text_date" />}
                  form={this.props.form}/>
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
                  name="step"
                  label={<this.Translate id="text_step" />}
                  dataSource={STOCK_STRANSFER_STEP_STR_LIST}
                  defaultValue={STOCK_STRANSFER_STEP_STR_LIST[0].value}
                  form={form} />
              </this.Col>
              <this.Col md="2" className="wrap-btn-search">
                <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                  <label htmlFor="status" className="" title="">Filter</label>
                </div>
                <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && this.props.list.fetching}>
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
