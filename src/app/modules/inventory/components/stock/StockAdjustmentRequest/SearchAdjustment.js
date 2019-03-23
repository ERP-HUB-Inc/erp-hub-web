import React from "react";
import Enum from "../../../enums";
import Util from "../../../utils";
import VariantProduct from "../../../../pos/containers/transactions/SaleWalkin/VariantProduct";
import DropDownSearch from "../../../components/products/Product/DropDownSearch";
import ProductVariantAction from "../../../actions/products/productVariant";
import ProductVariantConstant from "../../../constants/products/productVariant";
import Modal from "../../../../common/components/shares/Modal";
import "../PurchaseOrder/index.css";

export default class SearchAdjustmentRequest extends Modal {
  constructor(props){
    super(props);
    this.state = {
      selectedProduct: null,
      units: [],
      productLists: [],
      modalVariant: null,
      locationId: "",
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
              <this.InputText name={`stockAdjustmentRequestId[${index}]`} type="hidden" data={record.stockAdjustmentRequestId} form={this.form} />
              <this.InputText name={`productVariantId[${index}]`} type="hidden"   data={record.productVariantId} form={this.form} />
              <this.InputText name={`productName[${index}]`} type="hidden" data={record.productName} form={this.form} />
              <this.InputText name={`variantName[${index}]`} type="hidden" data={record.variantName} form={this.form} />
              <this.InputNumber name={`stockAdjustmentRequestStatus[${index}]`} className="hidden" data={record.stockAdjustmentRequestStatus} form={this.form} />
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
        title: <this.Translate id="text_current_qty" />,
        dataIndex: "currentQty",
        width: 250,
        align: "center",
        key: "currentQty",
        render: (text, product, index) => {
          const currentQty = this.countCurrentQty(product);
          return <div>
            <this.InputNumber className="hidden" type="hidden" name={`currentQty[${index}]`} precision={0} data={currentQty} form={this.form} />
            {currentQty}  
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
            required={true}
            name={`unitId[${index}]`}
            valueKey="id"
            dataSource={this.state.units}
            defaultValue={record.unitId}
            form={this.form} />;
        }
      },
      {
        title: <this.Translate id="text_adjust" />,
        dataIndex: "adjustQuantity",
        width: 150,
        align: "center",
        key: "adjustQuantity",
        render: (text, record, index) => {
          return <this.InputNumber
            name={`adjustQuantity[${index}]`}
            className="text-right"
            isAutoSelect={true}
            isHideTool={true}
            precision={0}
            data={record.adjustQuantity}
            required={true}
            handleKeyUp={(e) => this.handleOnChangeAdjust(e, index)}
            form={this.form} />;
        }
      },
      {
        title: <this.Translate id="text_difference" />,
        dataIndex: "different",
        width: 150,
        align: "center",
        key: "different",
        render: (text, product, index) => {
          const currentQty =  this.countCurrentQty(product);
          const different = this.calculateDifferent(currentQty,index); 
          return <div>
            <this.InputNumber className="hidden" name={`different[${index}]`} precision={0} data={String(different)} form={this.form} />
            {different}  
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
    this.handleOnChangeAdjust = this.handleOnChangeAdjust.bind(this);
    this.handleCancelVariantProduct = this.handleCancelVariantProduct.bind(this);
  }

  componentDidMount() {
    this.setState({units: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.UNIT))});
  }

  componentDidUpdate(){   
   
    const {stockAdjustmentRequest} = this.props; 
    if (stockAdjustmentRequest.length > 0 && this.state.isNotYetLoadComponentDidUpdated) {
      const existingProductList = this.state.productLists;
      stockAdjustmentRequest.forEach(stockAdjustmentRequest => {
        let productName = "";
        let variantName = "";
        let currentQty = 0;
        
        if (stockAdjustmentRequest.productVariant) {
          productName = Util.getProductName(stockAdjustmentRequest.productVariant.product);
          variantName = stockAdjustmentRequest.productVariant.product.productOption === Enum.PRODUCT_VARIANT ? stockAdjustmentRequest.productVariant.name : "";
          currentQty = stockAdjustmentRequest.currentQuantity;
        }
        if(stockAdjustmentRequest.status !== this.Enum.ARCHIVE){
          existingProductList.push({
            stockAdjustmentRequestId: stockAdjustmentRequest.id,
            productName,
            variantName,
            unitId: stockAdjustmentRequest.unitId,
            productVariantId: stockAdjustmentRequest.productVariantId,
            currentQty,
            productVariants: [stockAdjustmentRequest.productVariant],
            adjustQuantity: stockAdjustmentRequest.adjustQuantity,
            different: stockAdjustmentRequest.adjustQuantity - currentQty,
            stockAdjustmentRequestStatus: this.Enum.ACTIVE
          }); 
        }
       
       
      });
      
      this.setState({
        productLists: existingProductList,
        isNotYetLoadComponentDidUpdated: false
      });
    }

    if (this.props.productVariant.fetched) {
      if (this.props.productVariant.list) {
        this.handleOnSelectList(this.state.selectedProduct, [this.props.productVariant.list], false); // SET IT AS ARRAY TO MAKE IT MATCH ALL CONDITION BOTH STANDARD AND VARIANT
      } else {
        this.Message.error(this.CATranslate("error_product_not_found", this.props.locale));
        this.props.form.setFieldsValue({searchProduct: ""});
        document.getElementById("searchProduct").focus();
      }

      this.props.dispatch(ProductVariantAction.reset(ProductVariantConstant.RESET_PRODUCT_VARIANT));
    }
  }

  countCurrentQty(product) {
    let locationId = "";
    if (this.props.locationId) {
      locationId = this.props.locationId;
    } else {
      locationId = this.Util.getLocationId();
    }  
    return Util.countProductQTYCurrentLocation(product, locationId);
  }

  calculateDifferent(currentValues,index){
    let getCurrent = 0;
    let adjustQuantity = this.props.form.getFieldValue(`adjustQuantity[${index}]`);
    if(currentValues > 0){
      getCurrent = currentValues;
    }
    let different = (adjustQuantity - getCurrent);

    return different;
  }

  handleOnChangeAdjust(e,index){
    let different  = "";
    let getCurrent = 0;
    const existingProductList = this.state.productLists;
    existingProductList.forEach((product, productIndex) => {
      if (productIndex === index) {
        let currentQty = this.props.form.getFieldValue(`currentQty[${index}]`);
        if(currentQty > 0){
          getCurrent = currentQty;
        }
        different = e.target.value - getCurrent;
      }
    });
    this.props.form.setFieldsValue({[`different[${index}]`]: different });
  }

  removeRecord(record, index){
    let existingProductList = this.state.productLists;
    if (record.stockAdjustmentRequestId === "") {
      existingProductList.splice(index, 1);
    } else {
      existingProductList[index]["stockAdjustmentRequestStatus"] = this.Enum.ARCHIVE;
    }

    this.setState({
      productLists: existingProductList
    });    
  }

  handleCancelVariantProduct() {
    this.setState({modalVariant: null});
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
    } else if (productVariant && productVariant.length > 0) {
      productVariant = productVariant[0]; // ACCESS TO PRODUCT VARIANT DEFAUTL FOR STARTDARD PRODUCT
      if(productVariant){
        productVariant.name = isProductVariant ? productVariant.name : ""; // Remove product variant name away from label table
      }
    }

    const productName = Util.getProductName(product);
    const adjustQuantity = 0;
    const {quantity} = productVariant;
    const existingProductList = this.state.productLists;
    if (existingProductList.length === 0) {
      existingProductList.push({
        stockAdjustmentRequestId: "",
        productName,
        unitId: product.defaultUnitId,
        variantName: productVariant.name,
        currentQty: quantity,
        productVariants: productVariantForCalculateQTY,
        different: adjustQuantity - quantity,
        productVariantId: productVariant.id,
        stockAdjustmentRequestStatus: this.Enum.ACTIVE
      });

    } else {
      let isNotTheSameProduct = true;
      existingProductList.forEach((product, index) => {
        if (product.productVariantId === productVariant.id) {
          isNotTheSameProduct = false;
          // set adjustment value
        }
      });

      if (isNotTheSameProduct) {
        existingProductList.push({
          stockAdjustmentRequestId: "",
          productName,
          variantName: productVariant.name,
          currentQty: quantity,
          unitId: product.defaultUnitId,
          productVariants: productVariantForCalculateQTY,
          productVariantId: productVariant.id,
          different: adjustQuantity - quantity,
          stockAdjustmentRequestStatus: this.Enum.ACTIVE
        });
      }
    }
    this.setState({productLists: existingProductList});
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
          rowClassName={record => record.stockAdjustmentRequestStatus === this.Enum.ACTIVE ? "" : "hidden"}
          dataSource={productLists}
          loading={this.props.productVariant.fetching}
          columns={this.columns}
          locale={{emptyText: <this.Translate id="placeholder_table_stock_adjustment" />}}
        />
        {this.state.modalVariant}
      </div>
    );
  }   
       
}