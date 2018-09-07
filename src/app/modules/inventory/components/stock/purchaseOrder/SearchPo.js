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
      totalAmount:[]
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
              <this.InputText 
                name={`purchaseId[${index}]`} 
                type="hidden" 
                data={record.id}
                form={ this.form } />
              { index + 1 }
            </div>
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_description" />,
        dataIndex: "description",
        key: "description",
        render: (text,record,index) => 
        {
          return(
            <div>
              <this.InputText 
                name={`purchaseDescription[${index}]`} 
                type="hidden"
                data={record.productNam}
                form={ this.form } />
              { record.productName }
            </div>
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_on_hand" />,
        dataIndex: "key2",
        key: "key2"
      },
      {
        title: <this.Translate id="col_stock_purchase_order_qty" />,
        dataIndex: "requestQuantity",
        key: "requestQuantity",
        render: (text,record,index) => 
        {
          return(
            <div>
              <this.InputText 
                name={`purchaseQty[${index}]`} 
                type="text"
                data={record.markup}
                required={true}
                min={1}
                form={ this.form } />
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
              <this.InputText 
                name={`purchasePrice[${index}]`} 
                type="text"
                data={record.price}
                handleKeyUp={() => this.handleChangePrice(index)}
                required={true}
                min={1}
                form={ this.form } />
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
                // record.totalPrice
                this.state.total
              }
            </div>
          );
        }
      },
      {
        title:"Action",
        key:"id",
        render:(record,index) => 
        {
          return(
            <div>
              <this.Button
                className="danger"  
                onClick={() => this.removeRecord(index.id)}
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
    // this.handleChangePrice = this.handleChangePrice.bind(this);

  }


  handleChangePrice(){
    const total = this.state;
    this.props.form.validateFields((err, values) => {
      console.log("values handlechange price",values);

      const MainTotal = {
        price: values.purchasePrice,
        quantiy: values.purchaseQty
      };

      const listTotal = [];

      MainTotal.price.forEach((price, index) => {
        listTotal.push({
          price: MainTotal.price[index],
          quantiy: MainTotal.quantiy[index],
          Total:  MainTotal.price[index] * MainTotal.quantiy[index]
        });
       
      });

      this.setState({
        total: listTotal.map(item => item.Total)
      });
      console.log("main total",listTotal);
      console.log("total",listTotal.map(item => item.Total));

    //   this.setState({
    //     price: values.purchasePrice,
    //     quantity: values.purchaseQty
    //   });

    });
   
  }


  //remove row 
  removeRecord(key){
    const listProductSoruces = [...this.state.productLists];
    this.setState({productLists:listProductSoruces.filter(item => item.id !== key)});   
  }


  productList(){
    return(
      this.props.dataSource
    );
  }

  handleOnSelectList(value) {
    console.log("values",value);
    const productName = value.productDescriptions.length > 0 ?  value.productDescriptions[0].name : "";

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
        totalPrice: 0,
        markup: 0,
        cost,
        status: this.Enum.ACTIVE
      });
    } else {
      let isNotTheSameCompsite = true;
      existingProductList.forEach((compsoite, compsoiteIndex) => {
        if (compsoite.productCompositeProductId === value.id ) {
          isNotTheSameCompsite = false;
          existingProductList[compsoiteIndex]["markup"] += 1;
          existingProductList[compsoiteIndex]["totalPrice"] += value.price;
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
          totalPrice: 0,
          markup: 0,
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
      <div>
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
      </div>
    );
  }
       
}