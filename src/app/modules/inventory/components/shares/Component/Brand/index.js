import React from "react";
import BrandAction from "../../../../actions/products/brand";
import { connect } from "react-redux";
import { Form } from "antd";
import Modal from "../../../../../common/components/shares/Modal";

export class BrandSelect extends Modal {

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(BrandAction.fetch());
  }

  render() {
    const { form,brand} = this.props;

    return (
      <div>
        <this.Select
          name="brandid"
          label={this.props.label !== "" ? this.props.label : <this.Translate id="select_stock_purchase_order_from_brand" /> }
          placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
          dataSource={brand.list}
          valueKey="id"
          form={form}/>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    brand: state.reducer.brand.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const brandForm =  Form.create(mapPropsToFields)(BrandSelect);

export default connect(mapStateToProps)(brandForm);