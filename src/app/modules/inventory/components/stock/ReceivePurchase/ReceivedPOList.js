import React from "react";
import Util from "../../../utils";
import Modal from "../../../../common/components/shares/Modal";

export default class ReceivedPo extends Modal {
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
              <this.InputText name={`purchaseOrderEntryId[${index}]`} className="hidden" data={record.purchaseOrderEntryId} form={this.form} />
              <this.InputText name={`productId[${index}]`} className="hidden" data={record.productId} form={this.form} />
              <this.InputNumber name={`price[${index}]`} className="hidden" data={record.price} form={ this.form } />
            </div>
          );
        }
      },
      {
        title: <this.Translate id="text_product_name" />,
        dataIndex: "productName",
        key: "productName"
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "requestQuantity",
        width: 150,
        align: "center",
        key: "requestQuantity"
      },
      {
        title: <this.Translate id="col_stock_purchase_order_receive_qty" />,
        dataIndex: "receiveQuantity",
        width: 150,
        key: "receiveQuantity",
        align: "center",
        render: (text, record, index) => 
        {
          return (
            <this.InputNumber
              name={`receiveQuantity[${index}]`}  
              data={record.receiveQuantity}
              className="text-right"
              compare={{value: record.requestQuantity, message: <this.Translate id="text_receive_qty_warning"/>}}
              precision={0}
              isHideTool={true}
              required={true}
              isAutoFocus={index === 0}
              isAutoSelect={true}
              handleKeyUp={(e) => this.handleOnChangeQuantity(e, index)}
              form={this.form} />
          );
        }
      },
      {
        title: <this.Translate id="text_price" />,  
        dataIndex: "price",
        width: 100,
        key: "price",
        align: "right",
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

    this.grandTotal = this.grandTotal.bind(this);
    this.handleOnChangeQuantity = this.handleOnChangeQuantity.bind(this);
    this.calculateTotalAmountEachRow = this.calculateTotalAmountEachRow.bind(this);
  }

  componentDidUpdate() {
    if (this.props.receivePurchaseDetail.length > 0 && this.state.isNotYetLoadComponentDidUpdated) {
      const existingProductList = this.state.productLists;
      this.props.receivePurchaseDetail.forEach(purchaseOrderEntry => {
        this.state.productLists.push({
          purchaseOrderEntryId: purchaseOrderEntry.id,
          productName: Util.getProductName(purchaseOrderEntry.product),
          productId: purchaseOrderEntry.productId,
          requestQuantity: purchaseOrderEntry.requestQuantity, 
          receiveQuantity: purchaseOrderEntry.receiveQuantity,
          price: purchaseOrderEntry.price,
          totalPrice: 0
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
    const quantity = this.props.form.getFieldValue(`receiveQuantity[${index}]`);
    const price = this.props.form.getFieldValue(`price[${index}]`);
    return quantity * price;
  }

  handleOnChangeQuantity(e, index) {
    const existingProductList = this.state.productLists;
    existingProductList[index]["receiveQuantity"] = e.target.value;
    existingProductList[index]["totalPrice"] = this.calculateTotalAmountEachRow(e, index);

    this.setState({productLists: existingProductList});
    this.grandTotal(existingProductList);
    
  }

  grandTotal(productList) {
    let grandTotal = 0;
    productList.forEach(product => {
      grandTotal += (product.receiveQuantity * product.price);
    });

    this.props.form.setFieldsValue({receiveTotal: this.formatCurrency(grandTotal)});
    this.props.form.setFieldsValue({receiveTotalValue: `${grandTotal}`});
  }

  render() {
    return(
      <div className="main-dropdown-search">
        <this.Table
          rowKey="purchaseOrderEntryId"
          dataSource={this.state.productLists}
          columns={this.columns}
          locale={{emptyText: <this.Translate id="placeholder_table_purchase_order" />}}
          footer={() => <div className={`pull-right ${this.state.productLists.length > 0 ? "" : "hidden"}`}>
            <div className="total-title text-uppercase pull-left">
              <this.Translate id="text_total_amount" />:
            </div>
            <div className="total-value pull-left" style={{width: 100}}>
              <this.InputText name="receiveTotal" disabled={true} className="ca-input-no-border grandTotal" form={this.props.form}/>
              <this.InputText name="receiveTotalValue" className="hidden" form={this.props.form}/>
            </div>
          </div>}
        /> 
      </div>
    );
  }   
       
}