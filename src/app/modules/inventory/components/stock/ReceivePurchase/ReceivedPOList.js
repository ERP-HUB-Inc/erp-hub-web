import React from "react";
import Util from "../../../utils";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";
export default class ReceivedPo extends Modal {
  constructor(props){
    super(props);
    this.state = {
      units: [],
      productLists: [],
      isNotYetLoadComponentDidUpdated: true
    };
    this.form = this.props.form;
    this.columns = [
      {
        title: <this.Translate id="text_number_of" />,
        dataIndex: "no",
        width: 100,
        align: "center",
        key: "no",
        render: (text, record, index) => 
        {
          return(
            <div>
              {index + 1}
              <this.InputText name={`purchaseOrderEntryId[${index}]`} className="hidden" data={record.purchaseOrderEntryId} form={this.form} />
              <this.InputText name={`productVariantId[${index}]`} className="hidden" data={record.productVariantId} form={this.form} />
              <this.InputNumber name={`price[${index}]`} className="hidden" data={record.price} form={ this.form } />
            </div>
          );
        }
      },
      {
        title: <this.Translate id="text_item_name" />,
        dataIndex: "productName",
        key: "productName",
        render: (text, record) => {
          return <div>
            <div>{record.productName}</div>
            {
              record.variantName ? 
                <div className="variant-name">{record.variantName}</div>
                :
                ""
            }
          </div>;
        }
      },
      {
        title: <this.Translate id="text_unit" />,
        dataIndex: "unit",
        width: 150,
        key: "unit",
        align: "center",
        render: (text, record, index) => {
          return <this.Select
            name={`unitId[${index}]`}
            valueKey="id"
            dataSource={this.state.units}
            defaultValue={record.unitId}
            form={this.form}
            disabled={true} />;
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
        width: 160,
        key: "receiveQuantity",
        align: "center",
        render: (text, record, index) => 
        {
          return (
            <this.InputNumber
              name={`receiveQuantity[${index}]`}  
              data={record.receiveQuantity}
              className="text-right"
              compare={{value: record.quantity, message: <this.Translate id="text_receive_qty_warning"/>}}
              precision={0}
              isHideTool={true}
              isAutoFocus={index === 0}
              isAutoSelect={true}
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
        align: "right",
        render: price => this.formatCurrency(price)
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "totalPrice",
        width: 120,
        align: "right",
        key: "totalPrice",
        render: totalPrice => this.formatCurrency(totalPrice) 
      }
    ];

    this.grandTotal = this.grandTotal.bind(this);
    this.handleOnChangeQuantity = this.handleOnChangeQuantity.bind(this);
    this.calculateTotalAmountEachRow = this.calculateTotalAmountEachRow.bind(this);
  }

  componentDidMount() {
    this.setState({units: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.UNIT))});
  }

  componentDidUpdate() {
    if (this.props.receivePurchaseDetail.length > 0 && this.state.isNotYetLoadComponentDidUpdated) {
      const existingProductList = this.state.productLists;
      this.props.receivePurchaseDetail.forEach(purchaseOrderEntry => {
        let productName = "";
        let variantName = "";
        
        if (purchaseOrderEntry.productVariant) {
          productName = Util.getProductNameV2(purchaseOrderEntry.productVariant.product);
          variantName = purchaseOrderEntry.productVariant.product.productOption === Enum.PRODUCT_VARIANT ? purchaseOrderEntry.productVariant.name : "";
        }

        this.state.productLists.push({
          purchaseOrderEntryId: purchaseOrderEntry.id,
          unitId: purchaseOrderEntry.unitId,
          productName,
          variantName,
          productVariantId: purchaseOrderEntry.productVariantId,
          requestQuantity: purchaseOrderEntry.quantity, 
          receiveQuantity: purchaseOrderEntry.receiveQuantity,
          price: purchaseOrderEntry.price,
          totalPrice: 0
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
    const quantity = this.props.form.getFieldValue(`receiveQuantity[${index}]`);
    const price = this.props.form.getFieldValue(`price[${index}]`);
    return quantity * price;
  }

  calculateAllRequestQuantity() {
    return this.Util.sumBy(this.state.productLists, "requestQuantity");
  }

  calculateAllReceiveQuantity(productLists) {
    return this.Util.sumBy(productLists, "receiveQuantity");
  }

  handleOnChangeQuantity(e, index) {
    const existingProductList = this.state.productLists;
    existingProductList[index]["receiveQuantity"] = parseInt(e.target.value, 10);
    existingProductList[index]["totalPrice"] = this.calculateTotalAmountEachRow(e, index);

    this.setState({productLists: existingProductList});
    this.grandTotal(existingProductList);

    if (this.props.handleGetCallBackIsPartialReceive) {
      this.props.handleGetCallBackIsPartialReceive(this.calculateAllReceiveQuantity(existingProductList) < this.calculateAllRequestQuantity());
    }
    
  }

  grandTotal(productList) {
    let grandTotal = 0;
    productList.forEach(product => {
      grandTotal += (product.receiveQuantity * product.price);
    });

    this.props.form.setFieldsValue({receiveTotal: this.formatCurrency(grandTotal)});
    this.props.form.setFieldsValue({receiveTotalValue: `${grandTotal}`});
  }

  render() {
    return(
      <div className="main-dropdown-search">
        <this.Table
          rowKey="purchaseOrderEntryId"
          dataSource={this.state.productLists}
          columns={this.columns}
          locale={{emptyText: <this.Translate id="placeholder_table_purchase_order" />}}
          footer={() => <div className={`${this.state.productLists.length > 0 ? "" : "hidden"}`} style={{display: "flex"}}>
            <div className="total-title" style={{width: "auto", display: "flex"}}>
              <this.Translate id="text_total_amount" />:
            </div>
            <div className="total-value" style={{width: 128, display: "flex", alignItems: "center", paddingRight: 5}}>
              <this.InputText name="receiveTotal" disabled={true} className="ca-input-no-border grandTotal" form={this.props.form}/>
              <this.InputText name="receiveTotalValue" className="hidden" form={this.props.form}/>
            </div>
          </div>}
        /> 
      </div>
    );
  }   
       
}