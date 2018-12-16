import React from "react";
import Enum from "../../../enums";
import Util from "../../../utils";
import VariantProduct from "../../../../pos/containers/transactions/SaleWalkin/VariantProduct";
import DropDownSearch from "../../../components/products/Product/DropDownSearch";
import ProductVariantAction from "../../../actions/products/productVariant";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";
import PurchaseOrderConstant from "../../../constants/stock/purchaseOrder";
import ProductVariantConstant from "../../../constants/products/productVariant";
import Modal from "../../../../common/components/shares/Modal";
import "./index.css";

export default class SearchPo extends Modal {
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
        width: 50,
        align: "center",
        render: (text, record, index) => {
          return (
            <div>
              { index + 1 }
              <this.InputText name={`purchaseEntryId[${index}]`} type="hidden" data={record.purchaseEntryId} form={this.form} />
              <this.InputText name={`productVariantId[${index}]`} type="hidden" data={record.productVariantId} form={this.form} />
              <this.InputText name={`productName[${index}]`} type="hidden" data={record.productName} form={this.form} />
              <this.InputText name={`variantName[${index}]`} type="hidden" data={record.variantName} form={this.form} />
              <this.InputNumber name={`purchaseEntryStatus[${index}]`} className="hidden" data={record.purchaseEntryStatus} form={this.form} />
              <this.InputNumber name={`totalAmount[${index}]`} className="hidden" data={record.totalPrice} form={this.form} />
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
        title: <this.Translate id="col_stock_purchase_order_on_hand" />,
        dataIndex: "quantityOnHand",
        width: 150,
        align: "center",
        key: "quantityOnHand"
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
            form={this.form} />;
        }
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "requestQuantity",
        width: 150,
        key: "requestQuantity",
        align: "right",
        render: (text, record, index) => {
          return <this.InputNumber
            name={`purchaseQty[${index}]`}
            data={`${record.quantity}`}
            className="text-right"
            isAutoSelect={true}
            isHideTool={true}
            required={true}
            precision={0}
            handleKeyUp={(e) => this.handleOnChangeQuantity(e, index)}
            form={this.form}
          />;
        }
      },
      {
        title: <this.Translate id="text_price" />,  
        dataIndex: "price",
        width: 150,
        key: "price",
        align: "right",
        render: (text, record, index) => {
          return <this.InputNumber
            name={`purchasePrice[${index}]`}
            data={`${record.price}`}
            className="text-right"
            isAutoSelect={true}
            isHideTool={true}
            required={true}
            errorRequired={<this.Translate id="error_price_require"/>}
            handleKeyUp={(e) => this.handleOnChangePrice(e, index)}
            form={this.form} />;
        }
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 150,
        align: "right",
        render: (text, record, index) => {
          return <div>
            <this.InputText
              name={`totalPrice[${index}]`}
              className="totalPrice text-right"
              data={this.formatCurrency(record.totalPrice)}
              disabled={true}
              form={this.form} />
            <this.InputText name={`totalPriceValue[${index}]`} data={`${record.totalPrice}`} className="hidden"form={this.form} />
          </div>;
        }
      },
      {
        title: "Action",
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
    this.handleOnSelectList = this.handleOnSelectList.bind(this);
    this.handleOnChangeQuantity = this.handleOnChangeQuantity.bind(this);
    this.handleOnChangePrice = this.handleOnChangePrice.bind(this);
    this.handleCancelVariantProduct = this.handleCancelVariantProduct.bind(this);
    this.calculateTotalAmountEachRow = this.calculateTotalAmountEachRow.bind(this);
    this.grandTotal = this.grandTotal.bind(this);
  }

  componentDidMount() {
    this.setState({units: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.UNIT))});
  }

  componentDidUpdate(){
    const {purchaseOrderEntries} = this.props;
    if (purchaseOrderEntries.length > 0 && this.state.isNotYetLoadComponentDidUpdated) {
      const existingProductList = this.state.productLists;
      
      purchaseOrderEntries.forEach(purchaseOrderEntry => {
        let productName = "";
        let variantName = "";
        let quantityOnHand = 0;
        
        if (purchaseOrderEntry.productVariant) {
          productName = Util.getProductName(purchaseOrderEntry.productVariant.product);
          variantName = purchaseOrderEntry.productVariant.product.productOption === Enum.PRODUCT_VARIANT ? purchaseOrderEntry.productVariant.name : "";
          quantityOnHand = purchaseOrderEntry.productVariant.quantity;
        }

        existingProductList.push({
          purchaseEntryId: purchaseOrderEntry.id,
          productName,
          variantName,
          unitId: purchaseOrderEntry.unitId,
          productVariantId: purchaseOrderEntry.productVariantId,
          quantityOnHand,
          quantity: purchaseOrderEntry.requestQuantity, 
          price: purchaseOrderEntry.price,
          totalPrice: purchaseOrderEntry.requestQuantity * purchaseOrderEntry.price,
          purchaseEntryStatus: purchaseOrderEntry.status
        }); 
      }); 
      
      this.setState({
        productLists: existingProductList,
        isNotYetLoadComponentDidUpdated: false
      });

      this.grandTotal(existingProductList);

      this.props.dispatch(PurchaseOrderAction.reset(PurchaseOrderConstant.RESET_REQUEST_PURCHASE_ORDER));
    }

    if (this.props.productVariant.fetched) {
      this.handleOnSelectList(this.state.selectedProduct, [this.props.productVariant.list], false); // SET IT AS ARRAY TO MAKE IT MATCH ALL CONDITION BOTH STANDARD AND VARIANT
      this.props.dispatch(ProductVariantAction.reset(ProductVariantConstant.RESET_PRODUCT_VARIANT));
    }
  }

  calculateTotalAmountEachRow(e, index) {
    const quantity = this.props.form.getFieldValue(`purchaseQty[${index}]`);
    const price = this.props.form.getFieldValue(`purchasePrice[${index}]`);
    return quantity * price;
  }

  grandTotal(productList) {
    let grandTotal = 0;
    productList.forEach((product, index) => {
      if (product.purchaseEntryStatus === this.Enum.ACTIVE) {
        grandTotal += (product.quantity * product.price);
      }
    });
    this.props.form.setFieldsValue({requestTotal: this.formatCurrency(grandTotal)});
    this.props.form.setFieldsValue({requestTotalValue: `${grandTotal}`});
  }

  removeRecord(record, index){
    let existingProductList = this.state.productLists;
    if (record.purchaseEntryId === "") {
      existingProductList.splice(index, 1);
    } else {
      existingProductList[index]["purchaseEntryStatus"] = this.Enum.ARCHIVE;
    }

    this.setState({
      productLists: existingProductList
    });
    
    this.grandTotal(existingProductList);
  }

  handleCancelVariantProduct() {
    this.setState({modalVariant: null});
  }

  handleOnChangeQuantity(e, index) {
    const existingProductList = this.state.productLists;
    existingProductList.forEach((product, productIndex) => {
      if (productIndex === index) {
        existingProductList[productIndex]["quantity"] = e.target.value;
      }
    });
    this.props.form.setFieldsValue({[`totalPrice[${index}]`]: this.formatCurrency(this.calculateTotalAmountEachRow(e, index))});

    this.setState({productLists: existingProductList});
    this.grandTotal(existingProductList);
  }

  handleOnChangePrice(e, index) {
    const existingProductList = this.state.productLists;
    existingProductList.forEach((product, productIndex) => {
      if (productIndex === index) {
        existingProductList[productIndex]["price"] = e.target.value;
      }
    });
    this.props.form.setFieldsValue({[`totalPrice[${index}]`]: this.formatCurrency(this.calculateTotalAmountEachRow(e, index))});

    this.setState({productLists: existingProductList});
    this.grandTotal(existingProductList);
  }

  handleOnSelectList(product, productVariant, isRequestVariantForm = true) {
    let isProductVariant = product.productOption === Enum.PRODUCT_VARIANT;
    if (isProductVariant && isRequestVariantForm) {
      this.setState({
        selectedProduct: product,
        modalVariant: <VariantProduct
          dataSource={product}
          productId={product.id}
          handleCancel={this.handleCancelVariantProduct}/>
      });
      return;
    } else if (productVariant && productVariant.length > 0) {
      productVariant = productVariant[0]; // ACCESS TO PRODUCT VARIANT DEFAUTL FOR STARTDARD PRODUCT
      productVariant.name = isProductVariant ? productVariant.name : ""; // Remove product variant name away from label table
    }

    const productName = Util.getProductName(product);

    const {quantity} = productVariant;
    const existingProductList = this.state.productLists;
    const initialQuantity = 1;

    if (existingProductList.length === 0) {
      existingProductList.push({
        purchaseEntryId: "",
        productName,
        unitId: product.defaultUnitId,
        variantName: productVariant.name,
        quantityOnHand: quantity,
        quantity: initialQuantity,
        price: 0,
        productVariantId: productVariant.id,
        totalPrice: 0,
        purchaseEntryStatus: this.Enum.ACTIVE
      });
    } else {

      let isNotTheSameProduct = true;

      existingProductList.forEach((product, index) => {
        if (product.productVariantId === productVariant.id) {
          isNotTheSameProduct = false;
          existingProductList[index]["quantity"] += 1;
          existingProductList[index]["totalPrice"] = existingProductList[index]["quantity"] * existingProductList[index]["price"];
        }
      });

      if (isNotTheSameProduct) {
        existingProductList.push({
          purchaseEntryId: "",
          productName,
          variantName: productVariant.name,
          unitId: product.defaultUnitId,
          quantityOnHand: quantity,
          price: 0,
          productVariantId: productVariant.id,
          quantity: initialQuantity,
          totalPrice: 0,
          purchaseEntryStatus: this.Enum.ACTIVE
        });
      }
    }

    this.setState({productLists: existingProductList});

    this.grandTotal(existingProductList);
  }

  render(){
    const {productLists} = this.state; 
    return(
      <div className="main-dropdown-search">
        <DropDownSearch
          productSearch={ this.props.dataSource }
          handleOnSelectList={this.handleOnSelectList}
          dispatch={this.props.dispatch}
          className="ca-input-v1 purchase-order"
          locale={this.props.locale}
          form={this.props.form}/>  
        <this.Table
          rowKey="productVariantId"
          rowClassName={record => record.purchaseEntryStatus === this.Enum.ACTIVE ? "" : "hidden"}
          dataSource={productLists}
          loading={this.props.productVariant.fetching}
          columns={this.columns}
          locale={{emptyText: <this.Translate id="placeholder_table_purchase_order" />}}
          footer={() => <div className={`float-right ${productLists.length > 0 ? "" : "hidden"}`}>
            <div className="total-title text-uppercase pull-left"><this.Translate id="text_total_amount" />: </div>
            <div className="total-value pull-left">
              <this.InputText name="requestTotal" disabled={true} className="ca-input-no-border grandTotal" form={this.props.form}/>
              <this.InputText name="requestTotalValue" className="hidden" form={this.props.form}/>
            </div>
            <div className="pull-left" style={{width: 154}}></div>
            <div style={{clear: "both"}}></div>
          </div>} />
        {this.state.modalVariant}
      </div>
    );
  }   
       
}