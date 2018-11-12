import React from "react";
import List from "../List";
import Constant from "../../../constants/report/purchase";
import ProductReportAction from "../../../../inventory/actions/products/product";
import ProductReportService from "../../../../inventory/services/products/ProductService";
import ProductTypeAction from "../../../../inventory/actions/products/productsType";
import BrandAction from "../../../../inventory/actions/products/brand";
import LocationAction from "../../../../pos/action/settings/storeLocation";
import Util from "../../../../inventory/utils";
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
    this.fetchingProp = "productReport";
    this.addingProp = "productReportAdd";
    this.updatingProp = "productReportUpdate";
    this.service = ProductReportService;
    this.action = ProductReportAction;
    this.RESET_CONSTANT = Constant.RESET_PURCHASE_REPORT;
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.getProduct = this.getProduct.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(ProductTypeAction.fetch(100));
    this.props.dispatch(BrandAction.fetch(100));
    this.props.dispatch(LocationAction.fetch(100));
    super.componentDidMount();
  }

  getProduct(){
    const {productReport} = this.props;
    const getAllProductReport = [];
    if (Array.isArray(productReport.list)) {
      productReport.list.forEach(productReport => {
        getAllProductReport.push({
          productDescriptions : productReport.productDescriptions,
          barcode: productReport.barcode,
          productType: productReport.productType,
          type: productReport.type,
          quantity: productReport.quantity,
          cost: productReport.cost,
          totalPrice: productReport.quantity * productReport.price,
          totalCost: productReport.cost * productReport.quantity,
          price: productReport.price
        });
      });
      return getAllProductReport;
    }
  }

  renderTable(){
    return (  
      <div className="main-purchase">
        <this.Row>
          <this.Col md="12">
            <this.Table 
              dataSource={ this.getProduct() }
              columns= { this.columns }
              locale={{emptyText: <this.Translate id="table_empty_data"/>}}
            />
          </this.Col>
        </this.Row>
      </div>
    );
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let filter = {};
          let locationId = 0;
          if (values.locationId !== 0) {
            locationId = values.locationId;
          }

          if (values.brandId !== 0) {
            filter["brandId"] = [values.brandId];
          }

          if (values.productTypeId !== 0) {
            filter["productTypeId"] = [values.productTypeId];
          }

          filter["status"] = values.status === this.Enum.ALL_STATE ? [this.Enum.ACTIVE, this.Enum.DEACTIVE] : [values.status];
    
          filter = JSON.stringify(filter);

          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, locationId));
          this.setState({isClickFilter: true});
        }
      }); 
    } 
  }

  renderActionButton(){
    return(
      <div></div>
    );
  }

  renderFilterRecord() {
    const {form} = this.props;
    return(
      <div>
        <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout form-group"> 
            <this.Col md="2">
              <this.InputText
                name="key"
                label={<this.Translate id="text_search"/>}
                placeholder="Search for brand, code and notation"
                form={form}
              />
            </this.Col>
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
            <this.Col md="2">
              <this.Select
                name="brandId"
                label={<this.Translate id="text_brand"/>}
                dataSource={this.brandList.concat(this.props.brands.list)}
                valueKey="id"
                nameKey="name"
                form={form}
                defaultValue={this.brandList[0].id}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="productTypeId"
                label={<this.Translate id="text_product_type"/>}
                dataSource={this.productTypeList.concat(this.props.productsType.list)}
                defaultValue={this.productTypeList[0].id}
                valueKey="id"
                nestedName="productTypeDescriptions"
                nameKey="name"
                form={form}/>
            </this.Col>

            <this.Col md="2" className="wrap-btn-search">
              <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                <label htmlFor="status" className="" title=""></label>
              </div>
              <this.Button htmlType="submit" type="info" >
                <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="button_stock_reorder_search" />}
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
    return [
      {
        title: <this.Translate id="text_product_name" />,
        key: "productDescriptions",
        render: (text, record) => {
          const productName = Util.getProductName(record);
          return <div>
            <div>{productName ? productName: this.emptyCell}</div>
          </div>;
        }
      },
      {
        title: <this.Translate id="text_product_code" />,
        dataIndex: "barcode",
        align: "center",
        key: "barcode",
        render: barcode => barcode ? barcode : this.emptyCell
      },
      {
        title: <this.Translate id="col_products_type" />,
        dataIndex: "productType",
        render: (text, record) => {
          return record.productType.productTypeDescriptions.length > 0 ?  record.productType.productTypeDescriptions[0].name : this.emptyCell;
        }
      },
      {
        title: <this.Translate id="col_products_types" />,
        dataIndex: "type",
        align: "center",
        key: "type",
        render: type => type === Enum.TYPE_OF_PRODUCT.GOOD ? <this.Translate id="input_product_good" /> : <this.Translate id="input_product_raw_material" />
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "quantity",
        align: "center",
        key: "quantity"
      },
      {
        title: <this.Translate id="text_product_cost" />,
        dataIndex: "cost",
        align: "center",
        render: cost => this.formatCurrency(cost)
      },
      {
        title: <this.Translate id="text_product_total_cost" />,
        dataIndex: "totalCost",
        align: "center",
        key: "totalCost",
        render: totalCost => this.formatCurrency(totalCost)
      },
      {
        title: <this.Translate id="text_price" />,
        dataIndex: "price",
        align: "center",
        key: "price",
        render: price => this.formatCurrency(price)
      },
      {
        title: <this.Translate id="text_product_total_price" />,
        dataIndex: "totalPrice",
        align: "center",
        key: "totalPrice",
        render: totalPrice => this.formatCurrency(totalPrice)
      }
    ];
  }
}