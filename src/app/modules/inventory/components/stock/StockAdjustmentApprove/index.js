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
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="text_who_request" />,
        dataIndex: "number",
        key: "number"
      },
      {
        title: <this.Translate id="text_reason" />,
        dataIndex: "reason",
        key: "reason",
        width: 130
      },
      {
        title: <this.Translate id="text_step" />,
        dataIndex: "step",
        key: "step",
        sorter: true,
        width: 100,
        render: step => step in this.ADJUSTMENT_STEP ? <this.Tag color={this.ADJUSTMENT_STEP[step].color} className="text-uppercase text-center po-step-tag">{this.ADJUSTMENT_STEP[step].name}</this.Tag> : ""
      }
    ];
    this.formUpdate = <FormUpdate />;
    this.fetchingProp = "stockAdjustmentApprove";
    this.service = StockAdjustmentApproveService;
    this.ADJUSTMENT_STEP = {
      [Enum.STOCK_ADJUST_STEP.REQUEST]: {name: <this.Translate id="text_request" />, color:  this.Enum.STOCK_ADJUST_COLOR.REQUEST},
      [Enum.STOCK_ADJUST_STEP.COMPLETE]: {name: <this.Translate id="text_complete" />, color: this.Enum.STOCK_ADJUST_COLOR.COMPLETE}
    };
    this.columnFilterWithKey = ["name"];
    this.action = StockAdjustmentApproveAction;
    this.RESET_CONSTANT = Constant.RESET_STOCK_REQUEST;
  }

  showFormEdit(rowData) {
    this.props.dispatch(StockAdjustmentApproveAction.detail(rowData));  
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  handleDelete() {
    this.setState({deleting: true});
    StockAdjustmentApproveService.archive(this.state.selectedListIds)
      .then(response => {
        this.props.dispatch(StockAdjustmentApproveAction.fetch(this.pageSize, (this.state.current - 1) * this.pageSize));
        this.setState({
          selectedRowKeys: [],
          modalVisible: false,
          deleting: false
        });
      })
      .catch(err => {
        this.Message.error(this.CATranslate("error_warning_delete_po", this.props.locale));
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
      
      }); 
    } 
  }

  renderActionButton() {
   
  }

  renderFilterRecord() {
    const {form, locale} = this.props;

    const AdjustmentStepList = Object.keys(this.ADJUSTMENT_STEP).map((prop) => {
      return {name: this.ADJUSTMENT_STEP[prop].name, value: prop};
    });
    AdjustmentStepList.unshift({name: <this.Translate id="text_all_step"/>, value: -1});

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
                dataSource={AdjustmentStepList}
                defaultValue={AdjustmentStepList[0].value}
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