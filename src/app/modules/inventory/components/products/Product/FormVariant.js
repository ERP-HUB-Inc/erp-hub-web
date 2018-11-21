import React from "react";
import ProductAction from "../../../actions/products/product";
import Constant from "../../../constants/products/product";
import VariantAttributeAction from "../../../actions/products/variantAttribute";
import Modal from "../../../../common/components/shares/Modal";
export default class FormVariant extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      attributeValue: [],
      productVariantToDelete: {
        id: "",
        variantAttributeKey: null,
        productVariantKey: null
      },
      variantAttributes: [],
      variantAttributeList: [],
      productVariantList: [],
      addAttributeRowIndex: 0,
      isNotYetLoadComponentDidUpdated: true,
      changeStatusProductVariant: false
    };
    this.columns = [
      {
        title: <this.Translate id="input_product_variant_name" />,
        dataIndex: "name",
        key: "name"
      },
      {
        title: <this.Translate id="text_product_code" />,
        dataIndex: "barcode",
        key: "barcode",
        width: 120,
        render: (text, record, index) => {
          return <this.InputText
            name={`variantProductCode[${index}]`}
            placeholder={this.CATranslate("text_product_code", this.props.locale)}
            data={record.barcode}
            form={this.props.form}/>;
        }
      },
      {
        title: <this.Translate id="input_product_cost" />,
        dataIndex: "cost",
        key: "cost",
        align: "right",
        width: 120,
        render: (text, record, index) => {
          return <this.InputNumber
            name={`variantProductCost[${index}]`}
            className="text-right"
            isAutoSelect={true}
            isHideTool={true}
            data={record.barcode}
            form={this.props.form}/>;
        }
      },
      {
        title: <this.Translate id="text_price" />,
        dataIndex: "price",
        key: "price",
        align: "right",
        width: 120,
        render: (text, record, index) => {
          return <this.InputNumber
            name={`variantProductPrice[${index}]`}
            className="text-right"
            isAutoSelect={true}
            isHideTool={true}
            data={record.price}
            form={this.props.form}/>;
        }
      },
      {
        title: <this.Translate id="text_action" />,
        dataIndex: "action",
        key: "action",
        align: "center",
        width: 50,
        render: (text, record, index) => {
          return <div className="wrap-variant-action">
            <this.Switchs
              name={`variantProductStatus[${index}]`}
              checked={record.status}
              form={this.props.form} />
            <this.Button type="danger" className="delete-variant-item" onClick={() => this.handleRemoveProductVariant(index, 1, record.id)}>
              <span className="icon-delete" style={{fontSize: "15pt"}}></span>
            </this.Button>
          </div>;
        }
      }
    ];
    this.confirmTextAction = <this.Translate id="text_delete_confirm_variant_product" />;
    this.confirmTitle = <this.Translate id="delete_variant_warning" />;
    this.handleOnChangeAttribute = this.handleOnChangeAttribute.bind(this);
    this.actionConfirmResponseMsg = <this.Translate id="text_not_allow_to_delete_product_has_quantity" />;
    this.handleKeyDownAttributeValue = this.handleKeyDownAttributeValue.bind(this);
    this.handleOnRemoveLozengeItem = this.handleOnRemoveLozengeItem.bind(this);
    this.handleAddVariantAttribute = this.handleAddVariantAttribute.bind(this);
    this.handleAddProductVariant = this.handleAddProductVariant.bind(this);
    this.handleRemoveProductVariant = this.handleRemoveProductVariant.bind(this);
    this.handleCallBackAddAttribute = this.handleCallBackAddAttribute.bind(this);
    this.handleDeleteProductAttribute = this.handleDeleteProductAttribute.bind(this);
  }

  componentWillUpdate(nextProps) {
    const {productVariantArchive} = nextProps;

    if (productVariantArchive.archived) {
      const {id, variantAttributeKey, productVariantKey} = this.state.productVariantToDelete;
      this.deleteVariantThatExistInSystem(variantAttributeKey, productVariantKey, id);
      this.props.dispatch(ProductAction.reset(Constant.RESET_ARCHIVE_VARIANT_PRODUCT));
      this.isRepsonseBackErrorOfDelete = "none";
      this.setState({modalVisible: false});
    } else if (
      productVariantArchive["error"] !== null &&
      "data" in productVariantArchive["error"] &&
      "error" in productVariantArchive["error"]["data"]
    ) {
      this.isRepsonseBackErrorOfDelete = "";
    }

    if (nextProps.variantAttributeAdd.added) {
      this.setState({variantAttributes: [nextProps.variantAttributeAdd.response.data, ...this.state.variantAttributes]});
    }
  }

  componentDidUpdate() {
    const {
      productVariant,
      dispatch,
      variantAttributeAdd
    } = this.props;
    if (productVariant && productVariant.length > 0 &&  this.state.isNotYetLoadComponentDidUpdated) {
      let existingVariantAttributes = this.state.variantAttributeList;

      productVariant.forEach(variantAttribute => {
        if (variantAttribute.status !== this.Enum.ARCHIVE) {
          if (existingVariantAttributes.length === 0) {
            this.appendVariantAttribute(existingVariantAttributes, variantAttribute);
          } else {
            let isNotTheSameVariantAttributeId = true;
            existingVariantAttributes.forEach((value, key) => {
              if (value.variantAttributeId === variantAttribute.variantAttributeId) {
                isNotTheSameVariantAttributeId = false;
                existingVariantAttributes[key]["variantList"].push({
                  id: variantAttribute.id,
                  name: variantAttribute.name,
                  barcode: variantAttribute.barcode,
                  cost: variantAttribute.cost,
                  price: variantAttribute.price,
                  status: variantAttribute.status
                });
              }
            });

            if (isNotTheSameVariantAttributeId) {
              this.appendVariantAttribute(existingVariantAttributes, variantAttribute);
            }
          }
        }
      });

      this.setState({
        variantAttributeList: existingVariantAttributes,
        isNotYetLoadComponentDidUpdated: false
      });
     
    }

    if (variantAttributeAdd.added) {
      this.props.form.setFieldsValue({[`attributeId[${this.state.addAttributeRowIndex}]`]: variantAttributeAdd.response.data.id});
      dispatch(VariantAttributeAction.reset());
      document.getElementById(`lozenge-item${this.state.addAttributeRowIndex}`).focus();
    }
  }

  componentDidMount() {
    this.setState({variantAttributes: this.props.variantAttributes});
  }

  generateProductVariant(collection) {
    let productVariantList = [];

    if (collection.length > 0 ) {
      let name = "";
      collection[0].attributeValue.forEach((value1, index1) => {
        name = `${value1}`;
        if (collection.length > 1) {
          collection[1].attributeValue.forEach((value2, index2) => {
            name = `${value1} / ${value2}`;
            if (collection.length > 2) {
              collection[2].attributeValue.forEach((value3, index3) => {
                name = `${value1} / ${value2} / ${value3}`;
                productVariantList.push(this.appendProductVariant({name, index: index3}));
              });
            } else {
              productVariantList.push(this.appendProductVariant({name, index: index2}));
            }
          });
        } else {
          productVariantList.push(this.appendProductVariant({name, index: index1}));
        }
      });
    }
    return productVariantList;
  }

  appendProductVariant(variantAttribute = {}) {
    return {
      id: variantAttribute.id,
      name: variantAttribute.name,
      barcode: variantAttribute.barcode,
      cost: variantAttribute.cost,
      price: variantAttribute.price,
      quantity: variantAttribute.quantity,
      status: variantAttribute.status,
    };
  }

  appendVariantAttribute(existingArr, variantAttribute) {
    existingArr.push({
      variantAttributeId: variantAttribute.variantAttributeId,
      variantList: [{
        id: variantAttribute.id,
        name: variantAttribute.name,
        barcode: variantAttribute.barcode,
        cost: variantAttribute.cost,
        price: variantAttribute.price,
        quantity: variantAttribute.quantity,
        status: variantAttribute.status,
      }]});;
  }

  handleCallBackAddAttribute(index) {
    this.setState({addAttributeRowIndex: index});
  }

  handleDeleteProductAttribute(index) {
    const variantAttributeList = this.state.variantAttributeList;
    variantAttributeList.splice(index, 1);
    this.setState({
      variantAttributeList,
      productVariantList: this.generateProductVariant(variantAttributeList)
    });
  }

  handleOnChangeAttribute(index) {
    document.getElementById(`lozenge-item${index}`).focus();
  }

  handleKeyDownAttributeValue(event, index) {
    if (event.target.value && (event.keyCode === 188 || event.keyCode === 13)) {
      const variantAttributeList = this.state.variantAttributeList;
      let notExistYet = true;
      variantAttributeList[index]["attributeValue"].forEach(attributeValue => {
        if (attributeValue === event.target.value) {
          notExistYet = false;
        }
      });

      if (notExistYet) {
        variantAttributeList[index]["attributeValue"].push(event.target.value);
      }

      document.getElementById(`lozenge-item${index}`).value = "";

      this.setState({
        variantAttributeList,
        productVariantList: this.generateProductVariant(variantAttributeList)
      });
    }
  }

  handleOnRemoveLozengeItem(index, inputIndex) {
    const variantAttributeList = this.state.variantAttributeList;
    variantAttributeList[inputIndex]["attributeValue"].splice(index, 1);
    this.setState({
      variantAttributeList,
      productVariantList: this.generateProductVariant(variantAttributeList)
    });
    document.getElementById(`lozenge-item${inputIndex}`).focus();
  }

  handleAddVariantAttribute() {
    const existingVariantAttributes = this.state.variantAttributeList;

    existingVariantAttributes.push({
      variantAttributeId: "",
      variantList: [],
      attributeValue: []
    });

    this.setState({
      variantAttributeList: existingVariantAttributes
    });

    // console.log("Variant Attribute:", this.state.variantAttributeList);
  }

  handleAddProductVariant(variantAttributeKey) {
    const existingVariantAttributes = this.state.variantAttributeList;

    existingVariantAttributes.forEach((variantAttribute, key) => {
      if (variantAttributeKey === key) {
        existingVariantAttributes[key]["variantList"].push({
          id: "",
          name: "",
          barcode: "",
          cost: null,
          price: null,
          quantity: 0,
          status: this.Enum.ACTIVE
        });
      }
    });
    this.setState({variantAttributeList: existingVariantAttributes});
  }

  handleSubmitConfirmAction() {
    this.props.dispatch(ProductAction.archiveVariant(this.state.productVariantToDelete.id));
  }

  handleRemoveProductVariant(productVariantRow, productVariantKey, id) {
    if (false) {
      this.setState({
        modalVisible: true,
        productVariantToDelete: {
          id,
          variantAttributeKey: productVariantRow,
          productVariantKey
        }
      });
    } else {
      const productVariantList = this.state.productVariantList;
      productVariantList.splice(productVariantRow, 1);
      this.setState({productVariantList});
    }
  }

  deleteVariantThatExistInSystem(variantAttributeKey, productVariantKey, id) {
    const existingVariantAttributes = this.state.variantAttributeList;
    if ("variantList" in existingVariantAttributes[variantAttributeKey]) {
      existingVariantAttributes[variantAttributeKey]["variantList"].forEach((variantList, variantListKey) => {
        if (variantListKey === productVariantKey && variantList.id === id) {
          existingVariantAttributes[variantAttributeKey]["variantList"][variantListKey]["status"] = this.Enum.ARCHIVE;
        }
      });
    }
    this.setState({variantAttributeList: existingVariantAttributes});
  }

  renderVariantAttribute(variantAttribute, variantAttributeKey) {
    return (
      <this.SelectSearch
        name={`attributeId[${variantAttributeKey}]`}
        label={variantAttributeKey === 0 ? <span><this.Translate id="text_attribute" /> <this.Translate id="text_attribute_example" /></span> : ""}
        placeholder="Select attribute"
        valueKey="id"
        dataSource={this.state.variantAttributes}
        defaultValue={variantAttribute.variantAttributeId}
        onChange={() => this.handleOnChangeAttribute(variantAttributeKey)}
        addNew={() => this.props.handleAddVariantAttribute(variantAttributeKey, this.handleCallBackAddAttribute)}
        form={this.props.form}/>
    );
  }
  render() {
    this.submitConfirmActionLoading = this.props.productVariantArchive.archiving;
    return (
      <this.Row>
        {
          this.state.variantAttributeList.map((variantAttribute, variantAttributeKey) =>
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
                          <span>Value (e.g. Small, Medium, Large)</span>
                        </label>
                      </div>
                      :
                      ""
                  }
                  <div style={{display: "flex"}}>
                    <div className="wrap-lozenge-group-input ant-input">
                      {
                        variantAttribute.attributeValue.map((attributeValue, attributeValueIndex) => 
                          <div key={attributeValueIndex} className="lozenge-item">
                            {attributeValue}
                            <span className="icon-delete" onClick={() => this.handleOnRemoveLozengeItem(attributeValueIndex, variantAttributeKey)}></span>
                          </div>
                        )
                      }
                      <input
                        type="text"
                        name="attbributeVvalue"
                        id={`lozenge-item${variantAttributeKey}`}
                        className="ant-input lozenge-group-input"
                        onKeyDown={(e) =>this.handleKeyDownAttributeValue(e, variantAttributeKey)}/>
                    </div>
                    <this.Button type="danger" onClick={() => this.handleDeleteProductAttribute(variantAttributeKey)} className="btn-delete-attribute">
                      <span className="icon-delete" style={{fontSize: "15pt"}}></span>
                    </this.Button>
                  </div>
                </this.Col>
              </this.Row>
            </this.Col>
          )
        }
        {
          this.state.variantAttributeList.length < 3 ?
            <this.Col md="12" className="btn-addcontact">
              <this.Button onClick={this.handleAddVariantAttribute}>
                <span className="icon-add"></span> <span><this.Translate id="btn_product_add_another_attribute" /></span>
              </this.Button>
            </this.Col>
            :
            ""
        }
        <this.Col md="12">
          <this.Table
            rowKey="name"
            dataSource={this.state.productVariantList}
            columns={this.columns}
            locale={{emptyText: <this.Translate id="placeholder_table_variant_product" />}} />
        </this.Col>
        {this.renderModalConfirmAction()}
      </this.Row>
    );
  }
}
