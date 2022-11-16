import React from "react";
import {
  Menu,
  Dropdown,
  Icon
} from "antd";
import List from "../../List";
import Util from "../../../utils";
import Enum from "../../../enums";
import history from "../../../../common/router/history";
import FormCreate from "../../../containers/products/Product/FormCreate";
import Constant from "../../../constants/products/product";
import LocationAction from "../../../../pos/action/settings/location";
import ProductAction from "../../../actions/products/product";
import ProductService from "../../../services/products/ProductService";
import "./index.css";

export default class ProductList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      brands: [],
      locations: [],
      productTypes: [],
      dataSourceToPrint: []
    };
    this.locationList = [{name: <this.Translate id="text_all_store"/>, id: 0}];
    this.stockList = [
      {name: <this.Translate id="text_all_stock"/>, id: 0},
      {name: <this.Translate id="text_in_stock"/>, id: 1},
      {name: <this.Translate id="text_out_of_stock"/>, id: 2}
    ];
    this.columns = new Column(this.props);
    this.formCreate = <FormCreate/>;
    this.callBackOnShowEditForm = this.showFormEdit;
    this.columnExpend = new ColumnExpand(); 
    this.fetchingProp = "products";
    this.placeHolderForGeneralSearch = "text_general_seach_product";
    this.isShowExpandable = true;
    this.rowClassName = record => record.productOption !== Enum.PRODUCT_VARIANT ? "standard-product-row" : "";
    this.componentHasUpdated = false;
    this.service = ProductService;
    this.columnFilterWithKey = ["name", "barcode", "namekm"];
    this.action = ProductAction;
    this.RESET_CONSTANT = Constant.RESET_PRODUCT;
    this.handleClone = this.handleClone.bind(this);
    this.pathName = "/products/list";
  }

  componentDidMount() {
    const params = new URLSearchParams(document.location.search);
    if (params.get("current")) {
      this.setState({ current: Number(params.get("current")) });
    }
    if (params.get("search")) {
      this.props.form.setFieldsValue({ key: params.get("search") });
    }
    if (params.get("locationId")) {
      this.props.form.setFieldsValue({locationId: Number(params.get("locationId"))});
    }
    this.fetchList();
    this.props.dispatch(LocationAction.fetch()); 
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

  fetchList() {
    let searchKey = "";
    let filter = {};
    let locationId = 0;
    let limit = this.pageSize;
    let offset = this.state.current;
    const params = new URLSearchParams(document.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("current")) {
      offset = Number(params.get("current"));
    }

    if (params.get("search")) {
      searchKey = JSON.stringify({ column: this.columnFilterWithKey, value: params.get("search") });
    }

    if (params.get("locationId")) {
      locationId = Number(params.get("locationId"));
    }

    offset = (offset - 1) * limit;
    this.props.dispatch(this.action.fetch(limit, offset, "", "", filter, searchKey, locationId));
  }

  renderButtonAddNew() {
    return (
      <this.Link to="/products/create" className="ant-btn info" style={{marginRight: 15}}>
        <span className="icon-add icon-padding-right"></span>
        <this.Translate id="text_add_new" />
      </this.Link>
    );
  }

  showFormEdit(rowData) {
    history.push(`/products/update/${rowData.id}?productOption=${rowData.productOption}`);
  }

  handleClone() {
    if (this.state.selectedListIds.length > 0) {
      this.props.dispatch(ProductAction.clone(this.state.selectedListIds[0]));
    }
  }

  getAllQTY(record) {
    return Util.getProductQTYLocation(record["productVariants"]);
  }

  handleDelete() {
    let product = this.state.selectedRows;
    if(product){
      let quantity = this.getAllQTY(product[0]);

      if (product[0].serialType === Enum.SERIAL_TYPE.NON_INVENTORY){
        super.handleDelete();
      } else if(quantity <= 0) {
        super.handleDelete();
      } else{
        this.setState({modalVisible: false});
        this.Message.warning(this.CATranslate("error_delete_product", this.props.locale));
      }

    }
  }

  handleConfirm() {
    let selectedRows = this.state.selectedRows;
    if(selectedRows.length === 1){
      this.setState({ modalVisible: true });
    }else if(selectedRows.length > 1){
      this.Message.warning(this.CATranslate("text_allow_select_one_record", this.props.locale));
    }else{
      this.Message.warning(this.CATranslate("text_please_select_record", this.props.locale));
    }
  }

  renderButtonImport() {
    return <this.Link to={"/products/import"} className="ant-btn" style={{marginLeft: 15}}>
      <span className="icon-import icon-padding-right"></span>
      <this.Translate id="text_import" />
    </this.Link>;
  }

  buttonActionCollection() {
    return [
      this.renderButtonAddNew(),
      this.renderButtonDelete(),
      this.renderButtonImport()
    ];
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const params = new URLSearchParams(document.location.search);
          if (values.key) {
            if (params.get("search")) {
              params.set("search", values.key);
            } else {
              params.append("search", values.key);
            }
          } else {
            params.delete("search");
          }

          if (values.locationId) {
            if (params.get("locationId")) {
              params.set("locationId", values.locationId); 
            } else {
              params.append("locationId", values.locationId);
            }
          } else {
            params.delete("locationId");
          }

          this.Util.pushParamsToURL(this.pathName, params.toString());
          this.fetchList();
          this.setState({isClickFilter: true});
        }
      }); 
    } 
  }

  onShowSizeChange(current, pageSize) {
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
      this.fetchList();
    }
  }

  onChangePagination(current, pageSize) {
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
      this.fetchList();
    }
  }

  renderFilterRecord() {
    const {form} = this.props;
    const fetchingProps = this.props[this.fetchingProp];
    return (
      form == null ?
        ""
        :
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
                defaultValue={0}
              />
            </this.Col>
            <this.Col md="2" className="hidden">
              <this.Select
                name="status"
                label={<this.Translate id="text_status" />}
                dataSource={this.statusList}
                defaultValue={this.Enum.ALL_STATE}
                form={form}/>
            </this.Col>
            <this.Col md="2" className="wrap-btn-search">
              <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                <label htmlFor="status" className="" title="">Filter</label>
              </div>
              <this.Button htmlType="submit" type="default" loading={this.state.isClickFilter && fetchingProps.fetching}>
                <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
              </this.Button>
            </this.Col>
          </this.Row>
        </this.Form>
    ); 
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
}

class ColumnExpand extends List {
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
        dataIndex: "price",
        key: "price",
        width: 150,
        align: "center",
        render: price => this.formatCurrency(price)
      },
      {
        dataIndex: "wholePrice",
        key: "wholePrice",
        width: 150,
        align: "center",
        render: wholePrice => this.formatCurrency(wholePrice),
      },
      {
        dataIndex: "distributePrice",
        key: "distributePrice",
        width: 180,
        align: "center",
        render: distributePrice => this.formatCurrency(distributePrice)
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
          let quantity = this.getQTY(virtaulProduct);
          
          let colorIndex = 0;
          if (quantity === 0) {
            colorIndex = 1;
          } else if (quantity < 0) {
            colorIndex = 1;
          }

          return <this.Tag color={this.colorStockStatus[colorIndex]} className="text-center label-stock-status">{quantity}</this.Tag>;
        },
      }
    ];
  }

  getQTY(record) {
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

class Column extends List {
  constructor(props) {
    super(props);
    this.colorStockStatus = ["#4cb64c", "#f3a638"];
    return [
      {
        title: <this.Translate id="text_product_name" />,
        dataIndex: "name",
        key: "name",
        render: (name, record) => {
          const menu = (
            <Menu>
              <Menu.Item className="hidden">
                <this.Link to={`/products/detail/${record.id}?productOption=${record.productOption}`}>
                  <Icon type="eye" style={{marginRight: 10}} /> View
                </this.Link>
              </Menu.Item>
              <Menu.Item>
                <this.Link to={`/products/update/${record.id}?productOption=${record.productOption}`}>
                  <Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_edit" />
                </this.Link>
              </Menu.Item>
              <Menu.Item className={record.isSplittable ? "" : "hidden"}>
                <this.Link to={`/products/split/${Util.getProductVariantId(record)}?productOption=${record.productOption}`}>
                  <Icon type="scissor" style={{marginRight: 10}} /> <this.Translate id="text_slit_product" />
                </this.Link>
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
        title: <this.Translate id="text_stock_type" />,
        dataIndex: "serialType",
        key: "serialType",
        width: 150,
        render: serialType => {
          let stockTypeStr = <this.Translate id="text_other" />;
          if (serialType === Enum.SERIAL_TYPE.STANDARD) {
            stockTypeStr = <this.Translate id="text_inventory" />;
          } else if (serialType === Enum.SERIAL_TYPE.NON_INVENTORY) {
            stockTypeStr = <this.Translate id="text_non_inventory" />;
          }

          return stockTypeStr;
        }
      },
      {
        title: <this.Translate id="text_retial_price" />,
        key: "price",
        dataIndex: "price",
        width: 150,
        align: "center",
        render: (text, record) => this.formatCurrency(Util.getProductPrice(record))
      },
      {
        title: <this.Translate id="text_whole_price" />,
        key: "wholePrice",
        dataIndex: "wholePrice",
        width: 150,
        align: "center",
        render: (text, record) => this.formatCurrency(Util.getProductWholeSalePrice(record))
      },
      {
        title: <this.Translate id="text_distribute_price" />,
        key: "distributePrice",
        dataIndex: "distributePrice",
        width: 170,
        align: "center",
        render: (text, record) => this.formatCurrency(Util.getProductDistributePrice(record))
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "quantity",
        key: "quantity",
        width: 130,
        align: "right",
        render: (quantity, record) => {
          quantity = this.getQTY(record);
          return `${quantity} ${record.unit.name}`;
        }
      }
    ];
  }

  getQTY(record) {
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
}
