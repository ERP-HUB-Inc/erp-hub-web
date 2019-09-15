import React from "react";
import Enum from "../../../enums";
import history from "../../../../../modules/common/router/history";
import Retail from "../../../../pos/components/transactions/RetailSale";
import QuotationAction from "../../../action/transaction/quotation";
import POSUtil from "../../../../pos/utils";
import "./index.css";

export default class Form extends Retail {
    constructor(props){
        super(props);
        this.handleCreateQuotation = this.handleCreateQuotation.bind(this);
        this.handleProcessQuotation = this.handleProcessQuotation.bind(this);
        this.handleViewQuotation = this.handleViewQuotation.bind(this);
    }

    handleProcessQuotation(){
        this.saveQuotation(Enum.QUOTATION_STEP.PROCESS);
    }

    handleCreateQuotation(){
        this.saveQuotation(Enum.QUOTATION_STEP.DRAFT);
    }

    saveQuotation(status = Enum.QUOTATION_STEP.DRAFT){
        let productList = [];
        let productOrderList = this.state.productOrderList;
        if (productOrderList.length > 0) {
            this.props.form.validateFieldsAndScroll((err, values) => {
                productOrderList.forEach((values, index) => {
                    productList.push({
                        productVariantId: values.productVariantId,
                        quantity: values.quantity,
                        price: this.props.form.getFieldValue(`price[${index}]`),
                        description: this.props.form.getFieldValue(`description[${index}]`)
                    });
                });

                this.Util.clearObjProperty(values, [
                "discount",
                "isFocusOnSearchCompositeProduct",
                "price",
                "quantity",
                "searchProduct",
                "searchRecord"
                ]);

                const {
                    summaryTotal,
                    discountAmount,
                    taxAmount
                  } = this.getSummaryTotal();

                values["status"] = status;
                values["discount"] = this.state.discountValue.value;
                values["total"] = POSUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount);
                values["name"] = "Quotation";
                values["Entries"] = productList;
            
                if(this.state.selectedCustomer){
                    values["customerId"] = this.state.selectedCustomer.id;
                    this.props.dispatch(QuotationAction.add(values)); 
                    history.push("/transactions/quotation");
                }else{
                    this.Message.warning(this.CATranslate("text_error_create_quotation", this.props.locale));
                }

            });
        }else{
            this.Message.warning(this.CATranslate("text_error_not_create_quotation", this.props.locale));
        }
    }

    handleViewQuotation(){
        history.push("/transactions/quotation");
    }

    saleOrderHeader(){
        return(
            <this.Row className="wrap-receipt-type">
                <this.Col md="12" className="receipt-type">
                  <div className="pull-left park-receipt" onClick={this.handleViewQuotation}>
                    <span className="icon-time icon-padding-right"></span><this.Translate id="text_list_quotation" />
                  </div>
                </this.Col>
              </this.Row>
          )
    }

    renderSaveAndPayButton(){
        return(
            <this.Row className="payment-action">
                <this.Button type="info" className="mg-right" onClick={this.handleCreateQuotation}>
                    <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />
                </this.Button>
                <this.Button type="info"  onClick={this.handleProcessQuotation}>
                    <span className="icon-checked icon-padding-right"></span><this.Translate id="text_process" />
                </this.Button>
            </this.Row>
        );
    }

    FieldNotation(index,values){
        return(
            <this.InputTextArea
                name={`description[${index}]`}
                label={<this.Translate id="text_notation"/>}
                handleKeyUp={(event) => this.handleOnChangOrderField(event, index, "description")}
                placeholder={this.CATranslate("text_add_notation", this.props.locale)}
                rows={7}
                form={this.props.form} />
        )
    }

}