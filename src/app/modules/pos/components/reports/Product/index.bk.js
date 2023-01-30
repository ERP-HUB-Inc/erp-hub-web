import React from "react";
import ExportForm from "./ExportForm";
import List from "../List";
import Constant from "../../../constants/report/purchase";
import history from "../../../../common/router/history";
import FormCreate from "../../../../inventory/containers/stock/PurchaseOrder/FormCreate";
import ProductReportAction from "../../../action/report/product";
import ProductReportService from "../../../services/report/ProductService";
import LocationAction from "../../../action/settings/location";
import PurchaseAction from "../../../../inventory/actions/stock/purchaseOrder";
import InventoryUtil from "../../../../inventory/utils"; 
import Enum from "../../../../inventory/enums";
import "./index.css";

export default class ProductList extends List {
  constructor(props) {
    super(props);
    this.colorStockStatus = ["#4cb64c", "#f3a638", "#c72727"];
    this.columns = [
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
        title: <this.Translate id="text_barcode" />,
        dataIndex: "barcode",
        key: "barcode"
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "quantity",
        width: 150,
        key: "quantity",
        render: (quantity, record) => {
          quantity = record.quantity;
          if ("productLocations" in record) {
            quantity = InventoryUtil.getProductQTYLocation(record["productLocations"]);
          } else if ("productVariants" in record) {
            quantity = InventoryUtil.getProductQTYLocation(record["productVariants"]);
          }
          
          return `${quantity} ${record.product.unit.name}`;
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
        title: <this.Translate id="text_retail_price" />,
        dataIndex: "price",
        width: 150,
        align: "right",
        key: "price",
        render: price => this.formatCurrency(price)
      },
      {
        title: <this.Translate id="text_total_price" />,
        dataIndex: "price",
        width: 150,
        align: "right",
        key: "totalPrice",
        render: (price, record) => {
          return this.formatCurrency(price * record.quantity);
        }
      },
      {
        title: <this.Translate id="text_margin" />,
        dataIndex: "price",
        width: 150,
        align: "right",
        key: "margin",
        render: (price, record) => {

          const totalPrice = price * record.quantity,
            totalCost = record.cost * record.quantity,
            margin = ((totalPrice - totalCost) / totalPrice) * 100;

          return `${margin.toFixed(2)}%`;
        }
      }
    ];
    this.brandList = [{name: <this.Translate id="text_all_brand"/>, id: 0}];
    this.locationList = [{name: <this.Translate id="text_all_store"/>, id: 0}];
    this.productTypeList = [{productTypeDescriptions: {name: <this.Translate id="text_all_categories"/>}, id: 0}];
    this.columnFilterWithKey = ["name", "barcode"];
    this.pageSize = 50;
    this.pageSizeOptions = ["50", "100", "150", "200"];
    this.placeHolderForGeneralSearch = "text_general_seach_product";
    this.service = ProductReportService;
    this.action = ProductReportAction;
    this.RESET_CONSTANT = Constant.RESET_PURCHASE_REPORT;
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.handlePurchaseOrderForm = this.handlePurchaseOrderForm.bind(this);
  }

  componentDidMount() {
    const viewStock = this.Util.getQueryParam(this.props.location, "viewStock"),
      search = this.Util.getQueryParam(this.props.location, "search") | "",
      locationId = parseInt(this.Util.getQueryParam(this.props.location, "locationId"));

    let limit = this.Util.getQueryParam(this.props.location, "limit"),
      offset = this.Util.getQueryParam(this.props.location, "offset"),
      current = this.Util.getQueryParam(this.props.location, "current");

    limit = limit ? limit : this.pageSize;
    offset = offset ? offset : (this.state.current - 1) * limit;

    if (current) {
      this.setState({current: parseInt(current)});
    } else {
      current = this.state.current;
    }
    
    if (locationId) this.props.form.setFieldsValue({locationId});

    this.props.dispatch(ProductReportAction.getProductReport({limit, offset, viewStock, search, locationId}));
    this.props.dispatch(LocationAction.fetch(100));
  }

  onShowSizeChange(current, pageSize) {
    const params = new URLSearchParams(this.props.location.search);
    let search = params.get("search"),
      locationId = params.get("locationId");

    const option = {
      limit: pageSize,
      offset: (current - 1) * pageSize,
      search: search ? search : "",
      locationId: locationId > 0 ? locationId : 0
    };

    params.set("limit", pageSize);
    history.push({pathname: "/reports/product", search: `?${params.toString()}`});
    this.props.dispatch(ProductReportAction.getProductReport(option));
  }

  onChangePagination(current, pageSize) {
    const viewStock = this.Util.getQueryParam(this.props.location, "viewStock"),
      params = new URLSearchParams(this.props.location.search),
      offset = (current - 1) * pageSize;
    params.set("current", current);
    params.set("offset", offset);
    history.push({pathname: "/reports/product", search: `?${params.toString()}`});
    this.props.dispatch(ProductReportAction.getProductReport({limit: pageSize, offset, viewStock}));
    this.setState({current});
  }

  handleSubmitFilter(e) {
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const option = {
            limit: this.pageSize,
            offset: (this.state.current - 1) * this.pageSize,
            search: values.key ? values.key : "",
            locationId: values.locationId > 0 ? values.locationId : 0
          };

          history.push({path: "/reports/product", search: `?limit=${option.limit}&offset=${option.offset}&current=${this.state.current}&search=${option.search}&locationId=${option.locationId}`});

          this.props.dispatch(ProductReportAction.getProductReport(option));
          
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

  renderButtonAddNew() {
    const viewStock = this.Util.getQueryParam(this.props.location, "viewStock"),
      locationId = this.props.form.getFieldValue("locationId");

    return <div style={{ float: "left", marginRight: "11px" }}>
      <ExportForm locationId={locationId} viewStock={viewStock} />
    </div>;
  }

  renderButtonDelete() {}

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
                  defaultValue={0}/>
              </this.Col>
              <this.Col md="2" className="wrap-btn-search">
                <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                  <label htmlFor="status" className="" title=""></label>
                </div>
                <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
                  <span className="icon-search icon-padding-right"></span>{<this.Translate id="text_search" />}
                </this.Button> 
              </this.Col>

            </this.Row>
          </this.Form>
        </div>
    );
  }
}