import React from "react";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import moment from "moment";
import { 
  PageHeader,
  Row,
  Col,
  Form,
  Table,
  Icon,
  Divider,
  Spin
} from "antd";
import { 
  Button, 
  DatePickers, 
  InputNumber, 
  InputText, 
  Select
} from "../../../../common/elements/ant-ui";
import Util from "../../../../common/util";
import SupplierService from "../../../services/stock/SupplierService";
import LocationService from "../../../../pos/services/settings/LocationService";
import StockConsignmentService from "../../../services/stock/StockConsignmentService";
import ProductVariantAction from "../../../actions/products/productVariant";
import history from "../../../../common/router/history";
import Enum from "../../../enums";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import SearchProductDropdown from "../../../../pos/components/transactions/Invoice/SearchProduct";
import VariantProduct from "../../../../pos/containers/transactions/SaleWalkin/VariantProduct";

class FormItem extends React.PureComponent {
  state = {
    formData: {},
    sellers: [],
    locations: [],
    productSearch: [],
    productEntries: [],
    selectedProduct: null,
    loading: false,
    submitLoading: false,
    modalVariant: null
  }
  util = new Util();
  entryColumn = [
    {
      title: <Translate id="text_product_name" />,
      dataIndex: "productName",
      key: "productName",
      render: (productName, record, index) => {
        return <React.Fragment>
          <InputText
            name={`productName[${index}]`}
            placeholder={`${stringTranslate("text_product_name", this.props.locale)}`}
            data={`${productName} ${record.variantName ? record.variantName : ""}`}
            handleOnFocus={(e) => e.target.select()}
            form={this.props.form} />
          <InputText
            name={`id[${index}]`}
            data={record.id}
            style={{display: "none"}}
            form={this.props.form} />
          <InputText
            name={`productVariantId[${index}]`}
            style={{display: "none"}}
            data={record.productVariantId}
            form={this.props.form} />
          <InputText
            name={`barcode[${index}]`}
            style={{display: "none"}}
            data={record.barcode}
            form={this.props.form} />

          <InputNumber
            name={`entryStatus[${index}]`}
            style={{display: "none"}}
            data={record.status}
            form={this.props.form} />
        </React.Fragment>;
      }
    },
    {
      title: <Translate id="text_quantity" />,
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record, index) => {
        return <InputNumber
          name={`quantity[${index}]`}
          placeholder={`${stringTranslate("text_quantity", this.props.locale)}`}
          data={quantity}
          isAutoSelect={true}
          precision={0}
          onChange={(value) => this.onChangeQty(value, index)}
          form={this.props.form}
        />;
      }
    },
    {
      title: <Translate id="text_cost" />,
      dataIndex: "cost",
      key: "cost",
      render: (cost, record, index) => {
        return <InputNumber
          name={`cost[${index}]`}
          placeholder={`${stringTranslate("text_cost", this.props.locale)}`}
          data={Number(cost)}
          isAutoSelect={true}
          onChange={(value) => this.onChangeCost(value, index)}
          form={this.props.form}
        />;
      }
    },
    {
      title: <Translate id="text_total" />,
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (amount) => this.util.formatCurrency(amount)
    },
    {
      title: <Translate id="text_action" />,
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 100,
      render: (id, record, index) => {
        return (
          <Icon type="delete" style={{color: "red"}} onClick={() => this.handleRemoveEntry(record.id, index)} />
        );
      }
    }
  ]
  id = "";

  componentDidMount() {
    const {id} = this.props.match.params;
    if (id) {
      this.id = id;
      this.fetchDetail();
    } else {
      this.setState({
        formData: {
          sellerId: "",
          locationId: this.util.getLocationId(),
          date: moment(),
          status: "Draft",
        },
        productEntries: []
      });
    }

    SupplierService.lists(100)
    .then(response => this.setState({sellers: response.data.data}));

    LocationService.lists(100)
    .then(response => this.setState({locations: response.data.data}));
  }

  componentDidUpdate() {
    if (this.props.productVariant.fetched) {
      if (this.props.productVariant.list) {
        this.handleOnSelectList(this.state.selectedProduct, [this.props.productVariant.list], false);
      } else {
        this.Message.error(stringTranslate("error_product_not_found", this.props.locale));
        this.props.form.setFieldsValue({searchProduct: ""});
        document.getElementById("searchProduct").focus();
      }
      this.props.dispatch(ProductVariantAction.reset("RESET_PRODUCT_VARIANT"));
    }
  }

  fetchDetail() {
    this.setState({loading: true});
    StockConsignmentService.detail(this.id)
    .then(response => {
      const data = response.data && response.data.data;
      const entries = data.consignment_entries && data.consignment_entries.map(entry => ({
        ...entry,
        status: 1,
        amount: entry.quantity * entry.cost
      }));
      delete data.consignment_entries;
      this.setState({
        formData: data,
        productEntries: entries
      });
    })
    .catch(err => console.log("error", err.response))
    .finally(() => this.setState({loading: false}));
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {formData} = this.state;
        if (formData.status === Enum.STOCK_CONSIGNMENT_STATUS.RECEIVED && values.status !== Enum.STOCK_CONSIGNMENT_STATUS.RETURNED) {
          return this.util.sweetAlertMessageV2("Warning", "This consignment already received", "error");
        }

        if (formData.status === Enum.STOCK_CONSIGNMENT_STATUS.RETURNED) {
          return this.util.sweetAlertMessageV2("Warning", "This consignment already returned", "error");
        }

        const consignment = {
          locationId: values.locationId,
          sellerId: values.sellerId,
          description: "",
          date: values.date ? moment(values.date).format("YYYY-MM-DD") : "",
          status: values.status
        };

        const consignmentEntries = [];
        if (values.productVariantId && values.productVariantId.length) {
          values.productVariantId.forEach((productVariantId, index) => {
            consignmentEntries.push({
              id: values.id[index],
              productVariantId: productVariantId,
              productName: values.productName[index],
              barcode: values.barcode[index],
              quantity: values.quantity[index],
              cost: values.cost[index],
              status: values.entryStatus[index]
            });
          });
        }

        consignment.entries = consignmentEntries;

        this.save(consignment);
      }
    });
  }

  save(consignment) {
    this.setState({submitLoading: true});
    if (this.id) {
      StockConsignmentService.update(this.id, consignment)
      .then(() => {
        this.util.sweetAlertMessageV2("Success!", stringTranslate("text_update_success", this.props.locale), "success", false, 1500)
        .then(() => history.goBack());
      })
      .catch(err => {
        console.log("error", err.response);
        const error = err.response && err.response.data && err.response.data.error;
        if (error) {
          this.util.sweetAlertMessageV2("Sorry!", error.message, "error");
        }
      })
      .finally(() => this.setState({submitLoading: false}));
    } else {
      StockConsignmentService.create(consignment)
      .then(() => {
        this.util.sweetAlertMessageV2("Success!", stringTranslate("text_save_success", this.props.locale), "success", false, 1500)
        .then(() => history.goBack());
      })
      .catch(err => {
        const error = err.response && err.response.data && err.response.data.error;
        this.util.sweetAlertMessageV2("Sorry", error.message, this.props.locale);
      })
      .finally(() => this.setState({submitLoading: false}));
    }
  }

  onChangeQty(qty, index) {
    if (qty) {
      this.setState(prevState => {
        const cost = prevState.productEntries[index].cost;
        prevState.productEntries[index].quantity = qty;
        prevState.productEntries[index].amount = cost * qty;
        return prevState;
      });
    }
  }

  onChangeCost(cost, index) {
    if (cost) {
      this.setState(prevState => {
        const quantity = prevState.productEntries[index].quantity;
        prevState.productEntries[index].cost = cost;
        prevState.productEntries[index].amount = cost * quantity;
        return prevState;
      });
    }
  }

  handleRemoveEntry(id, index) {
    if (this.state.formData.status === Enum.STOCK_CONSIGNMENT_STATUS.RETURNED) {
      return this.util.sweetAlertMessageV2(
        "Sorry",
        "Can't delete product in returned step",
        "error"
      );
    }

    if (this.state.formData.status === Enum.STOCK_CONSIGNMENT_STATUS.RECEIVED) {
      return this.util.sweetAlertMessageV2(
        "Sorry",
        "Can't delete product in received step",
        "error"
      );
    }

    const entries = [];
    Object.assign(entries, this.state.productEntries);
    if (id) {
      this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
      .then(willDelete => {
        if (willDelete) {
          entries[index].status = Enum.DELETE;
          this.setState({productEntries: entries});
        }
      });
    } else {
      entries.splice(index, 1);
      this.setState({productEntries: entries});
    }
  }

  handleOnSelectList = (product, productVariant, isRequestVariantForm = true) => {
    let isProductVariant = product.productOption === Enum.PRODUCT_VARIANT;
    if (isProductVariant && isRequestVariantForm) {
      this.setState({
        selectedProduct: product,
        modalVariant: <VariantProduct
        product={product}
        handleCancel={() => this.setState({modalVariant: null})}/>
      });
      return;
    } else if (productVariant && productVariant.length > 0) {
      productVariant = productVariant[0];
      productVariant.name = isProductVariant ? productVariant.name : "";
    }
    
    const existingProductList = this.state.productEntries;
    if (existingProductList.length === 0) {
      existingProductList.push({
        id: null,
        productVariantId: productVariant.id,
        productName: product.name ? product.name : product.namekm,
        variantName: productVariant.name,
        barcode: productVariant.barcode,
        quantity: 1,
        cost: productVariant.cost,
        amount: productVariant.cost * 1,
        status: 1
      });
    } else {
      let isNotTheSameProduct = true;
      existingProductList.forEach((product, index) => {
        if (product.productVariantId === productVariant.id) {
          if (existingProductList[index]["status"] === 3) {
            existingProductList[index]["status"] = 1;
          }
          isNotTheSameProduct = false;
        }
      });
      if (isNotTheSameProduct) {
        existingProductList.push({
          id: null,
          productVariantId: productVariant.id,
          productName: product.name ? product.name : product.namekm,
          variantName: productVariant.name,
          barcode: productVariant.barcode,
          quantity: 1,
          cost: productVariant.cost,
          amount: productVariant.cost * 1,
          status: 1
        });
      }
    }

    this.setState({productEntries: existingProductList});
    this.props.form.setFieldsValue({searchProduct: ""});
    document.getElementById("searchProduct").focus();
  }

  render() {

    const {formData} = this.state;
    return (
      <div>
        <PageHeader
            style={{
              paddingLeft: 0,
              paddingRight: 0,
            }}
            onBack={() => history.goBack()}
            title={<Translate id="text_stock_consignment" />}
          />

        {
          !this.state.loading ?
          <Form onSubmit={this.handleSubmit} id="product-discount-form">
            <Row id="purchase-order-form" gutter={40}>
              <Col md={6}>
                <Select 
                  name="sellerId"
                  label={<Translate id="text_seller" />}
                  placeholder={`${stringTranslate("text_seller", this.props.locale)}`}
                  valueKey="id"
                  required={true}
                  defaultValue={formData.sellerId}
                  dataSource={this.state.sellers}
                  form={this.props.form}/>

                <DatePickers
                  name="date"
                  label={<Translate id="text_date" />}
                  placeholder={`${stringTranslate("text_date", this.props.locale)}`}
                  defaultValue={formData.date ? moment(formData.date) : null}
                  form={this.props.form} />

                <Select
                  name="locationId"
                  label={<Translate id="text_location" />}
                  placeholder={`${stringTranslate("text_location", this.props.locale)}`}
                  defaultValue={Number(formData.locationId)}
                  valueKey="id"
                  disabled={formData.status !== Enum.STOCK_CONSIGNMENT_STATUS.DRAFT ? true : false}
                  dataSource={this.state.locations}
                  form={this.props.form}/>

                <Select
                  name="status"
                  label={<Translate id="text_status" />}
                  placeholder={`${stringTranslate("text_status", this.props.locale)}`}
                  defaultValue={formData.status}
                  valueKey="value"
                  dataSource={[
                    {value: "Draft", name: <Translate id="text_draft" />},
                    {value: "Received", name: <Translate id="text_received" />},
                    {value: "Returned", name: <Translate id="text_returned" />}
                  ]}
                  form={this.props.form} />
              </Col>
              <Col md={18} className="purchase-order-entry" style={{marginTop: 25}}>
                <SearchProductDropdown
                  productSearch={this.state.productSearch}
                  handleOnSelectList={this.handleOnSelectList}
                  placeholder={`${stringTranslate("text_search_product", this.props.locale)}`}
                  locale={this.props.locale}
                  form={this.props.form} />

                <Table 
                  style={{marginTop: -16}}
                  rowKey={((record, index) => index)}
                  columns={this.entryColumn}
                  dataSource={this.state.productEntries}
                  pagination={false}
                  locale={{emptyText: <Translate id="table_empty_data" />}}
                  rowClassName={((record) => record.status === Enum.DELETE ? "hidden" : "")}
                />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col md={24} style={{textAlign: "center"}}>
                <Button className="danger" onClick={() => history.goBack()} style={{marginRight: 15}}>
                  <span className="icon-cancel icon-padding-right"></span><Translate id="text_cancel" />
                </Button>  
                <Button htmlType="submit" loading={this.state.submitLoading} className="info">
                  <span className="icon-save icon-padding-right"></span><span id="btnModalSave"><Translate id="text_save" /></span>
                </Button>
              </Col>
            </Row>
          </Form>
          :
          <div style={{width: 30, margin: "0 auto", paddingTop: 30}}>
            <Spin />
          </div>
        }

        {this.state.modalVariant}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    productVariant: state.reducer.productVariant.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formItem = Form.create(mapPropsToFields)(FormItem);

export default connect(mapStateToProps)(formItem);