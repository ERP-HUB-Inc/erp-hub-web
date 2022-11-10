import React from "react";
import moment from "moment";
import {Dropdown, Menu, Icon, Tag, Row, Col, Card, Statistic, Pagination, message} from "antd";
import "./index.css";
import Component from "../../../../common/components/Component";
import QuotationA4 from "./QuotationA4";
import Enum from "../../../enums";
import history from "../../../../../modules/common/router/history";
import Constant from "../../../constants/transactions/quotation";
import CustomerAction from "../../../../crm/actions/customers/customer";
import QuotationAction from "../../../action/transaction/quotation";
import ReceiptTemplateAction from "../../../../pos/action/settings/receiptTemplate";
import QuotationService from "../../../services/transactions/QuotationService";
import Detail from "../../../containers/transactions/Quotation/Detail";
import InventoryUtil from "../../../../inventory/utils";
import InventoryEnum from "../../../../inventory/enums";

export default class QuotationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pagination: {},
      isNotYetLoadComponentDidUpdated: true,
      isRequestPrint: false,
      handleUpdateForm: false,
      quotationStatus: false,
      summaryData: {},
      data: []
    };
    this.QUOTATION_STATUS_STR = {
      [Enum.QUOTATION_STATUS.DRAFT]: {name: <this.Translate id="text_draft" />, color: "#d9d9d9"},
      [Enum.QUOTATION_STATUS.SENT]: {name: <this.Translate id="text_sent" />, color: "#108ee9"},
      [Enum.QUOTATION_STATUS.APPROVED]: {name: <this.Translate id="text_approved" />, color: "#87d068"},
      [Enum.QUOTATION_STATUS.CLOSED]: {name: <this.Translate id="text_closed" />, color: "#f50"}
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
        dataIndex: "firstName",
        key: "firstName",
        render: (firstName, record) => `${firstName ? firstName : ""} ${record.lastName ? record.lastName : ""}`
      },
      {
        title: <this.Translate id="text_phone_number" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        render: (phoneNumber) => phoneNumber
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
      }
    ];
    this.columnFilterWithKey = ["name", "number"];
    this.service = QuotationService;
    this.pageSize = 50;
    this.fetchingProp = "list";
    this.pathname = "/transactions/quotation";
    this.RESET_CONSTANT = Constant.RESET_QUOTATION;
    this.handleCancelQuotation = this.handleCancelQuotation.bind(this);
    this.handleShowFormAdd = this.handleShowFormAdd.bind(this);
  }

  componentDidMount(){

    const params = new URLSearchParams(document.location.search);

    if (params.get("limit")) {
      this.pageSize = params.get("limit");
    }

    if (params.get("offset")) {
      this.setState({current: parseInt(params.get("offset"))});
    }

    if (params.get("search")) {
      this.props.form.setFieldsValue({search: params.get("search")});
    }

    if (params.get("start")) {
      this.props.form.setFieldsValue({dates: [moment(params.get("start")), moment(params.get("end"))]});
    }

    if (params.get("status")) {
      this.props.form.setFieldsValue({status: params.get("status")});
    }

    QuotationService.summary().then(({data})=>{
      this.setState({summaryData: data.data});
    });
    this.fetchList(true);
    this.props.dispatch(CustomerAction.fetch(100));
    new Promise(() => {
      this.props.dispatch(ReceiptTemplateAction.default());
    });
  }

  fetchList(withPagination= false) {
    let searchKey = "";
    let filter = {};
    let limit = this.pageSize;
    let ranges = "";
    let offset = this.state.current;
    const params = new URLSearchParams(document.location.search);
    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    if (params.get("search")) {
      searchKey = JSON.stringify({column: this.columnFilterWithKey, value: params.get("search")});
    }

    if (params.get("start") && params.get("end")) {
      ranges = JSON.stringify({column: "quotationDate", value: [params.get("start"), params.get("end")]});
    }

    if (params.get("status")) {
      filter = JSON.stringify({status: Number(params.get("status"))});
    }

    offset = (offset - 1) * limit;

    if (!withPagination){
      offset = 0;
      params.delete("offset");
      this.setState({current: 1});
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());

    this.setState({loading: true});
    QuotationService.lists(limit, offset, "", "", filter, searchKey, ranges)
        .then(response => {
          this.setState({data: response && response.data});
        })
        .catch(err => message.error("Error"))
        .finally(() => this.setState({loading: false, loadingButton: false}));
  }

  buttonActionCollection(){
    return [
      <this.Button key={1} type="info" id="btnAdd" className="mg-right text-uppercase" disabled={this.state.loadingPopup || this.props[this.fetchingProp].fetching} onClick={this.handleShowFormAdd}>
        <span className="icon-add icon-padding-right"></span>
        <this.Translate id="text_add_new" />
      </this.Button>
    ];
  }

  handleSubmitFilter = (e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const params = new URLSearchParams(document.location.search);

          if (values.search && values.search.trim()) {
            params.set("search", values.search.trim());
          } else {
            params.delete("search");
          }

          if (values.dates && values.dates.length) {
            params.set("start", moment(values.dates[0]).format("YYYY-MM-DD"));
            params.set("end", moment(values.dates[1]).format("YYYY-MM-DD"));
          } else {
            params.delete("start");
            params.delete("end");
          }

          if (values.status && values.status >= 0) {
            params.set("status", values.status);
          } else {
            params.delete("status");
          }

          this.Util.pushParamsToURL(this.pathname, params.toString());
          this.fetchList();
          this.setState({isClickFilter: true});
        }
      
      }); 
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
          <this.Col md="3">
            <this.InputText
              name="search"
              label={<this.Translate id="text_search" />}
              placeholder={this.CATranslate("text_general", locale)}
              isAutoFocus={true}
              form={form} />
          </this.Col>
          <this.Col md="3">
            <this.DateRangePicker
              name="dates"
              label={<this.Translate id="text_date" />}
              form={form}
              ranges={[]} />
          </this.Col>
          <this.Col md="3">
            <this.Select
              name="status"
              label={<this.Translate id="text_status" />}
              dataSource={QuotationStepList}
              defaultValue={QuotationStepList[0].value}
              form={form} />
          </this.Col>
          <this.Col md="3" className="wrap-btn-search">
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

  onShowSizeChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onChangePagination = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true);
  }

  renderPagination(fetchingProp, className = "float-right") {
    const data = this.state.data && this.state.data.pagination;
    let pagination = {
      total: data && data.total,
      pageSize: data && data.limit,
      current: this.state.current,
      pageSizeOptions: this.pageSizeOptions
    };

    const showTotal = total => {
      return `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`;
    };

    return(
        pagination.total > 0 ?
            <div className={className}>
              <Pagination
                  size="small"
                  showTotal={showTotal}
                  showSizeChanger
                  defaultCurrent={this.state.current}
                  defaultPageSize={this.pageSize}
                  onShowSizeChange={this.onShowSizeChange}
                  onChange={this.onChangePagination}
                  {...pagination} />
            </div>
            :
            ""
    );
  }

  render() {
    const {summaryData} = this.state;
    return (
        <React.Fragment>
          <Row gutter={16} style={{marginTop: 15, marginBottom: 15}}>
            <Col span={8}>
              <Card>
                <Statistic
                    title={<this.Translate id="text_sent"/>}
                    value={summaryData.sent ? summaryData.sent : 0 }
                    precision="0"
                    valueStyle={{color: "rgb(24, 144, 255)"}}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                    title={<this.Translate id="text_approved"/>}
                    value={summaryData.approved ? summaryData.approved : 0 }
                    precision="0"
                    valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                    title={<this.Translate id="text_closed"/>}
                    value={summaryData.closed ? summaryData.closed : 0 }
                    precision="0"
                    valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
          </Row>
          <div className="content-list">
            <div style={{height: "100%"}}>
              <div className="table-wrapper">
                {this.renderFilterRecord()}
              </div>
            </div>
          </div>
          <div className="content-list">
            <div style={{height: "100%"}}>
              <div className="table-wrapper">
                {
                  this.buttonActionCollection()
                }
                <this.Table
                    bordered={true}
                    rowKey="id"
                    loading={this.state.loading}
                    columns={this.columns}
                    dataSource={this.state.data.data}
                    onChange={this.onChange}
                />
                <div style={{marginTop: 15}}>
                  {this.renderPagination(this.state.pagination)}
                </div>
                <this.clearFloating/>
              </div>
            </div>
          </div>
        </React.Fragment>
    );
  }

}
