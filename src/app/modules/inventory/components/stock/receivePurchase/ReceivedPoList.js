import React from "react";
import ProductsAction from "../../../actions/products/product"; 
import Modal from "../../../../common/components/shares/Modal";

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
              {record.quantiy}
              <this.InputNumber name={`qty[${index}]`} className="hidden" data={record.quantiy} required={true} min={1} max={100} form={ this.form } />
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
              {/* { record.receiveQuantity } */}
              <this.InputNumber name={`receiveQty[${index}]`}  data={record.receiveQuantity} required={true} min={1} max={100} form={ this.form } />
            </div>
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
    const {receivePurchaseDetail} = this.props;

    if (receivePurchaseDetail.length > 0 && this.state.isNotYetLoadComponentDidUpdated) {

      const existingProductList = this.state.productLists;
      
      console.log("receivePurchaseDetails",receivePurchaseDetail);
      
      receivePurchaseDetail.forEach(purchaseOrderEntry => {
        existingProductList.push({
          id: purchaseOrderEntry.id,
          // productName: purchaseOrderEntry.product.productDescriptions.name,
          productId: purchaseOrderEntry.productId,
          quantiy: purchaseOrderEntry.requestQuantity, 
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

    }
  
  
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
        /> 
      </div>
    );
  }   
       
}