import React from "react";
import Util from "../../../utils";
import DropDownSearch from "../../../components/products/Product/DropDownSearch";
import Modal from "../../../../common/components/shares/Modal";
import "./index.css";

export default class SearchPo extends Modal {
  constructor(props){
    super(props);
    this.state = {
      productLists: [],
      isNotYetLoadComponentDidUpdated: true
    };
    this.form = this.props.form;
    this.columns = [
      {
        title: <this.Translate id="text_no" />,
        dataIndex: "id",
        key: "no",
        width: 50,
        align: "center",
        render: (text, record, index) => {
          return (
            <div>
              { index + 1 }
              <this.InputText name={`purchaseEntryId[${index}]`} type="hidden" data={record.purchaseEntryId} form={this.form} />
              <this.InputText name={`productId[${index}]`} type="hidden" data={record.productId} form={this.form} />
              <this.InputText name={`productName[${index}]`} type="hidden" data={record.productName} form={this.form} />
              <this.InputNumber name={`purchaseEntryStatus[${index}]`} className="hidden" data={record.purchaseEntryStatus} form={this.form} />
              <this.InputNumber name={`totalAmount[${index}]`} className="hidden" data={record.totalPrice} form={this.form} />
            </div>
          );
        }
      },
      {
        title: <this.Translate id="text_product_name" />,
        dataIndex: "name",
        key: "name",
        render: (text, record, index) => 
        {
          return(
            record.productName
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_on_hand" />,
        dataIndex: "quantityOnHand",
        width: 150,
        align: "center",
        key: "quantityOnHand"
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "requestQuantity",
        width: 150,
        key: "requestQuantity",
        align: "right",
        render: (text, record, index) => {
          return <this.InputNumber
            name={`purchaseQty[${index}]`}
            data={`${record.quantity}`}
            className="text-right"
            isAutoSelect={true}
            isHideTool={true}
            precision={0}
            handleKeyUp={(e) => this.handleOnChangeQuantity(e, index)}
            form={this.form}
          />;
        }
      },
      {
        title: <this.Translate id="text_price" />,  
        dataIndex: "price",
        width: 150,
        key: "price",
        align: "right",
        render: (text, record, index) => {
          return <this.InputNumber
            name={`purchasePrice[${index}]`}
            data={`${record.price}`}
            className="text-right"
            isAutoSelect={true}
            isHideTool={true}
            handleKeyUp={(e) => this.handleOnChangePrice(e, index)}
            form={this.form} />;
        }
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 150,
        align: "right",
        render: (text, record, index) => {
          return <div>
            <this.InputText
              name={`totalPrice[${index}]`}
              className="totalPrice text-right"
              data={this.formatCurrency(record.totalPrice)}
              disabled={true}
              form={this.form} />
            <this.InputText name={`totalPriceValue[${index}]`} data={`${record.totalPrice}`} className="hidden"form={this.form} />
          </div>;
        }
      },
      {
        title: "Action",
        key: "action",
        width: 150,
        align: "right",
        render: (text, record, index) => {
          return (
            <this.Button
              type="danger"
              className="btn-icon"
              onClick={() => this.removeRecord(record, index)}>
              <span className="icon-delete icon-padding-right"></span>
            </this.Button>
          );
        }
      }
    ];

    this.removeRecord = this.removeRecord.bind(this);
    this.handleOnSelectList = this.handleOnSelectList.bind(this);
    this.handleOnChangeQuantity = this.handleOnChangeQuantity.bind(this);
    this.handleOnChangePrice = this.handleOnChangePrice.bind(this);
    this.calculateTotalAmountEachRow = this.calculateTotalAmountEachRow.bind(this);
    this.grandTotal = this.grandTotal.bind(this);
  }

  removeRecord(record, index){
    let existingProductList = this.state.productLists;
    if (record.purchaseEntryId === "") {
      existingProductList.splice(index, 1);
    } else {
      existingProductList[index]["purchaseEntryStatus"] = this.Enum.ARCHIVE;
    }

    this.setState({
      productLists: existingProductList
    });
    
    this.grandTotal(existingProductList);
  }

  componentDidUpdate(){
    const {purchaseOrderEntries} = this.props;
    if (purchaseOrderEntries.length > 0 && this.state.isNotYetLoadComponentDidUpdated) {
      const existingProductList = this.state.productLists;
      
      purchaseOrderEntries.forEach(purchaseOrderEntry => {
        let productName = "";
        let quantityOnHand = 0;
        if (purchaseOrderEntry.product) {
          productName = Util.getProductName(purchaseOrderEntry.product);
          quantityOnHand = purchaseOrderEntry.product.quantity;
        }
        existingProductList.push({
          purchaseEntryId: purchaseOrderEntry.id,
          productName,
          productId: purchaseOrderEntry.productId,
          quantityOnHand,
          quantity: purchaseOrderEntry.requestQuantity, 
          price: purchaseOrderEntry.price,
          totalPrice: purchaseOrderEntry.requestQuantity * purchaseOrderEntry.price,
          purchaseEntryStatus: purchaseOrderEntry.status
        }); 
      }); 
      
      this.setState({
        productLists: existingProductList,
        isNotYetLoadComponentDidUpdated: false
      });

      this.grandTotal(existingProductList);
    }
  }

  calculateTotalAmountEachRow(e, index) {
    const quantity = this.props.form.getFieldValue(`purchaseQty[${index}]`);
    const price = this.props.form.getFieldValue(`purchasePrice[${index}]`);
    return quantity * price;
  }

  grandTotal(productList) {
    let grandTotal = 0;
    productList.forEach((product, index) => {
      if (product.purchaseEntryStatus === this.Enum.ACTIVE) {
        grandTotal += (product.quantity * product.price);
      }
    });
    this.props.form.setFieldsValue({requestTotal: this.formatCurrency(grandTotal)});
    this.props.form.setFieldsValue({requestTotalValue: `${grandTotal}`});
  }

  handleOnChangeQuantity(e, index) {
    const existingProductList = this.state.productLists;
    existingProductList.forEach((product, productIndex) => {
      if (productIndex === index) {
        existingProductList[productIndex]["quantity"] = e.target.value;
      }
    });
    this.props.form.setFieldsValue({[`totalPrice[${index}]`]: this.formatCurrency(this.calculateTotalAmountEachRow(e, index))});

    this.setState({productLists: existingProductList});
    this.grandTotal(existingProductList);
  }

  handleOnChangePrice(e, index) {
    const existingProductList = this.state.productLists;
    existingProductList.forEach((product, productIndex) => {
      if (productIndex === index) {
        existingProductList[productIndex]["price"] = e.target.value;
      }
    });
    this.props.form.setFieldsValue({[`totalPrice[${index}]`]: this.formatCurrency(this.calculateTotalAmountEachRow(e, index))});

    this.setState({productLists: existingProductList});
    this.grandTotal(existingProductList);
  }

  handleOnSelectList(value) {
    const productName = Util.getProductName(value);;

    const {quantity, price} = value;
    const existingProductList = this.state.productLists;
    const initialQuantity = 1;

    if (existingProductList.length === 0) {
      existingProductList.push({
        purchaseEntryId: "",
        productName,
        quantityOnHand: quantity,
        quantity: initialQuantity,
        price,
        productId: value.id,
        totalPrice: initialQuantity * price,
        purchaseEntryStatus: this.Enum.ACTIVE
      });
    } else {
      let isNotTheSameProduct = true;
      existingProductList.forEach((product, index) => {
        if (product.productId === value.id) {
          isNotTheSameProduct = false;
          existingProductList[index]["quantity"] += 1;
          existingProductList[index]["totalPrice"] = existingProductList[index]["quantity"] * price;
        }
      });

      if (isNotTheSameProduct) {
        existingProductList.push({
          purchaseEntryId: "",
          productName,
          quantityOnHand: quantity,
          price,
          productId: value.id,
          quantity: initialQuantity,
          totalPrice: initialQuantity * price,
          purchaseEntryStatus: this.Enum.ACTIVE
        });
      }
    }

    this.setState({productLists: existingProductList});

    this.grandTotal(existingProductList);
  }

  render(){
    const {productLists} = this.state; 
    return(
      <div className="main-dropdown-search">
        <DropDownSearch
          productSearch={ this.props.dataSource }
          handleOnSelectList={this.handleOnSelectList}
          dispatch={this.props.dispatch}
          className="ca-input-v1 purchase-order"
          isAutoFocus={true}
          locale={this.props.locale}
          form={this.props.form}/>  
        <this.Table
          rowKey="productId"
          rowClassName={record => record.purchaseEntryStatus === this.Enum.ACTIVE ? "" : "hidden"}
          dataSource={productLists}
          columns={this.columns}
          locale={{emptyText: <this.Translate id="placeholder_table_purchase_order" />}}
          footer={() => <div className={`float-right ${productLists.length > 0 ? "" : "hidden"}`}>
            <div className="total-title text-uppercase pull-left"><this.Translate id="text_total_amount" />: </div>
            <div className="total-value pull-left">
              <this.InputText name="requestTotal" disabled={true} className="ca-input-no-border grandTotal" form={this.props.form}/>
              <this.InputText name="requestTotalValue" className="hidden" form={this.props.form}/>
            </div>
            <div className="pull-left" style={{width: 150}}></div>
            <div style={{clear: "both"}}></div>
          </div>}/> 
      </div>
    );
  }   
       
}