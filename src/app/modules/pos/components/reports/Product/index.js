import React from "react";
import ExportForm from "./ExportForm";
import List from "../List";
import Constant from "../../../constants/report/purchase";
import History from "../../../../common/router/history";
import FormCreate from "../../../../inventory/containers/stock/PurchaseOrder/FormCreate";
import ProductReportAction from "../../../action/report/product";
import ProductReportService from "../../../services/report/ProductService";
import ProductTypeAction from "../../../../inventory/actions/products/productsType";
import BrandAction from "../../../../inventory/actions/products/brand";
import LocationAction from "../../../../pos/action/settings/location";
import PurchaseAction from "../../../../inventory/actions/stock/purchaseOrder";
import InventoryUtil from "../../../../inventory/utils"; 
import Enum from "../../../../inventory/enums";
import "./index.css";

export default class ProductList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.brandList = [{name: <this.Translate id="text_all_brand"/>, id: 0}];
    this.locationList = [{name: <this.Translate id="text_all_store"/>, id: 0}];
    this.productTypeList = [{productTypeDescriptions: {name: <this.Translate id="text_all_product_type"/>}, id: 0}];
    this.columnFilterWithKey = ["name", "barcode"];
    this.pageSize = 50;
    this.pageSizeOptions = ["50", "100", "150", "200"];
    this.placeHolderForGeneralSearch = "text_general_seach_product";
    this.service = ProductReportService;
    this.action = ProductReportAction;
    this.RESET_CONSTANT = Constant.RESET_PURCHASE_REPORT;

    this.ExportheadersCsv = [
      {label: this.CATranslate("text_product_name", this.props.locale) , key: "productDescriptions"},
      {label: this.CATranslate("text_product_code", this.props.locale), key: "barcode"},
      {label: this.CATranslate("text_type", this.props.locale), key: "type"},
      {label: this.CATranslate("text_quantity", this.props.locale), key: "quantity"},
      {label: this.CATranslate("text_cost", this.props.locale), key: "cost"},
      {label: this.CATranslate("text_product_total_cost", this.props.locale), key: "totalCost"},
      {label: this.CATranslate("text_price", this.props.locale), key: "price"},
      {label: this.CATranslate("text_total_price", this.props.locale), key: "totalPrice"}
    ];
    this.exportCsvFileName = "product_report.csv"; 
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.handlePurchaseOrderForm = this.handlePurchaseOrderForm.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    this.props.dispatch(ProductTypeAction.fetch(100));
    this.props.dispatch(BrandAction.fetch(100));
    this.props.dispatch(LocationAction.fetch(100));
  }
  
  componentDidUpdate() {
    if (this.props.purchaseOrder.added) {
      History.push("/stock/purchase/order");
      this.props.dispatch(PurchaseAction.reset());
    }
  }

  getProduct(){
    const getAllProductReport = [];
    if (Array.isArray(this.props.list.list)) {
      this.props.list.list.forEach(productReport => {
        let variantName = "";
        if (productReport.product && productReport.product.productOption === Enum.PRODUCT_VARIANT) {
          variantName = `(${productReport.name})`;
        }

        getAllProductReport.push({
          productDescriptions: `${InventoryUtil.getProductNameV2(productReport.product)} ${variantName}`,
          barcode: productReport.barcode ? productReport.barcode : this.emptyCell,
          type: productReport.type === Enum.TYPE_OF_PRODUCT.GOOD ? this.CATranslate("input_product_good", this.props.locale) : this.CATranslate("input_product_raw_material", this.props.locale) ,
          quantity: productReport.quantity,
          cost: this.formatCurrency(productReport.cost),
          totalPrice: this.formatCurrency(productReport.quantity * productReport.price),
          totalCost: this.formatCurrency(productReport.cost * productReport.quantity),
          price: this.formatCurrency(productReport.price)
        });
      });
      return getAllProductReport;
    }
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let filter = {};
          
          let locationId = "";

          if (values.locationId !== 0) {
            locationId = values.locationId;
          }

          filter["status"] =  [this.Enum.ACTIVE, this.Enum.DEACTIVE];
    
          filter = JSON.stringify(filter);

          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});

          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, locationId));
          
          this.setState({isClickFilter: true});

        }
      }); 
    } 
  }

  handlePurchaseOrderForm() {
    const limitRecord = 10;
    this.props.dispatch(PurchaseAction.showForm());
    if (this.props.list.list && Array.isArray(this.props.list.list)) {
      let productReOrderPointList = [];
      if (this.state.selectedListIds.length > 0) {
        const selectedListIds = this.state.selectedListIds.filter((value, index) => index < limitRecord);
        productReOrderPointList = this.props.list.list.filter(value => selectedListIds.includes(value.id) && value.product.serialType === Enum.SERIAL_TYPE.STANDARD);
      } else {
        productReOrderPointList = this.props.list.list.filter((value, index) => index < limitRecord && value.quantity <= value.reorderPoint && value.product.serialType === Enum.SERIAL_TYPE.STANDARD);
      }
      this.setState({ modalConten: <FormCreate productReOrderPointList={productReOrderPointList} /> });
    }
  }

  exportCsv(){
    return this.getProduct();
  }

  renderButtonAddNew(){
    // return(
    //   <div style={{ float: "left", marginRight: "11px" }}>
    //     <this.CSVLink
    //       filename={this.exportCsvFileName}
    //       data={this.exportCsv()}
    //       headers={this.ExportheadersCsv}>
    //       <this.Button type="info" disabled={this.props.list.list.length > 0 ? false : true }>
    //         <span className="icon-export icon-padding-right"></span>{<this.Translate id="text_export_csv" />}
    //       </this.Button>
    //     </this.CSVLink>
    //   </div>
    // );
    return <div style={{ float: "left", marginRight: "11px" }}>
      <ExportForm />
    </div>;
  }

  renderButtonDelete(){
    return(
      <this.Button
        type="info"
        id="btnAdd"
        className="mg-right text-uppercase"
        disabled={this.state.loadingPopup}
        onClick={this.handlePurchaseOrderForm}>
        <span className="icon-purchasing icon-padding-right"></span>
        <this.Translate id="text_order_product" />
      </this.Button>
    );
  }

  renderFilterRecord() {
    const {form} = this.props;
    const fetchingProps = this.props[this.fetchingProp];
    return(
      form == null ?
        ""
        :
        <div>
          <this.Form onSubmit={this.handleSubmitFilter}>
            <this.Row className="main-search-layout"> 
              {this.renderFilterGeneralKey()}
              <this.Col md="2">
                <this.Select
                  name="locationId"
                  label={<this.Translate id="text_store"/>}
                  dataSource={this.locationList.concat(this.props.locations.list)}
                  valueKey="id"
                  nameKey="name"
                  form={form}
                  defaultValue={this.locationList[0].id}/>
              </this.Col>
              <this.Col md="2" className="wrap-btn-search">
                <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                  <label htmlFor="status" className="" title=""></label>
                </div>
                <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
                  <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="text_search" />}
                </this.Button> 
              </this.Col>

            </this.Row>
          </this.Form>
        </div>
    );
  }
}


class Column extends List {
  constructor(props) {
    super(props);
    
    this.colorStockStatus = ["#4cb64c", "#f3a638", "#c72727"];

    return [
      {
        title: <this.Translate id="text_product_name" />,
        dataIndex: "name",
        key: "name",
        render: (text, record) => {
          let variantName = "";
          if (record.product && record.product.productOption === Enum.PRODUCT_VARIANT) {
            variantName = ` / ${record.name}`;
          }
          return InventoryUtil.getProductNameV2(record.product) + variantName;
        }
      },
      {
        title: <this.Translate id="text_product_code" />,
        dataIndex: "barcode",
        key: "barcode"
      },
      {
        title: <this.Translate id="text_type" />,
        dataIndex: "product",
        align: "center",
        key: "product",
        render: product => product && product.type === Enum.TYPE_OF_PRODUCT.GOOD ? <this.Translate id="input_product_good"/> : <this.Translate id="input_product_raw_material"/>
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "quantity",
        width: 150,
        align: "center",
        key: "quantity",
        render: (text, record) => {
          let quantity = record.quantity;
          let colorIndex = 0;
          if ("productLocations" in record) {
            quantity = InventoryUtil.getProductQTYLocation(record["productLocations"]);
          } else if ("productVariants" in record) {
            quantity = InventoryUtil.getProductQTYLocation(record["productVariants"]);
          }
          
          if (quantity === 0) {
            colorIndex = 1;
          } else if (quantity < 0) {
            colorIndex = 2;
          }

          return <this.Tag color={this.colorStockStatus[colorIndex]} className="text-center label-stock-status">{quantity}</this.Tag>;
        }
      },
      {
        title: <this.Translate id="text_cost" />,
        dataIndex: "cost",
        width: 150,
        align: "right",
        key: "cost",
        render: cost => this.formatCurrency(cost)
      },
      {
        title: <this.Translate id="text_product_total_cost" />,
        dataIndex: "totalCost",
        width: 150,
        align: "right",
        key: "totalCost",
        render: (text, record) => {
          return this.formatCurrency(record.cost * record.quantity);
        }
      },
      {
        title: <this.Translate id="text_price" />,
        dataIndex: "price",
        width: 150,
        align: "right",
        key: "price",
        render: price => this.formatCurrency(price)
      },
      {
        title: <this.Translate id="text_total_price" />,
        dataIndex: "totalPrice",
        width: 150,
        align: "right",
        key: "totalPrice",
        render: (text, record) => {
          return this.formatCurrency(record.price * record.quantity);
        }
      }
    ];
  }
}