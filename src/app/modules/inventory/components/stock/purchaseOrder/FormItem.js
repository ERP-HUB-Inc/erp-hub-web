import React from "react";
import SupplierAction from "../../../actions/stock/supplier";
import ProductsAction from "../../../actions/products/product";
import LocationAction from "../../../../pos/action/settings/storeLocation";
import PurchaseOrderService from "../../../services/stock/PurchaseOrderService";
import { Modal  } from "../../shares/Modal/modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    const {locale, form} = this.props;
    this.columns = [
      {
        title: <this.Translate id="col_stock_purchase_order_no" />,
        dataIndex: "id",
        key: "purchaseID",
        render: (id) => 
        {
          return(
            <div>
              <this.InputText 
                name={`purchaseID[${id}]`} 
                type="hidden"
                data={id}
                required={true}  
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
                required={true}  
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
        render: (requestQuantity) => 
        {
          return(
            <div>
              <this.InputText 
                name={`purchaseQty[${requestQuantity}]`} 
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
        render: (price) => 
        {
          return(
            <div>
              <this.InputText 
                name={`purchasePrice[${price}]`} 
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
        render:(record) => 
        {
          return(
            <div>
              <this.Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.removeRecord(record.key)}
              />
            </div>
          );
        }
      }
    ];

    this.remove = this.remove.bind(this);
    this.orderNumber = this.orderNumber.bind(this);
    this.removeRecord = this.removeRecord.bind(this);

  }

  remove(){
    alert("remove");
  }

  removeRecord(key){
   
  }

  productList(){
    return(
      this.props.product.list
    );
  }

  //check ordernumber if exist
  orderNumber(e){
    setTimeout(() => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        PurchaseOrderService.add(values.number)
          .then((response) => {
            console.log("already exist");
          })
          .catch((error) => {
            console.log("not exist");
          });
      });
    }, 5000);
  }

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(SupplierAction.fetch());
    dispatch(ProductsAction.fetch(this.pageSize));
    dispatch(LocationAction.fetch());
  }

  render() {
    const { form,locale,formData,supplier,product,storeLocation } = this.props;
    const {
      getFieldDecorator,
      getFieldValue
    } = this.props.form;
    console.log("list products",product.list);

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
              data={formData.dueDate}
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
            <this.Supplier 
              label={<this.Translate id="input_stock_purchase_order_supplier" />}
            />
          </this.Col>
          <this.Col md="2">
            <this.StoreLocation 
              label={<this.Translate id="input_stock_purchase_order_delivery_to_location" />}
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
            <this.Table 
              dataSource={this.productList()}
              columns={this.columns}
              locale={{emptyText: <this.Translate id="placeholder_table_purchase_order" />}} />
          </this.Col>
          {/* <div>
            Total Amount: {  }
          </div> */}
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