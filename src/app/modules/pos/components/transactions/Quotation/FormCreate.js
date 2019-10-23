import React from "react";
import Constant from "../../../constants/transactions/quotation";
import Enum from "../../../enums";
import EnumCustomer from "../../../../crm/enum";
import history from "../../../../../modules/common/router/history";
import Retail from "../../../../pos/components/transactions/RetailSale";
import QuotationAction from "../../../action/transaction/quotation";
import CustomerAction from "../../../../crm/actions/customers/customer";
import ConstantCustomer from "../../../../crm/constants/customers/customer";
import POSUtil from "../../../../pos/utils";
import Util from "../../../../inventory/utils";
import "./index.css";

export default class Form extends Retail {
    constructor(props){
        super(props);
        this.state = {
            ...this.state,
            isOutOfStock: false,
            isNotYetLoadComponentDidUpdated: true
          }
        this.handleSaveQuotation = this.handleSaveQuotation.bind(this);
        this.handleProcessQuotation = this.handleProcessQuotation.bind(this);
        this.handleViewQuotation = this.handleViewQuotation.bind(this);
    }

    componentDidUpdate(){
        super.componentDidUpdate();
        let quotaionValues = this.props.quotationDetail.data;
        let quotationColletion = [];
        let errorCode = "";

        if(this.state.isNotYetLoadComponentDidUpdated){
            if(quotaionValues){
                quotaionValues.quotationEntries.forEach((values, index) => {
                    quotationColletion.push({
                        id: values.id,
                        productVariantId: values.productVariant.id,
                        name: values.productVariant ? Util.getProductName(values.productVariant.product) : "",
                        variantName: values.productVariant.name ? values.productVariant.name : "",
                        barcode: values.productVariant.barcode,
                        quantity: values.quantity,
                        tax: values.tax,
                        price: values.price,
                        wholePrice: values.productVariant.wholePrice,
                        taxDescription: {
                            id: 0,
                            taxRate: 0,
                            taxName: "No Tax"
                        },
                        status: "",
                        description: values.description,
                    });
                    
                });
            
                this.props.form.setFieldsValue({ searchRecord: `${quotaionValues.customer.firstName ? quotaionValues.customer.firstName : "" } ${quotaionValues.customer.lastName ? quotaionValues.customer.lastName : ""}`});
                this.getSelectedCustomer(this.props.quotationDetail.data.customer);
               
                this.setState({
                    productOrderList: quotationColletion,
                    isNotYetLoadComponentDidUpdated: false,
                    quotationId: this.props.quotationDetail.data.id,
                    isDiscountHasAdded: this.props.quotationDetail.data.discount > 0,
                    discountValue: {type: Enum.DISCOUNT_TYPE.PERCENTAGE, value: quotaionValues.terms ? quotaionValues.terms : 0 }
                });

                this.props.dispatch(QuotationAction.reset(Constant.RESET_DETAIL_QUOTATION));
            }
        }

       
        if (this.props.customer.error) {
            errorCode = this.Util.getErrorCodeFromState(this.props.customer.error);
        }
    
        if (errorCode) {
            let message = "Something went wrong";
            if (errorCode === EnumCustomer.CUSTOMER_EXIST) {
                message = this.CATranslate("error_exist_customer", this.props.locale);
            }
            this.Message.error(message);
            this.props.dispatch(CustomerAction.reset(ConstantCustomer.RESET_ADD_CUSTOMERS));
        }
        

    }


    handleProcessQuotation(){
        this.saveQuotation(Enum.QUOTATION_STEP.PROCESS);
    }

    handleSaveQuotation(){
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
                values["total"] = POSUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount);
                values["name"] = "Quotation";
                values["totalExcludeTax"] = summaryTotal.subTotalAfterDiscount;
                values["discount"] = discountAmount;
                values["terms"] = this.state.discountValue.value;
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
        return <this.Row className="wrap-receipt-type">
                <this.Col md="12" className="receipt-type">
                  <div className="pull-left park-receipt" onClick={this.handleViewQuotation}>
                    <span className="icon-time icon-padding-right"></span><this.Translate id="text_list_quotation" />
                  </div>
                </this.Col>
              </this.Row>;
    }

    renderSaveAndPayButton(){
        return <this.Row className="payment-action">
                <this.Button type="info" className="mg-right" onClick={this.handleSaveQuotation}>
                    <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />
                </this.Button>
                <this.Button type="info"  onClick={this.handleProcessQuotation}>
                    <span className="icon-checked icon-padding-right"></span><this.Translate id="text_process" />
                </this.Button>
            </this.Row>;
    }

    FieldNotation(index,values){
        return(
            <this.InputTextArea
                name={`description[${index}]`}
                label={<this.Translate id="text_notation"/>}
                data={values.description}
                className="ca-input-v1"
                handleKeyUp={(event) => this.handleOnChangOrderField(event, index, "description")}
                placeholder={this.CATranslate("text_add_notation", this.props.locale)}
                rows={7}
                form={this.props.form} />
        )
    }

}