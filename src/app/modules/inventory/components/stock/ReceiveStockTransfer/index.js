import React from "react";
import List from "../StockTransfer";
import StockTransferAction from "../../../actions/stock/stockTransfer";
import Constant from "../../../constants/stock/stockTransfer";
import LoctionAction from "../../../../pos/action/settings/location";

export default class Lists extends List {

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
    this.props.dispatch(LoctionAction.fetchLocationAccess(100));
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
            filter["toLocationId"] = [values.locationId];
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
                  dataSource={this.locationList.concat(this.props.accessLocation.list)}
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
