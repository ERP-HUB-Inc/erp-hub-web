import React from "react";
import Enum from "@enums/index";
import ProductAction from "../redux/action";
import BaseModal from "@layout/base-modal";

export default class FormCostLog extends BaseModal {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "createdAt",
        width: 200,
        key: "createdAt",
        render: createdAt => this.formatDate(createdAt)
      },
      {
        title: <this.Translate id="text_user" />,
        dataIndex: "user",
        key: "user",
        render: user => user !== null ? user.userName : this.emptyText
      },
      {
        title: <this.Translate id="col_product_cost_log_po_number" />,
        dataIndex: "purchaseOrder",
        key: "purchaseOrder",
        render: purchaseOrder => purchaseOrder !== null ? purchaseOrder.number : this.emptyText
      },
      {
        title: <this.Translate id="text_cost" />,
        dataIndex: "cost",
        key: "cost",
        render: cost => this.formatCurrency(cost)
      }
    ];
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(productVariantId) {
    this.props.dispatch(ProductAction.fetchCostLog(productVariantId, 100));
  }

  render() {
    const {productCostLog} = this.props; 
    return (
      <this.Row className="wrapRowContentTab">
        {
          this.props.formData.productOption === Enum.PRODUCT_VARIANT ?
            <this.Col md="4">
              <this.Select
                name="id"
                label={<this.Translate id="text_product_variant" />}
                valueKey="id"
                dataSource={this.props.formData.productVariants}
                defaultValue={this.props.formData.productVariants.length > 0 ? this.props.formData.productVariants[0].id : ""}
                onChange={this.handleOnChange}
                form={this.props.form}/>
            </this.Col>
            :
            ""
        }
        <this.Col md="12">
          <this.Table
            dataSource={productCostLog.list}
            columns={this.columns}
            loading={productCostLog.fetching}
            locale={{emptyText: <this.Translate id="placeholder_table_product_cost_log" />}} />
        </this.Col>
      </this.Row>
    );
  }
}