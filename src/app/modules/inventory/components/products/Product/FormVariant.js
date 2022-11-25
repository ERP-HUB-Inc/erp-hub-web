import React from "react";
import { Icon } from "antd";
import _ from "lodash";
import Modal from "../../../../common/components/shares/Modal";
import ProductAction from "../../../actions/products/product";
import Constant from "../../../constants/products/product";
import ProductVariantAction from "../../../actions/products/productVariant";
import ConstantAttribute from "../../../constants/products/variantAttribute";
import VariantAttributeAction from "../../../actions/products/variantAttribute";
import Exchange from "./ExchangeMoneyFunc";

import "./index.css";

export default class FormVariant extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      productVariantToDelete: {
        id: "",
        productVariantRow: null
      },
      productAttributeToDelete: {
        attributeRow: null,
        attributeValueIndex: null
      },
      attributeRowToDelete: 0,
      variantAttributes: [],
      variantAttributeList: [],
      productVariantList: [],
      productVariantArchiveList: [],
      productAttributeArchiveList: [],
      addAttributeRowIndex: 0,
      isNotYetLoadComponentDidUpdated: true,
      variantImageList: [],
    };
    this.columns = [
      {
        title: <this.Translate id="input_product_variant_name" />,
        dataIndex: "name",
        key: "name"
      },
      {
        title: <this.Translate id="text_product_sku" />,
        dataIndex: "sku",
        key: "sku",
        width: 120,
        render: (sku, record, index) => {
          return <this.InputText
            name={`variantProductSku[${index}]`}
            placeholder={this.CATranslate("text_product_sku", this.props.locale)}
            data={sku}
            handleKeyUp={(e) => this.handleOnChangeSKU(e, index)}
            form={this.props.form}/>;
        }
      },
      {
        title: <this.Translate id="text_barcode" />,
        dataIndex: "barcode",
        key: "barcode",
        width: 120,
        render: (barcode, record, index) => {
          return <this.InputText
            name={`variantProductCode[${index}]`}
            placeholder={this.CATranslate("text_barcode", this.props.locale)}
            data={barcode}
            disabled={record.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.AUTO}
            handleKeyUp={(e) => this.handleOnChangeBarcode(e, index)}
            form={this.props.form}/>;
        }
      },
      {
        title: <this.Translate id="text_retial_price" />,
        dataIndex: "price",
        key: "price",
        align: "right",
        width: 120,
        render: (price, record, index) => {
          return <this.InputNumber
            name={`variantProductPrice[${index}]`}
            className="text-right"
            isAutoSelect={true}
            isHideTool={true}
            errorRequired={<this.Translate id="error_require_price" />}
            data={price}
            precision={this.props.getPrecisionByCurrency()}
            handleKeyUp={(e) => this.handleOnChangePrice(e, index)}
            form={this.props.form} />;
        }
      },
      {
        title: <this.Translate id="text_whole_price" />,
        dataIndex: "wholePrice",
        key: "wholePrice",
        align: "right",
        width: 120,
        render: (wholePrice, record, index) => {
          return <this.InputNumber
            name={`variantProductWholePrice[${index}]`}
            className="text-right"
            isAutoSelect={true}
            isHideTool={true}
            errorRequired={<this.Translate id="error_require_price" />}
            data={wholePrice}
            precision={this.props.getPrecisionByCurrency()}
            handleKeyUp={(e) => this.handleOnChangePrice(e, index, "wholePrice")}
            form={this.props.form}/>;
        }
      },
      {
        title: <this.Translate id="text_distribute_price" />,
        dataIndex: "distributePrice",
        key: "distributePrice",
        align: "right",
        width: 150,
        render: (distributePrice, record, index) => {
          return <this.InputNumber
            name={`variantProductDistributePrice[${index}]`}
            className="text-right"
            isAutoSelect={true}
            isHideTool={true}
            errorRequired={<this.Translate id="error_require_price" />}
            data={distributePrice}
            precision={this.props.getPrecisionByCurrency()}
            handleKeyUp={(e) => this.handleOnChangePrice(e, index, "distributePrice")}
            form={this.props.form} />;
        }
      },
      {
        title: <this.Translate id="text_photo" />,
        dataIndex: "image",
        key: "image",
        align: "center",
        render: (variantImage, record, index) => {
          const image = {
            uid: index,
            name: variantImage,
            status: "done",
            url: this.Util.getProductImage(record.image).url
          };
          
          const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
          
          return <this.UploadImg
            customerButtonUpload={uploadButton}
            className="variantImage .ant-upload.ant-upload-select-picture-card main-upload .ant-upload-list-picture-card .ant-upload-list-item "
            name={`image${index}`}  
            data={{file: image}}
            fileList={[image]}
            showPlusIcon={true}
            endPoint={`${this.Util.getAPIURL()}/file/v1/upload/product`}
            endPointDelete={`${this.Util.getAPIURL()}/file/v1/product/delete`}
            varianrIndex={index}
            accessToken={this.Util.getAccessToken()}
            responseAfterUpload={data => this.responseAfterUpload(data,index)}
            form={this.props.form}/>;
        }
      },
      {
        title: <this.Translate id="text_action" />,
        dataIndex: "action",
        key: "action",
        align: "center",
        width: 100,
        render: (text, record, index) => {
          return <div className="wrap-variant-action">
            <this.Switchs
              name={`variantProductStatus[${index}]`}
              checked={record.status}
              onChange={(checked) => this.handleChangeProductVariantStatus(checked, index, record.quantity)}
              form={this.props.form} />
            <this.Button
              loading={index === this.state.productVariantToDelete.productVariantRow && this.props.productVariantCheckStatus.fetching}
              type="danger"
              className="delete-variant-item"
              onClick={() => this.handleRemoveProductVariant(index, record.id)}>
              <span className="icon-delete" style={{fontSize: "15pt"}}></span>
            </this.Button>
          </div>;
        }
      }
    ];
    this.confirmTextAction = <this.Translate id="text_delete_confirm_variant_product" />;
    this.confirmTitle = <this.Translate id="delete_variant_warning" />;
    this.handleOnChangeAttribute = this.handleOnChangeAttribute.bind(this);
    this.handleOnChangePrice = this.handleOnChangePrice.bind(this);
    this.actionConfirmResponseMsg = <this.Translate id="text_not_allow_to_delete_product_has_quantity" />;
    this.handleKeyDownAttributeValue = this.handleKeyDownAttributeValue.bind(this);
    this.handleOnRemoveLozengeItem = this.handleOnRemoveLozengeItem.bind(this);
    this.handleAddProductAttribute = this.handleAddProductAttribute.bind(this);
    this.handleAddProductVariant = this.handleAddProductVariant.bind(this);
    this.handleRemoveProductVariant = this.handleRemoveProductVariant.bind(this);
    this.handleCallBackAddAttribute = this.handleCallBackAddAttribute.bind(this);
    this.handleDeleteProductAttribute = this.handleDeleteProductAttribute.bind(this);
    this.handleFocusOnAttributeValue = this.handleFocusOnAttributeValue.bind(this);
    this.handleOnFocusOutAttributeValue = this.handleOnFocusOutAttributeValue.bind(this);
    this.handleChangeProductVariantStatus = this.handleChangeProductVariantStatus.bind(this);
    this.syncInputTableWithProductVariant = this.syncInputTableWithProductVariant.bind(this);
  }

  responseAfterUpload = (response,index) => {
    const productVariantList = this.state.productVariantList;
    const variantImageList = this.state.variantImageList;
    let image = null;
    if (response.data === "success") image = null;
    else image = response.data.originalname;
    variantImageList.push(image);
    productVariantList[index]["image"] = image;
    this.setState({productVariantList,variantImageList});
  }

  componentWillUpdate(nextProps) {
    const {
      productVariantCheckStatus,
      productAttributeCheckStatus,
      productAttributeValueCheckStatus
    } = nextProps;

    // PRODUCT VARIANT
    if (productVariantCheckStatus.fetched) {
      const {productVariantRow} = this.state.productVariantToDelete;
      this.deleteVariantThatExistInSystem(productVariantRow);
      this.props.dispatch(ProductVariantAction.reset());
      this.setState({modalVisible: false});
    } else if (productVariantCheckStatus["error"]) {
      this.Message.warning(this.CATranslate("delete_product_variant_warning", this.props.locale));
      this.props.dispatch(ProductVariantAction.reset());
    }

    // PRODUCT ATTRIBUTE VALUE
    if (productAttributeValueCheckStatus.fetched) {
      // TO DO: Remove data from front end
      const productAttributeValue = productAttributeValueCheckStatus.list;
      const productAttributeValueId = productAttributeValue ? productAttributeValue.id : "";
      let productVariantList = this.state.productVariantList;
      const productVariantArchiveList = this.state.productVariantArchiveList;
      const variantAttributeList = this.state.variantAttributeList;

      const {attributeRow, attributeValueIndex} = this.state.productAttributeToDelete;
      variantAttributeList[attributeRow]["attributeValues"][attributeValueIndex]["status"] = this.Enum.ARCHIVE;
      const tempProductVariant = []; // USE FOR RELOAD BACK WHEN DELETE ATTRIBUTE VALUE AT INDEX 0
      const productVariantToDelete = [];

      for (var i = 0; i < productVariantList.length; i++) {
        let isArchive = false;
        if (productVariantList[i]["productAttributeValueId"] && productVariantList[i]["productAttributeValueId"].includes(productAttributeValueId)) {
          isArchive = true;
        } else if (productVariantList[i]["tempPVId"] && productVariantList[i]["tempPVId"].includes(productAttributeValueId)) {
          isArchive = true;
        }
        
        if (isArchive) {
          productVariantList[i]["status"] = this.Enum.ARCHIVE;
          productVariantArchiveList.push(this.Util.copyObj(productVariantList[i]));

          // REMOVE PRODUCT ATTRIBUTE VALUE FROM COLUMN IN PRODUCT VARIANT
          productVariantList[i]["productAttributeValueId"] = productVariantList[i]["productAttributeValueId"].includes(`${productAttributeValueId},`) ? productVariantList[i]["productAttributeValueId"].replace(`${productAttributeValueId},`, "") : productVariantList[i]["productAttributeValueId"].replace(`,${productAttributeValueId}`, "");
          tempProductVariant.push(productVariantList[i]);
          productVariantToDelete.push(i);
        }
      }


      // DELETE PRODUCT VARIANT
      for (var j = productVariantToDelete.length - 1; j >= 0; j--) {
        productVariantList.splice(productVariantToDelete[j], 1);
      }

      if (this.countProductVariant(productVariantList) === 0) {
        const newProductVariantList = this.generateProductVariant(
          this.variantAttributeListForGenerateVariantV2(variantAttributeList),
          attributeRow,
          false
        );
        
        if (newProductVariantList.length === tempProductVariant.length) {
          newProductVariantList.forEach((productVariant, productVariantIndex) => {
            tempProductVariant[productVariantIndex]["name"] = productVariant.name;
            tempProductVariant[productVariantIndex]["status"] = this.Enum.ACTIVE;
            
            // REMOVE PRODUCT VARIANT ACTIVE FROM ARCHIVE LIST
            productVariantArchiveList.forEach((productVariantArchive, productVariantArchiveIndex) => {
              if (productVariantArchive.status === this.Enum.ACTIVE) {
                productVariantArchiveList.splice(productVariantArchiveIndex, 1);
              }
            });
          });

          productVariantList = tempProductVariant;
        }
      }

      this.setState({
        variantAttributeList,
        productVariantList
      });

      this.syncInputTableWithProductVariant();

      this.props.dispatch(ProductVariantAction.reset());

      if (this.props.callBackGetProductVariant) {
        this.props.callBackGetProductVariant(productVariantList);
      }

    } else if (productAttributeCheckStatus["error"]) {
      this.Message.warning(this.CATranslate("delete_attribute_warning", this.props.locale));
      this.props.dispatch(ProductVariantAction.reset());
    }

    // PRODUCT ATTRIBUTE
    if (productAttributeCheckStatus.fetched) {
      // TO DO: Remove data from front end
      const productAttributeId = productAttributeCheckStatus.list ? productAttributeCheckStatus.list.id : "";
      const archiveAttribute = this.state.variantAttributeList.find(value => value.id === productAttributeId);
      let productVariantList = this.state.productVariantList;
      const variantAttributeList = this.state.variantAttributeList;
      const productAttributeArchiveList = this.state.productAttributeArchiveList;
      const productVariantArchiveList = this.state.productVariantArchiveList;
      const {attributeRow} = this.state.productAttributeToDelete;

      // START CHECK ARCHIVE ATTRIBUTE
      if (archiveAttribute) {

        archiveAttribute.status = this.Enum.ARCHIVE; // when change value here it will affect to variantAttributeList at index: (pointer reference)
        
        // START LOOP
        archiveAttribute["attributeValues"].forEach((attributeValue, attributeValueIndex) => {

          archiveAttribute["attributeValues"][attributeValueIndex]["status"] = this.Enum.ARCHIVE;
          const tempProductVariant = []; // USE FOR RELOAD BACK WHEN DELETE ATTRIBUTE VALUE AT INDEX 0
          const productVariantToDelete = [];

          this.state.productVariantList.forEach((productVariant, productVariantIndex) => {
            let isArchive = false;
            // We check two condition like this bcus sometimes product mix attribute value that has just new created with existing in system
            if (productVariant["productAttributeValueId"] && productVariant["productAttributeValueId"].includes(attributeValue.id)) {
              isArchive = true;
            } else if (productVariant["tempPVId"] && productVariant["tempPVId"].includes(attributeValue.id)) {
              isArchive = true;
            }

            if (isArchive) {
              this.state.productVariantList[productVariantIndex]["status"] = this.Enum.ARCHIVE; // Only just change here it will affect to product variant collection
              productVariantArchiveList.push(productVariant);

              productVariant["productAttributeValueId"] = productVariant["productAttributeValueId"].includes(`${attributeValue.id},`) ? productVariant["productAttributeValueId"].replace(`${attributeValue.id},`, "") : productVariant["productAttributeValueId"].replace(`,${attributeValue.id}`, "");
              tempProductVariant.push(productVariant);
              productVariantToDelete.push(productVariantIndex);
            }
          });

          // REMOVE PRODUCT VARIANT FRO THE COLLECTION
          for (var j = productVariantToDelete.length - 1; j >= 0; j--) {
            this.state.productVariantList.splice(productVariantToDelete[j], 1);
          }

          // CHECK IF PRODUCT VARIANT HAS ALL REMOVE FROM THE COLLECTION, SO WE NEED TO RESET DATA BACK
          if (this.countProductVariant(this.state.productVariantList) === 0) {

            const newProductVariantList = this.generateProductVariant(
              this.variantAttributeListForGenerateVariantV2(this.state.variantAttributeList),
              attributeRow,
              false
            );

            if (newProductVariantList.length === tempProductVariant.length) {
              // START LOOP
              newProductVariantList.forEach((productVariant, productVariantIndex) => {
                tempProductVariant[productVariantIndex]["name"] = productVariant.name;
                tempProductVariant[productVariantIndex]["status"] = this.Enum.ACTIVE;
                
                // REMOVE PRODUCT VARIANT ACTIVE FROM ARCHIVE LIST
                productVariantArchiveList.forEach((productVariantArchive, productVariantArchiveIndex) => {
                  if (productVariantArchive.status === this.Enum.ACTIVE) {
                    productVariantArchiveList.splice(productVariantArchiveIndex, 1);
                  }
                });
              });
              // END LOOP
              
              // RESET BACK TO PRODUCT VARIANT
              if (tempProductVariant.length > 0) {
                productVariantList = tempProductVariant;
              } 
            }
          }
          // END CONDITION

        });
        // END LOOP

        // BACK UP ATTRIBUTE ARCHIVE LIST FOR PRI
        productAttributeArchiveList.push(archiveAttribute);

        // DELETE ATTRIBUTE ARCHIVE AWAY FROM THE LIST
        variantAttributeList.splice(attributeRow, 1);
      }
      // END CHECK ARCHIVE ATTRIBUTE

      // WHEN WE REMOVE OUT OF PRODUCT VARIANT WE NEED RELOAD BACK FROM THE FIRST PRODUCT VARIANT: (tempProductVariant)
      if (this.state.productVariantList.length === 0) {
        this.setState({
          productVariantList
        });
      }

      this.props.dispatch(ProductVariantAction.reset());

      if (this.props.callBackGetProductVariant) {
        this.props.callBackGetProductVariant(productVariantList);
      }

    } else if (productAttributeValueCheckStatus["error"]) {
      this.Message.warning(this.CATranslate("delete_attribute_value_warning", this.props.locale));
      this.props.dispatch(ProductVariantAction.reset());
    }

    if (nextProps.variantAttributeAdd.added) {
      this.setState({variantAttributes: [nextProps.variantAttributeAdd.response.data, ...this.state.variantAttributes]});
    }

  }

  componentDidUpdate() {
    let {
      productAttributes,
      dispatch,
      variantAttributeAdd
    } = this.props;
    const productVariants = this.Util.copyArrayObj(this.props.productVariants);

    if (productVariants && productAttributes &&  this.state.isNotYetLoadComponentDidUpdated && this.props.exchangeRate) {
      if (this.props.exchangeRate !== 1){
        productVariants.map( (variant) => {
          variant.price           = Number(Exchange.dollarToRiel(variant.price, this.props.exchangeRate).toFixed());
          variant.distributePrice = Number(Exchange.dollarToRiel(variant.distributePrice, this.props.exchangeRate).toFixed());
          variant.wholePrice      = Number(Exchange.dollarToRiel(variant.wholePrice, this.props.exchangeRate).toFixed());
          return variant;
        });
      }
      productAttributes = _.sortBy(productAttributes, ["createdAt"]);
      this.setState({
        variantAttributeList: productAttributes,
        productVariantList: productVariants,
        isNotYetLoadComponentDidUpdated: false
      });

      if (this.props.callBackGetProductVariant) {
        this.props.callBackGetProductVariant(productVariants);
      }

      if (this.props.callBackGetProductAttribute) {
        this.props.callBackGetProductAttribute(productAttributes);
      }

      if (this.props.handleCallBackGetArchiveProductVariant) {
        this.props.handleCallBackGetArchiveProductVariant(this.state.productVariantArchiveList);
      }

      if (this.props.handleCallBackGetArchiveProductAttributes) {
        this.props.handleCallBackGetArchiveProductAttributes(this.state.productAttributeArchiveList);
      }
    }

    if (variantAttributeAdd.added) {
      const variantAttributeList = this.state.variantAttributeList;
      if (this.state.addAttributeRowIndex > variantAttributeList.length - 1) {
        variantAttributeList.push(variantAttributeAdd.response.data.id);
      } else {
        variantAttributeList[this.state.addAttributeRowIndex]["attributeId"] = variantAttributeAdd.response.data.id;
      }

      this.setState({variantAttributeList});

      this.props.form.setFieldsValue({[`attributeId[${this.state.addAttributeRowIndex}]`]: variantAttributeAdd.response.data.id});
      
      dispatch(VariantAttributeAction.reset());
      document.getElementById(`lozenge-item${this.state.addAttributeRowIndex}`).focus();
    }

    if (this.props.switchAutoGenerateSKU.switched) {
      const productVariantList = this.state.productVariantList;
      const isAutoGenerateBarcode = this.props.switchAutoGenerateSKU.value;
      productVariantList.forEach((productVariant, index) => {
        productVariantList[index]["isAutoGenerateBarcode"] = isAutoGenerateBarcode;
      });
      this.setState({productVariantList});
      this.props.dispatch(ProductAction.reset(Constant.RESET_SWITCH_TYPE_OF_GENERATE_SKU));
    }

    if (this.props.variantAttributes.fetched) {
      this.setState({variantAttributes: this.props.variantAttributes.list});
      this.props.dispatch(VariantAttributeAction.reset(ConstantAttribute.RESET_REQUEST_VARIANT_ATTRIBUTE));
    }
  }

  componentDidMount() {
    this.props.dispatch(VariantAttributeAction.fetch(100));
  }

  handleChangeProductVariantStatus(checked, productVariantRow, quantity) {
    if (!checked) {
      if (quantity > 0) {
        this.Message.warning(this.CATranslate("deactive_product_variant_warning", this.props.locale));
      } else {
        this.state.productVariantList[productVariantRow]["status"] = this.Enum.DEACTIVE;
      }
    } else {
      this.state.productVariantList[productVariantRow]["status"] = this.Enum.ACTIVE;
    }
  }

  handleOnChangePrice(event, index, fieldName = "price") {
    const productVariantList = this.state.productVariantList;
    productVariantList[index][fieldName] = parseFloat(event.target.value);
    this.setState({productVariantList});
  }

  handleOnChangeBarcode(event, index) {
    const productVariantList = this.state.productVariantList;
    productVariantList[index]["barcode"] = event.target.value;
  }

  handleOnChangeSKU(event, index) {
    const productVariantList = this.state.productVariantList;
    productVariantList[index]["sku"] = event.target.value;
  }

  syncInputTableWithProductVariant() {
    this.state.productVariantList.forEach((productVariant, index) => {
      if (productVariant.status === this.Enum.ACTIVE) {
        this.props.form.setFieldsValue({[`variantProductCode[${index}]`]: productVariant.barcode});
        this.props.form.setFieldsValue({[`variantProductPrice[${index}]`]: productVariant.price});
        this.props.form.setFieldsValue({[`variantProductWholePrice[${index}]`]: productVariant.wholePrice});
        this.props.form.setFieldsValue({ [`variantProductDistributePrice[${index}]`]: productVariant.distributePrice });
      }
    });
  }

  countProductVariant(productVariantList) {
    let count = 0;
    productVariantList.forEach(productVariant => {
      if (productVariant.status === this.Enum.ACTIVE) {
        count++;
      }
    });
    return count;
  }

  countProductAttribute(productAttributes) {
    let count = 0;
    productAttributes.forEach(productAttribute => {
      if (productAttribute.status === this.Enum.ACTIVE) {
        count++;
      }
    });
    return count;
  }

  countAttributeValues(attributeValues) {
    let count = 0;
    attributeValues.forEach(attributeValue => {
      if (attributeValue.status === this.Enum.ACTIVE) {
        count++;
      }
    });
    return count;
  }

  countProductVariantThatHasId(productVariantList) {
    let count = 0;
    productVariantList.forEach(productVariant => {
      if (productVariant.id) {
        count++;
      }
    });
    return count;
  }

  variantAttributeListForGenerateVariant(variantAttributeList, attributeIndex) {
    let variantAttributeListForGenerateVariant = this.Util.copyArrayObj(variantAttributeList); // To avoid pass by reference
    const indexValueToDelete = [];

    variantAttributeListForGenerateVariant[attributeIndex]["attributeValues"].forEach((attrValue, attrIndex) => {
      if (attrValue.status === this.Enum.ARCHIVE) {
        indexValueToDelete.push(attrIndex);
      }
    });

    for (var j = indexValueToDelete.length -1; j >= 0; j--) {
      variantAttributeListForGenerateVariant[attributeIndex]["attributeValues"].splice(indexValueToDelete[j], 1); 
    }

    return variantAttributeListForGenerateVariant;
  }

  variantAttributeListForGenerateVariantV2(variantAttributeList) {
    const newVariantAttributeList = [];
    let variantAttributeListForGenerateVariant = this.Util.copyArrayObj(variantAttributeList); // To avoid pass by reference

    variantAttributeListForGenerateVariant.forEach(variantAttribute=> {
      const indexValueToDelete = [];

      variantAttribute["attributeValues"].forEach((attrValue, attrIndex) => {
        if (attrValue.status === this.Enum.ARCHIVE) {
          indexValueToDelete.push(attrIndex);
        }
      });

      for (var j = indexValueToDelete.length -1; j >= 0; j--) {
        variantAttribute["attributeValues"].splice(indexValueToDelete[j], 1); 
      }

      newVariantAttributeList.push(variantAttribute);
    });

    return newVariantAttributeList;
  }

  createTempValueForVariant() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  productVariantDataField(name) {
    return {
      id: "",
      name,
      price: this.props.form.getFieldValue("price") ? this.props.form.getFieldValue("price") : 0,
      wholePrice: this.props.form.getFieldValue("wholePrice") ? this.props.form.getFieldValue("wholePrice") : 0,
      distributePrice: this.props.form.getFieldValue("distributePrice") ? this.props.form.getFieldValue("distributePrice") : 0,
      isAutoGenerateBarcode: this.props.form.getFieldValue("isAutoGenerateBarcode"),
      barcode: ""
    };
  }

  generateProductVariant(collection, index, isNotDeleteRequest = true) {
    let existingProductVariantList = this.state.productVariantList;
    let productVariantList = [];
    let isUpdateProduct = this.props.formData.id && isNotDeleteRequest;
    const initialStartLoop = [0, 0, 0];

    if (collection.length > 0) {
      if (isUpdateProduct && collection[index]) {
        initialStartLoop[index] = collection[index]["attributeValues"].length - 1;
      }

      let name = "";

      // LOOP 1
      const lengthi1 = collection[0].attributeValues.length;
      if ( // CASE1 1: 1: 1
        collection.length === 3 &&
        lengthi1 > 0 &&
        collection[1].attributeValues.length > 0 &&
        collection[2].attributeValues.length > 0
      ) {
        for (let i1 = initialStartLoop[0]; i1 < lengthi1; i1++) {
          const value1 = collection[0].attributeValues[i1];

          // LOOP 2
          const lengthi2 = collection[1].attributeValues.length;
  
          for (let i2 = initialStartLoop[1]; i2 < lengthi2; i2++) {
            const value2 = collection[1].attributeValues[i2];
  
            // LOOP 3
            const lengthi3 = collection[2].attributeValues.length;
            for (let i3 = initialStartLoop[2]; i3 < lengthi3; i3++) {
              const value3 = collection[2].attributeValues[i3];
              name = `${value1.name} / ${value2.name} / ${value3.name}`;
  
              productVariantList.push(this.appendProductVariant({
                ...this.productVariantDataField(name),
                temp: [
                  value1.tempPAVId ? value1.tempPAVId : value1.id,
                  value2.tempPAVId ? value2.tempPAVId : value2.id,
                  value3.tempPAVId ? value3.tempPAVId : value3.id
                ],
                sortField1: i3,
                sortField2: i2
              }));
            }
          }
          // END LOOP 2
        }
        // END LOOP 1
      } else if ( // CASE2 1 : 0 : 1
        collection.length === 3 &&
        lengthi1 > 0 &&
        collection[1].attributeValues.length === 0 &&
        collection[2].attributeValues.length > 0
      ) {
        for (let i1 = initialStartLoop[0]; i1 < lengthi1; i1++) {
          const value1 = collection[0].attributeValues[i1];
  
          // LOOP 3
          const lengthi3 = collection[2].attributeValues.length;
          for (let i3 = initialStartLoop[2]; i3 < lengthi3; i3++) {
            const value3 = collection[2].attributeValues[i3];
            name = `${value1.name} / ${value3.name}`;
  
            productVariantList.push(this.appendProductVariant({
              ...this.productVariantDataField(name),
              temp: [
                value1.tempPAVId ? value1.tempPAVId : value1.id,
                value3.tempPAVId ? value3.tempPAVId : value3.id
              ],
              sortField1: i3,
              sortField2: i1
            }));
          }
        }
        // END LOOP 1
      } else if ( // CASE3 0 : 1 : 1
        collection.length === 3 &&
        collection[1].attributeValues.length > 0 &&
        collection[2].attributeValues.length > 0
      ) {
        // LOOP 2
        const lengthi2 = collection[1].attributeValues.length;
        for (let i2 = initialStartLoop[1]; i2 < lengthi2; i2++) {
          const value2 = collection[1].attributeValues[i2];
          // LOOP 3
          const lengthi3 = collection[2].attributeValues.length;
          for (let i3 = initialStartLoop[2]; i3 < lengthi3; i3++) {
            const value3 = collection[2].attributeValues[i3];
            name = `${value2.name} / ${value3.name}`;
  
            productVariantList.push(this.appendProductVariant({
              ...this.productVariantDataField(name),
              temp: [
                value2.tempPAVId ? value2.tempPAVId : value2.id,
                value3.tempPAVId ? value3.tempPAVId : value3.id
              ],
              sortField1: i3,
              sortField2: i2
            }));
          }
        }
      } else if ( // CASE4 0 : 1
        collection.length === 2 &&
        collection[0].attributeValues.length === 0 &&
        collection[1].attributeValues.length > 0
      ) {
        // LOOP 2
        const lengthi2 = collection[1].attributeValues.length;
        for (let i2 = initialStartLoop[1]; i2 < lengthi2; i2++) {
          const value2 = collection[1].attributeValues[i2];
          name = `${value2.name}`;
          productVariantList.push(this.appendProductVariant({
            ...this.productVariantDataField(name),
            temp: [
              value2.tempPAVId ? value2.tempPAVId : value2.id
            ]
          }));
        }
      } else if ( // CASE5 0 : 0 : 1
        collection.length === 3 &&
        collection[2].attributeValues.length > 0
      ) {

        // LOOP 3
        const lengthi3 = collection[2].attributeValues.length;
        for (let i3 = initialStartLoop[2]; i3 < lengthi3; i3++) {
          const value3 = collection[2].attributeValues[i3];
          name = `${value3.name}`;

          productVariantList.push(this.appendProductVariant({
            ...this.productVariantDataField(name),
            temp: [
              value3.tempPAVId ? value3.tempPAVId : value3.id
            ]
          }));
        }
      } else { 
        for (let i1 = initialStartLoop[0]; i1 < lengthi1; i1++) {
          const value1 = collection[0].attributeValues[i1];
          name = `${value1.name}`;
  
          // LOOP 2
          if (collection.length > 1 && collection[1].attributeValues.length > 0) {
            const lengthi2 = collection[1].attributeValues.length;
  
            for (let i2 = initialStartLoop[1]; i2 < lengthi2; i2++) {
              const value2 = collection[1].attributeValues[i2];
              name = `${value1.name} / ${value2.name}`;
  
              // LOOP 3
              if (collection.length > 2 && collection[2].attributeValues.length > 0) {
                const lengthi3 = collection[2].attributeValues.length;
                for (let i3 = initialStartLoop[2]; i3 < lengthi3; i3++) {
                  const value3 = collection[2].attributeValues[i3];
                  name = `${value1.name} / ${value2.name} / ${value3.name}`;
                  productVariantList.push(this.appendProductVariant({
                    ...this.productVariantDataField(name),
                    temp: [
                      value1.tempPAVId ? value1.tempPAVId : value1.id,
                      value2.tempPAVId ? value2.tempPAVId : value2.id,
                      value3.tempPAVId ? value3.tempPAVId : value3.id
                    ],
                    sortField1: i3,
                    sortField2: i2
                  }));
                }
              } else {
                productVariantList.push(this.appendProductVariant({
                  ...this.productVariantDataField(name),
                  temp: [
                    value1.tempPAVId ? value1.tempPAVId : value1.id,
                    value2.tempPAVId ? value2.tempPAVId : value2.id
                  ],
                  sortField1: i2
                }));
              }
            }
          } else {
            productVariantList.push(this.appendProductVariant({
              ...this.productVariantDataField(name),
              temp: [
                value1.tempPAVId ? value1.tempPAVId : value1.id
              ]
            }));
          }
          // END LOOP 2
        }
        // END LOOP 1
      }
    }

    productVariantList = _.sortBy(productVariantList, ["sortField1", "sortField2"]);

    // IN CASE ADD NEW PRODUCT
    if (!isUpdateProduct) {
      return productVariantList;
    }

    // IN CASE UPDATE PRODUCT: INSERT IT TO GROUP PRODUCT VARIANT
    if (index === 0 && collection[index]["attributeValues"].length > 1) {
      productVariantList.forEach((productVariant, productVariantIndex) => {
        if (productVariant.status === this.Enum.ACTIVE) {
          const attributeValueLength = collection[index]["attributeValues"].length;
          let insertAtIndex = attributeValueLength * (productVariantIndex + 1); //(3 * 1) - 1 = 2 EX: [1, 2, INSERT HERE]

          existingProductVariantList.splice(insertAtIndex - 1, 0, productVariant);
          this.props.form.setFieldsValue({[`variantProductCode[${insertAtIndex - 1}]`]: ""});
          this.props.form.setFieldsValue({[`variantProductPrice[${insertAtIndex - 1}]`]: 0.00});
          this.props.form.setFieldsValue({[`variantProductWholePrice[${insertAtIndex - 1}]`]: 0.00});
          this.props.form.setFieldsValue({[`variantProductDistributePrice[${insertAtIndex - 1}]`]: 0.00 });
        }
      });
    } else {

      if (
        collection.length > 0 &&
        index === 0 &&  // first row of product attribute
        this.countAttributeValues(collection[0].attributeValues) <= 1 &&
        this.countProductVariant(existingProductVariantList) === productVariantList.length
      ) {
        // CLONE NAME OF PRODUCT VARIANT FROM NEW UPDATE NAME
        existingProductVariantList.forEach((existProductVariant, existProductVariantIndex) => {
          if (existProductVariant.status === this.Enum.ACTIVE) {
            existingProductVariantList[existProductVariantIndex]["name"] = productVariantList[existProductVariantIndex]["name"];
            existingProductVariantList[existProductVariantIndex]["tempPVId"] = productVariantList[existProductVariantIndex]["tempPVId"];
          }
        });
      } else if (
        collection.length > 1 &&
        index === 1 &&  // second row of product attribute
        this.countAttributeValues(collection[1].attributeValues) <= 1 &&
        this.countProductVariant(existingProductVariantList) === productVariantList.length
      ) {
        // CLONE NAME OF PRODUCT VARIANT FROM NEW UPDATE NAME
        existingProductVariantList.forEach((existProductVariant, existProductVariantIndex) => {
          if (existProductVariant.status === this.Enum.ACTIVE) {
            existingProductVariantList[existProductVariantIndex]["name"] = productVariantList[existProductVariantIndex]["name"];
            existingProductVariantList[existProductVariantIndex]["tempPVId"] = productVariantList[existProductVariantIndex]["tempPVId"];
          }
        });
      } else if (
        collection.length > 2 &&
        index === 2 && // third row of product attribute
        this.countAttributeValues(collection[2].attributeValues) <= 1 && 
        this.countProductVariant(existingProductVariantList) === productVariantList.length
      ) {
        // CLONE NAME OF PRODUCT VARIANT FROM NEW UPDATE NAME
        existingProductVariantList.forEach((existProductVariant, existProductVariantIndex) => {
          if (existProductVariant.status === this.Enum.ACTIVE) {
            existingProductVariantList[existProductVariantIndex]["name"] = productVariantList[existProductVariantIndex]["name"];
            existingProductVariantList[existProductVariantIndex]["tempPVId"] = productVariantList[existProductVariantIndex]["tempPVId"];
          }
        });
      } else {
        existingProductVariantList = existingProductVariantList.concat(productVariantList);
      }
    }

    return existingProductVariantList;
  }

  appendProductVariant(variantAttribute = {},index) {
    return {
      id: variantAttribute.id,
      name: variantAttribute.name,
      sku:variantAttribute.sku,
      image: this.state.variantImageList[index],
      barcode: variantAttribute.barcode,
      isAutoGenerateBarcode: variantAttribute.isAutoGenerateBarcode,
      price: variantAttribute.price,
      wholePrice: variantAttribute.wholePrice,
      distributePrice: variantAttribute.distributePrice,
      quantity: variantAttribute.quantity,
      status: this.Enum.ACTIVE,
      tempPVId: variantAttribute.temp,
      sortField1: variantAttribute.sortField1,
      sortField2: variantAttribute.sortField2
    };
  }

  appendAttributeValue(value = {}) {
    return {
      id: value.id,
      name: value.name,
      value: value.value,
      status: this.Enum.ACTIVE,
      tempPAVId: this.createTempValueForVariant()
    };
  }

  handleFocusOnAttributeValue() {
    this.props.form.setFieldsValue({isFocusOnVariantInput: 1});
  }

  handleOnFocusOutAttributeValue() {
    this.props.form.setFieldsValue({isFocusOnVariantInput: 0});
  }

  handleCallBackAddAttribute(index) {
    this.setState({addAttributeRowIndex: index});
  }

  handleDeleteProductAttribute(index) {
    const variantAttributeList = this.state.variantAttributeList;
    let productVariantList = this.state.productVariantList;
    if (variantAttributeList[index]["id"] === "") {
      variantAttributeList.splice(index, 1);
      productVariantList = this.generateProductVariant(
        this.variantAttributeListForGenerateVariantV2(variantAttributeList),
        index,
        this.countProductVariantThatHasId(this.state.productVariantList) > 0
      );
    } else {
      this.props.dispatch(ProductVariantAction.checkIsAvailableArchiveAttribute(variantAttributeList[index]["id"]));
    }

    this.setState({
      variantAttributeList,
      productVariantList,
      productAttributeToDelete: {
        attributeRow: index
      },
      attributeRowToDelete: index
    });
  }

  handleOnChangeAttribute(index, value) {
    const variantAttributeList = this.state.variantAttributeList;
    variantAttributeList[index]["attributeId"] = value;
    this.setState({variantAttributeList});
    document.getElementById(`lozenge-item${index}`).focus();
  }

  handleKeyDownAttributeValue(event, index) {
    const variantAttributeList = this.state.variantAttributeList;
    const variantAttributeLength = variantAttributeList.length;
    const attributeValue = event.target.value + "".trim();
    if (variantAttributeLength <= 0 || index > variantAttributeLength) {
      return;
    }

    if (attributeValue && event.keyCode === 13) {
      let notExistYet = true;
      variantAttributeList[index]["attributeValues"].forEach(attributeValue => {
        if (attributeValue.name === attributeValue && attributeValue.status === this.Enum.ACTIVE) {
          notExistYet = false;
        }
      });

      if (notExistYet) {
        variantAttributeList[index]["attributeValues"].push(this.appendAttributeValue({id: "", name: attributeValue}));
        document.getElementById(`lozenge-item${index}`).value = "";
        const productVariantList = this.generateProductVariant(
          this.variantAttributeListForGenerateVariantV2(variantAttributeList),
          index,
          this.countProductVariantThatHasId(this.state.productVariantList) > 0 // 1: Here to check wether need to generate variant by update or create 
        );
        
        this.setState({
          variantAttributeList,
          productVariantList
        });

        this.syncInputTableWithProductVariant();

        if (this.props.callBackGetProductVariant) {
          this.props.callBackGetProductVariant(productVariantList);
        }

      } else {
        document.getElementById(`lozenge-item${index}`).value = "";
      }

    } else if (
      !attributeValue &&
      event.keyCode === 8
    ) {
      // When key backspace find the last active attribute value and remove it
      let lastIndexActive = 0;
      variantAttributeList[index]["attributeValues"].forEach((attributeValue, attributeValueIndex) => {
        if (attributeValue.status === this.Enum.ACTIVE) {
          lastIndexActive = attributeValueIndex;
        }
      });

      const length = this.countAttributeValues(variantAttributeList[index]["attributeValues"]);

      if (length > 0) {
        this.handleOnRemoveLozengeItem(lastIndexActive, index); // index here is attribute row, this line is remove the last attribute value when key backspace
      }
    }
  }

  handleOnRemoveLozengeItem(index, inputIndex) {
    const variantAttributeList = this.state.variantAttributeList;
    let productVariantList = this.state.productVariantList;
    const productAttributeValueId = variantAttributeList[inputIndex]["attributeValues"][index]["id"];
   
    if (productAttributeValueId === "") {
      const productVariantToDelete = [];
      for (var i = 0; i < productVariantList.length; i++) {
        if (
          productVariantList[i]["tempPVId"] &&
          productVariantList[i]["tempPVId"].includes(variantAttributeList[inputIndex]["attributeValues"][index]["tempPAVId"])) {
          productVariantToDelete.push(i);
        }
      }

      for (var j = productVariantToDelete.length - 1; j >= 0; j--) {
        if (!productVariantList[productVariantToDelete[j]].id) { // Here we don't remove element from product variant list we keep it for value back
          productVariantList.splice(productVariantToDelete[j], 1);
        }
      }

      variantAttributeList[inputIndex]["attributeValues"].splice(index, 1);

      if (
        productVariantList.length === 0 ||
        this.countAttributeValues(variantAttributeList[inputIndex]["attributeValues"]) === 0
      ) {
        productVariantList = this.generateProductVariant(
          this.variantAttributeListForGenerateVariantV2(variantAttributeList),
          inputIndex,
          this.countProductVariantThatHasId(productVariantList) > 0
        );
      }

      this.setState({
        productVariantList
      });

    } else {
      this.props.dispatch(ProductVariantAction.checkIsAvailableArchiveAttributeValue(productAttributeValueId));
      this.setState({
        productAttributeToDelete: {
          attributeRow: inputIndex,
          attributeValueIndex: index
        }
      });
    }

    this.setState({
      variantAttributeList
    });

    this.syncInputTableWithProductVariant();

    document.getElementById(`lozenge-item${inputIndex}`).focus();
  }

  handleAddProductAttribute() {
    const existingVariantAttributes = this.state.variantAttributeList;
    
    existingVariantAttributes.push({
      id: "",
      attributeId: "",
      status: this.Enum.ACTIVE,
      attributeValues: []
    });

    this.setState({
      variantAttributeList: existingVariantAttributes,
      variantImageList: []
    });

    if (this.props.callBackGetProductAttribute) {
      this.props.callBackGetProductAttribute(existingVariantAttributes);
    }
  }

  handleAddProductVariant(variantAttributeKey) {
    const existingVariantAttributes = this.state.variantAttributeList;

    existingVariantAttributes.forEach((variantAttribute, key) => {
      if (variantAttributeKey === key) {
        existingVariantAttributes[key]["variantList"].push({
          id: "",
          name: "",
          barcode: "",
          price: null,
          wholePrice: null,
          distributePrice: null,
          quantity: 0,
          status: this.Enum.ACTIVE,
          image: ""
        });
      }
    });
    this.setState({variantAttributeList: existingVariantAttributes});
  }

  handleSubmitConfirmAction() {
    this.props.dispatch(ProductAction.archiveVariant(this.state.productVariantToDelete.id));
  }

  handleRemoveProductVariant(productVariantRow, id) {
    if (id !== "") {
      this.setState({
        productVariantToDelete: {
          id,
          productVariantRow
        }
      });
      this.props.dispatch(ProductVariantAction.checkIsAvailableForArchive(id));
    } else {
      const productVariantList = this.state.productVariantList;
      const variantImageList = this.state.variantImageList;
      const variantAttributeList = this.state.variantAttributeList;
      productVariantList.splice(productVariantRow, 1);
      variantImageList.splice(productVariantRow, 1);
      variantAttributeList[0]["attributeValues"].splice(productVariantRow, 1);
      this.setState({productVariantList,variantAttributeList,variantImageList});
    }
  }

  deleteVariantThatExistInSystem(productVariantRow) {
    const existingProductVariantList = this.state.productVariantList;
    const productVariantArchiveList = this.state.productVariantArchiveList;
    existingProductVariantList[productVariantRow]["status"] = this.Enum.ARCHIVE;
    productVariantArchiveList.push(existingProductVariantList[productVariantRow]);
    existingProductVariantList.splice(productVariantRow, 1);
    this.setState({
      productVariantList: existingProductVariantList,
      productVariantArchiveList
    });
  }

  renderVariantAttribute(variantAttribute, variantAttributeKey) {
    return (
      <this.Select
        name={`attributeId[${variantAttributeKey}]`}
        label={variantAttributeKey === 0 ? <span><this.Translate id="text_attribute" /> <this.Translate id="text_attribute_example" /></span> : ""}
        placeholder="Select attribute"
        valueKey="id"
        dataSource={this.state.variantAttributes}
        defaultValue={variantAttribute.attributeId}
        onChange={(value) => this.handleOnChangeAttribute(variantAttributeKey, value)}
        // addNew={() => this.props.handleAddVariantAttribute(variantAttributeKey, this.handleCallBackAddAttribute)}
        form={this.props.form}/>
    );
  }

  render() {
    this.submitConfirmActionLoading = this.props.productVariantArchive.archiving;
    const attributeLength = this.countProductAttribute(this.state.variantAttributeList);
    console.log("render", this.state.productVariantList);
    return (
      <this.Row>
        <this.InputNumber
          name="isFocusOnVariantInput"
          form={this.props.form}
          className="hidden"
          data={0} />
        {
          this.state.variantAttributeList.map((variantAttribute, variantAttributeKey) =>
            variantAttribute.status === this.Enum.ACTIVE ?
              <this.Col md="12" key={variantAttributeKey} className="wrap-variant-item-row">
                <this.Row>
                  <this.Col md="3">
                    {this.renderVariantAttribute(variantAttribute, variantAttributeKey)}
                  </this.Col>
                  <this.Col md="9">
                    {
                      variantAttributeKey === 0 ?
                        <div className="ant-form-item-label">
                          <label htmlFor="lozenge-item[0]">
                            <span><this.Translate id="label_attrib_value" /></span>
                          </label>
                        </div>
                        :
                        ""
                    }
                    <div style={{display: "flex"}}>
                      <div className="wrap-lozenge-group-input ant-input">
                        {
                          variantAttribute.attributeValues ?
                            variantAttribute.attributeValues.map((attributeValue, attributeValueIndex) =>
                              attributeValue.status === this.Enum.ACTIVE ?
                                <div key={attributeValueIndex} className="lozenge-item">
                                  <span>{attributeValue.name.trim()}</span>
                                  <span className="icon-delete" onClick={() => this.handleOnRemoveLozengeItem(attributeValueIndex, variantAttributeKey)}></span>
                                </div>
                                :
                                ""
                            )
                            :
                            ""
                        }
                        <input
                          type="text"
                          name="attbributeVvalue"
                          id={`lozenge-item${variantAttributeKey}`}
                          className="ant-input lozenge-group-input"
                          onKeyDown={(e) =>this.handleKeyDownAttributeValue(e, variantAttributeKey)}
                          onFocus={this.handleFocusOnAttributeValue}
                          onBlur={this.handleOnFocusOutAttributeValue}/>
                      </div>
                      <this.Button type="danger" loading={this.state.attributeRowToDelete === variantAttributeKey && this.props.productAttributeCheckStatus.fetching} onClick={() => this.handleDeleteProductAttribute(variantAttributeKey)} className="btn-delete-attribute">
                        <span className="icon-delete" style={{fontSize: "15pt"}}></span>
                      </this.Button>
                    </div>
                  </this.Col>
                </this.Row>
              </this.Col>
              :
              ""
          )
        }
        {
          attributeLength < 3 || attributeLength === 0 ?
            <this.Col md="12" className="btn-addcontact">
              <this.Button onClick={this.handleAddProductAttribute}>
                <span className="icon-add"></span> <span><this.Translate id="btn_product_add_another_attribute" /></span>
              </this.Button>
            </this.Col>
            :
            ""
        }
        <this.Col md="12">
          <this.Table
            rowKey="name"
            rowClassName={record => record.status === this.Enum.ARCHIVE ? "hidden" : ""}
            dataSource={this.state.productVariantList}
            loading={this.props.productAttributeValueCheckStatus.fetching}
            columns={this.columns}
            locale={{emptyText: <this.Translate id="placeholder_table_variant_product" />}} />
        </this.Col>
        {this.renderModalConfirmAction()}
      </this.Row>
    );
  }
}
