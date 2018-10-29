import React from "react";
import ProductsAction from "../../../actions/products/product"; 
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
        key: "no",
        render: (text, record, index) => 
        {
          return(
            <div>
              {index + 1}
              <this.InputText name={`receiveId[${index}]`} className="hidden" data={record.id} form={ this.form } />
              <this.InputText name={`productId[${index}]`} className="hidden" data={record.productId} form={ this.form } />
              <this.InputNumber name={`statusId[${index}]`} className="hidden" data={record.status} form={ this.form } />
              <this.InputNumber name={`totalPrice[${index}]`} className="hidden" data={record.totalPrice} form={ this.form } />
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
        dataIndex: "requestQuantity",
        width: 100,
        key: "requestQuantity",
        render: (text, record, index) => 
        {
          return(
            <div>
              {record.quantity}
              <this.InputNumber name={`qty[${index}]`} className="hidden" data={record.quantity} form={ this.form } />
            </div>
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_receive_qty" />,
        dataIndex: "receiveQuantity",
        width: 100,
        key: "receiveQuantity",
        render: (text, record, index) => 
        {
          return (
            <this.InputText
              name={`receiveQty[${index}]`}  
              data={record.receiveQuantity}
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
        render: (text, record, index) => 
        {
          return(
            <div>
              {this.formatCurrency(record.price)}
              <this.InputNumber name={`receivePrice[${index}]`} className="hidden" data={record.price} form={ this.form } />
            </div>
          );
        }
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


  componentDidUpdate(){
    const {receivePurchaseDetail} = this.props;

    if(receivePurchaseDetail == null){
      return;
    }

    if (receivePurchaseDetail.length > 0 && this.state.isNotYetLoadComponentDidUpdated) {

      const existingProductList = this.state.productLists;
      
      receivePurchaseDetail.forEach(purchaseOrderEntry => {
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
    const quantity = this.props.form.getFieldValue(`receiveQty[${index}]`);
    const price = this.props.form.getFieldValue(`receivePrice[${index}]`);
    return quantity * price;
  }

  handleOnChangeQuantity(e, index) {
    const existingProductList = this.state.productLists;
    existingProductList.forEach((product, productIndex) => {
      if (productIndex === index) {
        existingProductList[productIndex]["receiveQuantity"] = e.target.value;
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
        grandTotal += (product.receiveQuantity * product.price);
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
          rowKey="receivedId"
          rowClassName={record => record.status !== this.Enum.ACTIVE ? "hidden" : ""}
          dataSource={productLists}
          columns={this.columns}
          locale={{emptyText: <this.Translate id="placeholder_table_purchase_order" />}}
          footer={() => <div className={` ${productLists.length > 0 ? "" : "hidden"}`}>
            <div className="total-title text-uppercase pull-left"><this.Translate id="text_total_amount" />: </div>
            <div className="total-value pull-left">
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