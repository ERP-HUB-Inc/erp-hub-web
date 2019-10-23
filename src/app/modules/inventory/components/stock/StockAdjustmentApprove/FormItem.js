import React from "react";
import Enum from "../../../enums";
import Util from "../../../utils";
import Modal from "../../../../common/components/shares/Modal";
import LocationAction from "../../../../pos/action/settings/location";

export default class FormItem extends Modal {
  constructor(props){
    super(props);
    this.state = {
      locations: [],
      unit: [],
      locationId: "",
      productLists: [],
      isNotYetLoadComponentDidUpdated: true
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
              <this.InputText name={`stockApproveId[${index}]`} type="hidden" data={record.stockApproveId} form={this.form} />
              <this.InputText name={`productVariantId[${index}]`} type="hidden" data={record.productVariantId} form={this.form} />
              <this.InputText name={`productName[${index}]`} type="hidden" data={record.productName} form={this.form} />
              <this.InputText name={`variantName[${index}]`} type="hidden" data={record.variantName} form={this.form} />
              <this.InputNumber name={`stockAdjustmentRequestStatus[${index}]`} className="hidden" data={record.stockAdjustmentRequestStatus} form={this.form} />
              <this.InputNumber name={`isApprove[${record.index}]`} data={0} className="hidden" form={this.form} />
              <this.InputNumber name={`adjustQuantity[${index}]`} className="hidden" isAutoSelect={true} disabled={true} data={record.adjustQuantity} form={this.form} /> 
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
            {
              record.variantName ?
                <div className="variant-name">{record.variantName}</div>
                :
                ""
            }
          </div>;
        }
      },
      {
        title: <this.Translate id="text_current_qty" />,
        dataIndex: "currentQty",
        width: 250,
        align: "center",
        key: "currentQty",
        render: (text, product, index) => {
          return <div>
            <this.InputNumber name={`currentQty[${index}]`} className="hidden" type="hidden" data={product.currentQty} form={this.form} />
            {product.currentQty}
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
            required={true}
            name={`unitId[${index}]`}
            valueKey="id"
            dataSource={this.state.units}
            disabled={true}
            defaultValue={record.unitId}
            form={this.form} />;
        }
      },
      {
        title: <this.Translate id="text_adjust" />,
        dataIndex: "adjustQuantity",
        width: 150,
        align: "center",
        key: "adjustQuantity",
        render: (text, record, index) => {
          return record.adjustQuantity; 
        }
      },
      {
        title: <this.Translate id="text_difference" />,
        dataIndex: "different",
        width: 150,
        align: "center",
        key: "different",
        render: (text, record, index) => {
          return  record.different;
        }
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

  componentDidUpdate(){
    const stockApprove = this.props.formData.stockAdjustmentEntries;
    if(stockApprove.length > 0 && this.state.isNotYetLoadComponentDidUpdated){

      const existingProductList = this.state.productLists;

      stockApprove.forEach((stockApprove,index) => {
        let productName = "";
        let variantName = "";
        let currentQty = 0;
        
        if (stockApprove.productVariant) {
          productName = Util.getProductName(stockApprove.productVariant.product);
          variantName = stockApprove.productVariant.product.productOption === Enum.PRODUCT_VARIANT ? stockApprove.productVariant.name : "";
          currentQty = stockApprove.currentQuantity;
        }
        
        if(stockApprove.status !== this.Enum.ARCHIVE){
          existingProductList.push({
            stockApproveId: stockApprove.id,
            index: index,
            productName,
            variantName,
            unitId: stockApprove.unitId,
            productVariantId: stockApprove.productVariantId,
            currentQty,
            adjustQuantity: stockApprove.adjustQuantity,
            different: stockApprove.adjustQuantity - currentQty,
            stockApproveStatus: stockApprove.productVariant.product.status,
            isApprove: 0
          }); 

        }
        
      }); 

      this.setState({
        productLists: existingProductList,
        isNotYetLoadComponentDidUpdated: false
      });

    }
    
  }

  onSelectChange(selectedRowKeys){

    let existingProductList = this.state.productLists;
    let form =  this.props.form;

    existingProductList.forEach((values,index) => {

      // set value when not select in list product entry 
      form.setFieldsValue({[`isApprove[${index}]`]: Enum.STOCK_ADJUST_STEP.REQUEST }); 

      // check if select change  
      if(selectedRowKeys.length > 0){
        selectedRowKeys.forEach((values,index) => {
          form.setFieldsValue({[`isApprove[${values}]`]: Enum.STOCK_ADJUST_STEP.COMPLETE });
        });
      }
       
    });
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
                name="title"
                label={<this.Translate id="text_title" />}
                data={formData.title}
                placeholder={this.CATranslate("text_title", locale)}
                errorRequired={<this.Translate id="error_require_title" />}
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
                data={formData.reason}
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
                rowKey="index"
                dataSource={this.state.productLists}
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
    locationId: ""
  }
};