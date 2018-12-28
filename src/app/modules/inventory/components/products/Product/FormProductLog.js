import React from "react";
import Enum from "../../../enums";
import ProductAction from "../../../actions/products/product";
import Modal from "../../../../common/components/shares/Modal";

export default class FormProductLog extends Modal {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: <this.Translate id="col_product_cost_log_date" />,
        dataIndex: "createdAt",
        width: 200,
        key: "createdAt",
        render: createdAt => this.formatDate(createdAt)
      },
      {
        title: <this.Translate id="text_description" />,
        dataIndex: "description",
        key: "description"
      },
      {
        title: <this.Translate id="col_product_cost_log_user" />,
        dataIndex: "user",
        key: "user",
        render: user => user !== null ? user.userName : this.emptyText
      },
    ];
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(productVariantId) {
    this.props.dispatch(ProductAction.fetchLog(productVariantId, 100));
  }

  render() {
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
            dataSource={this.props.productLog.list}
            columns={this.columns}
            loading={this.props.productLog.fetching}
            locale={{emptyText: <this.Translate id="placeholder_table_product_log" />}} />
        </this.Col>
      </this.Row>
    );
  }
}