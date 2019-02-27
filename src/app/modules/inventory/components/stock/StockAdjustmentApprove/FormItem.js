import React from "react";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";
import LocationAction from "../../../../pos/action/settings/location";

export default class FormItem extends Modal {
  constructor(props){
    super(props);
    this.state = {
      locations: [],
      unit: [],
      locationId: ""
    };
    this.form = this.props.form;
    this.onSelectChange = this.onSelectChange.bind(this);
    this.columns = [
      {
        title: <this.Translate id="text_no" />,
        dataIndex: "id",
        key: "no",
        width: 50,
        align: "center",
        render: (text, record, index) => {
          return (
            <div>
              { index + 1 }
              <this.InputText name={`stockAdjustmentRequestId[${index}]`} type="hidden" data={record.stockAdjustmentRequestId} form={this.form} />
              <this.InputText name={`productName[${index}]`} type="hidden" data={record.productName} form={this.form} />
              <this.InputText name={`variantName[${index}]`} type="hidden" data={record.variantName} form={this.form} />
            </div>
          );
        }
      },
      {
        title: <this.Translate id="text_product_name" />,
        dataIndex: "productName",
        key: "productName",
        render: (text, record) => {
          return <div>
            <div>{record.productName}</div>
            <div className="variant-name">{record.variantName}</div>
          </div>;
        }
      },
      {
        title: <this.Translate id="text_unit" />,
        dataIndex: "unit",
        width: 150,
        key: "unit",
        align: "center",
        render: (text, record, index) => {
          return <this.Select
            name={`unitId[${index}]`}
            valueKey="id"
            dataSource={this.state.units}
            defaultValue={record.unitId}
            disabled={true}
            form={this.form} />;
        }
      },
      {
        title: <this.Translate id="text_current_qty" />,
        dataIndex: "currentQty",
        width: 250,
        align: "center",
        key: "currentQty"
      }
    ];
    this.data = [
      {
        id: "10",
        productName: "Angkor Beer",
        variantName: "Lg"
      },
      {
        id: "21",
        productName: "Anchor",
        variantName: "Lg"
      }
    ];
  }

  componentDidMount(){
    this.props.dispatch(LocationAction.fetchLocationAccess(100));
    this.setState({
      locations: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.LOCATION)),
      units: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.UNIT))
    });
  }

  onSelectChange(selectedRowKeys, selectedRows){
    console.log("selectedRowKeys",selectedRowKeys);
    console.log("selectedRows",selectedRows);
  }

  render() {
    const {
      form,
      locale,
      formData
    } = this.props;

    let locationId = formData.locationId;
    if (!locationId && Array.isArray(this.state.locations)) {
      const defaultLocation = this.state.locations.find(location => location.isDefault === this.Enum.IS_DEFAULT);
      if (defaultLocation) {
        locationId = defaultLocation.id;
      }
    }

    const rowSelection = {
      onChange: this.onSelectChange
    };
    
    return (
      <this.Row id="purchase-order-form">
        <this.Col md="12">
          <this.Row className="ca-penel-v1 wrap-po-filter-create">

            <this.Col md="4">
              <this.InputText
                name="name"
                label={<this.Translate id="col_stock_adjustment_request_title" />}
                data={formData.name}
                placeholder={this.CATranslate("col_stock_adjustment_request_title", locale)}
                errorRequired={<this.Translate id="error_require_name" />}
                required={true}
                isAutoFocus={true}
                max={100}
                disabled={true}
                form={form}/> 
            </this.Col>

            <this.Col md="4">
              <this.InputText
                name="reason"
                label={<this.Translate id="text_reason" />}
                data={formData.invoiceNo}
                placeholder={this.CATranslate("text_reason",locale)}
                required={true}
                max={100}
                disabled={true}
                form={form}/>
            </this.Col>

            <this.Col md="4">
              <this.Select
                name="locationId"
                label={<this.Translate id="text_location" /> }
                placeholder={this.CATranslate("text_location", locale)}
                defaultValue={locationId}
                dataSource={this.props.accessLocation.list}
                valueKey="id"
                disabled={true}
                form={form}/>
            </this.Col>
          

          </this.Row>
          <this.Row>
            <this.Col md="12">
              <this.Table
                rowKey="stockAdjustmentId"
                dataSource={this.data}
                rowSelection={rowSelection}
                columns={this.columns}
              />
            </this.Col>
          </this.Row>
        </this.Col>

      </this.Row>
      
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    purchaseOrderEntries: [],
    locationId: ""
  },
  productSearch: []
};