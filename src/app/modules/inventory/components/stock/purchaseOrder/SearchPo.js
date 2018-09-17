import React from "react";
import DropDownSearch from "../../../components/products/Product/DropDownSearch";
import ProductsAction from "../../../actions/products/product"; 
import Modal from "../../../../common/components/shares/Modal";

export default class SearchPo extends Modal {
  constructor(props){
    super(props);
    this.state = {};
    this.state = {
      productLists: [],
      total:[],
      totalAmount:[],
      calculateTotalAmount:[],
      isNotYetLoadComponentDidUpdated: true
    };
    this.form = this.props.form;
    this.columns = [
      {
        title: <this.Translate id="col_stock_purchase_order_no" />,
        dataIndex: "id",
        key: "no",
        width: 50,
        align: "center",
        render: (text, record, index) => {
          return (
            <div>
              { index + 1 }
              <this.InputText name={`id[${index}]`} type="hidden" data={record.id} form={ this.form } />
              <this.InputText name={`productId[${index}]`} type="hidden" data={record.productId} form={ this.form } />
              <this.InputNumber name={`purchaseEntryStatus[${index}]`} className="hidden" data={record.status} form={ this.form } />
              <this.InputNumber name={`totalAmount[${index}]`} className="hidden" data={record.totalPrice} form={ this.form } />
            </div>
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_name" />,
        dataIndex: "name",
        key: "name",
        render: (text,record,index) => 
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
        title: <this.Translate id="col_stock_purchase_order_qty" />,
        dataIndex: "requestQuantity",
        width: 150,
        key: "requestQuantity",
        align: "right",
        render: (text, record, index) => {
          return <this.InputText
            name={`purchaseQty[${index}]`}
            data={`${record.quantity}`}
            required={true}
            min={1}
            max={100}
            handleKeyUp={(e) => this.handleOnChangeQuantity(e, index)}
            form={this.form}
          />;
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_price" />,  
        dataIndex: "price",
        width: 150,
        key: "price",
        align: "right",
        render: (text, record, index) => {
          return <this.InputText
            name={`purchasePrice[${index}]`}
            data={`${record.price}`}
            required={true}
            min={1}
            max={100}
            handleKeyUp={(e) => this.handleOnChangePrice(e, index)}
            form={this.form} />;
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_total" />,
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 150,
        align: "right",
        render: (text, record, index) => {
          return <div>
            <this.InputText
              name={`totalPrice[${index}]`}
              className="totalPrice"
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
              onClick={() => this.removeRecord(record,index)}>
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
    if (record.id === "") {
      existingProductList.splice(index, 1);
    } else {
      existingProductList.forEach((product, productIndex) => {
        if (product.id === record.id) {
          existingProductList[productIndex]["status"] = this.Enum.ARCHIVE;
        }
      });
    }

    this.setState({
      productLists: existingProductList
    });   

  }

  productList(){
    return(
      this.props.dataSource
    );
  }

  componentDidUpdate(){
    const {purchaseOrderEntries} = this.props;

    if (purchaseOrderEntries.length > 0 && this.state.isNotYetLoadComponentDidUpdated) {

      const existingProductList = this.state.productLists;
      const totalAmountProductList =  [];
      
      purchaseOrderEntries.forEach(purchaseOrderEntry => {
        existingProductList.push({
          id: purchaseOrderEntry.id,
          productName: purchaseOrderEntry.product.productDescriptions.name,
          productId: purchaseOrderEntry.productId,
          quantity: purchaseOrderEntry.requestQuantity, 
          price: purchaseOrderEntry.price,
          totalPrice: purchaseOrderEntry.requestQuantity * purchaseOrderEntry.price,
          status: purchaseOrderEntry.status
        }); 
        const TotalValue = purchaseOrderEntry.requestQuantity * purchaseOrderEntry.price;

        totalAmountProductList.push({
          totalPrice: TotalValue
        }); 
        
      }); 
      
      this.setState({
        productLists: existingProductList,
        calculateTotalAmount: totalAmountProductList,
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
      grandTotal += (product.quantity * product.price);
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
    const productName = value.productDescriptions.length > 0 ?  value.productDescriptions[0].name : "";
    const productId = value.productDescriptions.length > 0 ?  value.productDescriptions[0].productId : "";

    const {productCode, quantity, price, cost} = value;
    const existingProductList = this.state.productLists;
    const initialQuantity = 1;

    if (existingProductList.length === 0) {
      existingProductList.push({
        id: "",
        productName,
        quantityOnHand: quantity,
        price,
        productCode,
        productCompositeProductId: value.id,
        productId,
        totalPrice: initialQuantity * price,
        quantity: initialQuantity,
        cost,
        status: this.Enum.ACTIVE
      });
    } else {
      let isNotTheSameProduct = true;
      existingProductList.forEach((product, index) => {
        if (product.productCompositeProductId === value.id ) {
          isNotTheSameProduct = false;
          existingProductList[index]["quantity"] += 1;
          existingProductList[index]["totalPrice"] = existingProductList[index]["quantity"] * price;
        }
      });

      if (isNotTheSameProduct) {
        existingProductList.push({
          id:"",
          productName,
          quantityOnHand: quantity,
          price,
          productCode,
          productCompositeProductId: value.id,
          productId,
          totalPrice: initialQuantity * price,
          quantity: initialQuantity,
          cost,
          status: this.Enum.ACTIVE
        });
      }
    }

    this.setState({productLists: existingProductList});

    this.grandTotal(existingProductList);
  }

  render(){
    const {productLists, calculateTotalAmount} = this.state; 

    let Calvalue = calculateTotalAmount.forEach((value, index) => {
      return value.totalPrice;
    });

    return(
      <div className="main-dropdown-search">
        <DropDownSearch
          productSearch={ this.props.dataSource }
          handleOnSelectList={this.handleOnSelectList}
          dispatch={this.props.dispatch}
          locale={this.props.locale}
          form={this.props.form}/>  
        <this.Table
          rowKey="productId"
          rowClassName={record => record.status !== this.Enum.ACTIVE ? "hidden" : ""}
          dataSource={productLists}
          columns={this.columns}
          locale={{emptyText: <this.Translate id="placeholder_table_purchase_order" />}}
          footer={() => <div className={`float-right ${productLists.length > 0 ? "" : "hidden"}`}>
            <div className="total-title text-uppercase pull-left"><this.Translate id="purchase_order_footer" />: </div>
            <div className="total-value pull-left">
              <this.InputText name="requestTotal" disabled={true} className="grandTotal" form={this.props.form}/>
              <this.InputText name="requestTotalValue" className="hidden" form={this.props.form}/>
            </div>
            <div className="pull-left" style={{width: 150}}></div>
            <div style={{clear: "both"}}></div>
          </div>}/> 
      </div>
    );
  }   
       
}