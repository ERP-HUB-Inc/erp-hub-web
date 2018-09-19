import React from "react";
import Modal from "../../../../common/components/shares/Modal";
export default class VariantProduct extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributeIndex: 0
    };
    this.title = <this.Translate id="variant_product_title"/>;
    this.wrapClassName = "wrap-product-varaint";
  }
  renderCrudAction() {
  }

  handleCancel() {
    this.props.handleCancel();
  }
  render() {
    this.content = (
      <this.Row className="product-variant">
        <this.Col md="12" className="variant-breadcrumb">
          <this.Breadcrumb separator=">">
            {
              this.props.dataSource.map((attribute, attributeIndex) => 
                <this.Breadcrumb.Item key={attributeIndex}><this.Translate id="variant_product_select_text"/> {attribute.attribute}</this.Breadcrumb.Item>
              )
            }
          </this.Breadcrumb>
        </this.Col>
        {
          this.props.dataSource[this.state.selectedAttributeIndex].variant.map((variant, variantIndex) =>
            <this.Col md="4" className="variant-box" key={variantIndex}>
              <div className="variant-item">
                {variant.name}
              </div>
            </this.Col>
          )
        }
      </this.Row>
    );
    return super.render();
  }
}

VariantProduct.defaultProps = {
  dataSource: []
};