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
              <this.InputText name={`purchaseId[${index}]`} type="hidden" data={record.id} form={ this.form } />
              <this.InputText name={`productId[${index}]`} type="hidden" data={record.productId} form={ this.form } />
              { index + 1 }
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
            <div>
              <this.InputText  name={`[${index}]`} type="hidden" data={record.productNam} form={ this.form } />
              { record.productName }
            </div>
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_qty" />,
        dataIndex: "requestQuantity",
        key: "requestQuantity",
        render: (text,record,index) => 
        {
          return(
            <div>
              <this.InputNumber
                name={`purchaseQty[${index}]`}  data={record.quantiy} required={true} min={1} max={100} form={ this.form } />
            </div>
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_price" />,  
        dataIndex: "price",
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
              {
                this.state.total
              }
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
    // const listProductSoruces = [...this.state.productLists];
    // this.setState({productLists:listProductSoruces.filter(item => item.id !== key)});

    console.log("record",record.id);

    let existingProductList = this.state.productLists;
    if (record.id === "") {
      existingProductList.splice(index, 1);
    } else {
      existingProductList.forEach((product, productIndex) => {
        if (product.id === record.id) {
          existingProductList[productIndex]["status"] = this.Enum.ARCHIVE;
        }
        console.log("index",productIndex);
      });
    }

    this.setState({
      productLists: existingProductList
    });   

    console.log("remove reccord",existingProductList);
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
      
      purchaseOrderEntries.forEach(purchaseOrderEntry => {
        existingProductList.push({
          id: purchaseOrderEntry.id,
          productId: purchaseOrderEntry.productId,
          quantiy: purchaseOrderEntry.requestQuantity, 
          price: purchaseOrderEntry.price
        }); 
      }); 
      
      this.setState({
        productLists: existingProductList,
        isNotYetLoadComponentDidUpdated: false
      });

    }
  
  }

  handleOnSelectList(value) {
    console.log("values",value);
    const productName = value.productDescriptions.length > 0 ?  value.productDescriptions[0].name : "";
    const productId = value.productDescriptions.length > 0 ?  value.productDescriptions[0].productId : "";

    const {id,productCode,quantity,price,cost} = value;
    const existingProductList = this.state.productLists;

    console.log("list all",existingProductList);

    if (existingProductList.length === 0) {
      existingProductList.push({
        id,
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
      let isNotTheSameCompsite = true;
      existingProductList.forEach((product, index) => {
        if (product.productCompositeProductId === value.id ) {
          isNotTheSameCompsite = false;
          existingProductList[index]["quantiy"] += 1;
          existingProductList[index]["totalPrice"] += value.price;
        }
      });

      if (isNotTheSameCompsite) {
        existingProductList.push({
          id,
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

    this.setState({productLists: existingProductList});
  }

  componentDidMount(){
    ProductsAction.fetch(10);
  }

  render(){
    const { productLists } = this.state;
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
          dataSource={productLists}
          columns={this.columns}
          locale={{emptyText: <this.Translate id="placeholder_table_purchase_order" />}} />
        <div className="total-amount">
          Total Amount: 
        </div>
      </div>
    );
  }   
       
}