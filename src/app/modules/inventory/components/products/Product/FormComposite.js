import React from "react";
import {List} from "antd";
import $ from "jquery";
import ProductAction from "../../../actions/products/product";
import Modal from "../../../../common/components/shares/Modal";

export default class FormComposite extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      visibleDropDown: false,
      compositeList: []
    };
    this.scrollTop = 0;
    this.columns = [
      {
        title: <this.Translate id="col_composite_product" />,
        dataIndex: "name",
        key: "product_composite",
        render: (text, record, index) => {
          const productName = record.productDescriptions.length > 0 ?  record.productDescriptions[0].name : "";
          const productCode = record.barcode;
          return <div>
            <this.InputText name={`productCompositeId[${index}]`} type="hidden" form={this.props.form} data={record.id}/>
            <div className="composite-product-name">{productName}</div>
            <div className="composite-product-code">{productCode}</div>
          </div>;
        },
      },
      {
        title: <this.Translate id="col_composite_product_markup" />,
        dataIndex: "description",
        key: "composite_product_markup",
        width: 100,
        render: (text, record, index) => <this.InputNumber name={`productCompositeMarkUp[${index}]`} form={this.props.form} data={0}/>
      },
      {
        title: <this.Translate id="col_composite_product_cost" />,
        dataIndex: "cost",
        key: "cost",
        width: 100,
        render: (text, record, index) => this.formatCurrency(record.cost),
      },
      {
        title: <this.Translate id="col_composite_action" />,
        dataIndex: "composite_product_action",
        key: "composite_product_action",
        width: 100,
        render: (text, record, index) => <this.Button type="danger" className="btn-icon" onClick={() => this.handleRemoveCompositeProduct(record, index)}>
          <span className="icon-delete icon-padding-right"></span>
        </this.Button>
      }
    ];

    this.timer = null;

    this.handleKeyDownOnProductSearch = this.handleKeyDownOnProductSearch.bind(this);
    this.handlePressEnterOnSearch = this.handlePressEnterOnSearch.bind(this);
    this.handleOnBlurSearch = this.handleOnBlurSearch.bind(this);
    this.handleOnFocusSearch = this.handleOnFocusSearch.bind(this);
    this.handleOnSelectList = this.handleOnSelectList.bind(this);
    this.handleRemoveCompositeProduct = this.handleRemoveCompositeProduct.bind(this);
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
    alert("Hello World");
  }

  handleOnBlurSearch() {
    console.log("Handle On Blur");
    // this.setState({visibleDropDown: false});
  }


  handleOnFocusSearch() {
    this.setState({visibleDropDown: true});
  }

  handleRemoveCompositeProduct(record, index) {
    let existingCompositeList = this.state.compositeList;
    existingCompositeList.splice(index, 1);

    this.setState({
      compositeList: existingCompositeList
    });
  }

  handleOnSelectList(value) {
    const existingCompositeList = this.state.compositeList;
    const resultExist = existingCompositeList.find(compsoite => compsoite.id === value.id);
    if (resultExist == null) {
      existingCompositeList.push(value);
    }

    this.setState({
      visibleDropDown: false,
      compositeList: existingCompositeList
    });
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
    console.log("Search Product:", this.props.productSearch);
    return (
      <this.Row style={{position: "relative"}}>
        <this.Col md="4">
          <this.InputText
            name="searchProduct"
            label={<this.Translate id="input_product_search_product" />}
            placeholder={this.CATranslate("input_product_search_product", this.props.locale)}
            validateStatus={this.props.productSearch.fetching ? "validating" : ""}
            handleKeyUp={this.handleKeyDownOnProductSearch}
            handlePressEnter={this.handlePressEnterOnSearch}
            handleOnBlur={this.handleOnBlurSearch}
            handleOnFocus={this.handleOnFocusSearch}
            form={this.props.form}/>
        </this.Col>
        <this.Col md="4" className="hidden">
          <this.Button type="info" className="btn-add-product-compsite">
            <span className="icon-add"></span>
          </this.Button>
        </this.Col>
        <this.Col md="8" className="wrap-dropdown-search-product">
          {
            this.props.productSearch.list.length > 0 && this.state.visibleDropDown ?
              <List
                itemLayout="horizontal"
                dataSource={this.props.productSearch.list}
                className="list-search"
                renderItem={product => (
                  <List.Item onClick={() => this.handleOnSelectList(product)}>
                    <List.Item.Meta
                      // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                      title={<a href="https://ant.design">{product.productDescriptions.length > 0 ? product.productDescriptions[0].name : ""}</a>}
                      description="Ant Design, a design language."
                    />
                  </List.Item>
                )}
              />
              :
              ""
          }
        </this.Col>
        <this.Col md="12">
          <this.Table 
            dataSource={this.state.compositeList}
            columns={this.columns}
            locale={{emptyText: <this.Translate id="placeholder_table_composite_product" />}} />
        </this.Col>
      </this.Row>
    );
  }
}