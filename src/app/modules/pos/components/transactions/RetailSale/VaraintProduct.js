import React from "react";
import ProductAction from "../../../../inventory/actions/products/product";
import ProductVariantAction from "../../../../inventory/actions/products/productVariant";
import Util from "../../../../inventory/utils";
import Modal from "../../../../common/components/shares/Modal";
import StartUp from "../../../../common/components/StartUp";
import "./index.css";
export default class VariantProduct extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      selectAttributeValueId: "",
      selectedAttributeIndex: 0,
      selectedAttributes: []
    };
    this.title = "";
    this.wrapClassName = "wrap-product-varaint";
    this.handleOnSelectAttributeValue = this.handleOnSelectAttributeValue.bind(this);
    this.handleOnSelectAttribute = this.handleOnSelectAttribute.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    this.props.dispatch(ProductAction.fetchAttributes(this.props.productId));
  }

  renderCrudAction() {
  }


  handleCancel() {
    if (this.props.handleCancel) {
      this.props.handleCancel();
    }
  }

  handleOnSelectAttribute(attributeIndex) {
    const selectedAttributes = this.state.selectedAttributes;

    let notExist = true;

    const removeIndex = [];
    selectedAttributes.forEach(selectedAttribute => {
      if (selectedAttribute.index === attributeIndex) {
        removeIndex.push(attributeIndex);
        notExist = false;
      } else if (selectedAttribute.index > attributeIndex) { // Check here we want to remove all sub selected of attribute
        removeIndex.push(attributeIndex);
      }
    });

    if (notExist) {
      return;
    }

    for (var i = removeIndex.length - 1; i >= 0; i--) {
      selectedAttributes.splice(removeIndex[i], 1);
    }

    this.setState({
      selectedAttributeIndex: attributeIndex 
    });
  }

  handleOnSelectAttributeValue(selectedAttributeIndex, attributeValueName, attributeValueId) {
    // VALIDATE ATTRIBUTE
    const selectedAttributes = this.state.selectedAttributes;
    let isNotFound = true;
    selectedAttributes.forEach(selectedAttribute => {
      if (selectedAttribute.index === selectedAttributeIndex) {
        isNotFound = false;
      }
    });

    if (isNotFound) {
      selectedAttributes.push({
        index: selectedAttributeIndex,
        name: attributeValueName
      });
    }


    // VALIDATE ATTRIBUTE VALUE
    let selectAttributeValueId = this.state.selectAttributeValueId;
    if (selectAttributeValueId === "") {
      selectAttributeValueId = attributeValueId;
    } else {
      selectAttributeValueId = `${selectAttributeValueId},${attributeValueId}`;
    }

    this.setState({selectAttributeValueId});


    // CHECK IF IS THE LAST ATTRIBUTE VALUE SELECTED
    if (selectedAttributeIndex === (this.props.productAttributes.list.length - 1)) {
      
      if (this.props.handleCancel) {
        this.props.handleCancel();
      }

      this.props.dispatch(ProductVariantAction.fetchByAttributeValue(selectAttributeValueId));

    } else {
      this.setState({
        selectedAttributeIndex: selectedAttributeIndex + 1
      });
    }
  }

  renderBreadCrumb(attribute, attributeIndex) {

    const currentAttribute = this.state.selectedAttributes.find(selectedAttribute => selectedAttribute.index === attributeIndex);

    return <this.Breadcrumb.Item className={currentAttribute ? "current ant-breadcrumb-link" : "ant-breadcrumb-link"} key={attributeIndex} onClick={() => this.handleOnSelectAttribute(attributeIndex)}>
      {currentAttribute ? `${Util.getProductAttributeName(attribute)}:${currentAttribute.name}` : <span><this.Translate id="variant_product_select_text"/> <span>{Util.getProductAttributeName(attribute)}</span></span>}
    </this.Breadcrumb.Item>;
  }

  renderAttributeValue(attributeValues) {
    const numberRow = 3;
    const attributesValueRows = this.Util.chuckCollection(attributeValues, numberRow);

    return attributesValueRows.map(values => 
      values.map((variant, variantIndex) =>
        <this.Col md={12/values.length} className="variant-box" key={variantIndex} onClick={() => this.handleOnSelectAttributeValue(this.state.selectedAttributeIndex, variant.name, variant.id)}>
          <div className="variant-item">
            {variant.name}
          </div>
        </this.Col>
      )
    );
  }

  render() {
    
    const attributesLength = this.props.productAttributes.list.length;

    this.content = (
      <this.Row className="product-variant">
        {
          this.props.productAttributes.fetched ?
            <this.Col md="12" className="variant-breadcrumb">
              <div className="ant-modal-title">{Util.getProductName(this.props.dataSource)}</div>
              <this.Breadcrumb separator=">">
                { this.props.productAttributes.list.map((attribute, attributeIndex) => this.renderBreadCrumb(attribute, attributeIndex)) }
              </this.Breadcrumb>
            </this.Col>
            :
            <StartUp />
        }
        {
          attributesLength > 0 && this.state.selectedAttributeIndex < attributesLength ?
            this.renderAttributeValue(this.props.productAttributes.list[this.state.selectedAttributeIndex]["attributeValues"])
            :
            ""
        }
      </this.Row>
    );
    return super.render();
  }
}

VariantProduct.defaultProps = {
  dataSource: []
};