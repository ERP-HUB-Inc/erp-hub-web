import React from "react";
import ProductsAction from "../../../actions/products/product"; 
import Modal from "../../../../common/components/shares/Modal";
import "./index.css";

export default class ReceivedPo extends Modal {
  constructor(props){
    super(props);
    this.state = {};
    this.state = {
      productLists: [],
      isNotYetLoadComponentDidUpdated: true
    };
    this.form = this.props.form;
    this.columns = [
      {
        title: <this.Translate id="col_stock_purchase_order_no" />,
        dataIndex: "id",
        key: "purchaseID",
        render: (text,record,index) => 
        {
          return(
            <div>
              { index + 1 }
              <this.InputText name={`receiveId[${index}]`} type="hidden" data={record.id} form={ this.form } />
              <this.InputText name={`productId[${index}]`} type="hidden" data={record.productId} form={ this.form } />
              <this.InputNumber name={`statusId[${index}]`} className="hidden" data={record.status} form={ this.form } />
              <this.InputNumber name={`totalAmount[${index}]`} className="hidden" data={record.totalPrice} form={ this.form } />
            </div>
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_name" />,
        dataIndex: "name",
        width: "418px",
        key: "name",
        render: (text,record,index) => 
        {
          return(
            record.productName
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_qty" />,
        dataIndex: "requestQuantity",
        width: "200px",
        key: "requestQuantity",
        render: (text,record,index) => 
        {
          return(
            <div>
              {record.quantity}
              <this.InputNumber name={`qty[${index}]`} className="hidden" data={record.quantity} required={true} min={1} max={100} form={ this.form } />
            </div>
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_receive_qty" />,
        dataIndex: "receiveQuantity",
        width: "200px",
        key: "receiveQuantity",
        render: (text,record,index) => 
        {
          return(
            <div>
              { record.receiveQuantity }
              <this.InputNumber name={`receiveQty[${index}]`} className="hidden" data={record.receiveQuantity} required={true} min={1} max={100} form={ this.form } />
            </div>
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_return_qty" />,
        dataIndex: "returnQty",
        width: "200px",
        key: "returnQty",
        render: (text,record,index) => 
        {
          return(
            <this.InputText 
              name={`returnQty[${index}]`} 
              data={record.returnQuantity} 
              required={true} 
              min={1} 
              max={100} 
              form={ this.form } 
              handleKeyUp={(e) => this.handleOnChangeQuantity(e, index)}
            />
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_price" />,  
        dataIndex: "price",
        width: "200px",
        key: "price",
        render: (text,record,index) => 
        {
          return(
            <div>
              {record.price}
              <this.InputNumber name={`receivePrice[${index}]`} className="hidden" data={record.price} required={true} min={1} max={100} form={ this.form } />
            </div>
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_total" />,
        dataIndex: "composite_product_action",
        key: "key5",
        render: (text,record,index) => {
          return(
            this.formatCurrency(record.totalPrice) 
          );
        }
      }
    ];


  }


  componentDidUpdate(){
    const {returnPurchaseDetail} = this.props;

    if(returnPurchaseDetail == null){
      return;
    }

    if (returnPurchaseDetail.length  > 0 && this.state.isNotYetLoadComponentDidUpdated) {

      const existingProductList = this.state.productLists;
      
      returnPurchaseDetail.forEach(purchaseOrderEntry => {
        let productName = "";
        if (purchaseOrderEntry.product) {
          if (purchaseOrderEntry.product.productDescriptions.length > 0) {
            productName = purchaseOrderEntry.product.productDescriptions[0].name;
          }
        }

        existingProductList.push({
          id: purchaseOrderEntry.id,
          productName,
          productId: purchaseOrderEntry.productId,
          quantity: purchaseOrderEntry.requestQuantity, 
          receiveQuantity: purchaseOrderEntry.receiveQuantity,
          returnQuantity: purchaseOrderEntry.returnQuantity,
          price: purchaseOrderEntry.price,
          totalPrice: purchaseOrderEntry.requestQuantity * purchaseOrderEntry.price,
          status: purchaseOrderEntry.status
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
    const quantity = this.props.form.getFieldValue(`returnQty[${index}]`);
    const price = this.props.form.getFieldValue(`receivePrice[${index}]`);
    return quantity * price;
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

  grandTotal(productList) {
    let grandTotal = 0;
    productList.forEach((product, index) => {
      if (product.status === this.Enum.ACTIVE) {
        grandTotal += (product.quantity * product.price);
      }
    });

    this.props.form.setFieldsValue({requestTotal: this.formatCurrency(grandTotal)});
    this.props.form.setFieldsValue({requestTotalValue: `${grandTotal}`});
  }

  productList(){
    return(
      this.props.dataSource
    );
  }


  componentDidMount(){
    ProductsAction.fetch(10);
  }


  render(){
    const { productLists } = this.state; 

    return(
      <div className="main-dropdown-search">
        <this.Table
          rowKey="returnpoId"
          rowClassName={record => record.status !== this.Enum.ACTIVE ? "hidden" : ""}
          dataSource={productLists}
          columns={this.columns}
          locale={{emptyText: <this.Translate id="placeholder_table_purchase_order" />}}
          footer={() => <div className={` ${productLists.length > 0 ? "" : "hidden"}`}>
            <div className="total-purchase-right"><this.Translate id="purchase_order_footer" />: </div>
            <div className="">
              <this.InputText name="requestTotal" disabled={true} className="grandTotal" form={this.props.form}/>
              <this.InputText name="requestTotalValue" className="hidden" form={this.props.form}/>
            </div>
            <div className="" style={{width: 150}}></div>
            <div style={{clear: "both"}}></div>
          </div>}
        /> 
      </div>
    );
  }   
       
}