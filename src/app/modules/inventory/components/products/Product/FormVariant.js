import React from "react";
import VariantAttributeAction from "../../../actions/products/variantAttribute";
import Modal from "../../../../common/components/shares/Modal";
export default class FormVariant extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      variantAttributeList: [],
      variantAttributeSelected: []
    };
    this.handleAddVariantAttribute = this.handleAddVariantAttribute.bind(this);
    this.handleAddProductVariant = this.handleAddProductVariant.bind(this);
    this.handleRemoveVariant = this.handleRemoveVariant.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {
      dispatch,
      variantAttributeAdd
    } = this.props;
    if (variantAttributeAdd.added) {
      this.props.form.setFieldsValue({attributeId: variantAttributeAdd.response.data.id});
      dispatch(VariantAttributeAction.reset());
    }
  }

  handleAddVariantAttribute() {
    const existingVariantAttributes = this.state.variantAttributeList;

    const variantAttributeSelected = this.state.variantAttributeSelected;

    existingVariantAttributes.forEach((variantAttribute, key) => {
      variantAttributeSelected.push(this.props.form.getFieldValue(`attributeId[${key}]`));
    });

    existingVariantAttributes.push({variantList: []});
    this.setState({
      variantAttributeList: existingVariantAttributes,
      variantAttributeSelected
    }
    );
  }

  handleAddProductVariant(variantAttributeKey) {
    const existingVariantAttributes = this.state.variantAttributeList;

    existingVariantAttributes.forEach((variantAttribute, key) => {
      if (variantAttributeKey === key) {
        existingVariantAttributes[key]["variantList"].push(1);
      }
    });
    this.setState(
      {variantAttributeList: existingVariantAttributes}
    );
  }

  handleRemoveVariant(variantAttributeKey, productVariantKey) {
    const existingVariantAttributes = this.state.variantAttributeList;
    existingVariantAttributes.forEach((existingVariantAttribute, key) => {
      if (variantAttributeKey === key && "variantList" in existingVariantAttribute) {
        existingVariantAttribute["variantList"].forEach((variantList, variantListKey) => {
          if (variantListKey === productVariantKey) {
            existingVariantAttributes[variantAttributeKey]["variantList"].splice(productVariantKey, 1);
          }
        });
      }
    });

    this.setState({
      variantAttributeList: existingVariantAttributes
    }
    );
  }

  renderVariantAttribute(variantAttributeKey, variantAttributesList) {

    let defaultVariantAttribute = "";

    return (
      <this.SelectSearch
        name={`attributeId[${variantAttributeKey}]`}
        label={<this.Translate id="input_variant_attribute_name" />}
        valueKey="id"
        dataSource={variantAttributesList}
        defaultValue={defaultVariantAttribute}
        addNew={() => this.props.handleAddVariantAttribute(variantAttributeKey)}
        form={this.props.form}/>
    );
  }

  render() {
    const {currentUser, variantAttributeAdd} = this.props;
    let {variantAttributes} = this.props;

    if (variantAttributeAdd.added) {
      variantAttributes.list = [variantAttributeAdd.response.data, ...variantAttributes.list];
    }

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
                  {this.renderVariantAttribute(variantAttributeKey, variantAttributes.list)}
                </this.Col>
                {
                  "variantList" in variantAttribute ? 
                    variantAttribute.variantList.map((variant, variantKey) =>
                      <this.Row className="variant-item-row" key={variantKey}>
                        <this.Col md="3">
                          <this.InputText
                            name={`variantName[${variantAttributeKey}][${variantKey}]`}
                            label={<this.Translate id="input_product_variant_name" />}
                            placeholder={this.CATranslate("input_product_variant_name", this.props.locale)}
                            max={20}
                            required={true}
                            form={this.props.form}/>
                        </this.Col>
                        <this.Col md="3">
                          <this.InputText
                            name={`variantProductCode[${variantAttributeKey}][${variantKey}]`}
                            label={<this.Translate id="input_product_code" />}
                            placeholder={this.CATranslate("input_product_code", this.props.locale)}
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
                            form={this.props.form}/>
                        </this.Col>
                
                        <this.Col md="2">
                          <this.InputNumber
                            name={`variantProductPrice[${variantAttributeKey}][${variantKey}]`}
                            label={<span><this.Translate id="input_product_price" /><span> ({currentUser.setting.currency})</span></span>}
                            placeholder={this.CATranslate("input_product_price_placeholder",  this.props.locale)}
                            required={true}
                            form={this.props.form}/>
                        </this.Col>
                
                        <this.Col md="2" className="wrap-variant-action">
                          <this.Switchs
                            name={`variantProductStatus[${variantAttributeKey}][${variantKey}]`}
                            checked={this.props.productVariantStatus}
                            form={this.props.form}/>
                          <this.Button type="danger" className="delete-variant-item" onClick={() => this.handleRemoveVariant(variantAttributeKey, variantKey)}>
                            <span className="icon-delete" style={{fontSize: "15pt"}}></span>
                          </this.Button>
                        </this.Col>
                      </this.Row>
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
      </this.Row>
    );
  }
}

FormVariant.defaultProps = {
  productVariantStatus: 1
};