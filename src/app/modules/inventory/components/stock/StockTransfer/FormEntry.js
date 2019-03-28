import React from "react";
import Enum from "../../../enums";
import Util from "../../../utils";
import VariantProduct from "../../../../pos/containers/transactions/SaleWalkin/VariantProduct";
import DropDownSearch from "../../../components/products/Product/DropDownSearch";
import ProductVariantAction from "../../../actions/products/productVariant";
import StockTransferAction from "../../../actions/stock/stockTransfer";
import StockTransferConstant from "../../../constants/stock/stockTransfer";
import ProductVariantConstant from "../../../constants/products/productVariant";
import Modal from "../../../../common/components/shares/Modal";
import "../PurchaseOrder/index.css";
import "./index.css";

export default class FormEntry extends Modal {
  constructor(props){
    super(props);
    this.state = {
      selectedProduct: null,
      units: [],
      productLists: [],
      modalVariant: null,
      isNotYetLoadComponentDidUpdated: true
    };
    this.form = this.props.form;
    this.columns = [
      {
        title: <this.Translate id="text_no" />,
        dataIndex: "id",
        key: "no",
        width: 100,
        align: "center",
        render: (text, record, index) => {
          return (
            <div>
              { index + 1 }
              <this.InputText name={`transferEntryId[${index}]`} type="hidden" data={record.transferEntryId} form={this.form} />
              <this.InputText name={`productVariantId[${index}]`} type="hidden" data={record.productVariantId} form={this.form} />
              <this.InputText name={`productName[${index}]`} type="hidden" data={record.productName} form={this.form} />
              <this.InputText name={`variantName[${index}]`} type="hidden" data={record.variantName} form={this.form} />
              <this.InputNumber name={`transferEntryStatus[${index}]`} className="hidden" data={record.transferEntryStatus} form={this.form} />
            </div>
          );
        }
      },
      {
        title: <this.Translate id="text_product_name" />,
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
        title: <this.Translate id="text_all_quantity" />,
        dataIndex: "allQuantity",
        width: 150,
        align: "center",
        key: "allQuantity",
      },
      {
        title: <this.Translate id="text_stock_on_hand" />,
        dataIndex: "quantityOnHand",
        width: 150,
        align: "center",
        key: "quantityOnHand",
        render: (text, product, index) => {
          const quantityOnHand = this.countQuantityOnHand(product);
          return <div>
            <this.InputNumber name={`quantityOnHand[${index}]`} className="hidden" data={quantityOnHand} form={this.form} />
            {quantityOnHand}
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
            disabled={true}
            form={this.form} />;
        }
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "transferQuantity",
        width: 200,
        key: "transferQuantity",
        align: "right",
        render: (text, product, index) => {
          const quantityOnHand = this.countQuantityOnHand(product);
          return <this.InputNumber
            name={`transferQuantity[${index}]`}
            data={`${product.transferQuantity}`}
            className="text-right"
            compare={{value: quantityOnHand, message: <this.Translate id="text_transfer_qty_warning"/>}}
            isAutoSelect={true}
            isHideTool={true}
            required={true}
            handleKeyUp={(e) => this.handleOnChangeQuantity(e, index)}
            precision={0}
            form={this.form} />;
        }
      },
      {
        title: <this.Translate id="text_action" />,
        key: "action",
        width: 150,
        align: "right",
        render: (text, record, index) => {
          return (
            <this.Button
              type="danger"
              className="btn-icon"
              onClick={() => this.removeRecord(record, index)}>
              <span className="icon-delete icon-padding-right"></span>
            </this.Button>
          );
        }
      }
    ];

    this.removeRecord = this.removeRecord.bind(this);
    this.handleOnChangeQuantity = this.handleOnChangeQuantity.bind(this);
    this.handleOnSelectList = this.handleOnSelectList.bind(this);
    this.handleCancelVariantProduct = this.handleCancelVariantProduct.bind(this);
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
        let allQuantity = 0;
        
        if (transferEntry.productVariant) {
          productName = Util.getProductName(transferEntry.productVariant.product);
          variantName = transferEntry.productVariant.product.productOption === Enum.PRODUCT_VARIANT ? transferEntry.productVariant.name : "";
          allQuantity = transferEntry.productVariant.quantity;
        }

        existingProductList.push({
          transferEntryId: transferEntry.id,
          productName,
          variantName,
          unitId: transferEntry.unitId,
          productVariantId: transferEntry.productVariantId,
          productVariants: [transferEntry.productVariant],// convert it to collection product variant to support with function in util
          allQuantity,
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

    if (this.props.productVariant.fetched) {
      if (this.props.productVariant.list) {
        this.handleOnSelectList(this.state.selectedProduct, [this.props.productVariant.list], false); // SET IT AS ARRAY TO MAKE IT MATCH ALL CONDITION BOTH STANDARD AND VARIANT
      } else {
        this.Message.error(this.CATranslate("error_product_not_found", this.props.locale));
        this.props.form.setFieldsValue({searchProduct: ""});
      }

      this.props.dispatch(ProductVariantAction.reset(ProductVariantConstant.RESET_PRODUCT_VARIANT));
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

  removeRecord(record, index){
    let existingProductList = this.state.productLists;
    if (record.transferEntryId === "") {
      existingProductList.splice(index, 1);
    } else {
      existingProductList[index]["transferEntryStatus"] = this.Enum.ARCHIVE;
    }

    this.setState({
      productLists: existingProductList
    });
  }

  handleCancelVariantProduct() {
    this.setState({modalVariant: null});
  }

  handleOnChangeQuantity(e, index) {
    const existingProductList = this.state.productLists;
    existingProductList[index]["transferQuantity"] = parseInt(e.target.value, 10);
    this.setState({productLists: existingProductList});
  }

  handleOnSelectList(product, productVariant, isRequestVariantForm = true) {
    const productVariantForCalculateQTY = productVariant;
    let isProductVariant = product.productOption === Enum.PRODUCT_VARIANT;
    if (isProductVariant && isRequestVariantForm) {
      this.setState({
        selectedProduct: product,
        modalVariant: <VariantProduct
          product={product}
          handleCancel={this.handleCancelVariantProduct}/>
      });
      return;
    } else if (productVariant && productVariant.length > 0) { // Difference from product variant
      productVariant = productVariant[0]; // ACCESS TO PRODUCT VARIANT DEFAUTL FOR STARTDARD PRODUCT
      productVariant.name = isProductVariant ? productVariant.name : ""; // Remove product variant name away from label table
    }

    const productName = Util.getProductName(product);

    const {quantity} = productVariant;
    const existingProductList = this.state.productLists;
    const initialQuantity = 1;

    if (existingProductList.length === 0) {
      existingProductList.push({
        transferEntryId: "",
        productName,
        unitId: product.defaultUnitId,
        variantName: productVariant.name,
        allQuantity: quantity,
        productVariants: productVariantForCalculateQTY,
        transferQuantity: initialQuantity,
        productVariantId: productVariant.id,
        transferEntryStatus: this.Enum.ACTIVE
      });
    } else {

      let isNotTheSameProduct = true;

      existingProductList.forEach((product, index) => {
        if (product.productVariantId === productVariant.id) {
          if (product.transferEntryStatus === this.Enum.ARCHIVE) {
            existingProductList[index]["transferEntryStatus"] = this.Enum.ACTIVE;
            existingProductList[index]["quantity"] = 1;
          } else {
            existingProductList[index]["quantity"] += 1;
          }

          isNotTheSameProduct = false;
        }
      });

      if (isNotTheSameProduct) {
        existingProductList.push({
          transferEntryId: "",
          productName,
          variantName: productVariant.name,
          unitId: product.defaultUnitId,
          allQuantity: quantity,
          productVariants: productVariantForCalculateQTY,
          productVariantId: productVariant.id,
          transferQuantity: initialQuantity,
          transferEntryStatus: this.Enum.ACTIVE
        });
      }
    }

    this.setState({productLists: existingProductList});
    this.props.form.setFieldsValue({searchProduct: ""});
    document.getElementById("searchProduct").focus();
  }

  render(){
    return(
      <div className="main-dropdown-search">
        <DropDownSearch
          productSearch={this.props.dataSource}
          handleOnSelectList={this.handleOnSelectList}
          dispatch={this.props.dispatch}
          className="ca-input-v1 purchase-order"
          locale={this.props.locale}
          form={this.props.form}/>  
        <this.Table
          rowKey="productVariantId"
          rowClassName={record => record.transferEntryStatus === this.Enum.ACTIVE ? "" : "hidden"}
          dataSource={this.state.productLists}
          loading={this.props.productVariant.fetching}
          columns={this.columns}
          locale={{emptyText: <this.Translate id="placeholder_table_stock_transfer" />}} />
        {this.state.modalVariant}
      </div>
    );
  }   
       
}