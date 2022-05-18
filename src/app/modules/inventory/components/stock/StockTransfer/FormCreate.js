import React from "react";
import {
  Form,
  PageHeader
} from "antd";
import sweetalert from "sweetalert";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Component from "../../../../common/components/Component";
import StockTransferAction from "../../../actions/stock/stockTransfer";
import history from "../../../../common/router/history";
import "./index.css";

export default class FormCreate extends Component {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_stock_transfer" />;
    this.dispatch = this.props.dispatch;
  }

  componentDidUpdate(nextProps) {
    if (this.props.stockTransferAdd.added && nextProps.stockTransferAdd.adding) {
      sweetalert({
        icon: "success",
        title: "Success!",
        text: "You have created stock transfer!",
        buttons: false,
        timer: 1500
      })
      .then(() => {
        history.goBack();
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        sweetalert({
          title: "Are you sure?",
          text: values["step"] === Enum.STOCK_STRANSFER_STEP.RECEIVED ? "Once saved, you will not be able to rollback this transfer" : "",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willSubmit) => {
          if (willSubmit) {
            const transferEntries = [];
            if ("productVariantId" in values) {
              values.productVariantId.forEach((productVariantId, index) => {
                transferEntries.push({
                  id: values.transferEntryId[index],
                  productVariantId,
                  unitId: values.unitId[index],
                  transferQuantity: parseInt(values.transferQuantity[index], 10),
                  status: values.transferEntryStatus[index]
                });
              });
            } else {
              this.Message.warning(this.CATranslate("error_purchase_order_no_entry", this.props.locale), 3);
              return;
            }

            this.Util.clearObjProperty(values, [
              "id",
              "productVariantId",
              "transferEntryId",
              "transferEntryStatus",
              "transferQuantity",
              "searchProduct",
              "productName",
              "variantName",
              "isFocusOnSearchCompositeProduct",
              "unitId"
            ]);

            values["deliveryDueDate"] = this.Util.formatDateForMYSQL(values.deliveryDueDate);

            values["transferEntries"] = transferEntries;
            this.dispatch(StockTransferAction.add(values));
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
      stockTransferAdd
    } = this.props;

    return <div style={{marginBottom: 25, height: "100%"}}>
      <PageHeader
        style={{
            backgroundColor: "#f7f7f7",
            paddingLeft: 0,
            paddingRight: 0
        }}
        onBack={() => history.goBack()}
        title={<this.Translate id="text_stock_transfer" />}
        subTitle={<this.Translate id="text_stock_transfer" />}
        extra={[]}
      />
      <Form autoComplete="off" onSubmit={this.handleSubmit} style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
          <FormItem 
            form={this.props.form}
            location={this.props.location}
            accessLocation={this.props.accessLocation}
            productSearch={this.props.productSearch} 
            productVariant={this.props.productVariant}
            dispatch={this.props.dispatch} 
            locale={this.props.locale}
          />

        <this.Row style={{justifyContent: "center", marginTop: 25, marginBottom: 25}}>
          <this.Button className="danger" onClick={this.handleCancel}>
            <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_back" />
          </this.Button>  
          <this.Button htmlType="submit" loading={stockTransferAdd.adding} className="info" style={{marginLeft: 15}} id="btnSubmit">
            <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />(Ctrl+s)
          </this.Button>
        </this.Row>
      </Form>
    </div>;
  }
}