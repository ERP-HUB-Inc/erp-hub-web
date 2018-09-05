import React from "react";
import ProductAction from "../../../actions/products/product";
import Constant from "../../../constants/products/product";
import VariantAttributeAction from "../../../actions/products/variantAttribute";
import Modal from "../../../../common/components/shares/Modal";
export default class FormVariant extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      productVariantToDelete: {
        id: "",
        variantAttributeKey: null,
        productVariantKey: null
      },
      variantAttributeList: [],
      isNotYetLoadComponentDidUpdated: true,
    };
    this.confirmTextDelete = <this.Translate id="text_delete_confirm_variant_product" />;
    this.confirmTitle = <this.Translate id="delete_variant_warning" />;
    this.deleteResponseMsg = <this.Translate id="text_not_allow_to_delete_product_has_quantity" />;
    this.handleAddVariantAttribute = this.handleAddVariantAttribute.bind(this);
    this.handleAddProductVariant = this.handleAddProductVariant.bind(this);
    this.handleRemoveVariant = this.handleRemoveVariant.bind(this);
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
        status: variantAttribute.status,
      }]});;
  }

  componentWillUpdate(nextProps) {
    const {
      productVariantArchive,
      dispatch,
    } = nextProps;

    if (productVariantArchive.archived) {
      const {id, variantAttributeKey, productVariantKey} = this.state.productVariantToDelete;
      this.deleteVariantThatExistInSystem(variantAttributeKey, productVariantKey, id);
      dispatch(ProductAction.reset(Constant.RESET_ARCHIVE_VARIANT_PRODUCT));
      this.isRepsonseBackErrorOfDelete = "none";
      this.setState({modalVisible: false});
    } else if (
      productVariantArchive["error"] !== null &&
      "data" in productVariantArchive["error"] &&
      "error" in productVariantArchive["error"]["data"]
    ) {
      this.isRepsonseBackErrorOfDelete = "";
    }
  }

  componentDidUpdate() {
    const {
      productVariantToProduct,
      dispatch,
      variantAttributeAdd
    } = this.props;
    if (productVariantToProduct.length > 0 &&  this.state.isNotYetLoadComponentDidUpdated) {
      let existingVariantAttributes = this.state.variantAttributeList;

      productVariantToProduct.forEach(variantAttribute => {
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
      this.props.form.setFieldsValue({attributeId: variantAttributeAdd.response.data.id});
      dispatch(VariantAttributeAction.reset());
    }
  }

  handleAddVariantAttribute() {
    const existingVariantAttributes = this.state.variantAttributeList;

    existingVariantAttributes.push({variantAttributeId: "", variantList: []});

    this.setState({variantAttributeList: existingVariantAttributes});
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
          status: this.Enum.ACTIVE
        });
      }
    });
    this.setState(
      {variantAttributeList: existingVariantAttributes}
    );
  }

  handleDelete() {
    this.props.dispatch(ProductAction.archiveVariant(this.state.productVariantToDelete.id));
  }

  handleRemoveVariant(variantAttributeKey, productVariantKey, id) {
    if (id !== "") {
      this.setState({
        modalVisible: true,
        productVariantToDelete: {
          id,
          variantAttributeKey,
          productVariantKey
        }
      });
    } else {
      this.deleteVariantThatNotExistingInSystem(variantAttributeKey, productVariantKey);
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
  deleteVariantThatNotExistingInSystem(variantAttributeKey, productVariantKey) {
    const existingVariantAttributes = this.state.variantAttributeList;
    if ("variantList" in existingVariantAttributes[variantAttributeKey]) {
      existingVariantAttributes[variantAttributeKey]["variantList"].forEach((variantList, variantListKey) => {
        if (variantListKey === productVariantKey && variantList.id === "") {
          existingVariantAttributes[variantAttributeKey]["variantList"].splice(productVariantKey, 1);
        }
      });
    }
    this.setState({variantAttributeList: existingVariantAttributes});
  }

  renderVariantAttribute(variantAttribute, variantAttributeKey, variantAttributesList) {
    return (
      <this.SelectSearch
        name={`attributeId[${variantAttributeKey}]`}
        label={<this.Translate id="input_variant_attribute_name" />}
        valueKey="id"
        dataSource={variantAttributesList}
        defaultValue={variantAttribute.variantAttributeId}
        addNew={() => this.props.handleAddVariantAttribute(variantAttributeKey)}
        form={this.props.form}/>
    );
  }
  render() {
    const {currentUser, variantAttributeAdd} = this.props;
    let {variantAttributes, productVariantArchive} = this.props;

    if (variantAttributeAdd.added) {
      variantAttributes.list = [variantAttributeAdd.response.data, ...variantAttributes.list];
    }

    this.deleteLoading = productVariantArchive.archiving;

    return (
      <this.Row>
        <this.Col md="12" className="btn-addcontact">
          <this.Button onClick={this.handleAddVariantAttribute}>
            <span className="icon-add"></span> <span><this.Translate id="btn_product_add_another_attribute" /></span>
          </this.Button>
        </this.Col>
        {
          this.state.variantAttributeList.map((variantAttribute, variantAttributeKey) =>
            <this.Col md="12" key={variantAttributeKey} className="wrap-variant-item-row">
              <this.Row>
                <this.Col md="3">
                  {this.renderVariantAttribute(variantAttribute, variantAttributeKey, variantAttributes.list)}
                </this.Col>
                {
                  "variantList" in variantAttribute ? 
                    variantAttribute.variantList.map((variant, variantKey) =>
                      variant.status !== this.Enum.ARCHIVE ?
                        <this.Row className="variant-item-row" key={variantKey}>
                          <this.InputText
                            name={`variantProductId[${variantAttributeKey}][${variantKey}]`}
                            type="hidden"
                            data={variant.id}
                            form={this.props.form}/>
                          <this.Col md="3">
                            <this.InputText
                              name={`variantName[${variantAttributeKey}][${variantKey}]`}
                              label={<this.Translate id="input_product_variant_name" />}
                              placeholder={this.CATranslate("input_product_variant_name", this.props.locale)}
                              data={variant.name}
                              max={20}
                              required={true}
                              form={this.props.form}/>
                          </this.Col>
                          <this.Col md="3">
                            <this.InputText
                              name={`variantProductCode[${variantAttributeKey}][${variantKey}]`}
                              label={<this.Translate id="input_product_code" />}
                              placeholder={this.CATranslate("input_product_code", this.props.locale)}
                              data={variant.barcode}
                              max={20}
                              required={true}
                              form={this.props.form}/>
                          </this.Col>
                  
                          <this.Col md="2">
                            <this.InputNumber
                              name={`variantProductCost[${variantAttributeKey}][${variantKey}]`}
                              label={<span><this.Translate id="input_product_cost" /><span> ({currentUser.setting.currency})</span></span>}
                              placeholder={this.CATranslate("input_product_cost_placeholder", this.props.locale)}
                              required={true}
                              data={variant.cost}
                              form={this.props.form}/>
                          </this.Col>
                  
                          <this.Col md="2">
                            <this.InputNumber
                              name={`variantProductPrice[${variantAttributeKey}][${variantKey}]`}
                              label={<span><this.Translate id="input_product_price" /><span> ({currentUser.setting.currency})</span></span>}
                              placeholder={this.CATranslate("input_product_price_placeholder",  this.props.locale)}
                              required={true}
                              data={variant.price}
                              form={this.props.form}/>
                          </this.Col>
                  
                          <this.Col md="2" className="wrap-variant-action">
                            <this.Switchs
                              name={`variantProductStatus[${variantAttributeKey}][${variantKey}]`}
                              checked={variant.status}
                              form={this.props.form}/>
                            <this.Button type="danger" className="delete-variant-item" onClick={() => this.handleRemoveVariant(variantAttributeKey, variantKey, variant.id)}>
                              <span className="icon-delete" style={{fontSize: "15pt"}}></span>
                            </this.Button>
                          </this.Col>
                        </this.Row>
                        :
                        ""
                    )
                    :
                    ""
                }
                <this.Col md="12" className="btn-add-more-variant btn-addcontact">
                  <this.Button onClick={() => this.handleAddProductVariant(variantAttributeKey)}>
                    <span className="icon-add"></span> <span><this.Translate id="btn_product_add_another_variant" /></span>
                  </this.Button>
                </this.Col>
              </this.Row>
            </this.Col>
          )
        }
        {this.renderModalConfirmDelete()}
      </this.Row>
    );
  }
}
