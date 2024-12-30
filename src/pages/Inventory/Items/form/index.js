import React from "react";
import {
  Menu,
  Dropdown,
  Divider,
  Icon,
  Row,
  Col,
  Checkbox,
  Table,
  Select,
  Input,
  Pagination
} from "antd";
import ReactGA from "react-ga4";
import history from "@router/index";
import Exchange from "./ExchangeMoneyFunc";
import EditStock from "./EditStock";
import Datatable from "@layout/Datatable";
import CommonUtil from "@common/util";
import Util from "@helper/inventory";
import Enum from "@enums/index";
import FormCreate from "../form.create";
import ProductAction from "../redux/action";
import Constant from "../redux/constant";
import ProductService from "@services/ProductService";
import CategoryService from "@services/CategoryService";
import ExchangeRateService from "@services/ExchangeRateService";
import "./index.css";

export default class ProductList extends Datatable {

   constructor(props) {
      super(props);
      this.state = {
         ...this.state,
         loading: false,
         brands: [],
         locations: [],
         categories: [],
         products: [],
         pagination: {},
         dataSourceToPrint: []
      };
      this.editStockRef = React.createRef();
      this.locationList = [{name: <this.Translate id="text_all_store"/>, id: 0}];
      this.categoriesList = [{name: <this.Translate id="text_all_categories"/>, id: 0}];
      this.stockList = [
         {name: <this.Translate id="text_all_stock"/>, id: 0},
         {name: <this.Translate id="text_in_stock"/>, id: 1},
         {name: <this.Translate id="text_out_of_stock"/>, id: 2}
      ];
      this.columns = [
         {
            title: <this.Translate id="text_item_name" />,
            dataIndex: "name",
            key: "name",
            render: (name, record) => {
               const menu = (
                  <Menu>
                     <Menu.Item key={1}>
                        <this.Link to={`/inventories/items/view/${record.id}?productOption=${record.productOption}`}>
                           <Icon type="eye" style={{marginRight: 10}} /> <this.Translate id="text_view" />
                        </this.Link>
                     </Menu.Item>
                     <Menu.Item key={2}>
                        <this.Link to={`/inventories/items/update/${record.id}?productOption=${record.productOption}`}>
                           <Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_edit" />
                        </this.Link>
                     </Menu.Item>
                     <Menu.Item key={3} className={record.isSplittable ? "" : "hidden"}>
                        <this.Link to={`/inventories/items/split/${Util.getProductVariantId(record)}?productOption=${record.productOption}`}>
                           <Icon type="scissor" style={{marginRight: 10}} /> <this.Translate id="text_slit_item" />
                        </this.Link>
                     </Menu.Item>
                     <Divider style={{marginTop: 4, marginBottom: 4}} />
                     <Menu.Item key={4} onClick={() => this.handleConfirm(record)}>
                        <Icon type="delete" style={{marginRight: 10}} /> <this.Translate id="text_delete" />
                     </Menu.Item>
                     <Menu.Item key={5} onClick={() => this.editStockRef.showDrawer(record)}>
                        <Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_edit_stock" />
                     </Menu.Item>
                  </Menu>
               );
               return <div className="wrap-product-name" style={{display: "flex"}}>
                  {Util.getProductNameV2(record, this.Util.getCurrentLanguageCode())}
                  <Dropdown overlay={menu} className="product-row-option">
                     {/*eslint-disable-next-line*/}
                  <a className="ant-dropdown-link" href="#" onClick={e => e.preventDefault()} style={{marginLeft: 10}}>
                     <this.Translate id="text_option" /> <Icon type="down" />
                  </a>
                  </Dropdown>
               </div>;
            }
         },
         {
            title: <this.Translate id="text_barcode" />,
            dataIndex: "barcode",
            key: "barcode",
            width: 140,
            render: (text, record) => Util.getProductBarcode(record)
         },
         {
            title: <this.Translate id="text_category" />,
            dataIndex: "category",
            key: "category",
            width: 140,
            render: category => category?.name
         },
         {
            title: <this.Translate id="text_manage_stock" />,
            dataIndex: "enableInventoryTracking",
            key: "enableInventoryTracking",
            width: 150,
            align: "center",
            render: enableInventoryTracking => {
               let stockTypeStr = <this.Translate id="text_other" />;
               if (enableInventoryTracking) {
                  stockTypeStr = <this.Translate id="text_inventory" />;
               } else {
                  stockTypeStr = <this.Translate id="text_non_inventory" />;
               }

               return <Checkbox checked={enableInventoryTracking} />;
            }
         },
         {
            title: <this.Translate id="text_quantity" />,
            dataIndex: "quantity",
            key: "quantity",
            width: 130,
            align: "right",
            render: (_, record) => {
               return `${this.calculateTotalQuantity(record)} ${record?.unitOfMeasurement?.name}`;
            }
         },
         {
            title: <this.Translate id="text_retial_price" />,
            key: "price",
            dataIndex: "price",
            width: 180,
            align: "right",
            render: (text, record) => exchangeAndFormatCurrency(Util.getProductPrice(record))
         },
      ];
      this.formCreate = <FormCreate/>;
      this.callBackOnShowEditForm = this.showFormEdit;
      // this.columnExpend = new ColumnExpand(this.props, this.handleConfirm); 
      this.fetchingProp = "products";
      this.isShowExpandable = true;
      this.rowClassName = record => record.productOption !== Enum.PRODUCT_VARIANT ? "standard-product-row" : "";
      this.componentHasUpdated = false;
      this.service = ProductService;
      this.columnFilterWithKey = ["name", "barcode", "namekm"];
      this.action = ProductAction;
      this.RESET_CONSTANT = Constant.RESET_PRODUCT;
      this.handleClone = this.handleClone.bind(this);
      this.pathName = "/inventories/items";
      this.timer = null;
   }

   componentDidMount() {
         const params = new URLSearchParams(document.location.search);
         const {currency, currencyId}  = this.Util.getSetting();
         if (params.get("current")) this.setState({ current: Number(params.get("current")) });
         if (params.get("search")) this.props.form.setFieldsValue({ key: params.get("search") });
         if (params.get("categoryId")) this.props.form.setFieldsValue({categoryId: params.get("categoryId")});
         if (params.get("locationId")) this.props.form.setFieldsValue({locationId: Number(params.get("locationId"))});

         this.fetchList(true);

         this.props.dispatch(ProductAction.fetchLocation());

         CategoryService.get(500, 0, "name", "ASC")
         .then(response => {
            if (response && response.data) {
               this.setState({categories: response.data.data});
            }
         });

         if (currency !== "$"){
            ExchangeRateService.getExchangeRate(JSON.stringify({"currencyId": [currencyId]})).then(({data})=>{
               const data1 = data.data;
               if (data1 && data1.length){
                  exchangeRate = data1[data1.length-1].value;
                  this.forceUpdate();
               }
            });
         }
   }

   componentWillUpdate(nextProps) {
      const {
         productAdd,
         productUpdate,
         dispatch
      } = nextProps;

      if (productAdd.added || productUpdate.updated) {
         this.fetchList();
         dispatch(ProductAction.reset(Constant.RESET_FORM_PRODUCT));
         dispatch(ProductAction.reset(Constant.RESET_DETAIL_PRODUCTS));
      }

      if (nextProps.units.fetched) {
         localStorage.setItem(Enum.LOCAL_SCHEMA.UNIT, JSON.stringify(nextProps.units.list));
      }
   }

   componentDidUpdate() {
      if (this.props.productDetail.fetched) {
         this.setState({
            loadingPopup: false
         });
         this.props.dispatch(ProductAction.reset(Constant.PARTIAL_RESET_DETAIL_PRODUCTS));
      }

      if (this.props.productAdd.error) {
         const errorCode = this.Util.getErrorCodeFromState(this.props.productAdd.error);
         if (errorCode === this.Enum.TAX_NOT_FOUND) {
         this.CATranslate("error_tax_not_found", this.props.locale);
         } else if (errorCode === this.Enum.BRAND_NOT_FOUND) {
         this.CATranslate("error_brand_not_found", this.props.locale);
         } else if (errorCode === this.Enum.PRODUCT_TYPE_NOT_FOUND) {
         this.CATranslate("error_product_type_not_found", this.props.locale);
         } else if (errorCode === this.Enum.PRODUCT_UNIT_NOT_FOUND) {
         this.CATranslate("error_unit_not_found", this.props.locale);
         }

         this.props.dispatch(ProductAction.reset(Constant.RESET_ADD_PRODUCT));
      }
   }

   fetchList(withPagination = false) {
         let search = "";
         let filter = {};
         let locationId = 0;
         let limit = this.pageSize;
         let offset = this.state.current;
         const params = new URLSearchParams(document.location.search);

         if (params.get("limit")) limit = Number(params.get("limit"));
         if (params.get("current")) offset = Number(params.get("current"));
         if (params.get("search")) search = params.get("search");
         if (params.get("categoryId")) filter = JSON.stringify({categoryId: params.get("categoryId")});
         if (params.get("locationId")) locationId = Number(params.get("locationId"));

         if (!withPagination) {
            offset = 1;
            this.setState({ current: 1 });
            params.delete("current");
            this.Util.pushParamsToURL(this.pathName, params.toString());
         }

         offset = (offset - 1) * limit;
         // this.props.dispatch(this.action.fetch(limit, offset, "", "", filter, searchKey, locationId));
         this.setState({loading: true});
         ProductService.get({ limit, offset, filter, search, locationId })
         .then(response => {
            if (response.data) {
               this.setState({
                  products: response.data.data,
                  pagination: response.data.pagination
               });
            }
         })
         .finally(() => this.setState({loading: false}));
   }

   renderButtonAddNew() {
      return (
         <this.Link to="/inventories/items/create" className="ant-btn ant-btn-primary" style={{marginRight: 15}}>
            <this.Translate id="text_add_new" />
         </this.Link>
      );
   }

   showFormEdit(rowData) {
      history.push(`/inventories/items/update/${rowData.id}?productOption=${rowData.productOption}`);
   }

   handleClone() {
      if (this.state.selectedListIds.length > 0) {
         this.props.dispatch(ProductAction.clone(this.state.selectedListIds[0]));
      }
   }

   calculateTotalQuantity(record) {
      let quantity = 0;
      let isNotFilterByLocation = true;
      record["productVariants"].forEach(productVariant => {
         if ("productLocations" in productVariant) {
         isNotFilterByLocation = false;
         quantity += Util.getProductQTYLocation(productVariant["productLocations"]);
         }
      });

      if (isNotFilterByLocation) {
         quantity = Util.getProductQTYLocation(record["productVariants"]);
      }

      return quantity;
   }

   getAllQTY(record) {
      return Util.getProductQTYLocation(record["productVariants"]);
   }

   handleDelete() {
      const product = this.state.selectedRows;
      if (product) {
         const quantity = this.getAllQTY(product[0]);

         if (product[0].serialType === Enum.SERIAL_TYPE.NON_INVENTORY || quantity <= 0){
            this.setState({deleting: true});
            ProductService.archive(this.state.selectedListIds)
            .then(() => {
               this.fetchList(true);
            })
            .finally(() => this.setState({deleting: false, selectedRowKeys: []}));
         } else{
            this.Message.warning(this.CATranslate("error_delete_product", this.props.locale));
         }
      }
   }

   handleConfirm(record) {
      this.setState({
         selectedRows: [record],
         selectedListIds: [record.id]
      });
      this.Util.sweetAlertConfirm(this.CATranslate("text_confirm_delete", this.props.locale))
      .then(willDelete => {
         if (willDelete) {
            this.handleDelete();
         }
      });
   }

   renderButtonImport() {
      return <this.Link to={"/products/import"} className="ant-btn" style={{marginLeft: 15}}>
         <span className="icon-import icon-padding-right"></span>
         <this.Translate id="text_import" />
      </this.Link>;
   }

   buttonActionCollection() {
      return <Dropdown.Button type="primary" onClick={() => console.log("Hello World")} overlay={(
            <Menu onClick={() => console.log("Hello World")}>
               <Menu.Item key="1">
                  <Icon type="user" />
                  Import
               </Menu.Item>
               <Menu.Item key="2">
                  <Icon type="user" />
                  Export
               </Menu.Item>
               <Menu.Item key="3">
                  <Icon type="user" />
                  3rd item
               </Menu.Item>
            </Menu>
         )}>
            <this.Translate id="text_add_new" />
      </Dropdown.Button>;
   }

   handleSearch = (e) => {
      const value = e.target.value;
      const params = new URLSearchParams(document.location.search);
      clearTimeout(this.timer);
      if (value) {
         params.set("search", value);
      } else {
         params.delete("search");
      }
      this.Util.pushParamsToURL(this.pathName, params.toString());
      this.timer = setTimeout(() => {
         this.fetchList();
      }, 800);
   }

   handleChangeLocation = (locationId) => {
      const params = new URLSearchParams(document.location.search);
      if (locationId) {
         params.set("locationId", locationId);
      } else {
         params.delete("locationId");
      }
      this.Util.pushParamsToURL(this.pathName, params.toString());
      this.fetchList();
   }

   handleChangeCategory = (categoryId) => {
      const params = new URLSearchParams(document.location.search);
      if (categoryId) {
         params.set("categoryId", categoryId);
      } else {
         params.delete("categoryId");
      }
      this.Util.pushParamsToURL(this.pathName, params.toString());
      this.fetchList();
   }

   onShowSizeChange = (current, pageSize) => {
      if (this.action) {
         const params = new URLSearchParams(document.location.search);
         let strParam = `limit=${pageSize}&current=${current}`;
         if (params.get("search")) {
         strParam += `&search=${params.get("search")}`;
         }

         if (params.get("locationId")) {
         strParam += `&locationId=${params.get("locationId")}`;
         }

         this.setState({ current, isClickFilter: false });
         this.Util.pushParamsToURL(this.pathName, strParam);
         this.fetchList(true);
      }
   }

   onChangePagination = (current, pageSize) => {
      if (this.action != null) {
         const params = new URLSearchParams(document.location.search);
         let strParam = `limit=${pageSize}&current=${current}`;

         if (params.get("search")) {
         strParam += `&search=${params.get("search")}`;
         }

         if (params.get("locationId")) {
         strParam += `&locationId=${params.get("locationId")}`;
         }

         this.setState({ current, isClickFilter: false });
         this.Util.pushParamsToURL(this.pathName, strParam);
         this.fetchList(true);
      }
   }

   onSelectChange(selectedRowKeys, selectedRows) {
      super.onSelectChange(selectedRowKeys, selectedRows);
      this.setState({dataSourceToPrint: this.mapSelectedListIds(selectedRows)});
   }

   expandedRender(record){
      return( 
         <div className="sub-table">
         <this.SubTable 
            columns={this.columnExpend}
            dataSource={record.productVariants}
            locale={{emptyText: <this.Translate id="placeholder_table_variant_product" />}}/>
         </div>
      );
   }

   renderPagination() {
      const {total, limit} = this.state.pagination;
      const pagination = {
        total,
        pageSize: limit,
        current: this.state.current,
        pageSizeOptions: this.pageSizeOptions
      };
  
      const showTotal = total => {
        return `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`;
      };
  
      return( 
        pagination.total > 0 ?
          <div className="float-right">
            <Pagination size="small" showTotal={showTotal} showSizeChanger onShowSizeChange={this.onShowSizeChange} onChange={this.onChangePagination} {...pagination} />
          </div>
          :
          ""
      );
    }

   render() {
      return (
         <div className="content-list">
            <EditStock ref={f => this.editStockRef = f} locale={this.props.locale} callback={() => this.fetchList(true)} />
            <div style={{height: "100%", marginTop: 10}}>
               <div className="table-wrapper">
                  <Row>
                     <Col md={3} style={{marginBottom: 0}}>
                        <h3 style={{marginBottom: 0, fontWeight: 600}}><this.Translate id="text_items" /></h3>
                     </Col>
                     <Col md={21} style={{display: "flex", justifyContent: "flex-end"}}>
                        <Input
                           placeholder={this.CATranslate("text_general_seach_product", this.props.locale)}
                           form={this.props.form}
                           style={{width: 314, marginBottom: 0}}
                           onChange={this.handleSearch}
                           allowClear={true}
                        />

                        <Select
                           showSearch
                           allowClear
                           placeholder={this.CATranslate("text_all_categories", this.props.locale)}
                           defaultValue={0}
                           onChange={this.handleChangeCategory}
                           style={{ width: 180, marginLeft: 15 }}
                        >
                           {
                              this.categoriesList.concat(this.state.categories).map((item, key) => 
                                 <Option value={item.id}>{item.name}</Option>
                              )
                           }
                        </Select>

                        <Select
                           showSearch
                           allowClear
                           placeholder={this.CATranslate("text_all_categories", this.props.locale)}
                           defaultValue={0}
                           onChange={this.handleChangeLocation}
                           style={{ width: 180, margin: "0 15px" }}
                        >
                           {
                              this.locationList.concat(this.props.locations.list).map((item, key) => 
                                 <Option value={item.id}>{item.name}</Option>
                              )
                           }
                        </Select>
                        <this.Link to="/inventories/items/create" onClick={() => { 
                           ReactGA.event({
                              category: "Action Button",
                              action: "click",
                              label: "ERP HUB Web",
                           });
                           }} className="ant-btn ant-btn-primary">
                           <this.Translate id="text_add_new" />
                        </this.Link>
                     </Col>
                  </Row>

                  <Table
                     rowKey="id"
                     bordered={true}
                     pagination={false}
                     dataSource={this.state.products}
                     columns={this.columns}
                     rowClassName={this.rowClassName}
                     locale={{emptyText: <this.Translate id="table_empty_data"/>}}
                     // expandedRowRender={this.expandedRender}
                     onRow={record =>({onDoubleClick:() => this.handleShowFormEdit(record),})}
                     loading={this.state.loading} />

                  <div style={{marginTop: 15}}>
                     {this.renderPagination()}
                  </div>

                  <this.clearFloating/>
               </div>
            </div>
         </div>
      );
   }
}

const commonUtil = new CommonUtil();
let exchangeRate = 1;

const exchangeAndFormatToDollar = (price) => {
   return commonUtil.formatCurrency(price);
};
const exchangeAndFormatToRiel = (price) => {
   return commonUtil.formatCurrency(commonUtil.toValidKHMoney(Exchange.dollarToRiel(price, exchangeRate)), "៛", 1, 0);
};

const currencyIsDollar = commonUtil.getSetting().currency === "$";
const exchangeAndFormatCurrency = currencyIsDollar ? exchangeAndFormatToDollar : exchangeAndFormatToRiel;

class ColumnExpand extends Datatable {
   constructor(props) {
      super(props);
      this.colorStockStatus = ["#4cb64c", "#f3a638"];
      return [
         {
            dataIndex: "blank1",
            key: "blank1",
            width: 20,
            render: () => {},
         },
         {
            dataIndex: "name",
            key: "name"
         },
         {
            dataIndex: "barcode",
            key: "barcode",
            width: 130,
            render: barcode => barcode ? barcode : this.emptyCell
         },
         {
            title: <this.Translate id="text_stock_type" />,
            dataIndex: "serialType",
            key: "serialType",
            width: 150,
            render: () => { }
         },
         {
            dataIndex: "productType",
            key: "productType",
            width: 200,
            render: () => {}
         },
         {
            dataIndex: "quantity",
            key: "quantity",
            width: 130,
            align: "center",
            render: (text, record) => {
               const virtaulProduct = {
                  productVariants: [
                     {
                        ...record,
                        productLocations: record.productLocations
                     }
                  ]
               };
               
               let quantity = this.calculateTotalQuantity(virtaulProduct);
               
               let colorIndex = 0;
               if (quantity === 0) {
                  colorIndex = 1;
               } else if (quantity < 0) {
                  colorIndex = 1;
               }

               return <this.Tag color={this.colorStockStatus[colorIndex]} className="text-center label-stock-status">{quantity}</this.Tag>;
            },
         },
         {
            dataIndex: "price",
            key: "price",
            width: 150,
            align: "center",
            render: price => exchangeAndFormatCurrency(price)
         },
         {
            dataIndex: "wholePrice",
            key: "wholePrice",
            width: 150,
            align: "center",
            render: wholePrice => exchangeAndFormatCurrency(wholePrice),
         },
         {
            dataIndex: "distributePrice",
            key: "distributePrice",
            width: 180,
            align: "center",
            render: distributePrice => exchangeAndFormatCurrency(distributePrice)
         }
      ];
   }

   calculateTotalQuantity(record) {
      let quantity = record.quantity;
      let isNotFilterByLocation = true;
      record["productVariants"].forEach(productVariant => {
         if ("productLocations" in productVariant && productVariant["productLocations"]) {
         isNotFilterByLocation = false;
         quantity = Util.getProductQTYLocation(productVariant["productLocations"]);
         }
      });

      if (isNotFilterByLocation) {
         quantity = Util.getProductQTYLocation(record["productVariants"]);
      }

      return quantity;
   }

   getAllQTY(record) {
      return Util.getProductQTYLocation(record["productVariants"]);
   }
}
