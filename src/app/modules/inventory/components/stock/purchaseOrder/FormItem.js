import React from "react";
import Supplier from "../../../actions/stock/supplier";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: <this.Translate id="col_stock_purchase_order_no" />,
        dataIndex: "no",
        key: "no"
      },
      {
        title: <this.Translate id="col_stock_purchase_order_description" />,
        dataIndex: "desc",
        key: "desc"
      },
      {
        title: <this.Translate id="col_stock_purchase_order_on_hand" />,
        dataIndex: "composite_product_cost",
        key: "composite_product_cost"
      },
      {
        title: <this.Translate id="col_stock_purchase_order_qty" />,
        dataIndex: "composite_product_action",
        key: "composite_product_action"
      },
      {
        title: <this.Translate id="col_stock_purchase_order_price" />,
        dataIndex: "composite_product_action",
        key: "composite_product_action"
      },
      {
        title: <this.Translate id="col_stock_purchase_order_total" />,
        dataIndex: "composite_product_action",
        key: "composite_product_action"
      }
    ];
    this.remove = this.remove.bind(this);
  }

  remove(){
    alert("remove");
  }

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(Supplier.fetch());
  }

  render() {
    const { form,locale,formData,supplier } = this.props;
    console.log("supplier",supplier);
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
              // errorRequired={<this.Translate id="input_error_stock_supplier_name" />}
              max={100}
              min={3}
              form={form}/> 
          </this.Col>
          <this.Col md="2">
            <this.DatePickers
              name="duedate"
              data={formData.dueDate}
              label={<this.Translate id="date_picker_stock_purchase_due_date" />}
              form={form}
            />
          </this.Col>
          <this.Col md="2">
            <this.InputNumber
              name="orderNumber"
              label={<this.Translate id="input_stock_purchase_order_number" />}
              data={formData.email}
              placeholder={this.CATranslate("input_stock_purchase_order_number", locale)}
              form={form}/> 
          </this.Col>
          <this.Col md="2">
            <this.InputText
              name="name"
              label={<this.Translate id="input_stock_purchase_invoice_no" />}
              data={formData.name}
              placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
              max={100}
              min={3}
              form={form}/>
          </this.Col>
          <this.Col md="2">
            <this.Select
              name="supplierid"
              label={<this.Translate id="select_stock_purchase_order_from_supplier" />}
              placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
              dataSource={supplier.list}
              valueKey="id"
              form={form}
            />
          </this.Col>
          <this.Col md="2">
            <this.Select
              name="supplierid"
              label={<this.Translate id="select_stock_purchase_delivery_to_location" />}
              placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
              dataSource={supplier.list}
              valueKey="id"
              form={form}
            />
          </this.Col>
        </this.Row>
        <this.Row>
          <this.Col md="12"> 
            <div className="main-searchs">
              <div className="search-icon icon-add-product"></div>
              <this.InputText
                name="searchproduct"
                placeholder="Search Product by product code,name,description"
                form={form}/>
              <div className="remove-search-icon icon-delete" onClick={this.remove}></div>
            </div>
          </this.Col>
          <this.Col md="12">
            <this.Table 
              dataSource={[]}
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