import React from "react";
import Modal from "../../../../common/components/shares/Modal";
export default class FormVariant extends Modal {
  render() {
    return (
      <this.Row>
        <this.Col md="12" className="btn-addcontact">
          <this.Button>
            <span className="icon-add"></span> <span><this.Translate id="btn_product_add_another_attribute" /></span>
          </this.Button>
        </this.Col>
        <this.Col md="3">
          <this.Select
            name="attributeId"
            label="Attribute"
            dataSource={this.statusDataSource}
            form={this.props.form}/>
        </this.Col>
        <this.Row className="variant-item-row">
          <this.Col md="3">
            <this.InputText
              name="variantName"
              label={<this.Translate id="input_product_variant_name" />}
              placeholder={this.CATranslate("input_product_variant_name", this.props.locale)}
              max={20}
              form={this.props.form}/>
          </this.Col>

          <this.Col md="3">
            <this.InputText
              name="variantProductCode"
              label={<this.Translate id="input_product_code" />}
              placeholder={this.CATranslate("input_product_code", this.props.locale)}
              max={20}
              form={this.props.form}/>
          </this.Col>

          <this.Col md="2">
            <this.InputNumber
              name="variantProductCost"
              label={<this.Translate id="input_product_cost" />}
              placeholder={this.CATranslate("input_product_cost", this.props.locale)}
              max={20}
              form={this.props.form}/>
          </this.Col>

          <this.Col md="2">
            <this.InputNumber
              name="variantProductPrice"
              label={<this.Translate id="input_product_price" />}
              placeholder={this.CATranslate("input_product_price",  this.props.locale)}
              max={20}
              form={this.props.form}/>
          </this.Col>

          <this.Col md="2" className="wrap-variant-action">
            <this.Switchs
              name="variantProductStatus"
              checked={0}
              form={this.props.form}/>
            <this.Button type="danger" className="delete-variant-item">
              <span className="icon-delete" style={{fontSize: "15pt"}}></span>
            </this.Button>
          </this.Col>
        </this.Row>
        <this.Row className="variant-item-row">
          <this.Col md="3">
            <this.InputText
              name="variantName"
              label={<this.Translate id="input_product_variant_name" />}
              placeholder={this.CATranslate("input_product_variant_name", this.props.locale)}
              max={20}
              form={this.props.form}/>
          </this.Col>

          <this.Col md="3">
            <this.InputText
              name="variantProductCode"
              label={<this.Translate id="input_product_code" />}
              placeholder={this.CATranslate("input_product_code", this.props.locale)}
              max={20}
              form={this.props.form}/>
          </this.Col>

          <this.Col md="2">
            <this.InputText
              name="variantProductCost"
              label={<this.Translate id="input_product_cost" />}
              placeholder={this.CATranslate("input_product_cost", this.props.locale)}
              max={20}
              form={this.props.form}/>
          </this.Col>

          <this.Col md="2">
            <this.InputText
              name="variantProductPrice"
              label={<this.Translate id="input_product_price" />}
              placeholder={this.CATranslate("input_product_price",  this.props.locale)}
              max={20}
              form={this.props.form}/>
          </this.Col>

          <this.Col md="2" className="wrap-variant-action">
            <this.Switchs
              name="variantProductStatus"
              checked={0}
              form={this.props.form}/>
            <this.Button type="danger" className="delete-variant-item">
              <span className="icon-delete" style={{fontSize: "15pt"}}></span>
            </this.Button>
          </this.Col>
        </this.Row>
        <this.Col md="3" className="btn-addcontact">
          <this.Button>
            <span className="icon-add"></span> <span><this.Translate id="btn_product_add_another_variant" /></span>
          </this.Button>
        </this.Col>
      </this.Row>
    );
  }
}