import React from "react";
import $ from "jquery";
import ProductAction from "../../../actions/products/product";
import Modal from "../../../../common/components/shares/Modal";

export default class DropDownSearch extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      visibleDropDown: false,
      isMouseHoverOnSearchList: false
    };

    this.scrollTop = 0;
    this.timer = null;

    this.handleKeyDownOnProductSearch = this.handleKeyDownOnProductSearch.bind(this);
    this.handlePressEnterOnSearch = this.handlePressEnterOnSearch.bind(this);
    this.handleOnBlurSearch = this.handleOnBlurSearch.bind(this);
    this.handleOnFocusSearch = this.handleOnFocusSearch.bind(this);
    this.handleOnSelectList = this.handleOnSelectList.bind(this);
    this.handleOnMouseHoverOnSearchList = this.handleOnMouseHoverOnSearchList.bind(this);
    this.handleOnMouseLeaveOnSearchList = this.handleOnMouseLeaveOnSearchList.bind(this);
    this.renderSearchItem = this.renderSearchItem.bind(this);
    this.handleRemoveTextSearch = this.handleRemoveTextSearch.bind(this);
  }

  componentDidMount() {
    var element = document.getElementsByClassName("ant-list-item");
    if (element.length > 0) {
      element[0].classList.add("search-item-hover");
    }
  }

  componentDidUpdate() {
    var element = document.getElementsByClassName("ant-list-item");
    if (element.length > 0) {
      element[0].classList.add("search-item-hover");
    }
  }

  handlePressEnterOnSearch() {
    const currentActive = $(".ant-spin-container div.search-item-hover");
    const productId = currentActive.attr("classid");
    const product = this.props.productSearch.list.find(value => value.id === productId);
    this.props.handlePressEnterOnSearch(product);
    this.setState({visibleDropDown: false});
  }

  handleOnBlurSearch() {
    if (!this.state.isMouseHoverOnSearchList) {
      this.setState({visibleDropDown: false});
    }
    this.props.form.setFieldsValue({isFocusOnSearchCompositeProduct: 0});
  }

  handleOnFocusSearch() {
    this.props.form.setFieldsValue({isFocusOnSearchCompositeProduct: 1});
    this.setState({visibleDropDown: true});
  }

  handleOnMouseHoverOnSearchList() {
    this.setState({isMouseHoverOnSearchList: true});
  }

  handleOnMouseLeaveOnSearchList() {
    this.setState({isMouseHoverOnSearchList: false});
  }

  handleOnSelectList(value) {
    this.props.handleOnSelectList(value);
    this.setState({visibleDropDown: false});
  }

  handleKeyDownOnProductSearch(event) {
    const value = event.target.value.trim();

    if (event.keyCode === 38) {
      const currentActive = $(".ant-spin-container div.search-item-hover");
      if (currentActive.prev().hasClass("ant-list-item")) {
        const allRow = $("div.ant-spin-container div.ant-list-item");
        
        allRow.removeClass("search-item-hover");
        currentActive.prev().addClass("search-item-hover");

        if (this.scrollTop > 0) {
          this.scrollTop = this.scrollTop - 60;
          $(".wrap-dropdown-search-product .list-search").scrollTop(this.scrollTop);
        }
      }

    } else if (event.keyCode === 40) {
      const currentActive = $(".ant-spin-container div.search-item-hover");
      if (currentActive.next().hasClass("ant-list-item")) { // protect offset elemet of row
        const allRow = $("div.ant-spin-container div.ant-list-item");

        allRow.removeClass("search-item-hover");
        currentActive.next().addClass("search-item-hover");

        this.scrollTop = this.scrollTop + 60;
        $(".wrap-dropdown-search-product .list-search").scrollTop(this.scrollTop);
      }
    } else {

      clearTimeout(this.timer);
    
      this.timer = setTimeout(function() {
        const searchKey = JSON.stringify({column: ["name"], value});

        this.props.dispatch(ProductAction.search(100, 0, "", "", this.props.filter, searchKey));

        this.setState({visibleDropDown: true});

      }.bind(this), 200);

    }
  }

  handleRemoveTextSearch() {
    this.props.form.setFieldsValue({searchProduct: ""});
  }

  renderSearchItem(product) {
    const {productDescriptions} = product;
    const barcode = product.barcode;
    return (
      <this.List.Item.Meta
        avatar={<span className="icon-items"></span>}
        title={
          <this.Row>
            <this.Col md="4">
              {productDescriptions.length > 0 ? productDescriptions[0].name : ""}
            </this.Col>
          </this.Row>
        }
        description={
          <this.Row className="wrap-description">
            <this.Col md="4" className="text-uppercase">
              <this.Translate id="text_product_code"/>: {barcode}
            </this.Col>
            <this.Col md="4">
              <div className="center-description">
                <div className="product-stock">{<this.Translate id="text_product_in_stock"/>}</div>
                <div className="product-stock-status">
                  <div className="current-stock">
                    <div className="title">{<this.Translate id="text_current"/>}</div>
                    <div className="quantity">{product.quantity}</div>
                  </div>
                  <div className="other-stock">
                    <div className="title">{<this.Translate id="text_other"/>}</div>
                    <div className="quantity">20</div>
                  </div>
                </div>
              </div>
            </this.Col>
            <this.Col md="4" className="right-description">
              {
                product.productVariantToProduct.length > 0 ?
                  <div className="variant">{product.productVariantToProduct.length} {<this.Translate id="text_variant"/>}{product.productVariantToProduct.length > 1 ? <this.Translate id="text_plural"/> : ""}</div>
                  :
                  <div className="price">{this.Util.formatCurrency(product.price)}</div>
              }
            </this.Col>
          </this.Row>
        }/>
    );
  }

  render() {
    return (
      <this.Col md="12" className="search-dropdown-product search-height" style={{position: "relative"}}>
        <div className="main-searchs">
          <div className="search-icon icon-add-product"></div>
          <this.InputText
            name="searchProduct"
            placeholder={this.CATranslate("input_product_search_product", this.props.locale)}
            className={this.props.className}
            validateStatus={this.props.productSearch.fetching ? "validating" : ""}
            handleKeyUp={this.handleKeyDownOnProductSearch}
            handlePressEnter={this.handlePressEnterOnSearch}
            handleOnBlur={this.handleOnBlurSearch}
            handleOnFocus={this.handleOnFocusSearch}
            form={this.props.form}/>
          <div className="remove-search-icon icon-clear" onClick={this.handleRemoveTextSearch}></div>
        </div>
        <this.Col md="4" className="hidden">
          <this.Button type="info" className="btn-add-product-compsite">
            <span className="icon-add"></span>
          </this.Button>
          <this.InputNumber
            name="isFocusOnSearchCompositeProduct"
            data={0}
            form={this.props.form}/>
        </this.Col>
        {
          this.state.visibleDropDown && this.props.productSearch.fetched?
            <div className="wrap-dropdown-search-product">
          
              <this.List
                itemLayout="horizontal"
                locale={{emptyText: <this.Translate id="placeholder_product_list_search" />}}
                dataSource={this.props.productSearch.list}
                className="list-search"
                onMouseEnter={this.handleOnMouseHoverOnSearchList}
                onMouseLeave={this.handleOnMouseLeaveOnSearchList}
                renderItem={product => (
                  <this.List.Item onClick={() => this.handleOnSelectList(product)} className="record-item-search" classID={product.id}>
                    {this.renderSearchItem(product)}
                  </this.List.Item>
                )}
              />
            </div>
            :
            ""
        }
      </this.Col>
    );
  }
}

DropDownSearch.defaultProps = {
  filter: ""
};
