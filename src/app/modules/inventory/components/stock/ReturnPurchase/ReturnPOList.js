import React from "react";
import Util from "../../../utils";
import Enum from "../../../enums";
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
        title: <this.Translate id="text_number_of" />,
        dataIndex: "no",
        width: 40,
        align: "center",
        key: "no",
        render: (text, record, index) => 
        {
          return(
            <div>
              {index+1}
              <this.InputText name={`purchaseOrderEntryId[${index}]`} type="hidden" data={record.purchaseOrderEntryId} form={this.form} />
              <this.InputText name={`productVariantId[${index}]`} type="hidden" data={record.productVariantId} form={this.form} />
              <this.InputText name={`productName[${index}]`} type="hidden" data={record.productName} form={this.form} />
              <this.InputNumber name={`receiveQuantity[${index}]`} className="hidden" data={record.receiveQuantity} form={this.form} />
              <this.InputNumber name={`price[${index}]`} className="hidden" data={record.price} form={this.form} />
            </div>
          );
        }
      },
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "productName",
        key: "productName",
        render: (text, record) => {
          return <div>
            <div>{record.productName}</div>
            <div className="variant-name">{record.variantName}</div>
          </div>;
        }
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "requestQuantity",
        width: 150,
        align: "center",
        key: "requestQuantity"
      },
      {
        title: <this.Translate id="text_receive_quantity" />,
        dataIndex: "receiveQuantity",
        width: 150,
        align: "center",
        key: "receiveQuantity"
      },
      {
        title: <this.Translate id="col_stock_purchase_order_return_qty" />,
        width: 150,
        align: "center",
        key: "returnQuantity",
        render: (text, record, index) => 
        {
          return (
            <this.InputNumber
              name={`returnQuantity[${index}]`}
              className="text-right"
              data={record.returnQuantity}
              compare={{value: record.receiveQuantity, message: <this.Translate id="text_return_warning"/>}}
              required={true}
              isHideTool={true}
              isAutoFocus={index === 0}
              isAutoSelect={true}
              precision={0}
              form={this.form} 
              handleKeyUp={(e) => this.handleOnChangeQuantity(e, index)}/>
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
    if (this.props.returnPurchaseDetail.length  > 0 && this.state.isNotYetLoadComponentDidUpdated) {
      const existingProductList = this.state.productLists;
      this.props.returnPurchaseDetail.forEach(purchaseOrderEntry => {
        let productName = "";
        let variantName = "";
        
        if (purchaseOrderEntry.productVariant) {
          productName = Util.getProductNameV2(purchaseOrderEntry.productVariant.product);
          variantName = purchaseOrderEntry.productVariant.product.productOption === Enum.PRODUCT_VARIANT ? purchaseOrderEntry.productVariant.name : "";
        }

        existingProductList.push({
          purchaseOrderEntryId: purchaseOrderEntry.id,
          productName,
          variantName,
          productVariantId: purchaseOrderEntry.productVariantId,
          requestQuantity: purchaseOrderEntry.requestQuantity, 
          receiveQuantity: purchaseOrderEntry.receiveQuantity,
          returnQuantity: 0,
          price: purchaseOrderEntry.price,
          totalPrice: 0,
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
    const quantity = this.props.form.getFieldValue(`returnQuantity[${index}]`);
    const price = this.props.form.getFieldValue(`price[${index}]`);
    return quantity * price;
  }


  handleOnChangeQuantity(e, index) {
    const existingProductList = this.state.productLists;
    const totalAmountEachRow = this.calculateTotalAmountEachRow(e, index);
    existingProductList[index]["returnQuantity"] = e.target.value;
    existingProductList[index]["totalPrice"] = totalAmountEachRow;
    this.setState({productLists: existingProductList});
    this.grandTotal(existingProductList);
  }

  grandTotal(productList) {
    let grandTotal = 0;
    productList.forEach(product => {
      if (product.status === this.Enum.ACTIVE) {
        grandTotal += (product.returnQuantity * product.price);
      }
    });

    this.props.form.setFieldsValue({returnTotal: this.formatCurrency(grandTotal)});
    this.props.form.setFieldsValue({returnTotalValue: `${grandTotal}`});
  }

  render() {
    return (
      <div className="main-dropdown-search">
        <this.Table
          rowKey="purchaseOrderEntryId"
          dataSource={this.state.productLists}
          columns={this.columns}
          locale={{emptyText: <this.Translate id="placeholder_table_purchase_order" />}}
          footer={() => <div className={`pull-right ${this.state.productLists.length > 0 ? "" : "hidden"}`}>
            <div className="total-title pull-left">
              <this.Translate id="text_total_amount" />: </div>
            <div className="total-value pull-left" style={{width: 100}}>
              <this.InputText name="returnTotal" disabled={true} className="ca-input-no-border grandTotal" form={this.props.form}/>
              <this.InputNumber name="returnTotalValue" className="hidden" form={this.props.form}/>
            </div>
          </div>}/>
      </div>
    );
  }   
       
}