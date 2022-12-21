import React from "react";
import { Translate } from "react-localize-redux";
import {connect} from "react-redux";
import {
  Col,
  Form, 
  Row,
  PageHeader,
  Table,
  Icon,
  message,
  Spin,
} from "antd";
import { 
  Button,
  Checkboxs,
  DateRangePicker, 
  InputText, 
  InputNumber,
  RadioNormal, 
  Select
} from "../../../../common/elements/ant-ui";
import history from "../../../../common/router/history";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import Util from "../../../../common/util";
import LocationService from "../../../../pos/services/settings/LocationService";
import PromotionService from "../../../services/products/PromotionService";
import Enum from "../../../../pos/enums";
import SearchProductDropdown from "../../../../pos/components/transactions/Invoice/SearchProduct";
import VariantProduct from "../../../../pos/components/transactions/RetailSale/VaraintProduct";
import moment from "moment";

const targetDiscount = {
  all: "all",
  some: "some"
};

const targetProduct = {
  all: "all",
  specific: "specific"
};

const promotionType = {
  basic: "basic",
  advanced: "advance"
};

class FormItem extends React.PureComponent {
  state = {
    locations: [],
    productEntries: [],
    productSearch: [],
    formData: {},
    loading: false,
    loadingButton: false
  }
  entryColumn = [
    {
      title: <Translate id="text_no" />,
      dataIndex: "id",
      key: "id",
      render: (id, record, index) => {
        return <div>
          {index + 1}
          <InputText
            name={`id[${index}]`}
            style={{display: "none"}}
            data={id}
            form={this.props.form} />
          <InputText
            style={{display: "none"}}
            name={`productVariantId[${index}]`}
            data={record.productVariantId}
            form={this.props.form} />
          <InputText
            style={{display: "none"}}
            name={`productId[${index}]`}
            data={record.productId}
            form={this.props.form} />
          <InputText
            style={{display: "none"}}
            name={`variantName[${index}]`}
            data={record.variantName}
            form={this.props.form} />
          <InputNumber
            name={`status[${index}]`}
            style={{display: "none"}}
            data={record.status}
            precision={0}
            form={this.props.form} />
        </div>;
      }
    },
    {
      title: <Translate id="text_product" />,
      dataIndex: "variantName",
      key: "variantName"
    },
    {
      title: <Translate id="text_barcode" />,
      dataIndex: "barcode",
      key: "barcode"
    },
    {
      title: <Translate id="text_price" />,
      dataIndex: "price",
      key: "price",
      render: (price) => this.util.formatCurrency(price)
    },
    {
      title: <Translate id="text_promotion_price" />,
      dataIndex: "price",
      key: "discountPrice",
      render: (price, record, index) => {
        const discountType = this.props.form.getFieldValue("discountType");
        let discount = this.props.form.getFieldValue("discount");
        if (discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
          discount = this.util.getValueFromPercentage(price, discount);
        }
        price = price - discount;
        return <div style={{display: "flex", justifyContent: "space-between"}}>
          <div>{this.util.formatCurrency(price)}</div>
          <Icon type="delete" style={{cursor: "pointer", color: "red"}} onClick={() => this.handleRemoveEntry(index)} />
          <InputNumber
            style={{display: "none"}}
            name={`price[${index}]`}
            data={price}
            form={this.props.form} />
        </div>;
      }
    }
  ];
  pageTitle = <Translate id="text_new_discount" />;
  util = new Util();
  id = null;

  componentDidMount() {
    LocationService.lists(20)
    .then(response => this.setState({locations: [{id: 0, name: "All"}, ...response.data.data]}));

    const idParam = this.props.match.params.id;
    if (idParam) {
      this.id = idParam;
      this.pageTitle = <Translate id="text_edit_discount" />;
      this.setState({loading: true});
      PromotionService.detail(idParam)
      .then(response => this.setState(preState => {
        const data = response.data;
        const productEntries = data.productDiscount.length && data.productDiscount.map(entry => ({
          ...entry, 
          barcode: entry.productVariant.barcode,
          price: entry.productVariant.price,
        }));
        delete data.productDiscount;

        preState.formData = data;
        preState.productEntries = productEntries ? productEntries : [];
        return preState;
      }))
      .finally(() => this.setState({loading: false}));
    } else {
      this.setState(preState => {
        preState.formData = {
          name: "",
          startDate: "",
          endDate: "",
          locationId: null,
          discount: 0,
          discountType: Enum.DISCOUNT_TYPE.PERCENTAGE,
          promotionType: promotionType.basic,
          targetDiscount: targetDiscount.all
        };

        return preState;
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["startDate"] = this.util.formatDateForMYSQL(values.dates[0], "YYYY-MM-DD HH:mm");
        values["endDate"] = this.util.formatDateForMYSQL(values.dates[1], "YYYY-MM-DD HH:mm");
        values.discount = Number(values.discount);
        if (values.productVariantId) {
          if (!values.targetProduct) {
            values.targetProduct = targetProduct.specific;
          }
          const productsDiscount = [];
          values.productVariantId.forEach((productVariantId, index) => {
            productsDiscount.push({
              id: values.id[index],
              productId: values.productId[index],
              productVariantId,
              variantName: values.variantName[index],
              price: values.price[index],
              status: values.status[index]
            });
          });

          delete values.productVariantId;
          delete values.price;
          delete values.dates;
          delete values.status;
          values.productDiscount = productsDiscount;
        }
        this.save(values);
      }
    });
  }

  save(data) {
    if (this.id) {
      this.setState({loadingButton: true});
      PromotionService.update(this.id, data)
      .then(() => {
        message.success("Success");
        history.goBack();
      })
      .catch(() => message.error("Error!"))
      .finally(() => this.setState({loadingButton: false}));
    } else {
      this.setState({loadingButton: true});
      PromotionService.create(data)
      .then(() => {
        message.success("Success");
        history.goBack();
      })
      .catch(() => message.error("Error!"))
      .finally(() => this.setState({loadingButton: false}));
    }
  }

  handleRemoveEntry = (index) => {
    const {productEntries} = this.state;
    if (productEntries && productEntries[index].id) {
      this.util.sweetAlertConfirm(stringTranslate("text_confirm_delete", this.props.locale), "warning")
      .then(isDelete => {
        if (isDelete) {
          productEntries[index].status = 3;
          this.setState({productEntries, productSearch: []});
        }
      });
    } else {
      productEntries.splice(index, 1);
      this.setState({productEntries, productSearch: []});
    }
  }

  handleOnSelectList = (product, productVariant, isRequestVariantForm = true) => {
    let isProductVariant = product.productOption === Enum.PRODUCT_VARIANT;
    if (isProductVariant && isRequestVariantForm) {
      this.setState({
        selectedProduct: product,
        modalVariant: <VariantProduct
        product={product}
        handleCancel={this.handleCancelVariantProduct}/>
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
        productId: productVariant.productId,
        productVariantId: productVariant.id,
        variantName: product.name ? product.name : product.namekm,
        barcode: productVariant.barcode,
        price: productVariant.price,
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
          productId: productVariant.productId,
          productVariantId: productVariant.id,
          variantName: product.name ? product.name : product.namekm,
          barcode: productVariant.barcode,
          price: productVariant.price,
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
      !this.state.loading && Object.keys(this.state.formData).length ?
      <div style={{background: "#FFFFFF", padding: "0px 15px 31px 18px", marginTop: 10}}>
        <Form onSubmit={this.handleSubmit} id="product-discount-form">
          <PageHeader
            style={{
              paddingLeft: 0,
              paddingRight: 0,
            }}
            onBack={() => history.goBack()}
            title={this.pageTitle}
            extra={[
              <Button key={0} type="info" htmlType="submit" loading={this.state.loadingButton}>
                <Translate id="text_save_and_close" />
              </Button>
            ]}
          />

          <Row>
            <Col md={6} style={{paddingLeft: 14, paddingRight: 28}}>
              <InputText 
                name="name"
                label={<Translate id="text_promotion_name" />}
                required={true}
                data={formData.name}
                errorRequired={`${stringTranslate("text_enter_promotion_name", this.props.locale)}`}
                placeholder={`${stringTranslate("text_enter_promotion_name", this.props.locale)}`}
                handleOnFocus={(e) => e.target.select()}
                form={this.props.form} />

              <DateRangePicker 
                name="dates"
                label={<Translate id="text_date" />}
                ranges={[]}
                showTime={{format: "hh:mm a"}}
                dateFormat="DD MM YYYY hh:mm a"
                defaultValue={formData.startDate ? [moment(formData.startDate), moment(formData.endDate)] : null}
                required={true}
                errorRequired={`${stringTranslate("text_please_enter_dates", this.props.locale)}`}
                form={this.props.form} />

              <Checkboxs
                name="isFeatured"
                label={<Translate id="text_featured_offer" />}
                defaultValue={formData.isFeatured ? true : false}
                form={this.props.form} />
            </Col>
            <Col md={18} style={{paddingLeft: 20}}>
              <Select 
                name="locationId"
                valueKey="id"
                label={<Translate id="text_location" />}
                placeholder={`${stringTranslate("text_location", this.props.locale)}`}
                defaultValue={formData.locationId}
                dataSource={this.state.locations}
                style={{width: 318}}
                form={this.props.form} />

              <Select 
                name="type"
                label={<Translate id="text_promotion_type" />}
                placeholder={`${stringTranslate("text_select_type", this.props.locale)}`}
                valueKey="value"
                defaultValue={promotionType.basic}
                dataSource={[
                  {value: promotionType.basic, name: <Translate id="text_basic" />}
                ]}
                style={{width: 318}}
                form={this.props.form}/> 

              <RadioNormal 
                label={<Translate id="text_target_promotion" />}
                defaultValue={targetDiscount.all}
                dataSource={[
                  {value: targetDiscount.all, title: stringTranslate("text_available_to_everyone", this.props.locale)},
                  {value: targetDiscount.some, title: stringTranslate("text_exclusive_to_some", this.props.locale), disabled: true}
                ]}
                inputStyle={{padding: "10px !important", marginTop: 3}}
                form={this.props.form} />
            </Col>
          </Row>
          <Row>
            <Col md={6} style={{paddingLeft: 14, paddingRight: 28, display: "flex", alignItems: "center"}}>
              <RadioNormal 
                name="discountType"
                label={<Translate id="text_discount" />}
                defaultValue={formData.discountType}
                buttonStyle="solid"
                dataSource={[
                  {value: Enum.DISCOUNT_TYPE.PERCENTAGE, title: "%"},
                  {value: Enum.DISCOUNT_TYPE.AMOUNT, title: "$"}
                ]}
                form={this.props.form} />
              <InputText 
                name="discount"
                type="number"
                required={true}
                data={`${(formData.discount)}`}
                handleOnFocus={(e) => e.target.select()}
                style={{paddingTop: 13, paddingLeft: 17, width: "100%"}}
                suffix={this.props.form.getFieldValue("discountType") === Enum.DISCOUNT_TYPE.PERCENTAGE ? "%" : "$"}
                form={this.props.form} />
            </Col>
            <Col md={18} style={{paddingLeft: 20, paddingRight: 38}}>
              <div style={{display: "flex", height: 70}}>
                <RadioNormal
                  name="targetProduct"
                  label={<Translate id="text_product" />}
                  defaultValue={formData.targetProduct}
                  buttonStyle="solid"
                  dataSource={[
                    {value: targetProduct.all, title: <Translate id="text_all" />},
                    {value: targetProduct.specific, title: <Translate id="text_specific" />}
                  ]}
                  form={this.props.form} />
                <SearchProductDropdown
                  productSearch={this.state.productSearch}
                  handleOnSelectList={this.handleOnSelectList}
                  locale={this.props.locale}
                  showIcon={false}
                  disabled={this.props.form.getFieldValue("targetProduct") === targetDiscount.all ? true : false}
                  style={{marginTop: 30, flexGrow: 1, paddingLeft: 17}}
                  form={this.props.form} />
              </div>

              <Table 
                rowKey={((record, index) => index)}
                columns={this.entryColumn}
                dataSource={this.state.productEntries}
                pagination={false}
                locale={{emptyText: <Translate id="text_no_sale_entries_product" />}}
                rowClassName={((record) => record.status === 3 ? "hidden" : "")}
              />
            </Col>
          </Row>
        </Form>
      </div>
      : <div style={{width: 30, margin: "0 auto", paddingTop: 30}}><Spin /></div>
    );
  }
}

function mapStateToProps(state) {
  return {
      locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
      form: props.form
  };
}

const formItem =  Form.create(mapPropsToFields)(FormItem);
  
export default connect(mapStateToProps)(formItem);