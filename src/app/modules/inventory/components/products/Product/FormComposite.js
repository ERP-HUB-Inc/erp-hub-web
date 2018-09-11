import React from "react";
import DropDownSearch from "./DropDownSearch";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";

export default class FormComposite extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      isNotYetLoadComponentDidUpdated: true,
      compositeList: [],
    };
    this.columns = [
      {
        title: <this.Translate id="col_composite_product" />,
        dataIndex: "name",
        key: "product_composite",
        render: (text, record, index) => {
          return <div>
            <this.InputText name={`productCompositeId[${index}]`} type="hidden" form={this.props.form} data={record.id}/>
            <this.InputText name={`productCompositeProductId[${index}]`} type="hidden" form={this.props.form} data={record.productCompositeProductId}/>
            <this.InputNumber name={`productCompositeStatus[${index}]`} className="hidden" form={this.props.form} data={record.status}/>
            <div className="composite-product-name">{record.productName}</div>
            <div className="composite-product-code">{record.productCode}</div>
          </div>;
        },
      },
      {
        title: <span><this.Translate id="col_composite_product_markup" />(%)</span>,
        dataIndex: "markup",
        key: "composite_product_markup",
        width: 100,
        render: (text, record, index) => <this.InputNumber name={`productCompositeMarkUp[${index}]`} form={this.props.form} isUnsign={true} data={record.markup}/>
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

    this.handleOnSelectList = this.handleOnSelectList.bind(this);
    this.handlePressEnterOnSearch = this.handlePressEnterOnSearch.bind(this);
    this.handleRemoveCompositeProduct = this.handleRemoveCompositeProduct.bind(this);
  }


  componentDidUpdate() {
    const {productPackageToProduct} = this.props;
    console.log("productPackageToProduct",productPackageToProduct);
    if (productPackageToProduct.length > 0 && this.state.isNotYetLoadComponentDidUpdated) {
      const existingCompositeList = this.state.compositeList;

      productPackageToProduct.forEach(productPackage => {
        if (productPackage.status === this.Enum.ACTIVE) {
          existingCompositeList.push({
            id: productPackage.id,
            productName: productPackage.rawProductToProductPackage.productDescriptions.length > 0 ? productPackage.rawProductToProductPackage.productDescriptions[0].name : "",
            productCode: productPackage.rawProductToProductPackage.barcode,
            productCompositeProductId: productPackage.rawProductId,
            markup: productPackage.quantity,
            cost: productPackage.rawProductToProductPackage.cost,
            status: productPackage.status
          });
        }
      });

      this.setState({
        compositeList: existingCompositeList,
        isNotYetLoadComponentDidUpdated: false
      });
    }
  }

  

  handleRemoveCompositeProduct(record, index) {
    let existingCompositeList = this.state.compositeList;
    if (record.id === "") {
      existingCompositeList.splice(index, 1);
    } else {
      existingCompositeList.forEach((composite, compositeIndex) => {
        if (composite.id === record.id) {
          existingCompositeList[compositeIndex]["status"] = this.Enum.ARCHIVE;
        }
      });
    }

    this.setState({
      compositeList: existingCompositeList
    });
  }

  handleOnSelectList(value) {
    const productName = value.productDescriptions.length > 0 ?  value.productDescriptions[0].name : "";
    const {productCode, cost} = value;

    const existingCompositeList = this.state.compositeList;

    if (existingCompositeList.length === 0) {
      existingCompositeList.push({
        id: "",
        productName,
        productCode,
        productCompositeProductId: value.id,
        markup: 1,
        cost,
        status: this.Enum.ACTIVE
      });
    } else {
      let isNotTheSameCompsite = true;
      existingCompositeList.forEach((compsoite, compsoiteIndex) => {
        if (compsoite.productCompositeProductId === value.id ) {
          isNotTheSameCompsite = false;
          existingCompositeList[compsoiteIndex]["markup"] += 1;
        }
      });

      if (isNotTheSameCompsite) {
        existingCompositeList.push({
          id: "",
          productName,
          productCode,
          productCompositeProductId: value.id,
          markup: 1,
          cost,
          status: this.Enum.ACTIVE
        });
      }
    }

    this.setState({compositeList: existingCompositeList});
    
  }

  handlePressEnterOnSearch(product) {
    this.handleOnSelectList(product);
  }
  
  render() {
    return (
      <this.Row>
        <DropDownSearch
          productSearch={this.props.productSearch}
          handleOnSelectList={this.handleOnSelectList}
          handlePressEnterOnSearch={this.handlePressEnterOnSearch}
          filter={JSON.stringify({type: [Enum.TYPE_OF_PRODUCT.RAW_MATERIAL]})}
          dispatch={this.props.dispatch}
          locale={this.props.locale}
          form={this.props.form}/>
        <this.Col md="12">
          <this.Table
            rowClassName={record => record.status !== this.Enum.ACTIVE ? "hidden" : ""}
            rowKey="productCompositeProductId"
            dataSource={this.state.compositeList}
            columns={this.columns}
            locale={{emptyText: <this.Translate id="placeholder_table_composite_product" />}} />
        </this.Col>
      </this.Row>
    );
  }
}