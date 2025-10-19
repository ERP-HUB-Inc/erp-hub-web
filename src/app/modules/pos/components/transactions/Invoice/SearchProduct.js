import React from "react";
import BarcodeReader from "react-barcode-reader";
import {List, Alert} from "antd";
import { Translate } from "react-localize-redux";
import $ from "jquery";
import { 
  InputText,
  Image 
} from "../../../../common/elements/ant-ui";
import Util from "../../../../common/util";
import ProductUtil from "../../../../inventory/utils/index";
import ProductService from "../../../../inventory/services/products/ProductService";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import "./SearchProduct.css"

export default function SearchProductDropdown(props) {
  const [visibleDropDown, setVisibleDropdown] = React.useState(false);
  const [isMouseHoverOnSearchList, setIsMouseHoverOnSearchList] = React.useState(false);
  const [isSetFocusSearchInput, setIsSetFocusSearchInput] = React.useState(false);
  const [isFocusOnSearchInput, setIsFocusOnSearchInput] = React.useState(false);
  const [productSearch, setProductSearch] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const util = new Util();
  let timer = null;

  const handleOnBlurSearch = () => {
    if (!isMouseHoverOnSearchList) {
      setVisibleDropdown(false);
    }

    setIsSetFocusSearchInput(false);
    setIsFocusOnSearchInput(false);

    if (props.handleOnBlur) {
      props.handleOnBlur();
    }
  };

  const handleOnFocusSearch = () => {
    setVisibleDropdown(true);
    setIsFocusOnSearchInput(true);

    if (props.handleOnFocusSearch) {
      props.handleOnFocusSearch();
    }
  };

  const handleScanError = (value) => {};

  const handleScan = (value) => {
    if (props.handleScan) {
      props.handleScan(value);
    } else {
      props.form.setFieldsValue({ searchProduct: value });
      handleSearchProduct(value, true);
    }
  };

  const handleSearchProduct = (value, isSearchingBarcode = false) => {
    const searchKey = JSON.stringify({ column: ["name", "namekm", "barcode"], value });

    setIsFetching(true);

    ProductService.searchForDrowDown(50, 0, "", "", props.filter, searchKey, props.searchFor, isSearchingBarcode)
    .then(response => {
      setProductSearch(response.data.data);
    })
    .finally(() => setIsFetching(false));
  };

  const handleOnMouseHoverOnSearchList = () => {
    setIsMouseHoverOnSearchList(true);
  };

  const handleOnMouseLeaveOnSearchList = () => {
    setIsMouseHoverOnSearchList(false);
  };

  const handleKeyDownOnProductSearch = (event) => {
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
      if (currentActive.next().hasClass("ant-list-item")) { // protect offset element of row
        const allRow = $("div.ant-spin-container div.ant-list-item");

        allRow.removeClass("search-item-hover");
        currentActive.next().addClass("search-item-hover");

        this.scrollTop = this.scrollTop + 60;
        $(".wrap-dropdown-search-product .list-search").scrollTop(this.scrollTop);
      }
    } else {
      if (value.length > 1) {
        clearTimeout(timer);
        timer = setTimeout(function() {
          handleSearchProduct(value);
          setVisibleDropdown(true);
        }, 1000);
      }
    }
  };

  const handleOnSelectList = (value) => {
    props.handleOnSelectList(value, value.productVariants);
    setVisibleDropdown(false);
  };

  const handleRemoveTextSearch = () => {
    props.form.setFieldsValue({searchProduct: ""});
    setIsSetFocusSearchInput(true);
  };

  const renderSearchItem = (product) => {
    const barcode = ProductUtil.getItemBarcode(product);
    return <List.Item.Meta
        avatar={
          <Image url={util.getProductImage(product.image).url}/>
        }
        title={ProductUtil.getProductNameV2(product)}
        description={
          <div>
            {
              barcode ?
                <div className="wrap-description">
                  {barcode}
                </div>
                :
                ""
            }
          </div>
        }
        
      />;
  };

  return <div className="search-dropdown-product search-height" style={{position: "relative", ...props.style}}>
    <BarcodeReader
      minLength={4}
      onError={handleScanError}
      onScan={handleScan}
      preventDefault={true}
      avgTimeByChar={40}
      endChar={[13]}
      timeBeforeScanTest={200}
    />
    <div className={`${props.showIcon ? "main-searchs" : ""}`}>
      {props.showIcon ? <div className="search-icon icon-add-product"></div> : null}
      <InputText
        wrapperCol={{xs: {span: 24}, sm: {span: 24}}}
        name={props.name ? props.name : "searchProduct"}
        placeholder={`${props.placeholder ? props.placeholder : stringTranslate("text_search_product_by_name_bc", props.locale)}`}
        className={`${props.showIcon ? "ca-input-v1-icon-left" : ""} ${props.className}`}
        isAutoFocus={props.isAutoFocus}
        disabled={props.disabled}
        didUpdateMakeAutoFocus={props.didUpdateMakeAutoFocus || isSetFocusSearchInput}
        handleKeyUp={handleKeyDownOnProductSearch}
        // handlePressEnter={this.handlePressEnterOnSearch}
        handleOnBlur={handleOnBlurSearch}
        handleOnFocus={handleOnFocusSearch}
        onChange={props.onChange}
        autoComplete="off"
        style={{width: "100%"}}
        form={props.form}
      />
      {
        props.isShowBarcodeScannerIcon ?
          <div style={{ display: isFocusOnSearchInput ? "flex" : "none" }}>
            <div className="icon-scaner icon-clear" onClick={handleRemoveTextSearch} style={{ right: 30 }}></div>
            <div className="text-warning-before-scan" style={{ display: "none" }}>
              <Alert
                message={<Translate id="text_warning" />}
                description={<Translate id="text_warning_before_scan" />}
                type="warning"
                showIcon
              />
            </div>
          </div>
          :
          ""
      }
      {props.showIcon ? <div className="remove-search-icon icon-clear" onClick={handleRemoveTextSearch}></div> : null }
    </div>
    {
      visibleDropDown ?
        <div className="wrap-dropdown-search-product">
          <List
            itemLayout="horizontal"
            locale={{emptyText: <Translate id="placeholder_product_list_search" />}}
            dataSource={productSearch}
            className="list-search"
            loading={isFetching}
            onMouseEnter={handleOnMouseHoverOnSearchList}
            onMouseLeave={handleOnMouseLeaveOnSearchList}
            renderItem={product => (
              <List.Item onClick={() => handleOnSelectList(product)} className="record-item-search" classID={product.id}>
                {renderSearchItem(product)}
              </List.Item>
            )}
          />
        </div>
        :
        ""
    }
  </div>;
}

SearchProductDropdown.defaultProps = {
  showIcon: true
};