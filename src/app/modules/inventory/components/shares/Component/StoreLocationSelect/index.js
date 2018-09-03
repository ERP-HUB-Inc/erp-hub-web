import React from "react";
import StoreLocationAction from "../../../../../pos/action/settings/storeLocation";
import { connect } from "react-redux";
import { Form } from "antd";
import Modal from "../../../../../common/components/shares/Modal";

export class StoreLocationList extends Modal {

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(StoreLocationAction.fetch());
  }

  render() {
    const { form,storeLocation} = this.props;
    return (
      <div>
        <this.Select
          name="locationId"
          label={<this.Translate id="select_stock_purchase_delivery_to_location" />}
          placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
          dataSource={storeLocation.list}
          valueKey="id"
          form={form}
        />
      </div>
    );
  }
}

StoreLocationList.defaultProps = {
  formData: {
    locationId:""
  }
};


function mapStateToProps(state) {
  return {
    storeLocation: state.reducer.storeLocation.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const storeLocationList =  Form.create(mapPropsToFields)(StoreLocationList);

export default connect(mapStateToProps)(storeLocationList);