import React from "react";
import {
  Form,
  PageHeader
} from "antd";
import sweetalert from "sweetalert";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import history from "../../../../common/router/history";
import Component from "../../../../common/components/Component";
import StockAdjustmentRequestAction from "../../../actions/stock/stockAdjustmentRequest";
import "../PurchaseOrder/index.css";

export default class FormCreate extends Component {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_stock_adjustment" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount() {
    window.addEventListener("keydown", (e) => {
      const S = 83;
      if (e.keyCode === S && e.ctrlKey) {
        e.preventDefault();
        document.getElementById("btnSubmit").click();
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", null);
  }

  componentDidUpdate(nextProps) {
    if (this.props.stockAdjustmentRequestAdd.added && nextProps.stockAdjustmentRequestAdd.adding) {
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

  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button className="danger" onClick={() => this.handleCancel()}>
          <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_cancel" />
        </this.Button>  
        <this.Button htmlType="submit" loading={this.submitLoading} className="info">
          <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />
        </this.Button>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        sweetalert({
          title: "Are you sure?",
          text: values["step"] === Enum.STOCK_ADJUST_STEP.COMPLETE ? "Once saved, you will not be able to rollback this adjustment" : "",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willSubmit) => {
          if (willSubmit) {
            const stockAdjustmentEntries = [];

            if("productVariantId" in values){
              values.productVariantId.forEach((productVariantId, index) => {
                stockAdjustmentEntries.push({
                  currentQuantity: parseInt(values.currentQty[index], 10),
                  productVariantId,
                  unitId: values.unitId[index],
                  adjustQuantity: values.adjustQuantity[index]
                });
              });
            } else {
              this.Message.warning(this.CATranslate("error_stock_adjustment_no_entry", this.props.locale), 3);
              return;
            }

            this.Util.clearObjProperty(values, [
              "id",
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

            values["entries"] = stockAdjustmentEntries;
            values["locationId"] = parseInt(values.locationId);
            this.dispatch(StockAdjustmentRequestAction.add(values)); 
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
      stockAdjustmentRequestAdd, 
      form, 
      locale, 
      productSearch, 
      dispatch
    } = this.props;

    return <div style={{marginBottom: 25, height: "100%"}}>
      <PageHeader
        style={{
            backgroundColor: "#f7f7f7",
            paddingLeft: 0,
            paddingRight: 0
        }}
        onBack={() => history.goBack()}
        title={<this.Translate id="text_stock_adjustment" />}
        subTitle={<this.Translate id="text_new_adjustment" />}
        extra={[]}
      />
      <Form autoComplete="off" onSubmit={this.handleSubmit} style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <FormItem 
          form={form} 
          productSearch={productSearch} 
          productVariant={this.props.productVariant}
          seletList={this.props.seletList}
          dispatch={dispatch} 
          locale={locale} />

        <this.Row style={{justifyContent: "center", marginTop: 25, marginBottom: 25}}>
          <this.Button className="danger" onClick={this.handleCancel}>
            <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_back" />
          </this.Button>  
          <this.Button htmlType="submit" loading={stockAdjustmentRequestAdd.adding} className="info" style={{marginLeft: 15}} id="btnSubmit">
            <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />(Ctrl+s)
          </this.Button>
        </this.Row>
      </Form>
    </div>;
  }
}