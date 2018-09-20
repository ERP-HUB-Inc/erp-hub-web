import React from "react";
import VaraintProduct from "./VaraintProduct";
import CustomerDropDownSearch from "../../../../crm/components/customers/customer/DropDownSearch";
import ProductDropDownSearch from "../../../../inventory/components/products/Product/DropDownSearch";
import Component from "../../../../common/components/Component";
import "./index.css";
export default class Retail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVariantProduct: false,
      variantProductList: [],
      categoryList: [
        {id: 1, name: "Drinks"},
        {id: 2, name: "Drinks"},
        {id: 3, name: "Drinks"},
        {id: 4, name: "Drinks"},
        {id: 5, name: "Drinks"},
        {id: 6, name: "Drinks"},
        {id: 7, name: "Drinks"},
        {id: 8, name: "Drinks"}
      ],
      productList: [
        {id: 1, name: "Coca Cola 2 L Bottle", price: 1.75, image: "https://storeveinresource.sgp1.digitaloceanspaces.com/sting.PNG", options: [
          {attribute: "Color", variant: [{name: "GOLD"}, {name: "WHITE"}, {name: "BLACK"}]},
          {attribute: "Size", variant: [{name: "8G"}, {name: "12G"}, {name: "128G"}]}
        ]},
        {id: 2, name: "Coca Cola 2 L Bottle", price: 1.75, image: "https://storeveinresource.sgp1.digitaloceanspaces.com/barcase.PNG", options: []},
        {id: 3, name: "Coca Cola 2 L Bottle", price: 1.75, image: "https://storeveinresource.sgp1.digitaloceanspaces.com/coca.PNG", options: []},
        {id: 4, name: "Coca Cola 2 L Bottle", price: 1.75, image: "https://storeveinresource.sgp1.digitaloceanspaces.com/milk.PNG", options: []},
        {id: 5, name: "Coca Cola 2 L Bottle", price: 1.75, image: "https://storeveinresource.sgp1.digitaloceanspaces.com/fanta.PNG", options: []},
        {id: 6, name: "Coca Cola 2 L Bottle", price: 1.75, image: "https://storeveinresource.sgp1.digitaloceanspaces.com/carabav.PNG", options: []},
        {id: 7, name: "Coca Cola 2 L Bottle", price: 1.75, image: "https://storeveinresource.sgp1.digitaloceanspaces.com/soda.PNG", options: []},
        {id: 8, name: "Coca Cola 2 L Bottle", price: 1.75, image: "https://storeveinresource.sgp1.digitaloceanspaces.com/sting.PNG", options: []},
      ],
      selectedCategoryIds: []
    };
    this.handleOnSelectCategory = this.handleOnSelectCategory.bind(this);
    this.handleOnSelectProduct = this.handleOnSelectProduct.bind(this);
    this.handleCancelVariant = this.handleCancelVariant.bind(this);
  }

  handleOnSelectCategory(value) {
    const selectedCategoryIds = this.state.selectedCategoryIds;
    if (selectedCategoryIds.length === 0) {
      selectedCategoryIds.push(value);
    } else {
      let isNotTheSame = true;
      selectedCategoryIds.forEach((categoryId, categoryIdIndex) => {
        if (categoryId === value) {
          isNotTheSame = false;
          selectedCategoryIds.splice(categoryIdIndex, 1);
        }
      });
      if (isNotTheSame) {
        selectedCategoryIds.push(value);
      }
    }
    this.setState({selectedCategoryIds});
  }

  handleCancelVariant() {
    this.setState({
      showVariantProduct: false,
      variantProductList: []
    });
  }

  handleOnSelectProduct(value) {
    if (value.options.length > 0) {
      this.setState({
        showVariantProduct: true,
        variantProductList: value.options
      });
    }
  }
  render() {
    return (
      <this.Row className="main-layout main-store-account" id="retail-sale">
        <this.Col md="7">
          <this.Row className="wrap-category">
            <this.Col md="12" className="receipt-type">
              <div className="pull-left current-receipt selected">
                <span className="icon-receipt icon-padding-right"></span><this.Translate id="current_receipt_type"/>
              </div>
              <div className="pull-left park-receipt">
                <span className="icon-receipt icon-padding-right"></span><this.Translate id="park_receipt_type"/>
              </div>
            </this.Col>
            {
              this.state.categoryList.map((category, index) =>
                <this.Col md="3" className="category-box" key={index}>
                  <div onClick={() => this.handleOnSelectCategory(category.id)} className={`category ${this.state.selectedCategoryIds.includes(category.id)? "selected": "" }`}>
                    {category.name}
                  </div>
                </this.Col>
              )
            }
          </this.Row>
          <this.Row>
            {
              this.state.productList.map((product, index) =>
                <this.Col md="3" className="product-box" key={index}>
                  <div onClick={() => this.handleOnSelectProduct(product)} className="product">
                    <div className="image"><img alt="example" src={product.image} /></div>
                    <div className="name">{product.name}</div>
                    <div className="price">{this.Util.formatCurrency(product.price)}</div>
                  </div>
                </this.Col>
              )
            }
          </this.Row>
        </this.Col>
        <this.Col md="5">
          <this.Row>
            <CustomerDropDownSearch
              customers={this.props.customers}
              locale={this.props.locale}
              form={this.props.form}
              dispatch={this.props.dispatch} />
            <ProductDropDownSearch
              productSearch={this.props.productSearch}
              locale={this.props.locale}
              form={this.props.form}
              dispatch={this.props.dispatch} />
          </this.Row>
        </this.Col>
        {
          this.state.showVariantProduct ?
            <VaraintProduct
              dataSource={this.state.variantProductList}
              handleCancel={this.handleCancelVariant}/>
            :
            ""
        }
      </this.Row>
    );
  }
}