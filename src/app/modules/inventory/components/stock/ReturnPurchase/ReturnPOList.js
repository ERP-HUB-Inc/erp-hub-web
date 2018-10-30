import React from "react";
import Modal from "../../../../common/components/shares/Modal";
import "./index.css";

export default class ReceivedPO extends Modal {
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
        dataIndex: "no",
        width: 40,
        align: "center",
        key: "no",
        render: (text, record, index) => 
        {
          return(
            <div>
              {index + 1}
              <this.InputText name={`receiveId[${index}]`} type="hidden" data={record.id} form={this.form} />
              <this.InputText name={`productId[${index}]`} type="hidden" data={record.productId} form={this.form} />
              <this.InputNumber name={`statusId[${index}]`} className="hidden" data={record.status} form={this.form} />
              <this.InputNumber name={`totalAmount[${index}]`} className="hidden" data={record.totalPrice} form={this.form} />
              <this.InputNumber name={`receiveQty[${index}]`} className="hidden" data={record.receiveQuantity} form={this.form} />
              <this.InputNumber name={`qty[${index}]`} className="hidden" data={record.quantity} form={this.form} />
              <this.InputNumber name={`receivePrice[${index}]`} className="hidden" data={record.price} form={this.form} />
            </div>
          );
        }
      },
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "productName",
        key: "productName"
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "quantity",
        width: 150,
        align: "center",
        key: "quantity"
      },
      {
        title: <this.Translate id="col_stock_purchase_order_receive_qty" />,
        dataIndex: "receiveQuantity",
        width: 150,
        align: "center",
        key: "receiveQuantity"
      },
      {
        title: <this.Translate id="col_stock_purchase_order_return_qty" />,
        dataIndex: "returnQty",
        width: 150,
        align: "center",
        key: "returnQty",
        render: (text, record, index) => 
        {
          return (
            <this.InputNumber
              name={`returnQty[${index}]`}
              className="text-right"
              data={record.returnQuantity} 
              required={true}
              isHideTool={true}
              isAutoSelect={true}
              precision={0}
              form={ this.form } 
              handleKeyUp={(e) => this.handleOnChangeQuantity(e, index)}
            />
          );
        }
      },
      {
        title: <this.Translate id="text_price" />,  
        dataIndex: "price",
        width: 100,
        align: "right",
        key: "price",
        render: price => this.formatCurrency(price)
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "totalPrice",
        width: 100,
        align: "right",
        key: "totalPrice",
        render: totalPrice => this.formatCurrency(totalPrice)
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
    productList.forEach(product => {
      if (product.status === this.Enum.ACTIVE) {
        grandTotal += (product.quantity * product.price);
      }
    });

    this.props.form.setFieldsValue({requestTotal: this.formatCurrency(grandTotal)});
    this.props.form.setFieldsValue({requestTotalValue: `${grandTotal}`});
  }

  render() {
    return (
      <div className="main-dropdown-search">
        <this.Table
          rowKey="returnpoId"
          rowClassName={record => record.status !== this.Enum.ACTIVE ? "hidden" : ""}
          dataSource={this.state.productLists}
          columns={this.columns}
          locale={{emptyText: <this.Translate id="placeholder_table_purchase_order" />}}
          footer={() => <div className={`pull-right ${this.state.productLists.length > 0 ? "" : "hidden"}`}>
            <div className="total-title text-uppercase pull-left">
              <this.Translate id="text_total_amount" />: </div>
            <div className="total-value pull-left" style={{width: 100}}>
              <this.InputText name="requestTotal" disabled={true} className="ca-input-no-border grandTotal" form={this.props.form}/>
              <this.InputText name="requestTotalValue" className="hidden" form={this.props.form}/>
            </div>
          </div>}/>
      </div>
    );
  }   
       
}