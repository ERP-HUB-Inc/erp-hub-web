import React from "react";
import { Translate } from "react-localize-redux";
import {connect} from "react-redux";
import {
  Col,
  Form, 
  Row,
  PageHeader,
  Table,
  Icon
} from "antd";
import { 
  Button, 
  DateRangePicker, 
  InputText, 
  RadioNormal, 
  Select
} from "../../../../common/elements/ant-ui";
import history from "../../../../common/router/history";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import Util from "../../../../common/util";
import LocationService from "../../../../pos/services/settings/LocationService";
import ProductService from "../../../services/products/ProductService";
import Enum from "../../../../pos/enums";
import SearchProductDropdwon from "../../../../pos/components/transactions/Invoice/SearchProduct";
import VariantProduct from "../../../../pos/components/transactions/RetailSale/VaraintProduct";

class FormItem extends React.PureComponent {
  state = {
    locations: [],
    productEnties: [],
    productSearch: []
  }
  entryColumn = [
    {
      title: <Translate id="text_no" />,
      dataIndex: "id",
      key: "no",
      render: (id, record, index) => index + 1
    },
    {
      title: <Translate id="text_product" />,
      dataIndex: "variantName",
      key: "variantName",
      render: (variantName, record, index) => {
        return <div style={{display: "flex", justifyContent: "space-between"}}>
          <div>{variantName}</div>
          <Icon type="delete" style={{cursor: "pointer", color: "red"}} onClick={() => this.handleRemoveEntry(index)} />

          <InputText
            style={{display: "none"}}
            name={`productVariantId[${index}]`}
            data={record.productVariantId}
            form={this.props.form} />
        </div>;
      }
    }
  ];
  pageTitle = <Translate id="text_new_discount" />;
  util = new Util();

  componentDidMount() {
    LocationService.lists(20)
    .then(response => this.setState({locations: response.data.data}));

    ProductService.searchForDrowDown(15, 0)
    .then(response => this.setState({productSearch: response && response.data.data}));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("values", values);
      }
    });
  }

  handleRemoveEntry = (index) => {
    const {productEnties} = this.state;
    if (productEnties && productEnties[index].id) {
      this.util.sweetAlertConfirm(stringTranslate("text_confirm_delete", this.props.locale), "warning")
      .then(isDelete => {
        if (isDelete) {
          productEnties[index].status = 3;
          this.setState({productEnties, productSearch: []});
        }
      });
    } else {
      productEnties.splice(index, 1);
      this.setState({productEnties, productSearch: []});
    }

    console.log("entry", this.state.productEnties);
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
    
    const existingProductList = this.state.productEnties;
    if (existingProductList.length === 0) {
      existingProductList.push({
        id: null,
        productVariantId: productVariant.id,
        variantName: product.name ? product.name : product.namekm,
        status: 1
      });
    } else {
      let isNotTheSameProduct = true;
      existingProductList.forEach((product, index) => {
        if (product.productVariantId === productVariant.id) {
          let quantity = existingProductList[index]["quantity"] += 1;
          existingProductList[index]["quantity"] = quantity;
          existingProductList[index]["amount"] = quantity * existingProductList[index]["price"];
          isNotTheSameProduct = false;
        }
      });
      if (isNotTheSameProduct) {
        existingProductList.push({
          id: null,
          productVariantId: productVariant.id,
          variantName: product.name ? product.name : product.namekm,
          status: 1
        });
      }
    }

    this.setState({productEnties: existingProductList});
    this.props.form.setFieldsValue({searchProduct: ""});
    document.getElementById("searchProduct").focus();
  }

  render() {
    return (
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
              <Button key={0} type="info" htmlType="submit">
                <Translate id="text_save_and_close" />
              </Button>
            ]}
          />

          <Row>
            <Col md={6} style={{paddingLeft: 14, paddingRight: 60}}>
              <InputText 
                name="name"
                label={<Translate id="text_promotion_name" />}
                placeholder={`${stringTranslate("text_enter_promotion_name", this.props.locale)}`}
                form={this.props.form} />

              <DateRangePicker 
                name="dates"
                label={<Translate id="text_date" />}
                form={this.props.form} />
            </Col>
            <Col md={18} style={{paddingLeft: 20}}>
              <Select 
                name="locationId"
                valueKey="id"
                label={<Translate id="text_location" />}
                placeholder={`${stringTranslate("text_location", this.props.locale)}`}
                dataSource={this.state.locations}
                style={{width: 318}}
                form={this.props.form} />

              <Select 
                name="type"
                label={<Translate id="text_promotion_type" />}
                placeholder={`${stringTranslate("text_select_type", this.props.locale)}`}
                dataSource={[]}
                style={{width: 318}}
                form={this.props.form}/> 

              <RadioNormal 
                name="target"
                label={<Translate id="text_target_promotion" />}
                dataSource={[
                  {value: 1, title: stringTranslate("text_available_to_everyone", this.props.locale)},
                  {vlaue: 2, title: stringTranslate("text_exclusive_to_some", this.props.locale)}
                ]}
                inputStyle={{padding: "10px !important", marginTop: 3}}
                form={this.props.form} />
            </Col>

            <Col md={6} style={{paddingLeft: 14, paddingRight: 60, display: "flex"}}>
              <RadioNormal 
                name="discountType"
                label={<Translate id="text_discount" />}
                defaultValue={Enum.DISCOUNT_TYPE.PERCENTAGE}
                buttonStyle="solid"
                dataSource={[
                  {value: Enum.DISCOUNT_TYPE.PERCENTAGE, title: "%"},
                  {value: Enum.DISCOUNT_TYPE.AMOUNT, title: "$"}
                ]}
                form={this.props.form} />

              <InputText 
                name="discount"
                type="number"
                style={{paddingTop: 32, paddingLeft: 17}}
                suffix={this.props.form.getFieldValue("discountType") === Enum.DISCOUNT_TYPE.PERCENTAGE ? "%" : "$"}
                form={this.props.form} />
            </Col>
            <Col md={18} style={{paddingLeft: 20, paddingRight: 17}}>
              <div style={{display: "flex", height: 70}}>
                <RadioNormal
                  label={<Translate id="text_product" />}
                  defaultValue="all"
                  buttonStyle="solid"
                  dataSource={[
                    {value: "all", title: <Translate id="text_all" />},
                    {value: "specific", title: <Translate id="text_specific" />}
                  ]}
                  form={this.props.form} />
                <SearchProductDropdwon
                  productSearch={this.state.productSearch}
                  handleOnSelectList={this.handleOnSelectList}
                  locale={this.props.locale}
                  showIcon={false}
                  style={{marginTop: 32, flexGrow: 1, paddingLeft: 17}}
                  form={this.props.form} />
              </div>

              <Table 
                rowKey={((record, index) => index)}
                columns={this.entryColumn}
                dataSource={this.state.productEnties}
                pagination={false}
                locale={{emptyText: <Translate id="text_no_sale_entries_product" />}}
                rowClassName={((record) => record.status === 3 ? "hidden" : "")}
              />
            </Col>
          </Row>
        </Form>
      </div>
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