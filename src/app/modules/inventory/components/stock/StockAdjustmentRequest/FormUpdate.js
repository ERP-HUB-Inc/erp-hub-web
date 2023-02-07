import React from "react";
import {
  Form,
  PageHeader,
  Badge,
  Spin
} from "antd";
import sweetalert from "sweetalert";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import history from "../../../../common/router/history";
import Component from "../../../../common/components/Component";
import StockAdjustmentRequestAction from "../../../actions/stock/stockAdjustmentRequest";

export default class AdjustmentEdit extends Component {
  constructor(props) {
    super(props);
    this.ADJUSTMENT_STEP_STR = {
      [Enum.STOCK_ADJUST_STEP.REQUEST]: {name: <this.Translate id="text_requested" />, color:  this.Enum.STOCK_ADJUST_COLOR.REQUEST},
      [Enum.STOCK_ADJUST_STEP.COMPLETE]: {name: <this.Translate id="text_complete" />, color: this.Enum.STOCK_ADJUST_COLOR.COMPLETE}
    };

    this.title = <this.Translate id="text_stock_adjustment" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.dispatch(StockAdjustmentRequestAction.detail({id})); 
  }

  componentDidUpdate(nextProps) {
    if (this.props.stockAdjustmentRequestUpdate.updated && nextProps.stockAdjustmentRequestUpdate.updating) {
      sweetalert({
        icon: "success",
        title: "Success!",
        text: "You have adjusted stock!",
        buttons: false,
        timer: 1500
      })
      .then(() => {
        history.goBack();
      });
    }
  }

  handleOnChangeLocation(value){
    this.setState({locationId: value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const adjustment = this.props.stockAdjustmentRequestDetail.data;

        if (adjustment.step === Enum.STOCK_ADJUST_STEP.COMPLETE) {
          sweetalert({
            icon: "warning",
            title: "Approved!",
            text: "This adjustment already approved!",
            buttons: false,
            timer: 1500
          });

          return;
        }
        
        sweetalert({
          title: "Are you sure?",
          text: adjustment.step === Enum.STOCK_ADJUST_STEP.REQUEST && values["step"] === Enum.STOCK_ADJUST_STEP.COMPLETE ? "Once saved, you will not be able to rollback this adjustment" : "",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willSubmit) => {
          if (willSubmit) {
            values["id"] = adjustment.id;
            const stockAdjustmentEntries = [];
            if("productVariantId" in values) {
              values.productVariantId.forEach((productVariantId, index) => {
                stockAdjustmentEntries.push({
                  id: values.stockAdjustmentRequestId[index],
                  currentQuantity: parseInt(values.currentQty[index], 10),
                  productVariantId,
                  productName: values.productName[index],
                  variantName: values.variantName[index],
                  barcode: values.barcode[index],
                  unitId: values.unitId[index],
                  adjustQuantity: values.adjustQuantity[index],
                  status: values.stockAdjustmentRequestStatus[index]
                });
              });
            } else {
              this.Message.warning(this.CATranslate("error_stock_adjustment_no_entry", this.props.locale), 3);
              return;
            }

            this.Util.clearObjProperty(values, [
              "productVariantId",
              "stockAdjustmentRequestId",
              "stockAdjustmentRequestStatus",
              "variantName",
              "isFocusOnSearchCompositeProduct",
              "adjust",
              "currentQty",
              "different",
              "searchProduct",
              "productName",
              "unitId",
              "adjustQuantity"
            ]);
            values["title"] = null;
            values["locationId"] = parseFloat(values.locationId);
            values["entries"] = stockAdjustmentEntries;
            this.dispatch(StockAdjustmentRequestAction.update(values));
          }
        });     
      }
    });
  }

  
  handleCancel() {
    history.goBack();
  }

  render() {
    const {
      stockAdjustmentRequestDetail,
      form, 
      locale, 
      productSearch,
      dispatch
    } = this.props,
    isApproved = stockAdjustmentRequestDetail.data && stockAdjustmentRequestDetail.data.step === Enum.STOCK_ADJUST_STEP.COMPLETE;

    return <div style={{marginBottom: 25, height: "100%"}}>
      <PageHeader
        style={{
            backgroundColor: "#f7f7f7",
            paddingLeft: 0,
            paddingRight: 0
        }}
        onBack={() => history.goBack()}
        title={<this.Translate id="text_stock_adjustment" />}
        subTitle={<div><this.Translate id="text_edit_adjustment" /><Badge count={isApproved ? "Approved" : "Requested"} style={{ backgroundColor: isApproved ? "#52c41a" : "#f0ad4e" }} /></div>}
        extra={[]}
      />
      {
        stockAdjustmentRequestDetail.fetched ?
        <Form autoComplete="off" onSubmit={this.handleSubmit} style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
          <FormItem 
              form={form} 
              formData={stockAdjustmentRequestDetail.data} 
              productVariant={this.props.productVariant}
              productSearch={productSearch}
              dispatch={dispatch} 
              locale={locale}
            />
          
          <this.Row style={{justifyContent: "center", marginTop: 25, marginBottom: 25}}>
            <this.Button className="danger" onClick={this.handleCancel}>
              <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_back" />
            </this.Button>  
            <this.Button htmlType="submit" loading={this.props.stockAdjustmentRequestUpdate.updating} className="info" style={{marginLeft: 15}} id="btnSubmit">
              <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />(Ctrl+s)
            </this.Button>
          </this.Row>
        </Form>
        :
        <div style={{width: 30, margin: "0 auto"}}>
          <Spin />
        </div>
      }
    </div>;
  }
}