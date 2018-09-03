import React from "react";
import List from "../List";
import FormCreate from "../../../containers/stock/purchaseOrder/FormCreate";
import FormUpdate from "../../../containers/stock/purchaseOrder/FormUpdate";
import Constant from "../../../constants/stock/purchaseOrder";
import PurchaseAction from "../../../actions/stock/purchaseOrder";
import PurchaseService from "../../../services/stock/PurchaseOrderService";
import Supplier from "../../../actions/stock/supplier";
import "./index.css";

export default class PurchaseOrderLists extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "purchaseOrder";
    this.addingProp = "purchaseOrderAdd";
    this.updatingProp = "purchaseOrderUpdate";
    this.service = PurchaseService;
    this.columnFilterWithKey = [
      "name",
      "supplierId",
      "deliveryDueDate"
    ];
    this.action = PurchaseAction;
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
  }

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(Supplier.fetch());
    super.componentDidMount();
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(PurchaseAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(PurchaseAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  // renderActionButton() {
  //   return (
  //     <div>
  //       <this.Button type="info">
  //         <span className="icon-export"></span> {<this.Translate id="button_search_stock_purchase_order_export_csv" />}
  //       </this.Button> 
  //     </div>
  //   );
  // }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const {dispatch} = this.props;
          const status = values.status === this.Enum.ALL_STATE ? [this.Enum.ACTIVE, this.Enum.DEACTIVE] : [values.status];
          let filter = {status};
          filter = JSON.stringify(filter);
          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey));
          this.setState({isClickFilter: true});
        }
      
      }); 
    } 
  }

  renderFilterRecord() {
    const {form,supplier} = this.props;

    return(
      <div>
        { form == null ?
          ""
          :
          <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
            <this.Row className="main-search-layout form-group"> 
              <this.Col md="2">
                <this.Select
                  name="status"
                  label={<this.Translate id="text_status" />}
                  placeholder="Please select status"
                  dataSource={this.statusList}
                  defaultValue={this.Enum.ALL_STATE}
                  form={form}
                />
              </this.Col>
              <this.Col md="2">
                <this.Supplier
                  label={<this.Translate id="col_stock_purchase_order_supplier" />}
                />
              </this.Col>
              <this.Col md="2">
                <this.DatePickers
                  name="duedate"
                  label={<this.Translate id="datepicker_stock_purchase_due_date" />}
                  form={form}
                />
              </this.Col>
              <this.Col md="2">
                <this.InputText
                  name="key"
                  label={<this.Translate id="input_stock_purchase_key" />}
                  placeholder="Search for Purchase Order"
                  form={form}
                />
              </this.Col>

              <this.Button htmlType="submit" type="info" >
                <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
              </this.Button>
            </this.Row>
          </this.Form>
        }
      </div>
    );
  }

}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      {
        title: <this.Translate id="col_stock_purchase_order_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_purchase_order_supplier" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_purchase_order_stock_location" />,
        dataIndex: "stockLocation",
        key: "stockLocation",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_purchase_order_due_date" />,
        dataIndex: "deliveryDueDate",
        key: "deliveryDueDate",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_purchase_order_shipping_fee" />,
        dataIndex: "shippingFee",
        key: "shippingFee",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_purchase_order_total" />,
        dataIndex: "requestTotal",
        key: "requestTotal",
        sorter: true
      },
      this.columnStatus
    ];
  }
}