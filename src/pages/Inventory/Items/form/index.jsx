import React from "react";
import {
   Avatar,
   Menu,
   Dropdown,
   Divider,
   Icon,
   Row,
   Col,
   Table,
   Tabs,
   Input,
   Pagination,
   Tag,
   Typography,
   Button
} from "antd";
import ReactGA from "react-ga4";
import { Link } from "react-router-dom";
import { Translate } from "@redux/index";
import history from "@router/index";
import Exchange from "./exchange-money-func";
import EditStock from "./edit-stock";
import Datatable from "@layout/datatable";
import CommonUtil from "@common/util";
import Util from "@helper/inventory";
import Enum from "@enums/index";
import { 
   SelectCategory,
   SelectLocation
} from "@components/index";
import FormCreate from "../form.create";
import ProductAction from "../redux/action";
import Constant from "../redux/constant";
import ProductService from "@services/ProductService";
import LocationService from "@services/LocationService";
import ExchangeRateService from "@services/ExchangeRateService";
import { PageHeader } from "@components/PageHeader";
import "./index.css";

const { Text } = Typography;
const { TabPane } = Tabs;

export default class ProductList extends Datatable {
   constructor(props) {
      super(props);
      this.state = {
         ...this.state,
         loading: false,
         brands: [],
         locations: [],
         products: [],
         pagination: {},
         dataSourceToPrint: []
      };
      this.SelectCategoryRef = React.createRef();
      this.SelectLocationRef = React.createRef();
      this.editStockRef = React.createRef();
      this.locationList = [{name: <Translate id="text_all_store"/>, id: 0}];
      this.stockList = [
         {name: <Translate id="text_all_stock"/>, id: 0},
         {name: <Translate id="text_in_stock"/>, id: 1},
         {name: <Translate id="text_out_of_stock"/>, id: 2}
      ];
      this.columns = [
         {
            title: <Translate id="text_item_name" />,
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name - b.name,
            render: (name, record) => {
               const numberOfVariant = record?.productVariants?.length || 0;
               const stockCount = this.calculateTotalQuantity(record);
               const categoryName = record?.category?.name || 'Uncategorized';
               
               // Helper function to get product name (you'll need to implement this based on your Util)
               const getProductName = () => {
                  // Replace this with your actual utility function
                  return record?.name || name || 'Product Name';
               };

               return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <Avatar 
                     src={record?.image || record?.imageUrl || "https://ae-pic-a1.aliexpress-media.com/kf/S1dd261bc501a452ab057df05e6c91d823.jpg_960x960q75.jpg_.avif"} 
                     size={64}
                     shape="square"
                     style={{ 
                        borderRadius: '8px',
                        backgroundColor: '#f0f0f0'
                     }}
                     />
                     <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
                           {getProductName()}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                           <>
                              {
                                 numberOfVariant > 1 ?
                                 <Tag color="#2db7f5">
                                    {`${numberOfVariant} variants`}
                                 </Tag>
                                 :
                                 <Text type="secondary" style={{ fontSize: '12px', fontWeight: '500' }}>
                                    {Util.getProductBarcode(record)}
                                 </Text>
                              }
                              <Text type="secondary" style={{ fontSize: '12px' }}>•</Text>
                           </>
                           <Text type="secondary" style={{ fontSize: '12px' }}>
                              {categoryName}
                           </Text>
                           <Text type="secondary" style={{ fontSize: '12px' }}>•</Text>
                           <Text type="secondary" style={{ 
                              fontSize: '12px',
                              fontWeight: '500'
                           }}>
                              📦 Current Stock: {stockCount} {record?.unitOfMeasurement?.name}
                           </Text>
                           {stockCount <= record.reorderPoint && stockCount > 0 && (
                              <Text style={{ 
                              fontSize: '12px', 
                              color: '#fa8c16',
                              fontWeight: '500'
                              }}>
                                 📉 low
                              </Text>
                           )}
                        </div>
                     </div>
                  </div>
               );
            },
         },
         {
            title: <Translate id="text_retial_price" />,
            key: "price",
            dataIndex: "price",
            width: 180,
            align: "right",
            sorter: (a, b) => a.price - b.price,
            render: (_, record) => {
               return <Text strong style={{ fontSize: '16px' }}>
                  {exchangeAndFormatCurrency(Util.getProductPrice(record))}
               </Text>
            }
         },
         {
            title: <Translate id="text_whole_price" />,
            key: "wholePrice",
            dataIndex: "wholePrice",
            width: 180,
            align: "right",
            sorter: (a, b) => a.wholePrice - b.wholePrice,
            render: (_, record) => {
               return <Text strong style={{ fontSize: '16px' }}>{exchangeAndFormatCurrency(Util.getProductWholeSalePrice(record))}</Text>
            }
         },
         {
            title: <Translate id="text_distribute_price" />,
            key: "distributePrice",
            dataIndex: "distributePrice",
            width: 180,
            align: "right",
            sorter: (a, b) => a.distributePrice - b.distributePrice,
            render: (_, record) => <Text strong style={{ fontSize: '16px' }}>{exchangeAndFormatCurrency(Util.getProductDistributePrice(record))}</Text>
         },
         {
            title: <Translate id="text_action" />,
            key: "action",
            dataIndex: "action",
            align: "center",
            width: 100,
            render: (_, record) => {
               const menu = (
                  <Menu>
                     <Menu.Item key={1}>
                        <Link to={`/inventories/items/view/${record.id}?productOption=${record.productOption}`}>
                           <Icon type="eye" style={{marginRight: 10}} /> <Translate id="text_view" />
                        </Link>
                     </Menu.Item>
                     <Menu.Item key={2}>
                        <Link to={`/inventories/items/update/${record.id}?productOption=${record.productOption}`}>
                           <Icon type="edit" style={{marginRight: 10}} /> <Translate id="text_edit" />
                        </Link>
                     </Menu.Item>
                     <Menu.Item key={3} className={record.isSplittable ? "" : "hidden"}>
                        <Link to={`/inventories/items/split/${Util.getProductVariantId(record)}?productOption=${record.productOption}`}>
                           <Icon type="scissor" style={{marginRight: 10}} /> <Translate id="text_slit_item" />
                        </Link>
                     </Menu.Item>
                     <Divider style={{marginTop: 4, marginBottom: 4}} />
                     <Menu.Item key={4} onClick={() => this.handleConfirm(record)}>
                        <Icon type="delete" style={{marginRight: 10}} /> <Translate id="text_delete" />
                     </Menu.Item>
                     <Menu.Item key={5} onClick={() => this.editStockRef.showDrawer(record)}>
                        <Icon type="edit" style={{marginRight: 10}} /> <Translate id="text_edit_stock" />
                     </Menu.Item>
                  </Menu>
               );
               return <Dropdown overlay={menu} placement="bottomLeft">
                  <Button icon="more" />
               </Dropdown>;
            }
         }
      ];
      this.formCreate = <FormCreate />;
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
         const { currency, currencyId }  = this.Util.getSetting();

         if (params.get("current")) this.setState({ current: Number(params.get("current")) });
         if (params.get("search")) this.props.form.setFieldsValue({ key: params.get("search") });
         if (params.get("categoryId")) this.props.form.setFieldsValue({categoryId: params.get("categoryId")});
         if (params.get("locationId")) this.props.form.setFieldsValue({locationId: Number(params.get("locationId"))});

         this.fetchList(true);

         // Fetch the list of locations with pagination, sorting by "name" in ascending order
         LocationService.get(500, 0, "name", "ASC")
         .then(response => {
            if (response && response.data) {
               this.setState({locations: response.data.data});
            }
         });
         
         if (currency !== "$") {
            ExchangeRateService.getExchangeRate(JSON.stringify({"currencyId": [currencyId]}))
            .then(({data})=>{
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
         if (params.get("categoryId")) filter = JSON.stringify({ categoryId: params.get("categoryId") });
         if (params.get("locationId")) locationId = Number(params.get("locationId"));

         if (!withPagination) {
            offset = 1;
            this.setState({ current: 1 });
            params.delete("current");
            this.Util.pushParamsToURL(this.pathName, params.toString());
         }

         offset = (offset - 1) * limit;
         
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
            <Translate id="text_add_new" />
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

         if (product[0].serialType === Enum.SERIAL_TYPE.SERVICE || quantity <= 0){
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
         <Translate id="text_import" />
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
            <Translate id="text_add_new" />
      </Dropdown.Button>;
   }

   onSearch = (e) => {
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

   onChangeLocation = (locationId) => {
      const params = new URLSearchParams(document.location.search);

      if (locationId) {
         params.set("locationId", locationId);
      } else {
         params.delete("locationId");
      }

      this.Util.pushParamsToURL(this.pathName, params.toString());

      this.fetchList();
   }

   onSearchLocation = (value) => {
      LocationService.get({ search: value })
      .then(response => {
         if (response && response.data) {
            this.setState({ locations: response.data.data });
         }
      });
   }

   onChangeCategory = (categoryId) => {
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
      this.setState({ dataSourceToPrint: this.mapSelectedListIds(selectedRows) });
   }

   expandedRender(record) {
      return( 
         <div className="sub-table">
            <this.SubTable 
               columns={this.columnExpend}
               dataSource={record.productVariants}
               locale={{ emptyText: <Translate id="placeholder_table_variant_product" /> }}
            />
         </div>
      );
   }

   renderPagination() {
      const { total, limit } = this.state.pagination;
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
            <div className="table-wrapper">
               <PageHeader
                  title="Items Management"
                  subtitle="Manage all products and services"
                  breadcrumbs={[
                     { text: 'Dashboard', href: '/dashboard' },
                     { text: 'Items Management' }
                  ]}
                  actions={[
                     {
                        text: 'Import Items',
                        type: 'default',
                        icon: 'upload',
                        onClick: () => {}
                     },
                     {
                        text: <Translate id="text_add_new" />,
                        type: 'primary',
                        icon: 'plus',
                        onClick: () => {
                           ReactGA.event({
                              category: "Action Button",
                              action: "Add New Item",
                              label: "ERP HUB Web",
                           });

                           history.push("/inventories/items/create");
                        }
                     }
                  ]}
               />

               <Tabs defaultActiveKey="item">
                  <TabPane tab={`Items(${this.state.pagination.total})`} key="item" style={{ paddingLeft: "40px", paddingRight: "40px" }}>
                     <Row style={{ marginBottom: 10 }}>
                        <Col md={24}>
                           <Input
                              placeholder={this.CATranslate("text_search_item", this.props.locale)}
                              form={this.props.form}
                              onChange={this.onSearch}
                              suffix={<Icon type="search" />}
                              style={{width: 350, marginBottom: 0}}
                              allowClear={true}
                           />

                           <SelectCategory
                              ref={this.SelectCategoryRef}
                              onChange={this.onChangeCategory}
                           />

                           <SelectLocation
                              ref={this.SelectLocationRef}
                              onChange={this.onChangeLocation}
                           />
                        </Col>
                     </Row>

                     <Table
                        rowKey="id"
                        bordered={true}
                        pagination={false}
                        dataSource={this.state.products}
                        columns={this.columns}
                        rowClassName={this.rowClassName}
                        locale={{emptyText: <Translate id="table_empty_data"/>}}
                        // expandedRowRender={this.expandedRender}
                        onRow={record =>({onDoubleClick:() => this.handleShowFormEdit(record),})}
                        loading={this.state.loading}
                        size="middle"
                     />

                     <div style={{marginTop: 15}}>
                        {this.renderPagination()}
                     </div>

                     <this.clearFloating/>
                  </TabPane>
                  <TabPane tab="Stock" key="stock" style={{ paddingLeft: "40px", paddingRight: "40px" }}>
                     Content of Tab Pane 3
                  </TabPane>
               </Tabs>
            </div>
         </div>
      );
   }
}

const commonUtil = new CommonUtil();
let exchangeRate = 1;

const exchangeAndFormatToDollar = (price) => {
   return commonUtil.formatCurrency(price, "$");
};
const exchangeAndFormatToRiel = (price) => {
   return commonUtil.formatCurrency(commonUtil.toValidKHMoney(Exchange.dollarToRiel(price, exchangeRate)), "៛", 1, 0);
};

const currencyIsDollar = commonUtil.getSetting()?.currency === "$";
const exchangeAndFormatCurrency = currencyIsDollar ? exchangeAndFormatToDollar : exchangeAndFormatToRiel;
