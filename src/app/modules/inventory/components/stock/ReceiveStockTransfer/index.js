import React from "react";
import List from "../List";
import Enum from "../../../enums";
import FormUpdate from "../../../containers/stock/ReceiveStockTransfer/FormUpdate";
import UnitAction from "../../../actions/products/productsUnit";
import LocationAction from "../../../../pos/action/settings/location";
import StockTransferAction from "../../../actions/stock/stockTransfer";
import StockTransferService from "../../../services/stock/StockTransferService";
import Constant from "../../../constants/stock/stockTransfer";

export default class Lists extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      setDefaultDate: []
    };
    this.formUpdate = <FormUpdate />;
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
        title: <this.Translate id="text_step" />,
        dataIndex: "step",
        key: "step",
        sorter: true,
        width: 100,
        render: step => step in this.STOCK_STRANSFER_STEP_STR ? <this.Tag color={this.STOCK_STRANSFER_STEP_STR[step].color} className="text-uppercase text-center po-step-tag">{this.STOCK_STRANSFER_STEP_STR[step].name}</this.Tag> : ""
      },
      {
        title: <this.Translate id="text_action" />,
        dataIndex: "id",
        key: "action",
        align: "center",
        width: 100,
        render: (text, record) => {
          return <this.Button
            type="info"
            id="btnAdd"
            className="mg-right text-uppercase"
            onClick={() => this.handleShowFormAccept(record)}>
            <span className="icon-arrow-down icon-padding-right"></span>
            <this.Translate id="text_receive"/>
          </this.Button>;
        }
      }
    ];
    this.STOCK_STRANSFER_STEP_STR = {
      [Enum.STOCK_STRANSFER_STEP.PROCESS]: {name: <this.Translate id="text_process" />, color: this.Enum.STOCK_TRANSFER_STEP_COLOR.PROCESS},
      [Enum.STOCK_STRANSFER_STEP.RECEIVED]: {name: <this.Translate id="text_received" />, color:  this.Enum.STOCK_TRANSFER_STEP_COLOR.RECEIVED},
      [Enum.STOCK_STRANSFER_STEP.CANCEL]: {name: <this.Translate id="text_canceled" />, color:  this.Enum.STOCK_TRANSFER_STEP_COLOR.CANCEL}
    };
    this.service = StockTransferService;
    this.action = StockTransferAction;
    this.callBackOnShowEditForm = this.showFormEdit;
    this.columnFilterWithKey = ["name", "description", "number"];
    this.RESET_CONSTANT = Constant.RESET_STOCK_TRANSFER;
    this.handleShowFormAccept = this.handleShowFormAccept.bind(this);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.approve.updated) {
      this.props.dispatch(StockTransferAction.fetchReceive(this.pageSize));
      nextProps.dispatch(StockTransferAction.reset(Constant.REQUEST_STOCK_TRANSFER_DETAIL_FULL_RESET));
      nextProps.dispatch(StockTransferAction.reset(Constant.RESET_APPROVE_STOCK_TRANSFER));
    } else if (nextProps.cancel.updated) {
      this.setState({loadingPopup: false});
      nextProps.dispatch(StockTransferAction.fetch(this.pageSize));
      nextProps.dispatch(StockTransferAction.reset(Constant.RESET_CANCEL_STOCK_TRANSFER));
    }
  }

  componentDidMount() {
    this.props.dispatch(StockTransferAction.fetchReceive(this.pageSize));
    this.props.dispatch(LocationAction.fetch(100));
    this.props.dispatch(UnitAction.fetch(100));
  }

  componentDidUpdate() {
    if (this.props.detail.fetched) {
      this.setState({loadingPopup: false});
      this.props.dispatch(StockTransferAction.reset(Constant.REQUEST_STOCK_TRANSFER_DETAIL_RESET));
    }

    let errorResponse = null;
    if (this.props.approve.error) {
      errorResponse = this.props.approve.error;
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

      this.props.dispatch(StockTransferAction.reset(Constant.RESET_APPROVE_STOCK_TRANSFER));
    }
  }

  handleShowFormAccept(rowData) {
    if (rowData.step === Enum.STOCK_STRANSFER_STEP.RECEIVED) {
      this.Message.error(this.CATranslate("error_receive_invalid_step", this.props.locale));
    } else {
      this.props.dispatch(StockTransferAction.detail(rowData));
      this.setState({
        loadingPopup: true,
        modalConten: <FormUpdate />
      });
    }
  }

  renderActionButton() {
    return [
      this.renderButtonExportCSV()
    ];
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", "", searchKey, ""));
          this.setState({isClickFilter: true});
        }
      
      }); 
    } 
  }

  renderFilterRecord() {
    const {form} = this.props;

    delete this.STOCK_STRANSFER_STEP_STR["3"]; // Remove cancel step away

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
                  placeholder={this.CATranslate("text_stock_transfer_general_search", this.props.locale)}
                  isAutoFocus={true}
                  form={form}/>
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
