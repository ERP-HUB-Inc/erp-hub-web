import React from "react";
import BarcodeReader from "react-barcode-reader";
import $ from "jquery";
import ProductAction from "../../../actions/products/product";
import Constant from "../../../constants/products/product";
// import Enum from "../../../enums";
import Util from "../../../utils";
import Component from "../../../../common/components/Component";
import "./DropDownSearch.css";

export default class DropDownSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleDropDown: false,
      isScanBarcode: false,
      isMouseHoverOnSearchList: false,
      isFocusOnSearchInput: false,
      isSetFocusSearchInput: false
    };

    this.scrollTop = 0;
    this.timer = null;
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

    if (this.props.callBack && this.props.productSearch.fetched) {
      this.props.callBack(this.props.productSearch.list, this.state.isScanBarcode ? false : true); // productList, isRequestVariantForm

      if (this.state.isScanBarcode) {
        this.setState({ isScanBarcode: false });
        this.props.form.setFieldsValue({ searchProduct: "" });
        document.getElementById("searchProduct").blur();
      }
    }
  }

  handleScan = (searchProduct) => {
    this.setState({ isScanBarcode: true });
    this.props.form.setFieldsValue({ searchProduct });
    this.handleSearchProduct(searchProduct, true);
  }
  handleScanError = (err) => {
    console.error(err);
  }

  handlePressEnterOnSearch =() => {
    const currentActive = $(".ant-spin-container div.search-item-hover");
    const productId = currentActive.attr("classid");
    const product = this.props.productSearch.list.find(value => value.id === productId);
    if (product && this.props.handlePressEnterOnSearch) {
      this.props.handlePressEnterOnSearch(product);
      this.setState({visibleDropDown: false});
    }
  }

  handleOnBlurSearch = () => {
    if (!this.state.isMouseHoverOnSearchList) {
      this.setState({visibleDropDown: false});
      this.props.dispatch(ProductAction.reset(Constant.SEARCH_PRODUCT_RESET));
    }

    this.setState({
      isSetFocusSearchInput: false,
      isFocusOnSearchInput: false
    });

    if (this.props.handleOnBlur) {
      this.props.handleOnBlur();
    }
  }

  handleOnFocusSearch = () => {
    this.setState({
      visibleDropDown: true,
      isFocusOnSearchInput: true
    });

    if (this.props.handleOnFocusSearch) {
      this.props.handleOnFocusSearch();
    }
  }

  handleOnMouseHoverOnSearchList = () => {
    this.setState({isMouseHoverOnSearchList: true});
  }

  handleOnMouseLeaveOnSearchList = () => {
    this.setState({isMouseHoverOnSearchList: false});
  }

  handleOnSelectList = (value) => {
    this.props.handleOnSelectList(value, value.productVariants);
    this.setState({visibleDropDown: false});
    this.props.dispatch(ProductAction.reset(Constant.SEARCH_PRODUCT_RESET));
  }

  handleSearchProduct = (value, isSearchingBarcode = false) => {
    const searchKey = JSON.stringify({ column: ["name", "namekm", "namebm", "barcode"], value });
    this.props.dispatch(ProductAction.search(100, 0, "", "", this.props.filter, searchKey, this.props.searchFor, isSearchingBarcode));
  }

  handleKeyDownOnProductSearch = (event) => {
    const value = event.target.value.trim();
    if (event.keyCode === 13) {
      return;
    }

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
      if (value.length > 1) {
        clearTimeout(this.timer);
        this.timer = setTimeout(function() {
          this.handleSearchProduct(value);
          this.setState({visibleDropDown: true});
        }.bind(this), 500);
      } else {
        this.props.dispatch(ProductAction.reset(Constant.SEARCH_PRODUCT_RESET));
      }
    }
  }

  handleRemoveTextSearch = () => {
    this.props.form.setFieldsValue({searchProduct: ""});
    this.setState({isSetFocusSearchInput: true});
  }

  renderSearchItem = (product) => {
    const barcode = Util.getProductBarcode(product);
    return <this.List.Item.Meta
        avatar={
          <this.Image url={this.Util.getProductImage(product.image).url}/>
        }
        title={Util.getProductNameV2(product)}
        description={
          <div>
            {
              barcode ?
                <div className="wrap-description">
                  <this.Translate id="text_barcode"/>: {barcode}
                </div>
                :
                ""
            }
            {/* {
              product.productOption === Enum.PRODUCT_VARIANT ?
                ""
                :
                <div className="product-stock">
                  <div>
                    <this.Translate id="text_current_stock"/>: {Util.countProductQTYCurrentLocation(product, this.Util.getLocationId())}
                  </div>
                  <div style={{marginLeft: 10}}>
                    <this.Translate id="text_other_location"/>: {Util.countProductQTYOtherLocation(product, this.Util.getLocationId())}
                  </div>
                </div>
            } */}
          </div>
        }
        
      />;
  }

  render() {
    return (
      <this.Col md="12" className="search-dropdown-product search-height" style={{position: "relative"}}>
        <BarcodeReader
          minLength={4}
          onError={this.handleScanError}
          onScan={this.handleScan}
          preventDefault={true}
          avgTimeByChar={40}
          endChar={[13]}
          timeBeforeScanTest={200}
          // onKeyDetect={() => console.log("Hello World")}
        />
        <div className="main-searchs">
          <div className="search-icon icon-add-product"></div>
          <this.InputText
            name="searchProduct"
            placeholder={`${this.props.placeholder ? this.props.placeholder : this.CATranslate("text_search_product", this.props.locale)}`}
            className={`ca-input-v1-icon-left ${this.props.className}`}
            isAutoFocus={this.props.isAutoFocus}
            didUpdateMakeAutoFocus={this.props.didUpdateMakeAutoFocus || this.state.isSetFocusSearchInput}
            validateStatus={this.props.productSearch.fetching ? "validating" : ""}
            handleKeyUp={this.handleKeyDownOnProductSearch}
            // handlePressEnter={this.handlePressEnterOnSearch}
            handleOnBlur={this.handleOnBlurSearch}
            handleOnFocus={this.handleOnFocusSearch}
            autoComplete="off"
            form={this.props.form}
          />
          {
            this.props.isShowBarcodeScannerIcon ?
              <div style={{ display: this.state.isFocusOnSearchInput ? "flex" : "none" }}>
                <div className="icon-scaner icon-clear" onClick={this.handleRemoveTextSearch} style={{ right: 30 }}></div>
                <div className="text-warning-before-scan" style={{ display: "none" }}>
                  <this.Alert
                    message={<this.Translate id="text_warning" />}
                    description={<this.Translate id="text_warning_before_scan" />}
                    type="warning"
                    showIcon
                  />
                </div>
              </div>
              :
              ""
          }
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
          this.state.visibleDropDown && this.props.productSearch.fetched ?
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
  filter: "",
  searchFor: 0,
  isShowBarcodeScannerIcon: false
};
