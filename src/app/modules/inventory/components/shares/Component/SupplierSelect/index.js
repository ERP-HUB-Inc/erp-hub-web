import React from "react";
import SupplierAction from "../../../../actions/stock/supplier";
import { connect } from "react-redux";
import { Form } from "antd";
import Modal from "../../../../../common/components/shares/Modal";

export class Supplier extends Modal {

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(SupplierAction.fetch());
  }

  render() {
    const { form,supplier} = this.props;

    return (
      <div>
        <this.Select
          name="supplierid"
          label={this.props.label !== "" ? this.props.label : <this.Translate id="select_stock_purchase_order_from_supplier" /> }
          placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
          dataSource={supplier.list}
          valueKey="id"
          form={form}/>
      </div>
    );
  }
}

Supplier.defaultProps = {
  formData: {
    supplierid:""
  }
};


function mapStateToProps(state) {
  return {
    supplier: state.reducer.supplier.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const supplierForm =  Form.create(mapPropsToFields)(Supplier);

export default connect(mapStateToProps)(supplierForm);