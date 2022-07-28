import React from "react";
import swal from "sweetalert";
import { 
  Dropdown,
  Menu,
  Icon
} from "antd";
import List from "../List";
import Enum from "../../../enums";
import POSUtil from "../../../utils";
import TransactionService from "../../../services/transactions/TransactionService";
import InvoiceService from "../../../services/transactions/InvoiceService";
import InventoryEnum from "../../../../inventory/enums";
import history from "../../../../common/router/history";

export default class Invoice extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isRequestReturn: false,
      setDefaultDate: [],
      data: [],
      loading: false
    };
    this.title = <this.Translate id="text_sales"/>;
    this.fetchingProp = "list";
    this.columnFilterWithKey = ["firstName", "lastName", "email", "phoneNumber"];

    this.INVOICE_STATUS_STR = {
      [Enum.INVOICE_STATUS.DRAFT]: { title: <this.Translate id="text_draft" />, color: "default" },
      [Enum.INVOICE_STATUS.SENT]: { title: <this.Translate id="processing" />, color: "processing" },
      [Enum.INVOICE_STATUS.PARTIAL]: { title: <this.Translate id="text_partial_pay" />, color: "warning"},
      [Enum.INVOICE_STATUS.PAID]: { title: <this.Translate id="text_paid" />, color: "success"},
    };

    this.service = InvoiceService;

    this.employeeList = [{
      id: "",
      fullName: <this.Translate id="text_all_employee"/>
    }];
    this.storeList = [{
      id: "",
      name: <this.Translate id="text_all_store"/>
    }];

    this.columns = [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "registerDate",
        key: "registerDate",
        render: registerDate => this.Util.formatDateTime(registerDate),
        sorter: true
      },
      {
        title: <this.Translate id="text_invoice_no" />,
        dataIndex: "invoiceNumber",
        key: "invoiceNumber",
        width: 160,
        render: (invoiceNumber, record) => {
          const menu = (
            <Menu>
              <Menu.Item>
                <this.Link to={`/transactions/update-invoice/${record.id}`}>
                  <Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_edit" />
                </this.Link>
              </Menu.Item>
            </Menu>
          );
          return <div className="wrap-product-name" style={{display: "flex"}}>
            {invoiceNumber}
            <Dropdown className="product-row-option" overlay={menu}>
              {/*eslint-disable-next-line*/}
              <a className="ant-dropdown-link" href="#" onClick={e => e.preventDefault()} style={{marginLeft: 10}}>
                <this.Translate id="text_option" /> <Icon type="down" />
              </a>
            </Dropdown>
          </div>
        },
        sorter: true
      },
      {
        title: <this.Translate id="text_customer" />,
        dataIndex: "firstName",
        key: "firstName",
        render: (firstName, record) => `${firstName} ${record.lastName}`,
        sorter: true
      },
      {
        title: <this.Translate id="text_sub_total" />,
        dataIndex: "total",
        key: "total",
        render: total => this.formatCurrency(total),
        sorter: true
      },
      // {
      //   title: <this.Translate id="text_tax" />,
      //   dataIndex: "tax",
      //   key: "tax",
      //   render: (text, record, index) => {
      //     if (!record.totalExcludeTax) record.totalExcludeTax = 0;
      //     return this.formatCurrency(record.total - record.totalExcludeTax);
      //   },
      //   sorter: true
      // },
      {
        title: <this.Translate id="text_discount" />,
        dataIndex: "discount",
        key: "discount",
        render: discount => discount ? this.formatCurrency(discount) : 0,
        sorter: true
      },
      {
        title: <this.Translate id="text_sale_total" />,
        dataIndex: "total",
        key: "totalSale",
        render: (total, record) => {
          let discount = record.discount;
          if (!discount) discount = 0;
          return this.Util.formatCurrency(total - discount);
        },
        sorter: true
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "status",
        key: "status",
        render: status => {
          if(status){
            const stepValue = this.INVOICE_STATUS_STR[status];
            let stepColor = stepValue.color;
            let stepTitile = stepValue.title;
            return <this.Badge style={{ textTransform: "uppercase" }} color={stepColor} text={stepTitile} />;
          }
        },
        sorter: true
      },
      {
        title: <this.Translate id="text_action" />,
        key: "action",
        align: "center",
        width: 100,
        render: (text, record) => {
          return <this.Button className="danger mg-right text-uppercase"  onClick={() => this.handleReturn(record, this.state.selectedRows)}>
            <span className="icon-sale-return icon-padding-right"></span>
            <this.Translate id="text_return" />
          </this.Button>;
        }
      }
    ];
  }

  componentDidMount() {
    this.fetchList();
  }  

  fetchList() {
    this.setState({loading: true});
    this.service.lists(this.pageSize, 0)
    .then((response) => {
      this.setState({data: response && response.data});
    })
    .catch((err) => console.log("error", err))
    .finally(() => this.setState({loading: false}));
  }

  getProductOrderList(data) {
    let productOrderList = [];
    if (this.Util.isValidCollectionInObj(data, "transactionEntries")) {
      data.transactionEntries.forEach(transactionEntry => {
        if (transactionEntry.productVariant && transactionEntry.productVariant.product) {
          const productVariant = transactionEntry.productVariant;
          const tax = POSUtil.getTaxFromProduct(productVariant.product);
          productOrderList.push({
            quantity: transactionEntry.quantity,
            // name: InventoryUtil.getProductNameV2(productVariant.product),
            name: productVariant.product.name,
            namekm: productVariant.product.namekm,
            variantName: productVariant.product.productOption === InventoryEnum.PRODUCT_VARIANT ? productVariant.name : "",
            tax: tax.taxRate/100,
            taxDescription: tax,
            price: transactionEntry.price,
            discount: transactionEntry.discount,
            newPrice: transactionEntry.price
          });
        }
      });
    }
    return productOrderList;
  }

  getSummaryTotal(data) {
    return {
      subTotalAfterDiscount: data.total - data.discount
    };
  }

  getProductTaxList(productOrderList) {
    return POSUtil.appendProductTaxList(productOrderList);
  }

  getTaxAmount(data) {
    return data.total - data.totalExcludeTax;
  }

  handleReturn(rowData) {
    if (rowData.step === Enum.TRANSACTION_STEP.PAID || rowData.step === Enum.TRANSACTION_STEP.CREDIT) {
      swal({
        title: this.CATranslate("text_confirm_return_invoice", this.props.locale),
        text: this.CATranslate("text_message_return_invoice", this.props.locale),
        icon: "warning",
        buttons: [this.CATranslate("text_cancel", this.props.locale), this.CATranslate("text_ok", this.props.locale)],
        dangerMode: true,
      })
      .then(ok => {
          if (ok) {
            TransactionService.returnTransaction(rowData.id)
            .then(() => {
              swal({
                icon: "success",
                title: "Success!",
                text: "Your transaction has been returned",
                buttons: false,
                timer: 1500
              })
              .then(() => {
                super.componentDidMount();
              });
            });
          }
      });
    } else {
      this.MessageV2.warning(this.CATranslate("text_error_allow_return", this.props.locale));
    }
  }

  buttonActionCollection() {
    return [this.renderButtonAddNew()];
  }

  renderButtonAddNew() {
    return <this.Button
        type="info"
        id="btnAdd"
        className="mg-right text-uppercase"
        onClick={() => history.push({pathname: "/transactions/create-invoice"})}>
        <span className="icon-add icon-padding-right"></span>
        <this.Translate id="text_add_new" />
      </this.Button>
  }
  
  renderButtonDelete(){
    return <this.Button type="info" loading={this.props.detail.fetching && this.state.isRequestReprint} onClick={this.handleReceivePayment}>
      <span className="icon-payment-report icon-padding-right text-uppercase"></span><this.Translate id="text_receive_payment" />
    </this.Button>;
  }

  renderButtonSearch(fetchingProps){
    return <this.Col md="2" className="wrap-btn-search">
      <div className="ant-form-item-label" style={{visibility: "hidden"}}>
        <label htmlFor="status" className="" title="">Filter</label>
      </div>
      <this.Button htmlType="submit" type="default" loading={this.state.isClickFilter && fetchingProps.fetching}>
        <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="text_search" />}
      </this.Button>
    </this.Col>;
  }

  renderFilterRecord() {
    const fetchingProps = this.props[this.fetchingProp];
    return this.props.form == null ?
        ""
        :
        <this.Form onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout">
            <this.Col md="2">
              <this.InputText
                name="number"
                placeholder={this.CATranslate("text_search_for_sale_no", this.props.locale)}
                label={<this.Translate id="text_search_for_sale_no" />}
                form={this.props.form}/>
            </this.Col>
            <this.Col md="2" className="hidden">
              <this.InputText
                name="customer"
                placeholder={this.CATranslate("text_search_for_customer", this.props.locale)}
                label={<this.Translate id="text_customer" />}
                form={this.props.form}/>
            </this.Col>
            <this.Col md="2">
              <this.DateRangePicker
                name="createdAt"
                defaultValue={this.state.setDefaultDate}
                label={<this.Translate id="text_date" />}
                form={this.props.form}
                ranges={this.dateRangeDataSource()} />
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="locationId"
                dataSource={this.storeList.concat(this.props.storeLocation.list)}
                defaultValue=""
                valueKey="id"
                label={<this.Translate id="text_store" />}
                form={this.props.form}/>
            </this.Col>
            {this.renderButtonSearch(fetchingProps)}
          </this.Row>
        </this.Form>;
  }

  handleSubmitFilter(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let filter = {};

        if (values.locationId) {
          filter["locationId"] = [values.locationId];
        }

        if (values.number) {
          filter["number"] = [values.number];
        }
        
        let rangFilter = "";
        if (values.createdAt && values.createdAt.length > 0) {
          rangFilter = JSON.stringify({
            column: "registerDate",
            value: [
              this.Util.formatDateForMYSQL(values.createdAt[0]) + " 00:00:00",
              this.Util.formatDateForMYSQL(values.createdAt[1]) + " 23:59:59"
            ]});
        }
        
        filter = JSON.stringify(filter);

        let searchKey = "";

        if (values.customer) {
          searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.customer});
        }

        this.setState({loading: true});
        InvoiceService.lists(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, rangFilter)
        .then((response) => this.setState({loading: false, data: response.data}));
        this.setState({isClickFilter: true});
      }
    });
  }

  renderTable() {
    return (
      <this.Table
        rowKey="id"
        loading={this.state.loading}
        columns={this.columns}
        dataSource={this.state.data}
        onChange={this.onChange}
      />
    )
  }

}