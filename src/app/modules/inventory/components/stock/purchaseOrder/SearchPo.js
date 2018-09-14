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
        key: "purchaseID",
        render: (text,record,index) => 
        {
          return(
            <div>
              { index + 1 }
              <this.InputText name={`purchaseId[${index}]`} type="hidden" data={record.id} form={ this.form } />
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
              <this.InputNumber name={`purchaseQty[${index}]`}  data={record.quantiy} required={true} min={1} max={100} form={ this.form } />
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
              <this.InputNumber name={`purchasePrice[${index}]`} data={record.price} required={true} min={1} max={100} form={ this.form } />
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
            <div>
              { this.formatCurrency(record.totalPrice) }
            </div>
          );
        }
      },
      {
        title:"Action",
        key:"id",
        render:(text,record,index) => 
        {
          return(
            <div>

              <this.Button
                className="danger"  
                onClick={() => this.removeRecord(record,index)}
              >
                <span className="icon-delete"></span>
              </this.Button>
            </div>
          );
        }
      }
    ];

    this.removeRecord = this.removeRecord.bind(this);
    this.handleOnSelectList = this.handleOnSelectList.bind(this);

  }


  //remove row 
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

    console.log("remove", existingProductList);

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

    console.log("purchaseOrderEntries",purchaseOrderEntries);

    if (purchaseOrderEntries.length > 0 && this.state.isNotYetLoadComponentDidUpdated) {

      const existingProductList = this.state.productLists;
      const totalAmountProductList =  [];
      
      purchaseOrderEntries.forEach(purchaseOrderEntry => {
        existingProductList.push({
          id: purchaseOrderEntry.id,
          productName: purchaseOrderEntry.product.productDescriptions.name,
          productId: purchaseOrderEntry.productId,
          quantiy: purchaseOrderEntry.requestQuantity, 
          price: purchaseOrderEntry.price,
          totalPrice: purchaseOrderEntry.requestQuantity * purchaseOrderEntry.price,
          status: purchaseOrderEntry.status
        }); 
        const TotalValue = purchaseOrderEntry.requestQuantity * purchaseOrderEntry.price;

        totalAmountProductList.push({
          totalPrice: TotalValue
        }); 
        
      }); 

      console.log("calculateTotalAmount",totalAmountProductList);
      
      this.setState({
        productLists: existingProductList,
        calculateTotalAmount: totalAmountProductList,
        isNotYetLoadComponentDidUpdated: false
      });

      console.log("existingProductList",existingProductList);

    }

  
  }

  handleOnSelectList(value) {
    console.log("values",value);
    const productName = value.productDescriptions.length > 0 ?  value.productDescriptions[0].name : "";
    const productId = value.productDescriptions.length > 0 ?  value.productDescriptions[0].productId : "";

    const {productCode,quantity,price,cost} = value;
    const existingProductList = this.state.productLists;

    console.log("list all",existingProductList);

    const CalculateTotalPrice = [];

    if (existingProductList.length === 0) {
      existingProductList.push({
        id: "",
        productName,
        quantity,
        price,
        productCode,
        productCompositeProductId: value.id,
        productId,
        totalPrice: 0,
        quantiy: 0,
        cost,
        status: this.Enum.ACTIVE
      });
    } else {
      let isNotTheSameProduct = true;
      existingProductList.forEach((product, index) => {
        if (product.productCompositeProductId === value.id ) {
          isNotTheSameProduct = false;
          existingProductList[index]["quantiy"] += 1;
          existingProductList[index]["totalPrice"] += value.price;
        }

        CalculateTotalPrice.push({
          totalPrice: existingProductList[index]["totalPrice"] += value.price
        });

      });

      if (isNotTheSameProduct) {
        existingProductList.push({
          id:"",
          productName,
          quantity,
          price,
          productCode,
          productCompositeProductId: value.id,
          productId,
          totalPrice: 0,
          quantiy: 0,
          cost,
          status: this.Enum.ACTIVE
        });
        
      }
    }

    this.setState({
      productLists: existingProductList,
      calculateTotalAmount: CalculateTotalPrice
    });

    console.log("CalculateTotalPrice",CalculateTotalPrice);
  }

  componentDidMount(){
    ProductsAction.fetch(10);
  }


  render(){
    const { productLists,calculateTotalAmount } = this.state; 

   
    let Calvalue = calculateTotalAmount.forEach((value, index) => {
      return value.totalPrice;
    });

    console.log("totalPrice",calculateTotalAmount);

    return(
      <div className="main-dropdown-search">
        <DropDownSearch
          productSearch={ this.props.dataSource }
          handleOnSelectList={this.handleOnSelectList}
          dispatch={this.props.dispatch}
          locale={this.props.locale}
          form={this.props.form}
        />  
        <this.Table
          rowKey="productId"
          rowClassName={record => record.status !== this.Enum.ACTIVE ? "hidden" : ""}
          dataSource={productLists}
          columns={this.columns}
          locale={{emptyText: <this.Translate id="placeholder_table_purchase_order" />}}
        /> 
        <div className="total-amount">
          Total Amount:  { Calvalue }
        </div>
      </div>
    );
  }   
       
}