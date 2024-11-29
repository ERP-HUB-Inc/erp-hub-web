import React from "react";
import Enum from "../../../enums";
import Util from "../../../utils";
import StockTransferAction from "../../../actions/stock/stockTransfer";
import StockTransferConstant from "../../../constants/stock/stockTransfer";
import Modal from "../../../../common/components/shares/Modal";
import "../PurchaseOrder/index.css";

export default class FormEntry extends Modal {
  constructor(props){
    super(props);
    this.state = {
      selectedProduct: null,
      productLists: [],
      modalVariant: null,
      isNotYetLoadComponentDidUpdated: true
    };
    this.form = this.props.form;
    this.columns = [
      {
        title: <this.Translate id="text_number_of" />,
        dataIndex: "id",
        key: "no",
        width: 100,
        align: "center",
        render: (text, record, index) => {
          return (
            <div>
              { index + 1 }
              <this.InputText name={`transferEntryId[${index}]`} type="hidden" data={record.transferEntryId} form={this.form} />
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
            <div className="variant-name">{record.variantName}</div>
          </div>;
        }
      },
      {
        title: <this.Translate id="text_transfer_quantity" />,
        dataIndex: "transferQuantity",
        width: 200,
        align: "center",
        key: "transferQuantity",
      },
      {
        title: <this.Translate id="text_stock_on_hand" />,
        dataIndex: "quantityOnHand",
        width: 150,
        align: "center",
        key: "quantityOnHand",
        render: (text, product) => {
          return this.countQuantityOnHand(product);
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
            dataSource={this.props.unit.list}
            defaultValue={record.unitId}
            disabled={true}
            form={this.form} />;
        }
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "receiveQuantity",
        width: 150,
        key: "receiveQuantity",
        render: (text, product, index) => {
          return <this.InputNumber
            name={`receiveQuantity[${index}]`}
            data={product.receiveQuantity}
            compare={{value: product.transferQuantity, message: <this.Translate id="text_transfer_qty_warning"/>}}
            isAutoSelect={true}
            isHideTool={true}
            required={true}
            handleKeyUp={(e) => this.handleOnChangeQuantity(e, index)}
            precision={0}
            form={this.form} />;
        }
      }
    ];

    this.handleOnChangeQuantity = this.handleOnChangeQuantity.bind(this);
  }

  componentDidMount() {
    this.setState({units: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.UNIT))});
  }

  componentDidUpdate() {
    if (this.props.stockTransferEntries.length > 0 && this.state.isNotYetLoadComponentDidUpdated) {
      const existingProductList = this.state.productLists;
      
      this.props.stockTransferEntries.forEach(transferEntry => {
        let productName = "";
        let variantName = "";
        
        if (transferEntry.productVariant) {
          productName = Util.getProductNameV2(transferEntry.productVariant.product);
          variantName = transferEntry.productVariant.product.productOption === Enum.PRODUCT_VARIANT ? transferEntry.productVariant.name : "";
        }

        existingProductList.push({
          transferEntryId: transferEntry.id,
          productName,
          variantName,
          unitId: transferEntry.unitId,
          productVariantId: transferEntry.productVariantId,
          receiveQuantity: 0,
          transferQuantity: transferEntry.transferQuantity,
          transferEntryStatus: transferEntry.status
        }); 
      }); 
      
      this.setState({
        productLists: existingProductList,
        isNotYetLoadComponentDidUpdated: false
      });

      this.props.dispatch(StockTransferAction.reset(StockTransferConstant.RESET_REQUEST_STOCK_TRANSFER));
    }
  }

  countQuantityOnHand(product) {
    let fromLocationId = "";
    if (this.props.fromLocationId) {
      fromLocationId = this.props.fromLocationId;
    } else {
      fromLocationId = this.Util.getLocationId();
    }
    return Util.countProductQTYCurrentLocation(product, fromLocationId);
  }

  handleOnChangeQuantity(e, index) {
    const existingProductList = this.state.productLists;
    existingProductList[index]["receiveQuantity"] = parseInt(e.target.value, 10);
    this.setState({productLists: existingProductList});
  }

  render(){
    return <this.Table
      rowKey="productVariantId"
      dataSource={this.state.productLists}
      columns={this.columns}
      locale={{emptyText: <this.Translate id="placeholder_table_stock_transfer" />}} />;
  }   
       
}