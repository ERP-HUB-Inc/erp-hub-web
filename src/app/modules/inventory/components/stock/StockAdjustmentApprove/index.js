import React from "react";
import List from "../List";
import Enum from "../../../enums";
import FormUpdate from "../../../containers/stock/StockAdjustmentApprove/FormUpdate";
import Constant from "../../../constants/stock/stockAdjustmentApprove";
import StockAdjustmentApproveAction from "../../../actions/stock/stockAdjustmentApprove";
import StockAdjustmentApproveService from "../../../services/stock/StockAdjustmentApproveService";
import "../PurchaseOrder/index.css";

export default class StockAdjustmentApprovetLists extends List {
  constructor(props) {
    super(props);
    this.columns = [
      this.columnCreatedAt,
      {
        title: <this.Translate id="text_title" />,
        dataIndex: "title",
        key: "title",
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
      },
      {
        title: <this.Translate id="text_location" />,
        dataIndex: "location",
        key: "location",
        sorter: true,
        render: location => location ? location.name: this.emptyText
      },
      {
        title: <this.Translate id="text_step" />,
        dataIndex: "step",
        key: "step",
        sorter: true,
        width: 150,
        render: step => step in this.ADJUSTMENT_STEP ? <this.Tag color={this.ADJUSTMENT_STEP[step].color} className="text-uppercase text-center adjustment-step-tag">{this.ADJUSTMENT_STEP[step].name}</this.Tag> : ""
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
            onClick={() => this.handleApprove(record)}
          >
            <span className="icon-padding-right"></span>
            <this.Translate id="text_approve"/>
          </this.Button>;
        }
      }
    ];
    this.callBackOnShowEditForm = this.showFormEdit;
    this.fetchingProp = "stockAdjustmentApprove";
    this.service = StockAdjustmentApproveService;
    this.ADJUSTMENT_STEP = {
      [Enum.STOCK_ADJUST_STEP.REQUEST]: {name: <this.Translate id="text_requested" />, color:  this.Enum.STOCK_ADJUST_COLOR.REQUEST},
      [Enum.STOCK_ADJUST_STEP.COMPLETE]: {name: <this.Translate id="text_complete" />, color: this.Enum.STOCK_ADJUST_COLOR.COMPLETE}
    };
    this.columnFilterWithKey = ["title"];
    this.rowSelection = false;
    this.action = StockAdjustmentApproveAction;
    this.RESET_CONSTANT = Constant.RESET_STOCK_REQUEST;
    this.handleApprove = this.handleApprove.bind(this);
  }

  handleApprove(rowData){
    this.showFormEdit(rowData);
  }

  renderActionButton(){}

  showFormEdit(rowData) {
    this.props.dispatch(StockAdjustmentApproveAction.detail(rowData));  
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          // let filter = {};
          let rangFilter = {};

          if (values.date) {
            values.date = this.Util.formatDateForMYSQL(values.date);
            rangFilter = JSON.stringify({column: "createdAt", value: [values.date, values.date]});
          }

          // filter = JSON.stringify(filter);
          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", searchKey, rangFilter));
          this.setState({isClickFilter: true});
        }
        
      }); 
    } 
  }

  componentWillUpdate(nextProps){
    if (nextProps.stockAdjustmentApproveUpdate.updated) {
      nextProps.dispatch(StockAdjustmentApproveAction.fetch(this.pageSize));
      nextProps.dispatch(StockAdjustmentApproveAction.reset(Constant.RESET_STOCK_ADJUSTMENT_APPROVE));
    }
  }

  componentDidUpdate(){
    let errorResponse = null;
    if (this.props.stockAdjustmentApproveUpdate.error) {
      errorResponse = this.props.stockAdjustmentApproveUpdate.error;
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
      } 
      this.props.dispatch(StockAdjustmentApproveAction.reset());
      this.Message.error(message);
    }
  }

  renderFilterRecord() {
    const {form, locale} = this.props;
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