import React from "react";
import moment from "moment";
import { Dropdown, Menu, Icon, Tag } from "antd";
import QuotationA4 from "./QuotationA4";
import List from "../List";
import Enum from "../../../enums";
import history from "../../../../../modules/common/router/history";
import FormCreate from "../../../containers/transactions/Quotation/FormCreate";
import FormUpdate from "../../../containers/transactions/Quotation/FormUpdate";
import Constant from "../../../constants/transactions/quotation";
import CustomerAction from "../../../../crm/actions/customers/customer";
import QuotationAction from "../../../action/transaction/quotation";
import ReceiptTemplateAction from "../../../../pos/action/settings/receiptTemplate";
import QuotationService from "../../../services/transactions/QuotationService";
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
    };
    this.QUOTATION_STATUS_STR = {
      [Enum.QUOTATION_STATUS.DRAFT]: {name: <this.Translate id="text_draft" />, color: "#d9d9d9"},
      [Enum.QUOTATION_STATUS.SENT]: {name: <this.Translate id="text_sent" />, color: "#108ee9"},
      [Enum.QUOTATION_STATUS.APPROVED]: {name: <this.Translate id="text_approved" />, color: "#87d068"},
      [Enum.QUOTATION_STATUS.CLOSED]: {name: <this.Translate id="text_close" />, color: "#f50"}
    };
    this.columns = [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "quotationDate",
        key: "quotationDate",
        render: (quotationDate) => this.Util.formatDate(quotationDate, "DD/MM/YYYY")
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (status, record) => {
          const quotation_status = {
            name: this.QUOTATION_STATUS_STR[Number(status)].name,
            color: this.QUOTATION_STATUS_STR[Number(status)].color
          };

          if (record.validDate && moment(moment(record.validDate).format("YYYY-MM-DD")).isBefore(moment(moment().format("YYYY-MM-DD")))) {
            quotation_status.name = <this.Translate id="text_expired" />;
            quotation_status.color = "#f5222d";
          }
          return status in this.QUOTATION_STATUS_STR ? <Tag color={quotation_status.color} style={{width: 100, textAlign: "center", margin: 0}}>{quotation_status.name}</Tag> : this.emptyText;
        }
      },
      {
        title: <this.Translate id="text_quotation_no" />,
        dataIndex: "number",
        key: "number",
        width: 160,
        render: (number, record) => {
          const menu = (
            <Menu>
              <Menu.Item onClick={() => this.handleShowFormUpdate(record)}>
                <Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_edit" />
              </Menu.Item>
              <Menu.Item>
                <this.Link to={`/transactions/quotation-detail/${record.id}`}>
                  <Icon type="eye" style={{marginRight: 10}} /> <this.Translate id="text_view_detail" />
                </this.Link>
              </Menu.Item>
            </Menu>
          );
          return <div className="wrap-product-name" style={{display: "flex"}}>
            {number}
            <Dropdown className="product-row-option" overlay={menu}>
              {/*eslint-disable-next-line*/}
              <a className="ant-dropdown-link" href="#" onClick={e => e.preventDefault()} style={{marginLeft: 10}}>
                <this.Translate id="text_option" /> <Icon type="down" />
              </a>
            </Dropdown>
          </div>;
        }
      },
      {
        title: <this.Translate id="text_customer" />,
        dataIndex: "customer",
        key: "customer",
        render: customer => customer ? `${customer.firstName} ${customer.lastName}` : this.emptyText
      },
      {
        title: <this.Translate id="text_phone_number" />,
        dataIndex: "customer",
        key: "phoneNumber",
        render: customer => customer && customer.phoneNumber ? customer.phoneNumber : this.emptyText
      },
      {
        title: <this.Translate id="text_sub_total" />,
        key: "subTotal",
        align: "right",
        render: (total, record) => this.Util.formatCurrency(record.totalExcludeTax)
      },
      {
        title: <this.Translate id="text_discount" />,
        dataIndex: "discount",
        key: "discount",
        align: "right",
        render: (discount) => this.Util.formatCurrency(discount)
      },
      {
        title: <this.Translate id="text_vat" />,
        dataIndex: "totalExcludeTax",
        key: "totalExcludeTax",
        align: "right",
        render: (totalExcludeTax, record) => this.Util.formatCurrency(record.total - totalExcludeTax)
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "total",
        key: "total",
        align: "right",
        render: (total, record) => this.Util.formatCurrency(total - this.Util.floor(record.discount))
      },
      // {
      //   title: <this.Translate id="text_action" />,
      //   key: "action",
      //   align: "center",
      //   width: 100,
      //   render: (text, record) => {
      //     return <this.Button className="mg-right text-uppercase danger" onClick={() => this.handleCancelQuotation(record, this.state.selectedRows)}>
      //       <span className="icon-cancel icon-padding-right"></span>
      //       <this.Translate id="text_cancel" />
      //     </this.Button>;
      //   }
      // }
    ];
    this.customerList = [{firstName: this.CATranslate("text_all_customer", this.props.locale), lastName: "", id: 0}];
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.generalSearchLabel = "text_name";
    this.placeHolderForGeneralSearch = "text_name";
    this.columnFilterWithKey = ["name", "number"];
    this.service = QuotationService;
    this.action = QuotationAction;
    this.RESET_CONSTANT = Constant.RESET_QUOTATION;
    this.handleCancelQuotation = this.handleCancelQuotation.bind(this);
    this.handleShowFormAdd = this.handleShowFormAdd.bind(this);
  }

  componentDidMount(){
    this.props.dispatch(QuotationAction.fetch(this.pageSize, "", "", "", "", "", ""));
    this.props.dispatch(CustomerAction.fetch(100));
    new Promise(() => {
      this.props.dispatch(ReceiptTemplateAction.default());
    });
  }

  buttonActionCollection(){
    return [
      <this.Button key={1} type="info" id="btnAdd" className="mg-right text-uppercase" disabled={this.state.loadingPopup || this.props[this.fetchingProp].fetching} onClick={this.handleShowFormAdd}>
        <span className="icon-add icon-padding-right"></span>
        <this.Translate id="text_add_new" />
      </this.Button>
    ];
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let filter = {};
          let searchKey = "";

          if (values.status !== -1) {
            filter["status"] = [values.status];
          }

          if (values.customerId) {
            filter["customerId"] = [values.customerId];
          }
          
          filter = JSON.stringify(filter);

          if(values.key){
            searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          }
          console.log("filter", filter);
          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, ""));
          this.setState({isClickFilter: true});
        }
      
      }); 
    } 
  }

  handleCancelQuotation(record){
    if(record.status === Enum.QUOTATION_STEP.DRAFT){
      this.Util.sweetAlertConfirm(this.CATranslate("text_are_you_sure", this.props.locale))
      .then(willCancel => {
        if (willCancel) {
          let status = { status: Enum.QUOTATION_STEP.CANCEL, id: record.id };
          this.props.dispatch(QuotationAction.update(status)); 
        }
      });
    }else{
      this.Message.warning(this.CATranslate("text_error_allow_cancel_only_draft_step", this.props.locale));
    }
  }

  renderFilterRecord() {
    const {form, locale} = this.props;

    const QuotationStepList = Object.keys(this.QUOTATION_STATUS_STR).map((prop) => {
      return {name: this.QUOTATION_STATUS_STR[prop].name, value: prop};
    });
    QuotationStepList.unshift({name: <this.Translate id="text_all_status"/>, value: -1});


    const fetchingProps = this.props[this.fetchingProp];
    return form == null ?
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
              name="status"
              label={<this.Translate id="text_status" />}
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
      </this.Form>;
  }

  getProductOrderList(data) {
    let productOrderList = [];
    if (this.Util.isValidCollectionInObj(data, "quotationEntries")) {
      data.quotationEntries.forEach(quotationtionEntry => {
        if (quotationtionEntry.productVariant && quotationtionEntry.productVariant.product) {
          const productVariant = quotationtionEntry.productVariant;
          productOrderList.push({
            quantity: quotationtionEntry.quantity,
            name: InventoryUtil.getProductNameV2(productVariant.product),
            unit: productVariant.product ? productVariant.product.unit : null,
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
      this.props.dispatch(QuotationAction.fetch(this.pageSize,"","","",JSON.stringify({status: [Enum.QUOTATION_STEP.DRAFT]}),"",""));
    }
  } 
 

  componentDidUpdate(){
    if(this.props.quotationDetail.data && this.state.isRequestPrint){
      let listProduct = this.getProductOrderList(this.props.quotationDetail.data);
      this.setState({
        modalConten: <Detail
          receiptContent={ 
            <QuotationA4 
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

    this.Util.removeFullScreen();
  }

  handleShowFormAdd() {
    history.push("/transactions/quotation-create");
  }

  handleShowFormEdit(rowData) {
    return;
  }

  handleShowFormUpdate(rowData){
    history.push(`/transactions/quotation-update/${rowData.id}`);
  }
}
