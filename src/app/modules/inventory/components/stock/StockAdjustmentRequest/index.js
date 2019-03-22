import React from "react";
import List from "../List";
import Enum from "../../../enums";
import FormCreate from "../../../containers/stock/StockAdjustmentRequest/FormCreate";
import FormUpdate from "../../../containers/stock/StockAdjustmentRequest/FormUpdate";
import Constant from "../../../constants/stock/stockAdjustmentRequest";
import StockAdjustmentRequestAction from "../../../actions/stock/stockAdjustmentRequest";
import StockAdjustmentRequestService from "../../../services/stock/StockAdjustmentRequestService";
import "../PurchaseOrder/index.css";

export default class StockAdjustmentRequestLists extends List {
  constructor(props) {
    super(props);
    this.columns = [
      this.columnCreatedAt,
      {
        title: <this.Translate id="text_title" />,
        dataIndex: "title",
        key: "title",
        width: 500,
        sorter: true
      },
      {
        title: <this.Translate id="text_who_request" />,
        dataIndex: "user",
        key: "user",
        render: user => user ? user.fullName : this.emptyText
      },
      {
        title: <this.Translate id="text_reason" />,
        dataIndex: "reason",
        key: "reason",
        width: 300
      },
      {
        title: <this.Translate id="text_step" />,
        dataIndex: "step",
        key: "step",
        sorter: true,
        width: 150,
        render: step => step in this.ADJUSTMENT_STEP ? <this.Tag color={this.ADJUSTMENT_STEP[step].color} className="text-uppercase text-center adjustment-step-tag">{this.ADJUSTMENT_STEP[step].name}</this.Tag> : ""
      }
    ];
    this.formCreate = <FormCreate/>;
    this.callBackOnShowEditForm = this.showFormEdit;
    this.fetchingProp = "stockAdjustmentRequest";
    this.service = StockAdjustmentRequestService;
    this.ADJUSTMENT_STEP = {

      [Enum.STOCK_ADJUST_STEP.REQUEST]: {name: <this.Translate id="text_request" />, color:  this.Enum.STOCK_ADJUST_COLOR.REQUEST},
      [Enum.STOCK_ADJUST_STEP.COMPLETE]: {name: <this.Translate id="text_complete" />, color: this.Enum.STOCK_ADJUST_COLOR.COMPLETE}
    };
    this.columnFilterWithKey = ["title","reason"];
    this.action = StockAdjustmentRequestAction;
    this.RESET_CONSTANT = Constant.RESET_STOCK_ADJUSTMENT_REQUEST;
  }

  componentWillUpdate(nextProps){
    if (nextProps.stockAdjustmentRequestAdd.added) {
      nextProps.dispatch(StockAdjustmentRequestAction.fetch(this.pageSize));
      nextProps.dispatch(StockAdjustmentRequestAction.reset());
    }
    if (nextProps.stockAdjustmentRequestUpdate.updated) {
      nextProps.dispatch(StockAdjustmentRequestAction.fetch(this.pageSize));
      nextProps.dispatch(StockAdjustmentRequestAction.reset());
      nextProps.dispatch(StockAdjustmentRequestAction.reset(Constant.RESET_STOCK_ADJUSTMENT_FULL_RESET));
    }
    
  }

  componentDidUpdate() {
    let errorResponse = null;
    if (this.props.stockAdjustmentRequestAdd.error) {
      errorResponse = this.props.stockAdjustmentRequestAdd.error;
    } else if (this.props.stockAdjustmentRequestUpdate.error) {
      errorResponse = this.props.stockAdjustmentRequestUpdate.error;
    } 
    if (errorResponse) {
      let errorCode = this.Util.getErrorCodeFromState(errorResponse);
      let message = "Something wrong, Please contact system provider";
      if (errorCode === Enum.LOCATION_NOT_FOUND) {
        message = this.CATranslate("error_location_not_found", this.props.locale);
      } else if (errorCode === Enum.PRODUCT_NOT_FOUND) {
        message = this.CATranslate("error_product_not_found", this.props.locale);
      } else if (errorCode === Enum.PRODUCT_UNIT_NOT_FOUND) {
        message = this.CATranslate("error_unit_not_found", this.props.locale);
      } else if (errorCode === Enum.INVALID_LOCATION_FOR_RECEIVE) {
        message = this.CATranslate("invalid_location_for_receive", this.props.locale);
      } else if (errorCode === Enum.STOCK_ADJUSTMENT_ENTRY_NOT_FOUND) {
        message = this.CATranslate("invalid_stock_adjustment_entry", this.props.locale);
      }
      this.props.dispatch(StockAdjustmentRequestAction.reset());
      this.Message.error(message);
    }

  }

  showFormEdit(rowData){
    if(rowData.step === Enum.STOCK_ADJUST_STEP.REQUEST){
      this.props.dispatch(StockAdjustmentRequestAction.detail(rowData));  
      this.setState({
        modalConten: <FormUpdate/>
      });
    }else{
      this.Message.warning(this.CATranslate("error_warning_edit_adjustment", this.props.locale));
    }
  }

  handleDelete() {
    this.setState({deleting: true});
    StockAdjustmentRequestService.archive(this.state.selectedListIds)
      .then(response => {
        this.props.dispatch(StockAdjustmentRequestAction.fetch(this.pageSize, (this.state.current - 1) * this.pageSize));
        this.setState({
          selectedRowKeys: [],
          modalVisible: false,
          deleting: false
        });
      })
      .catch(err => {
        this.Message.error(this.CATranslate("error_warning_delete_adjustment", this.props.locale));
        this.setState({deleting: false});
        this.setState({
          modalVisible: false,
          deleting: false
        });
      });
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
      
        if (!err) {

          let filter = {};
          if (values.step !== -1) {
            filter["step"] = [values.step];
          }
    
          filter = JSON.stringify(filter);

          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey));
          this.setState({isClickFilter: true});
        }
        
      }); 
    } 
  }

  
  

  renderFilterRecord() {
    const {form, locale} = this.props;

    const adjustmentStepList = Object.keys(this.ADJUSTMENT_STEP).map((prop) => {
      return {name: this.ADJUSTMENT_STEP[prop].name, value: prop};
    });
    adjustmentStepList.unshift({name: <this.Translate id="text_all_step"/>, value: -1});

    const fetchingProps = this.props[this.fetchingProp];
    return (
      form == null ?
        ""
        :
        <this.Form onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout">
            <this.Col md="2">
              <this.InputText
                name="key"
                label={<this.Translate id="text_search" />}
                placeholder={this.CATranslate("text_search", locale)}
                isAutoFocus={true}
                form={form}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="step"
                label={<this.Translate id="text_step" />}
                dataSource={adjustmentStepList}
                defaultValue={adjustmentStepList[0].value}
                form={form}
              />
            </this.Col>
            <this.Col md="2" className="wrap-btn-search">
              <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                <label htmlFor="status" className="" title="">Filter</label>
              </div>
              <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
                <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
              </this.Button>
            </this.Col>
          </this.Row>
        </this.Form>
    );
  }

}