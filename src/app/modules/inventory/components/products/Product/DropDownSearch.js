import React from "react";
import {List} from "antd";
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
  }

  componentDidMount() {
    var element = document.getElementsByClassName("ant-list-item");
    if (element.length > 0) {
      element[0].classList.add("product-item-hover");
    }
  }

  componentDidUpdate() {
    var element = document.getElementsByClassName("ant-list-item");
    if (element.length > 0) {
      element[0].classList.add("product-item-hover");
    }
  }

  handlePressEnterOnSearch() {
    console.log("On Mouse Enter Now");
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
      const currentActive = $(".ant-spin-container div.product-item-hover");
      if (currentActive.prev().hasClass("ant-list-item")) {
        const allRow = $("div.ant-spin-container div.ant-list-item");
        
        allRow.removeClass("product-item-hover");
        currentActive.prev().addClass("product-item-hover");

        if (this.scrollTop > 0) {
          this.scrollTop = this.scrollTop - 60;
          $(".wrap-dropdown-search-product .list-search").scrollTop(this.scrollTop);
        }
      }

    } else if (event.keyCode === 40) {
      const currentActive = $(".ant-spin-container div.product-item-hover");
      if (currentActive.next().hasClass("ant-list-item")) { // protect offset elemet of row
        const allRow = $("div.ant-spin-container div.ant-list-item");

        allRow.removeClass("product-item-hover");
        currentActive.next().addClass("product-item-hover");

        this.scrollTop = this.scrollTop + 60;
        $(".wrap-dropdown-search-product .list-search").scrollTop(this.scrollTop);
      }
    } else {

      clearTimeout(this.timer);
    
      this.timer = setTimeout(function() {
        const searchKey = JSON.stringify({column: ["name"], value});

        this.props.dispatch(ProductAction.search(100, 0, "", "", "", searchKey));

        this.setState({visibleDropDown: true});

      }.bind(this), 500);

    }
  }

  render() {
    return (
      <this.Col md="12" className="search-height" style={{position: "relative"}}>
        <div className="main-searchs">
          <div className="search-icon icon-add-product"></div>
          <this.InputText
            name="searchProduct"
            placeholder={this.CATranslate("input_product_search_product", this.props.locale)}
            validateStatus={this.props.productSearch.fetching ? "validating" : ""}
            handleKeyUp={this.handleKeyDownOnProductSearch}
            handlePressEnter={this.handlePressEnterOnSearch}
            handleOnBlur={this.handleOnBlurSearch}
            handleOnFocus={this.handleOnFocusSearch}
            form={this.props.form}/>
          <div className="remove-search-icon icon-clear" onClick={this.remove}></div>
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

        <div className="wrap-dropdown-search-product">
          {
            this.state.visibleDropDown && this.props.productSearch.fetched?
              <List
                itemLayout="horizontal"
                dataSource={this.props.productSearch.list}
                className="list-search"
                onMouseEnter={this.handleOnMouseHoverOnSearchList}
                onMouseLeave={this.handleOnMouseLeaveOnSearchList}
                renderItem={product => (
                  <List.Item onClick={() => this.handleOnSelectList(product)}>
                    <List.Item.Meta
                      title={product.productDescriptions.length > 0 ? product.productDescriptions[0].name : ""}
                      description={product.productDescriptions.length > 0 ? product.productDescriptions[0].description : ""}
                    />
                  </List.Item>
                )}
              />
              :
              ""
          }
        </div>
      </this.Col>
    );
  }
}