import React from "react";
import { Row, Col, Button, Input, Table } from "antd";
import _ from "lodash";
import { InputText, InputNumber, Select } from "@components/index";
import Enum from "@enums/index";
import { Translate } from "@redux/index";
import { UploadImageCrop } from "@components/UploadImageCrop";
import VariantService from "@services/VariantService";
import BaseModal from "@layout/BaseModal";
import ProductAction from "../redux/action";
import Constant from "../redux/constant";
import Exchange from "./ExchangeMoneyFunc";
import "./index.css";
import { Variant } from "@model/index";

export default class FormVariant extends BaseModal {
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
      variants: [],
      variantPagination: {},
      variantSearch: "",
      productVariantArchiveList: [],
      productAttributeArchiveList: [],
      addAttributeRowIndex: 0,
      isNotYetLoadComponentDidUpdated: true,
      variantImageList: [],
    };
    this.columns = [
      {
        title: <Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        render: (variantName, record, index) => {
          return <InputText
          name={`variantName[${index}]`}
          placeholder="Enter variant name"
          data={variantName}
          form={this.props.form}/>;
        }
      },
      {
        title: <Translate id="text_product_sku" />,
        dataIndex: "sku",
        key: "sku",
        width: 180,
        render: (sku, record, index) => {
          return <>
            <InputText
              name={`variantId[${index}]`}
              data={record.id}
              className="hidden"
              form={this.props.form}
            />
      
            <InputText
              name={`variantAttributeValueId[${index}]`}
              data={record.productAttributeValueId}
              className="hidden"
              form={this.props.form}
            />

            <InputText
              name={`variantSku[${index}]`}
              placeholder="Enter SKU"
              data={sku}
              // onKeyUp={(e) => this.onOnChangeSKU(e, index)}
              form={this.props.form}
            />
          </>;
        }
      },
      {
        title: <Translate id="text_barcode" />,
        dataIndex: "barcode",
        key: "barcode",
        width: 180,
        render: (barcode, record, index) => {
          return <InputText
            name={`variantBarcode[${index}]`}
            placeholder="Enter barcode"
            data={barcode}
            disabled={record.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.AUTO}
            // onKeyUp={(e) => this.onOnChangeBarcode(e, index)}
            form={this.props.form}/>;
        }
      },
      {
        title: <Translate id="text_retial_price" />,
        dataIndex: "price",
        key: "price",
        width: 180,
        render: (price, _, index) => {
          return <InputNumber
            name={`variantRetailPrice[${index}]`}
            isAutoSelect={true}
            isHideTool={true}
            errorRequired={<Translate id="error_require_price" />}
            data={price}
            precision={this.props.getPrecisionByCurrency()}
            // onKeyUp={(e) => this.onOnChangePrice(e, index)}
            form={this.props.form}
          />;
        }
      },
      // {
      //   title: <Translate id="text_whole_price" />,
      //   dataIndex: "wholePrice",
      //   key: "wholePrice",
      //   width: 120,
      //   render: (wholePrice, _, index) => {
      //     return <InputNumber
      //       name={`variantWholesalePrice[${index}]`}
      //       isAutoSelect={true}
      //       isHideTool={true}
      //       errorRequired={<Translate id="error_require_price" />}
      //       data={wholePrice}
      //       precision={this.props.getPrecisionByCurrency()}
      //       onKeyUp={(e) => this.onOnChangePrice(e, index, "wholePrice")}
      //       form={this.props.form}/>;
      //   }
      // },
      // {
      //   title: <Translate id="text_distribute_price" />,
      //   dataIndex: "distributePrice",
      //   key: "distributePrice",
      //   width: 150,
      //   render: (distributePrice, _, index) => {
      //     return <InputNumber
      //       name={`variantDistributionPrice[${index}]`}
      //       isAutoSelect={true}
      //       isHideTool={true}
      //       errorRequired={<Translate id="error_require_price" />}
      //       data={distributePrice}
      //       precision={this.props.getPrecisionByCurrency()}
      //       onKeyUp={(e) => this.onOnChangePrice(e, index, "distributePrice")}
      //       form={this.props.form} />;
      //   }
      // },
      // {
      //   title: <Translate id="text_image" />,
      //   dataIndex: "image",
      //   key: "image",
      //   align: "center",
      //   render: (variantImage, record, index) => {
      //     const image = {
      //       uid: index,
      //       name: variantImage,
      //       status: "done",
      //       url: this.Util.getProductImage(record.image).url
      //     };
          
      //     const uploadButton = (
      //       <div>
      //         <Icon type="plus" />
      //         <div className="ant-upload-text">Upload</div>
      //       </div>
      //     );
          
      //     // return <this.UploadImg
      //     //   customerButtonUpload={uploadButton}
      //     //   className="variantImage .ant-upload.ant-upload-select-picture-card main-upload .ant-upload-list-picture-card .ant-upload-list-item "
      //     //   name={`image${index}`}  
      //     //   data={{file: image}}
      //     //   fileList={[image]}
      //     //   showPlusIcon={true}
      //     //   endPoint={`${this.Util.getAPIURL()}/file/v1/upload/product`}
      //     //   endPointDelete={`${this.Util.getAPIURL()}/file/v1/product/delete`}
      //     //   varianrIndex={index}
      //     //   accessToken={this.Util.getAccessToken()}
      //     //   responseAfterUpload={data => this.responseAfterUpload(data,index)}
      //     //   form={this.props.form}/>;

      //     return <UploadImageCrop
      //       customerButtonUpload={uploadButton}
      //       className="variantImage .ant-upload.ant-upload-select-picture-card main-upload .ant-upload-list-picture-card .ant-upload-list-item "
      //       name={`image${index}`}  
      //       data={{file: image}}
      //       fileList={[image]}
      //       showPlusIcon={true}
      //       endPoint={`${this.Util.getAPIURL()}/file/v1/upload/product`}
      //       endPointDelete={`${this.Util.getAPIURL()}/file/v1/product/delete`}
      //       varianrIndex={index}
      //       accessToken={this.Util.getAccessToken()}
      //       responseAfterUpload={data => this.responseAfterUpload(data,index)}
      //       form={this.props.form} />;
      //   }
      // },
      {
        title: <Translate id="text_action" />,
        dataIndex: "action",
        key: "action",
        align: "center",
        width: 100,
        render: (_, record, index) => {
          return <div className="wrap-variant-action">
            {/* <this.Switchs
              name={`variantProductStatus[${index}]`}
              checked={record.status}
              onChange={(checked) => this.onChangeProductVariantStatus(checked, index, record.quantity)}
              form={this.props.form} /> */}
            <Button
              loading={index === this.state.productVariantToDelete.productVariantRow && this.props.productVariantCheckStatus.fetching}
              type="danger"
              icon="delete"
              shape="circle"
              onClick={() => this.onRemoveVariant(index, record)} />
          </div>;
        }
      }
    ];
    this.confirmTextAction = <Translate id="text_delete_confirm_variant_product" />;
    this.confirmTitle = <Translate id="delete_variant_warning" />;
    this.actionConfirmResponseMsg = <Translate id="text_not_allow_to_delete_product_has_quantity" />;
  }

  responseAfterUpload = (response,index) => {
    const variants = this.state.variants;
    const variantImageList = this.state.variantImageList;
    let image = null;
    if (response.data === "success") image = null;
    else image = response.data.originalname;
    variantImageList.push(image);
    variants[index]["image"] = image;
    this.setState({ variants, variantImageList });
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
      this.props.dispatch(ProductAction.reset());
      this.setState({modalVisible: false});
    } else if (productVariantCheckStatus["error"]) {
      this.Message.warning(this.CATranslate("delete_product_variant_warning", this.props.locale));
      this.props.dispatch(ProductAction.reset(Constant.RESET_PRODUCT_VARIANT));
    }

    // PRODUCT ATTRIBUTE VALUE
    if (productAttributeValueCheckStatus.fetched) {
      // TO DO: Remove data from front end
      const productAttributeValue = productAttributeValueCheckStatus.list;
      const productAttributeValueId = productAttributeValue ? productAttributeValue.id : "";
      let variants = this.state.variants;
      const productVariantArchiveList = this.state.productVariantArchiveList;
      const variantAttributeList = this.state.variantAttributeList;

      const {attributeRow, attributeValueIndex} = this.state.productAttributeToDelete;
      variantAttributeList[attributeRow]["attributeValues"][attributeValueIndex]["status"] = this.Enum.ARCHIVE;
      const tempProductVariant = []; // USE FOR RELOAD BACK WHEN DELETE ATTRIBUTE VALUE AT INDEX 0
      const productVariantToDelete = [];

      for (var i = 0; i < variants.length; i++) {
        let isArchive = false;
        if (variants[i]["productAttributeValueId"] && variants[i]["productAttributeValueId"].includes(productAttributeValueId)) {
          isArchive = true;
        } else if (variants[i]["tempPVId"] && variants[i]["tempPVId"].includes(productAttributeValueId)) {
          isArchive = true;
        }
        
        if (isArchive) {
          variants[i]["status"] = this.Enum.ARCHIVE;
          productVariantArchiveList.push(this.Util.copyObj(variants[i]));

          // REMOVE PRODUCT ATTRIBUTE VALUE FROM COLUMN IN PRODUCT VARIANT
          variants[i]["productAttributeValueId"] = variants[i]["productAttributeValueId"].includes(`${productAttributeValueId},`) ? variants[i]["productAttributeValueId"].replace(`${productAttributeValueId},`, "") : variants[i]["productAttributeValueId"].replace(`,${productAttributeValueId}`, "");
          tempProductVariant.push(variants[i]);
          productVariantToDelete.push(i);
        }
      }


      // DELETE PRODUCT VARIANT
      for (var j = productVariantToDelete.length - 1; j >= 0; j--) {
        variants.splice(productVariantToDelete[j], 1);
      }

      if (this.countProductVariant(variants) === 0) {
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

          variants = tempProductVariant;
        }
      }

      this.setState({
        variantAttributeList,
        variants
      });

      this.syncInputTableWithProductVariant();

      this.props.dispatch(ProductAction.resetVariant());

      if (this.props.callBackGetProductVariant) {
        this.props.callBackGetProductVariant(variants);
      }

    } else if (productAttributeCheckStatus["error"]) {
      this.Message.warning(this.CATranslate("delete_attribute_warning", this.props.locale));
      this.props.dispatch(ProductAction.resetVariant());
    }

    // PRODUCT ATTRIBUTE
    if (productAttributeCheckStatus.fetched) {
      // TO DO: Remove data from front end
      const productAttributeId = productAttributeCheckStatus.list ? productAttributeCheckStatus.list.id : "";
      const archiveAttribute = this.state.variantAttributeList.find(value => value.id === productAttributeId);
      let variants = this.state.variants;
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

          this.state.variants.forEach((productVariant, productVariantIndex) => {
            let isArchive = false;
            // We check two condition like this bcus sometimes product mix attribute value that has just new created with existing in system
            if (productVariant["productAttributeValueId"] && productVariant["productAttributeValueId"].includes(attributeValue.id)) {
              isArchive = true;
            } else if (productVariant["tempPVId"] && productVariant["tempPVId"].includes(attributeValue.id)) {
              isArchive = true;
            }

            if (isArchive) {
              this.state.variants[productVariantIndex]["status"] = this.Enum.ARCHIVE; // Only just change here it will affect to product variant collection
              productVariantArchiveList.push(productVariant);

              productVariant["productAttributeValueId"] = productVariant["productAttributeValueId"].includes(`${attributeValue.id},`) ? productVariant["productAttributeValueId"].replace(`${attributeValue.id},`, "") : productVariant["productAttributeValueId"].replace(`,${attributeValue.id}`, "");
              tempProductVariant.push(productVariant);
              productVariantToDelete.push(productVariantIndex);
            }
          });

          // REMOVE PRODUCT VARIANT FRO THE COLLECTION
          for (var j = productVariantToDelete.length - 1; j >= 0; j--) {
            this.state.variants.splice(productVariantToDelete[j], 1);
          }

          // CHECK IF PRODUCT VARIANT HAS ALL REMOVE FROM THE COLLECTION, SO WE NEED TO RESET DATA BACK
          if (this.countProductVariant(this.state.variants) === 0) {

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
                variants = tempProductVariant;
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
      if (this.state.variants.length === 0) {
        this.setState({
          variants
        });
      }

      this.props.dispatch(ProductAction.resetVariant());

      if (this.props.callBackGetProductVariant) {
        this.props.callBackGetProductVariant(variants);
      }

    } else if (productAttributeValueCheckStatus["error"]) {
      this.Message.warning(this.CATranslate("delete_attribute_value_warning", this.props.locale));
      this.props.dispatch(ProductAction.resetVariant());
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
    const productVariants = this.Util.copyArrayObj(this.props?.productVariants?.data ?? []);

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
        variants: productVariants,
        variantPagination: this.props?.productVariants?.pagination,
        isNotYetLoadComponentDidUpdated: false
      });

      if (this.props.callBackGetProductVariant) {
        this.props.callBackGetProductVariant(productVariants);
      }

      if (this.props.callBackGetProductAttribute) {
        this.props.callBackGetProductAttribute(productAttributes);
      }

      if (this.props.onCallBackGetArchiveProductVariant) {
        this.props.onCallBackGetArchiveProductVariant(this.state.productVariantArchiveList);
      }

      if (this.props.onCallBackGetArchiveProductAttributes) {
        this.props.onCallBackGetArchiveProductAttributes(this.state.productAttributeArchiveList);
      }
    }

    if (variantAttributeAdd.added) {
      const variantAttributeList = this.state.variantAttributeList;
      if (this.state.addAttributeRowIndex > variantAttributeList.length - 1) {
        variantAttributeList.push(variantAttributeAdd.response.data.id);
      } else {
        variantAttributeList[this.state.addAttributeRowIndex]["attributeId"] = variantAttributeAdd.response.data.id;
      }

      this.setState({ variantAttributeList });

      this.props.form.setFieldsValue({[`attributeId[${this.state.addAttributeRowIndex}]`]: variantAttributeAdd.response.data.id});
      
      dispatch(ProductAction.reset(Constant.RESET_VARIANT_ATTRIBUTE));
      document.getElementById(`lozenge-item${this.state.addAttributeRowIndex}`).focus();
    }

    if (this.props.switchAutoGenerateSKU.switched) {
      const variants = this.state.variants;
      const isAutoGenerateBarcode = this.props.switchAutoGenerateSKU.value;
      variants.forEach((_, index) => {
        variants[index]["isAutoGenerateBarcode"] = isAutoGenerateBarcode;
      });
      this.setState({variants});
      this.props.dispatch(ProductAction.reset(Constant.RESET_SWITCH_TYPE_OF_GENERATE_SKU));
    }

    if (this.props.variantAttributes.fetched) {
      this.setState({ variantAttributes: this.props.variantAttributes.list });
      this.props.dispatch(ProductAction.reset(Constant.RESET_REQUEST_VARIANT_ATTRIBUTE));
    }
  }

  componentDidMount() {
    this.props.dispatch(ProductAction.fetchVariantAttributes(100));
  }

  onChangeProductVariantStatus = (checked, productVariantRow, quantity) => {
    if (!checked) {
      if (quantity > 0) {
        this.Message.warning(this.CATranslate("deactive_product_variant_warning", this.props.locale));
      } else {
        this.state.variants[productVariantRow]["status"] = this.Enum.DEACTIVE;
      }
    } else {
      this.state.variants[productVariantRow]["status"] = this.Enum.ACTIVE;
    }
  }

  onOnChangePrice = (event, index, fieldName = "price") => {
    const variants = this.state.variants;
    variants[index][fieldName] = parseFloat(event.target.value);
    this.setState({ variants });
  }

  onOnChangeBarcode(event, index) {
    const variants = this.state.variants;
    variants[index]["barcode"] = event.target.value;
  }

  onOnChangeSKU(event, index) {
    const variants = this.state.variants;
    variants[index]["sku"] = event.target.value;
  }

  syncInputTableWithProductVariant = () => {
    this.state.variants.forEach((productVariant, index) => {
      if (productVariant.status === this.Enum.ACTIVE) {
        this.props.form.setFieldsValue({[`variantProductCode[${index}]`]: productVariant.barcode});
        this.props.form.setFieldsValue({[`variantProductPrice[${index}]`]: productVariant.price});
        this.props.form.setFieldsValue({[`variantProductWholePrice[${index}]`]: productVariant.wholePrice});
        this.props.form.setFieldsValue({ [`variantProductDistributePrice[${index}]`]: productVariant.distributePrice });
      }
    });
  }

  countProductVariant(variants) {
    let count = 0;
    variants.forEach(productVariant => {
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

  countProductVariantThatHasId(variants) {
    let count = 0;
    variants.forEach(productVariant => {
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
    let existingProductVariantList = this.state.variants;
    let variants = [];
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
  
              variants.push(this.appendProductVariant({
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
  
            variants.push(this.appendProductVariant({
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
  
            variants.push(this.appendProductVariant({
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
          variants.push(this.appendProductVariant({
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

          variants.push(this.appendProductVariant({
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
                  variants.push(this.appendProductVariant({
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
                variants.push(this.appendProductVariant({
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
            variants.push(this.appendProductVariant({
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

    variants = _.sortBy(variants, ["sortField1", "sortField2"]);

    // IN CASE ADD NEW PRODUCT
    if (!isUpdateProduct) {
      return variants;
    }

    // IN CASE UPDATE PRODUCT: INSERT IT TO GROUP PRODUCT VARIANT
    if (index === 0 && collection[index]["attributeValues"].length > 1) {
      variants.forEach((productVariant, productVariantIndex) => {
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
        this.countProductVariant(existingProductVariantList) === variants.length
      ) {
        // CLONE NAME OF PRODUCT VARIANT FROM NEW UPDATE NAME
        existingProductVariantList.forEach((existProductVariant, existProductVariantIndex) => {
          if (existProductVariant.status === this.Enum.ACTIVE) {
            existingProductVariantList[existProductVariantIndex]["name"] = variants[existProductVariantIndex]["name"];
            existingProductVariantList[existProductVariantIndex]["tempPVId"] = variants[existProductVariantIndex]["tempPVId"];
          }
        });
      } else if (
        collection.length > 1 &&
        index === 1 &&  // second row of product attribute
        this.countAttributeValues(collection[1].attributeValues) <= 1 &&
        this.countProductVariant(existingProductVariantList) === variants.length
      ) {
        // CLONE NAME OF PRODUCT VARIANT FROM NEW UPDATE NAME
        existingProductVariantList.forEach((existProductVariant, existProductVariantIndex) => {
          if (existProductVariant.status === this.Enum.ACTIVE) {
            existingProductVariantList[existProductVariantIndex]["name"] = variants[existProductVariantIndex]["name"];
            existingProductVariantList[existProductVariantIndex]["tempPVId"] = variants[existProductVariantIndex]["tempPVId"];
          }
        });
      } else if (
        collection.length > 2 &&
        index === 2 && // third row of product attribute
        this.countAttributeValues(collection[2].attributeValues) <= 1 && 
        this.countProductVariant(existingProductVariantList) === variants.length
      ) {
        // CLONE NAME OF PRODUCT VARIANT FROM NEW UPDATE NAME
        existingProductVariantList.forEach((existProductVariant, existProductVariantIndex) => {
          if (existProductVariant.status === this.Enum.ACTIVE) {
            existingProductVariantList[existProductVariantIndex]["name"] = variants[existProductVariantIndex]["name"];
            existingProductVariantList[existProductVariantIndex]["tempPVId"] = variants[existProductVariantIndex]["tempPVId"];
          }
        });
      } else {
        existingProductVariantList = existingProductVariantList.concat(variants);
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

  onFocusOnAttributeValue = () => {
    this.props.form.setFieldsValue({isFocusOnVariantInput: 1});
  }

  onOnFocusOutAttributeValue = () => {
    this.props.form.setFieldsValue({isFocusOnVariantInput: 0});
  }

  onCallBackAddAttribute = (index) => {
    this.setState({addAttributeRowIndex: index});
  }

  onDeleteProductAttribute = (index) => {
    const variantAttributeList = this.state.variantAttributeList;
    let variants = this.state.variants;
    if (variantAttributeList[index]["id"] === "") {
      variantAttributeList.splice(index, 1);
      variants = this.generateProductVariant(
        this.variantAttributeListForGenerateVariantV2(variantAttributeList),
        index,
        this.countProductVariantThatHasId(this.state.variants) > 0
      );
    } else {
      this.props.dispatch(ProductAction.checkIsAvailableVariantArchiveAttribute(variantAttributeList[index]["id"]));
    }

    this.setState({
      variantAttributeList,
      variants,
      productAttributeToDelete: {
        attributeRow: index
      },
      attributeRowToDelete: index
    });
  }

  onOnChangeAttribute = (index, value) => {
    const variantAttributeList = this.state.variantAttributeList;
    variantAttributeList[index]["attributeId"] = value;
    this.setState({variantAttributeList});
    document.getElementById(`lozenge-item${index}`).focus();
  }

  onKeyDownAttributeValue = (event, index) => {
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
        const variants = this.generateProductVariant(
          this.variantAttributeListForGenerateVariantV2(variantAttributeList),
          index,
          this.countProductVariantThatHasId(this.state.variants) > 0 // 1: Here to check wether need to generate variant by update or create 
        );
        
        this.setState({
          variantAttributeList,
          variants
        });

        this.syncInputTableWithProductVariant();

        if (this.props.callBackGetProductVariant) {
          this.props.callBackGetProductVariant(variants);
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
        this.onOnRemoveLozengeItem(lastIndexActive, index); // index here is attribute row, this line is remove the last attribute value when key backspace
      }
    }
  }

  onOnRemoveLozengeItem = (index, inputIndex) => {
    const variantAttributeList = this.state.variantAttributeList;
    let variants = this.state.variants;
    const productAttributeValueId = variantAttributeList[inputIndex]["attributeValues"][index]["id"];
   
    if (productAttributeValueId === "") {
      const productVariantToDelete = [];
      for (var i = 0; i < variants.length; i++) {
        if (
          variants[i]["tempPVId"] &&
          variants[i]["tempPVId"].includes(variantAttributeList[inputIndex]["attributeValues"][index]["tempPAVId"])) {
          productVariantToDelete.push(i);
        }
      }

      for (var j = productVariantToDelete.length - 1; j >= 0; j--) {
        if (!variants[productVariantToDelete[j]].id) { // Here we don't remove element from product variant list we keep it for value back
          variants.splice(productVariantToDelete[j], 1);
        }
      }

      variantAttributeList[inputIndex]["attributeValues"].splice(index, 1);

      if (
        variants.length === 0 ||
        this.countAttributeValues(variantAttributeList[inputIndex]["attributeValues"]) === 0
      ) {
        variants = this.generateProductVariant(
          this.variantAttributeListForGenerateVariantV2(variantAttributeList),
          inputIndex,
          this.countProductVariantThatHasId(variants) > 0
        );
      }

      this.setState({
        variants
      });

    } else {
      this.props.dispatch(ProductAction.checkIsAvailableVariantArchiveAttributeValue(productAttributeValueId));
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

  onAddProductAttribute = () => {
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

  onAddProductVariant = (variantAttributeKey) => {
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

  onSubmitConfirmAction() {
    this.props.dispatch(ProductAction.archiveVariant(this.state.productVariantToDelete.id));
  }

  onRemoveVariant = (productVariantRow, record) => {
    if (record?.id) {
      record.status = Enum.ARCHIVE;
      VariantService.checkIsAvailableForArchive(record.id);
      this.setState(prev => ({ ...prev, variants: prev.variants }));
    } else {
      const variants = this.state.variants;
      variants.splice(productVariantRow, 1);
      this.setState({ 
        variants
      });
    }
  }

  deleteVariantThatExistInSystem(productVariantRow) {
    const existingProductVariantList = this.state.variants;
    const productVariantArchiveList = this.state.productVariantArchiveList;
    existingProductVariantList[productVariantRow]["status"] = this.Enum.ARCHIVE;
    productVariantArchiveList.push(existingProductVariantList[productVariantRow]);
    existingProductVariantList.splice(productVariantRow, 1);
    this.setState({
      variants: existingProductVariantList,
      productVariantArchiveList
    });
  }

  renderVariantAttribute(variantAttribute, variantAttributeKey) {
    return (
      <this.Select
        name={`attributeId[${variantAttributeKey}]`}
        label={variantAttributeKey === 0 ? <span><Translate id="text_attribute" /> <Translate id="text_attribute_example" /></span> : ""}
        placeholder="Select attribute"
        valueKey="id"
        dataSource={this.state.variantAttributes}
        defaultValue={variantAttribute.attributeId}
        onChange={(value) => this.onOnChangeAttribute(variantAttributeKey, value)}
        // addNew={() => this.props.onAddVariantAttribute(variantAttributeKey, this.onCallBackAddAttribute)}
        form={this.props.form}/>
    );
  }

  onSearchVariant = (e) => {
    const value = e.target.value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      VariantService.getVariantsByItemId({ itemId: this.props.formData.id, search: value })
      .then(response => {
        this.setState({ 
          variants: response?.data?.data ?? [],
          variantPagination: response?.data?.pagination,
          variantSearch: value
        });
      })
    }, 800);
  }

  onAddNewVariant = () => {
    this.setState(prevState => {
      const variant = new Variant();

      return {
        ...prevState,
        variants: [...prevState.variants, variant]
      }
    })
  }

  render() {
    this.submitConfirmActionLoading = this.props.productVariantArchive.archiving;
    return (
      <this.Row>
        <InputNumber
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
                            <span><Translate id="label_attrib_value" /></span>
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
                                  <span className="icon-delete" onClick={() => this.onOnRemoveLozengeItem(attributeValueIndex, variantAttributeKey)}></span>
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
                          onKeyDown={(e) =>this.onKeyDownAttributeValue(e, variantAttributeKey)}
                          onFocus={this.onFocusOnAttributeValue}
                          onBlur={this.onOnFocusOutAttributeValue}/>
                      </div>
                      <this.Button type="danger" loading={this.state.attributeRowToDelete === variantAttributeKey && this.props.productAttributeCheckStatus.fetching} onClick={() => this.onDeleteProductAttribute(variantAttributeKey)} className="btn-delete-attribute">
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

        {/* Add Another Attributes */}
        {/* {
          attributeLength < 3 || attributeLength === 0 ?
            <this.Col md="12" className="btn-addcontact">
              <Button icon="plus" onClick={this.onAddProductAttribute}>
                <Translate id="text.add.another.attribute" />
              </Button>
            </this.Col>
            :
            ""
        } */}
        <this.Col md="12">
          <Input
            placeholder={"Search variant name, sku and barcode"}
            form={this.props.form}
            style={{width: 350, marginBottom: 0}}
            onChange={this.onSearchVariant}
            allowClear={true}  
          />
          <Table
            rowKey="id"
            rowClassName={r => r.status === this.Enum.ARCHIVE && "hidden"}
            pagination={{
              total: this.state.variantPagination?.total,
              pageSize: this.state.variantPagination?.limit,
              current: this.state.variantPagination?.current,
              showSizeChanger: true
            }}
            onChange={(pagination) => {
              VariantService.getVariantsByItemId({ itemId: this.props.formData.id, search: this.state.variantSearch, limit: pagination.pageSize, offset: (pagination.current - 1) * pagination.pageSize })
              .then(response => {
                this.setState({ 
                  variants: response?.data?.data ?? [],
                  variantPagination: response?.data?.pagination
                });
              })
            }}
            dataSource={this.state.variants}
            loading={this.props.productAttributeValueCheckStatus.fetching}
            columns={this.columns}
            locale={{emptyText: <Translate id="placeholder_table_variant_product" />}}
            expandedRowRender={(record, index) => {

              const image = {
                uid: "-1",
                name: record.image,
                status: "done",
                url: this.Util.getProductImage(record.image).url
              };

              return <Row gutter={[20, 20]}>
                <Col md={24}>
                  <UploadImageCrop 
                    name="image"
                    data={{file: image}}
                    fileList={[image]}
                    endPoint={`${this.Util.getAPIURL()}/file/v1/upload/product`}
                    endPointDelete={`${this.Util.getAPIURL()}/file/v1/product/delete`}
                    accessToken={this.Util.getAccessToken()}
                    locale={this.props.locale}
                    form={this.props.form}
                  />
                </Col>
                <Col
                  md={8}
                >
                  <InputNumber
                    name={`variantWholePrice[${index}]`}
                    label="Whole Price"
                    isAutoSelect={true}
                    isHideTool={true}
                    data={record.wholePrice}
                    errorRequired={<Translate id="error_require_price" />}
                    form={this.props.form}
                  />
                </Col>
                <Col md={8}>
                  <InputNumber
                    name={`variantDistributePrice[${index}]`}
                    label="Distribute Price"
                    isAutoSelect={true}
                    isHideTool={true}
                    data={record.distributePrice}
                    errorRequired={<Translate id="error_require_price" />}
                    form={this.props.form}
                  />
                </Col>
                <Col md={8}>
                  <InputNumber
                    name={`variantReorderPoint[${index}]`}
                    label="Reorder Point"
                    isAutoSelect={true}
                    isHideTool={true}
                    data={record.reorderPoint}
                    form={this.props.form}
                  />
                </Col>
                <Col md={8}>
                  <Select
                    name={`variantStatus[${index}]`}
                    label="Status"
                    defaultValue={record?.status ? record.status : Enum.ACTIVE}
                    dataSource={[{ value: Enum.ACTIVE, name: "Active" }, { value: Enum.DEACTIVE, name: "Inactive" }]}
                    form={this.props.form}
                  />
                </Col>
              </Row>
            }
          }
          />
          
          <Button icon="plus" onClick={this.onAddNewVariant} style={{ marginTop: 15 }}>
            Add New
          </Button>
        </this.Col>
        {this.renderModalConfirmAction()}
      </this.Row>
    );
  }
}
