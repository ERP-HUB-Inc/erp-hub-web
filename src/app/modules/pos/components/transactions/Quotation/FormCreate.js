import React from "react";
import history from "../../../../../modules/common/router/history";
import Retail from "../../../../pos/components/transactions/RetailSale";
import QuotationAction from "../../../action/transaction/quotation";
import POSUtil from "../../../../pos/utils";
import "./index.css";

export default class Form extends Retail {
    constructor(props){
        super(props);
        this.handleCreateQuotation = this.handleCreateQuotation.bind(this);
    }

    handleCreateQuotation(){
        let productList = [];
        let productOrderList = this.state.productOrderList;
        const summaryTotal = POSUtil.getSummaryTotalInOrder(this.state.productOrderList, this.state.customerFieldPrice);

        if (productOrderList.length > 0) {
            this.props.form.validateFieldsAndScroll((err, values) => {
                productOrderList.forEach((values, index) => {
                    productList.push({
                        productVariantId: values.productVariantId,
                        quantity: values.quantity,
                        price: values.price
                    });
                });

                this.Util.clearObjProperty(values, [
                "description",
                "discount",
                "isFocusOnSearchCompositeProduct",
                "price",
                "quantity",
                "searchProduct",
                "searchRecord"
                ]);
                values["status"] = 0;
                values["total"] = summaryTotal.subTotal;
                values["name"] = "Create Quotation";
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

    handleSetFullScreen(){}

    saleOrderHeader(){}
    
    renderSaveAndPayButton(){
        return(
            <this.Row className="create-quotation-action" onClick={this.handleCreateQuotation}>
                <this.Button type="info" className="mg-right">
                    <span className="icon-add icon-padding-right"></span><this.Translate id="text_create_quotation" />
                </this.Button>
            </this.Row>
        );
    }
}