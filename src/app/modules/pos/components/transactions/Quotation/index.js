import React from "react";
import Enum from "../../../enums";
import history from "../../../../../modules/common/router/history";
import List from "../List";
import FormCreate from "../../../containers/transactions/Quotation/FormCreate";
import FormUpdate from "../../../containers/transactions/Quotation/FormUpdate";
import Constant from "../../../constants/transactions/quotation";
import CustomerAction from "../../../../crm/actions/customers/customer";
import QuotationAction from "../../../action/transaction/quotation";
import ReceiptTemplateAction from "../../../../pos/action/settings/receiptTemplate";
import QuotationService from "../../../services/transactions/QuotationService";
import ReceiptA4Extend from "./ReceiptA4";
import Detail from "../../../containers/transactions/Quotation/Detail";
import InventoryUtil from "../../../../inventory/utils";
import InventoryEnum from "../../../../inventory/enums";
import "./index.css";

export default class QuotationList extends List {
  constructor(props) {
    super(props);
    this.state = {
      isNotYetLoadComponentDidUpdated: true,
      isRequestPrint: false,
      handleUpdateForm: false,
      quotationStatus: false,
      ...this.state
    }
    this.QUOTATION_STEP_STR = {
      [Enum.QUOTATION_STEP.DRAFT]: {name: <this.Translate id="purchase_order_step_draff" />, color:"warning"},
      [Enum.QUOTATION_STEP.PROCESS]: {name: <this.Translate id="text_process" />, color:"processing"},
      [Enum.QUOTATION_STEP.CANCEL]: {name: <this.Translate id="text_cancel" />, color:"error"}
    };
    this.columns = [
      this.columnCreatedAt,
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        sorter: true,
        render: (text,record) => `${record.name}:${record.number}`
      },
      {
        title: <this.Translate id="text_customer" />,
        dataIndex: "customer",
        key: "firstName",
        sorter: true,
        render: (customer) => customer ? `${customer.firstName} ${customer.lastName}` : this.emptyText
      },
      {
        title: <this.Translate id="text_phone_number" />,
        dataIndex: "customer",
        key: "phoneNumber",
        sorter: true,
        render :(text,record) => {
          if(record.customer){
            if(record.customer.phoneNumber){
             return record.customer.phoneNumber;
            }else{
              return this.emptyText
            }
          }
         }
      },
      {
        title: <this.Translate id="text_email" />,
        dataIndex: "customer",
        key: "email",
        sorter: true,
        render :(text,record) => {
         if(record.customer){
           if(record.customer.email){
            return record.customer.email;
           }else{
             return this.emptyText
           }
         }
        }
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
        width: 120,
        render: status => status in this.QUOTATION_STEP_STR ? <this.Badge style={{ textTransform: "uppercase" }} status={this.QUOTATION_STEP_STR[status].color}  text={this.QUOTATION_STEP_STR[status].name} /> : this.emptyText
      },
      {
        title: <this.Translate id="text_action" />,
        dataIndex: "id",
        key: "action",
        align: "center",
        width: 100,
        render: (text, record) => {
          return <div style={{ flexDirection: "row", display: "flex", width: "100%" }} className="action_create_quotation"> 
             <this.Button className="mg-right text-uppercase cancel_step" onClick={() => this.handleCancelQuotation(record,this.state.selectedRows)}>
                <span className="icon-cancel icon-padding-right"></span>
                <this.Translate id="text_cancel"/>
              </this.Button>
          </div>;
        }
      }
    ];
    this.customerList = [{firstName: this.CATranslate("text_all_customer", this.props.locale), lastName: "", id: 0}];
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.generalSearchLabel = "text_name";
    this.placeHolderForGeneralSearch = "text_name";
    this.columnFilterWithKey = ["name","number"];
    this.service = QuotationService;
    this.action = QuotationAction;
    this.RESET_CONSTANT = Constant.RESET_QUOTATION;
    this.handleCancelQuotation = this.handleCancelQuotation.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
  }

  componentDidMount(){
    this.props.dispatch(QuotationAction.fetch(this.pageSize,"","","",JSON.stringify({status: [Enum.QUOTATION_STEP.DRAFT]}),"",""));
    this.props.dispatch(CustomerAction.fetch(100));
    new Promise(() => {
      this.props.dispatch(ReceiptTemplateAction.default());
    });
  }

  handlePrint(){
    new Promise(() => {
      const selectLength = this.state.selectedListIds.length;
      if (selectLength === 0 && this.state.selectedListIds) {
        this.Message.error(this.CATranslate("text_reprint_warning_1", this.props.locale));
      } else if (selectLength > 1) {
        this.Message.error(this.CATranslate("text_reprint_warning_2", this.props.locale));
      } else {
        this.setState({isRequestPrint: true});  
        this.props.dispatch(QuotationAction.detail(this.state.selectedListIds[0]));
      }
    });
  }

  renderOtherAction(){
    return(
      <this.Button className="mg-right text-uppercase" type="info" loading={this.props.list.fetching && this.state.isRequestPrint} onClick={this.handlePrint}>
        <span className="icon-print icon-padding-right text-uppercase"></span><this.Translate id="text_print"/>
        <div id="receiptLogoPreLoading" style={{display: "none"}}>
          {<img style={{width: 100}} alt="" src={this.Util.getProductImage(this.props.receiptTemplate && this.props.receiptTemplate.data ? this.props.receiptTemplate.data.logo : "", "general").url} />}
        </div>
      </this.Button>
    );
  }

  renderButtonDelete(){}

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let filter = {};
          let searchKey = "";

          if (values.step !== -1) {
            filter["status"] = [values.step];
          }else if(values.customerId){
            filter["customerId"] = [values.customerId];
          }
          
          filter = JSON.stringify(filter);

          if(values.key){
            searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          }
          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, ""));
          this.setState({isClickFilter: true});
        }
      
      }); 
    } 
  }

  handleCancelQuotation(record){
    if(record.status === Enum.QUOTATION_STEP.DRAFT){
      let status = { status: Enum.QUOTATION_STEP.CANCEL, id: record.id }
      this.props.dispatch(QuotationAction.update(status)); 
    }else{
      this.Message.warning(this.CATranslate("text_error_allow_cancel_only_draft_step", this.props.locale));
    }
  }

  saveProcessQuotation(quotationEntry,values){
    let data = { 
      status: Enum.QUOTATION_STEP.PROCESS,
      Entries: quotationEntry,
      id: values.id,
      total: values.total,
      totalExcludeTax: values.totalExcludeTax
    }
    this.props.dispatch(QuotationAction.update(data)); 
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
             <this.Col md="2">
              <this.Select
                  name="customerId"
                  label={<this.Translate id="text_customer" /> }
                  dataSource={this.customerList.concat(this.props.customer.list)}
                  defaultValue={this.customerList[0].id}
                  valueKey="id"
                  nameKey="firstName"
                  concatNameKey="lastName"
                  form={form} />
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="step"
                label={<this.Translate id="text_step" />}
                dataSource={QuotationStepList}
                defaultValue={QuotationStepList[1].value}
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

  getProductOrderList(data) {
    let productOrderList = [];
    if (this.Util.isValidCollectionInObj(data, "quotationEntries")) {
      data.quotationEntries.forEach(quotationtionEntry => {
        if (quotationtionEntry.productVariant && quotationtionEntry.productVariant.product) {
          const productVariant = quotationtionEntry.productVariant;
          productOrderList.push({
            quantity: quotationtionEntry.quantity,
            name: InventoryUtil.getProductName(productVariant.product),
            productDescription: quotationtionEntry.description,
            variantName: productVariant.product.productOption === InventoryEnum.PRODUCT_VARIANT ? productVariant.name : "",
            price: quotationtionEntry.price,
          });
        }
      });
    }
    return productOrderList;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.update.updated || nextProps.add.added) {
      this.props.dispatch(QuotationAction.fetch(this.pageSize));
    }
  } 
 

  componentDidUpdate(){
    if(this.props.quotationDetail.data && this.state.isRequestPrint){
      let listProduct = this.getProductOrderList(this.props.quotationDetail.data);
        this.setState({
          modalConten: <Detail
            receiptContent={ 
              <ReceiptA4Extend 
                data={this.props.quotationDetail.data} 
                receiptTemplate={this.props.receiptTemplate}
                productList={listProduct} />}
                dispatch={this.props.dispatch} 
            />,
            isRequestPrint: false
        });
    }
    
    if(this.state.isNotYetLoadComponentDidUpdated && this.props.quotationDetail.fetching && this.state.handleUpdateForm){
      history.push("/transactions/quotation-update");
      this.setState({isNotYetLoadComponentDidUpdated: false, handleUpdateForm: false});
    }

    if(this.state.quotationStatus && this.props.quotationDetail.data){
      let quotationEntry = [];
      if(this.props.quotationDetail){
        this.props.quotationDetail.data.quotationEntries.forEach((values, index) => {
          quotationEntry.push({
              productVariantId: values.productVariantId,
              quantity: values.quantity,
              price: values.price,
              description: values.description
          });
        });
        this.saveProcessQuotation(quotationEntry,this.props.quotationDetail.data);
      }
      this.setState({quotationStatus: false})
    }

    this.Util.removeFullScreen();
  }

  handleShowFormAdd() {
    history.push("/transactions/quotation-create");
  }

  handleShowFormEdit(rowData){
    if(rowData.status === Enum.QUOTATION_STEP.DRAFT){
      this.setState({handleUpdateForm: true});
      this.props.dispatch(QuotationAction.detail(rowData.id));
    }else{
      this.Message.warning(this.CATranslate("text_error_allow_update_only_draft_step", this.props.locale));
    }
  }

  // handleDelete(){
  //   if(this.state.selectedRows[0].status !== Enum.QUOTATION_STEP.DRAFT){
  //     this.Message.warning(this.CATranslate("text_error_allow_only_delete_draft_step", this.props.locale));
  //   }else{
  //     this.setState({deleting: true});
  //     this.service.archive(this.state.selectedListIds)
  //       .then(response => {
  //         this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize));
  //         this.setState({
  //           selectedRowKeys: [],
  //           deleting: false
  //         });
  //       })
  //       .catch(err => {
  //         this.setState({deleting: false});
  //       });
  //   }
  // }

}
