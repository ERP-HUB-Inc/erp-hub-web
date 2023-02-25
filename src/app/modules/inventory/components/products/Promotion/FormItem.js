import React from "react";
import moment from "moment";
import { Translate } from "react-localize-redux";
import {connect} from "react-redux";
import {
  Col,
  Form, 
  Row,
  PageHeader,
  message,
  Spin,
} from "antd";
import { 
  Button,
  Checkboxs,
  DateRangePicker, 
  InputText, 
  RadioNormal, 
  Select
} from "../../../../common/elements/ant-ui";
import history from "../../../../common/router/history";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import Util from "../../../../common/util";
import LocationService from "../../../../pos/services/settings/LocationService";
import PromotionService from "../../../services/products/PromotionService";
import Enum from "../../../../pos/enums";
import BasicDiscount from "./basic";
import AdvanceDiscount from "./advance";

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
    whenBuyProducts: [],
    thenGetProducts: [],
    formData: {},
    loading: false,
    loadingButton: false
  }
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
        if (data.type === promotionType.basic) {
          const productEntries = data.productDiscount.length && data.productDiscount.map(entry => ({
            ...entry, 
            barcode: entry.productVariant.barcode,
            price: entry.productVariant.price,
          }));
          data.promotionCriteria = {};
          delete data.productDiscount;

          preState.formData = data;
          preState.productEntries = productEntries ? productEntries : [];
          return preState;
        } else if (data.type === promotionType.advanced) {
          const promotionCriteria = data.promotionCriteria;
          const whenBuyProducts = promotionCriteria && promotionCriteria.whenBuyProducts;
          const thenGetProducts = promotionCriteria && promotionCriteria.thenGetProducts;
          preState.formData = data;
          preState.whenBuyProducts = whenBuyProducts;
          preState.thenGetProducts = thenGetProducts;
          return preState;
        }
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
          type: promotionType.basic,
          targetDiscount: targetDiscount.all,
          promotionCriteria: {}
        };

        return preState;
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {formData} = this.state;
        values["startDate"] = this.util.formatDateForMYSQL(values.dates[0], "YYYY-MM-DD HH:mm");
        values["endDate"] = this.util.formatDateForMYSQL(values.dates[1], "YYYY-MM-DD HH:mm");
        values.discount = Number(values.discount);
          
        if (formData.type === promotionType.basic) {
          if (values.productVariantId) {
            if (!values.targetProduct) {
              values.targetProduct = targetProduct.specific;
            }
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
          values.productDiscount = productsDiscount;
        } else if (formData.type === promotionType.advanced) {
          let promotionCriteria = {
            id: formData.promotionCriteria && formData.promotionCriteria.id,
            when: values.when,
            whenTarget: values.whenTarget,
            buyQuantity: values.buyQuantity ? values.buyQuantity : 0,
            spendAmount: values.spendAmount ? values.spendAmount : 0,
            then: values.then,
            getQuantity: 0,
            getPercentage: 0,
            getAmount: 0,
            thenTarget: values.thenTarget
          };

          const whenBuyProducts = [];
          const thenGetProducts = [];

          if (values.discountType === "free") {
            promotionCriteria.getQuantity = values.getQuantity;
          } else if (values.discountType === "%") {
            promotionCriteria.getPercentage = values.getAmount;
          } else if (values.discountType === "$") {
            promotionCriteria.getAmount = values.getAmount;
          }

          if (this.state.whenBuyProducts && this.state.whenBuyProducts.length) {
            this.state.whenBuyProducts.forEach(entry => {
              whenBuyProducts.push({
                id: entry.id,
                productId: entry.productId,
                productVariantId: entry.productVariantId,
                productName: entry.productName,
                type: "WHEN",
                status: entry.status
              });
            });
          }

          if (this.state.thenGetProducts && this.state.thenGetProducts.length) {
            this.state.thenGetProducts.forEach(entry => {
              thenGetProducts.push({
                id: entry.id,
                productId: entry.productId,
                productVariantId: entry.productVariantId,
                productName: entry.productName,
                type: "THEN",
                status: entry.status
              });
            });
          }

          promotionCriteria.whenBuyProducts = whenBuyProducts;
          promotionCriteria.thenGetProducts = thenGetProducts;
          values.promotionCriteria = promotionCriteria;
          values.discountType = 0;
        }

        delete values.productVariantId;
        delete values.price;
        delete values.dates;
        delete values.status;
      }
      this.save(values);
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

  handleUpdateProductEntries = (productEntries) => {
    this.setState({productEntries});
  }

  handleUpdateWhenEntries = (whenBuyProducts) => {
    this.setState({whenBuyProducts: this.util.copyArrayObj(whenBuyProducts)});
  }

  handleUpdateThenEntries = (thenGetProducts) => {
    this.setState({thenGetProducts: this.util.copyArrayObj(thenGetProducts)});
  }

  handleOnSelectListBasicDiscount = (productEntries) => {
    this.setState({productEntries});
  }

  render() {
    const {formData} = this.state;
    return (
      !this.state.loading || Object.keys(this.state.formData).length ?
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
                style={{display: formData.type === promotionType.advanced ? "none" : "block"}}
                form={this.props.form} />
            </Col>
            <Col md={18} style={{paddingLeft: 20}}>
              <Select 
                name="locationId"
                valueKey="id"
                label={<Translate id="text_location" />}
                placeholder={`${stringTranslate("text_location", this.props.locale)}`}
                defaultValue={formData.locationId ? formData.locationId : this.util.getLocationId()}
                dataSource={this.state.locations}
                style={{width: 318}}
                form={this.props.form} />

              <Select 
                name="type"
                label={<Translate id="text_promotion_type" />}
                placeholder={`${stringTranslate("text_select_type", this.props.locale)}`}
                valueKey="value"
                defaultValue={formData.type}
                dataSource={[
                  {value: promotionType.basic, name: <Translate id="text_basic" />},
                  {value: promotionType.advanced, name: <Translate id="text_advance" />}
                ]}
                style={{width: 318}}
                onChange={(value) => this.setState(preState => {
                  preState.formData.type = value;
                  return preState;
                })}
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
            {
              formData.type === promotionType.advanced ?
              <Row>
                <Col md={6} style={{paddingRight: 28}}></Col>
                <AdvanceDiscount 
                  formData={formData}
                  locale={this.props.locale}
                  productBuyVariant={this.props.productVariant}
                  productGetVariant={this.props.productGetVariant}
                  whenBuyProducts={this.state.whenBuyProducts}
                  thenGetProducts={this.state.thenGetProducts}
                  handleUpdateWhenEntries={this.handleUpdateWhenEntries}
                  handleUpdateThenEntries={this.handleUpdateThenEntries}
                  form={this.props.form}
                />
              </Row>
              :
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
                <BasicDiscount
                  formData={formData}
                  locale={this.props.locale}
                  productVariant={this.props.productVariant}
                  productEntries={this.state.productEntries}
                  handleOnSelectList={this.handleOnSelectListBasicDiscount}
                  handleUpdateProductEntries={this.handleUpdateProductEntries}
                  form={this.props.form} 
                />
              </Row>
            }
        </Form>
      </div>
      : <div style={{width: 30, margin: "0 auto", paddingTop: 30}}><Spin /></div>
    );
  }
}

function mapStateToProps(state) {
  return {
    locale: state.locale,
    productVariant: state.reducer.productVariant.request,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formItem =  Form.create(mapPropsToFields)(FormItem);
  
export default connect(mapStateToProps)(formItem);