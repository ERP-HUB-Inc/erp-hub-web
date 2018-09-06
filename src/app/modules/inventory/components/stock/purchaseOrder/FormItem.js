import React from "react";
import ProductsAction from "../../../actions/products/product";
import SupplierAction from "../../../actions/stock/supplier";
import PurchaseOrderService from "../../../services/stock/PurchaseOrderService";
import StoreLoctionAction from "../../../../pos/action/settings/storeLocation";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    const {form} = this.props;
    this.timer = null;
    this.state = {
      productLists: this.productList()
    };
    this.ChangeSupplierEmailValue = this.ChangeSupplierEmailValue.bind(this);
    this.columns = [
      {
        title: <this.Translate id="col_stock_purchase_order_no" />,
        dataIndex: "id",
        key: "purchaseID",
        render: (id,row,index) => 
        {
          return(
            <div>
              <this.InputText 
                name={`purchaseId[${index}]`} 
                type="hidden"
                data={id}
                form={ form } />
              { id }
            </div>
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_description" />,
        dataIndex: "description",
        key: "description",
        render: (description) => 
        {
          return(
            <div>
              <this.InputText 
                name={`purchaseDescription[${description}]`} 
                type="hidden"
                data={description}
                form={ form } />
              { description }
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
        render: (requestQuantity,row,index) => 
        {
          return(
            <div>
              <this.InputText 
                name={`purchaseQty[${index}]`} 
                type="text"
                data={requestQuantity}
                required={true}
                form={ form } />
              { requestQuantity }
            </div>
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_price" />,
        dataIndex: "price",
        key: "price",
        render: (price,row,index) => 
        {
          return(
            <div>
              <this.InputText 
                name={`purchasePrice[${index}]`} 
                type="text"
                data={price}
                required={true}
                form={ form } />
              { price }
            </div>
          );
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_total" />,
        dataIndex: "composite_product_action",
        key: "key5"
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

    this.orderNumber = this.orderNumber.bind(this);
    this.removeRecord = this.removeRecord.bind(this);
    this.handleAdd = this.handleAdd.bind(this);

  }

  // componentDidMount(){
  //   this.productList();
  // }

  //remove row 
  removeRecord(key){
    const listProductSoruces = [...this.state.productLists];
    this.setState({productLists:listProductSoruces.filter(item => item.id !== key)});   

  }

  //add row
  handleAdd(count){
    const listProductSoruces = [...this.state.productLists];
    const newData = {
      clientId: count + 1,
      createdAt :"2018-09-05T01:31:00.981Z",
      description  : "dddd",
      email : "sopha088@gmail.com",
      id: count + 1,
      name:"Book",
      phoneNumber: "098765432",
      status :1,
      updatedAt : "2018-09-05T01:31:00.981Z"
    };

  
    this.setState({
      productLists: [...this.state.productLists, newData],
    });

  } 
  
  ChangeSupplierEmailValue(values){
    console.log(".supplieri",values);
    this.dispatch(SupplierAction.detail(values));
  }
  
  productList(){
    return(
      this.props.product.list
    );
  }

  //check ordernumber if exist
  orderNumber(e){
    clearTimeout(this.timer);
    this.timer  =  setTimeout(() => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {

        PurchaseOrderService.findPurchaseOrderNumber(values.number)

          .then((response) => {
            console.log("already exist");
          })
          .catch((error) => {
            console.log("not exist");
          });

        // this.props.form.setFields({
        //   number: {
        //     value: values.number,
        //     errors: [new Error("Po is already exist")],
        //   },
        // });
        
      });
    }, 1000);

  }

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(ProductsAction.fetch(10));
    dispatch(SupplierAction.fetch(10));
    dispatch(StoreLoctionAction.fetch(10));
  }


  render() {
    const { form,supplier,storeLocation,locale,formData,supplierDetail } = this.props;

    console.log("supplierDetail",supplierDetail);
    console.log("Product Lists",this.state.productLists);

    const { productLists } = this.state;
    
    let count = 1;
    return (
      <div>
        <this.Row>
          <this.Col md="2">
            <this.InputText
              name="name"
              label={<this.Translate id="input_stock_purchase_order_name" />}
              data={formData.name}
              placeholder={this.CATranslate("input_stock_purchase_order_name", locale)}
              required={true}
              max={100}
              min={3}
              form={form}/> 
          </this.Col>
          <this.Col md="2">
            <this.DatePickers
              name="deliveryDueDate"
              dataSource={this.Util.listFormatDate()}
              defaultValue={formData.dueDate} 
              label={<this.Translate id="date_picker_stock_purchase_due_date" />}
              form={form}
            />
          </this.Col>
          <this.Col md="2">
            <this.InputText
              name="number"
              label={<this.Translate id="input_stock_purchase_order_number" />}
              handleKeyUp={this.orderNumber}
              placeholder={this.CATranslate("input_stock_purchase_order_number", locale)}
              form={form}/> 
          </this.Col>
          <this.Col md="2">
            <this.InputText
              name="invoiceNo"
              label={<this.Translate id="input_stock_purchase_invoice_no" />}
              placeholder={this.CATranslate("input_stock_purchase_invoice_no",locale)}
              max={100}
              min={3}
              form={form}/>
          </this.Col>
          <this.Col md="2">
            <this.Select
              name="supplierid"
              label={<this.Translate id="select_stock_purchase_order_from_supplier" /> }
              placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
              dataSource={supplier.list}
              valueKey="id"
              form={form}
              onChange={this.ChangeSupplierEmailValue}
            />
          </this.Col>
          <this.Col md="2">
            <this.Select
              name="locationid"
              label={<this.Translate id="input_stock_purchase_order_delivery_to_location" />}
              placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
              dataSource={storeLocation.list}
              valueKey="id"
              form={form}
            />
          </this.Col>
        </this.Row>
        <this.Row>
          <this.Col md="12" className="search-height"> 
            <div className="main-searchs">
              <div className="search-icon icon-add-product"></div>
              <this.InputText
                name="searchproduct"
                placeholder="Search Product by product code,name,description"
                form={form}/>
              <div className="remove-search-icon icon-clear" onClick={this.remove}></div>
            </div>
          </this.Col>
          <this.Col md="12">
            <this.Button
              onClick={() => this.handleAdd(count)}
              type="primary"
            >
              Add a row
            </this.Button>
            <this.Table 
              dataSource={productLists}
              columns={this.columns}
              locale={{emptyText: <this.Translate id="placeholder_table_purchase_order" />}} />
          </this.Col>
        </this.Row>
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    description:"",
    status: 1,
    supplierid:""
  }
};