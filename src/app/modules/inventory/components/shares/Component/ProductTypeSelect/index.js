import React from "react";
import ProductTypeAction from "../../../../actions/products/productsType";
import { connect } from "react-redux";
import { Form } from "antd";
import Modal from "../../../../../common/components/shares/Modal";

export class ProductTypeSelect extends Modal {

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(ProductTypeAction.fetch());
  }

  render() {
    const { form,productsType} = this.props;

    return (
      <div>
        <this.Select
          name="productTypeid"
          label={this.props.label !== "" ? this.props.label : <this.Translate id="select_stock_purchase_order_from_productsType" /> }
          placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
          dataSource={productsType.list}
          valueKey="id"
          form={form}/>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    productsType: state.reducer.productsType.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const productsTypeForm =  Form.create(mapPropsToFields)(ProductTypeSelect);

export default connect(mapStateToProps)(productsTypeForm);