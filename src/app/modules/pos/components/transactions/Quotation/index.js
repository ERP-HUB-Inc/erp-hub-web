import React from "react";
import Enum from "../../../enums";
import history from "../../../../../modules/common/router/history";
import List from "../List";
import FormCreate from "../../../containers/transactions/Quotation/FormCreate";
import FormUpdate from "../../../containers/transactions/Quotation/FormUpdate";
import Constant from "../../../constants/transactions/quotation";
import CustomerAction from "../../../../crm/actions/customers/customer";
import QuotationAction from "../../../action/transaction/quotation";
import QuotationService from "../../../services/transactions/QuotationService";

export default class QuotationList extends List {
  constructor(props) {
    super(props);
    this.state = {
      isNotYetLoadComponentDidUpdated: true
    }
    this.QUOTATION_STEP_STR = {
      [Enum.QUOTATION_STEP.DRAFT]: {name: <this.Translate id="purchase_order_step_draff" />, color: this.Enum.PO_STEP_COLOR.DRAFT},
      [Enum.QUOTATION_STEP.PROCESS]: {name: <this.Translate id="text_process" />, color:  this.Enum.PO_STEP_COLOR.PROCESS},
      [Enum.QUOTATION_STEP.CANCEL]: {name: <this.Translate id="text_cancel" />, color:  this.Enum.PO_STEP_COLOR.CANCEL},
      [Enum.QUOTATION_STEP.COMPLETED]: {name: <this.Translate id="text_complete" />, color:  this.Enum.PO_STEP_COLOR.PAID}
    };
    this.columns = [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        sorter: true
      },
      {
        title: <this.Translate id="text_customer" />,
        dataIndex: "customer",
        sorter: true,
        render: (customer) => customer ? customer.firstName + " " + customer.lastName : this.emptyText
      },
      {
        title: <this.Translate id="text_terms" />,
        dataIndex: "term",
        sorter: true,
        render: (term) => term ? term : this.emptyText
      },
      {
        title: <this.Translate id="text_deposit" />,
        dataIndex: "deposit",
        sorter: true,
        render: (deposit) => deposit ? deposit : this.emptyText
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "total",
        sorter: true,
        render: (total) => this.Util.formatCurrency(total)
      },
      {
        title: <this.Translate id="text_step" />,
        dataIndex: "status",
        key: "status",
        sorter: true,
        width: 100,
        render: status => status in this.QUOTATION_STEP_STR ? <this.Tag color={this.QUOTATION_STEP_STR[status].color} className="text-uppercase text-center po-step-tag">{this.QUOTATION_STEP_STR[status].name}</this.Tag> : ""
      }
    ];
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.generalSearchLabel = "text_name";
    this.placeHolderForGeneralSearch = "text_name";
    this.columnFilterWithKey = ["name"];
    this.service = QuotationService;
    this.action = QuotationAction;
    this.RESET_CONSTANT = Constant.RESET_QUOTATION;
  }

  componentDidMount(){
    super.componentDidMount();
    this.props.dispatch(CustomerAction.fetch(100));
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let filter = {};
         
          if (values.step !== -1) {
            filter["status"] = [values.step];
          }
          filter = JSON.stringify(filter);
          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, ""));
          this.setState({isClickFilter: true});
        }
      
      }); 
    } 
  }

  renderFilterRecord() {
    const {form, locale} = this.props;

    const QuotationStepList = Object.keys(this.QUOTATION_STEP_STR).map((prop) => {
      return {name: this.QUOTATION_STEP_STR[prop].name, value: prop};
    });
    QuotationStepList.unshift({name: <this.Translate id="text_all_step"/>, value: -1});

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
                placeholder={this.CATranslate("text_general", locale)}
                isAutoFocus={true}
                form={form} />
            </this.Col>
             {/* <this.Col md="2">
              <this.Select
                  name="customerId"
                  label={<this.Translate id="text_customer" /> }
                  dataSource={[]}
                  // dataSource={this.supplierList.concat(this.props.supplier.list)}
                  // defaultValue={this.supplierList[0].id}
                  valueKey="id"
                  form={form} />
            </this.Col> */}
            <this.Col md="2">
              <this.Select
                name="step"
                label={<this.Translate id="text_step" />}
                dataSource={QuotationStepList}
                defaultValue={QuotationStepList[0].value}
                form={form} />
            </this.Col>
            <this.Col md="2" className="wrap-btn-search">
              <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                <label htmlFor="status" className="" title=""><this.Translate id="text_filter" /></label>
              </div>
              <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
                <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
              </this.Button>
            </this.Col>
          </this.Row>
        </this.Form>
    );
  }

  handleShowFormAdd() {
    history.push("/transactions/quotation-create");
  }

  componentDidUpdate(){
      if(this.state.isNotYetLoadComponentDidUpdated && this.props.quotationDetail.fetching){
        history.push("/transactions/quotation-update");
        this.setState({isNotYetLoadComponentDidUpdated: false});
      }
  }

  handleShowFormEdit(rowData){
    if(rowData.status === Enum.QUOTATION_STEP.DRAFT){
      this.props.dispatch(QuotationAction.detail(rowData.id));
    }else{
      this.Message.warning(this.CATranslate("text_error_allow_update_only_draft_step", this.props.locale));
    }
  }

}
