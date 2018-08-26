import React from "react";
import Modal from "../../../../common/components/shares/Modal";
export default class FormComposite extends Modal {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: <this.Translate id="col_composite_product" />,
        dataIndex: "product_composite",
        key: "product_composite"
      },
      {
        title: <this.Translate id="col_composite_product_markup" />,
        dataIndex: "composite_product_markup",
        key: "composite_product_markup"
      },
      {
        title: <this.Translate id="col_composite_product_cost" />,
        dataIndex: "composite_product_cost",
        key: "composite_product_cost"
      },
      {
        title: <this.Translate id="col_composite_action" />,
        dataIndex: "composite_product_action",
        key: "composite_product_action"
      }
    ];
  }
  render() {
    return (
      <this.Row>
        <this.Col md="4">
          <this.InputText
            name="search_product"
            label={<this.Translate id="input_product_search_product" />}
            placeholder={this.CATranslate("input_product_search_product",  this.props.locale)}
            max={20}
            form={this.props.form}/>
        </this.Col>
        <this.Col md="4">
          <this.Button type="info" className="btn-add-product-compsite">
            <span className="icon-add"></span>
          </this.Button>
        </this.Col>
        <this.Col md="12">
          <this.Table 
            dataSource={[]}
            columns={this.columns}
            locale={{emptyText: <this.Translate id="placeholder_table_composite_product" />}} />
        </this.Col>
      </this.Row>
    );
  }
}