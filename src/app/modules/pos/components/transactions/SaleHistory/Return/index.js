import React from "react";
import swal from "sweetalert";
import Constant from "../../../../constants/transactions/transaction";
import Enum from "../../../../enums";
import Retail from "../../../../../pos/components/transactions/RetailSale";
import TransactionAction from "../../../../action/transaction/transaction";
import SalesUtil from "../../../../../pos/utils";
import Util from "../../../../../inventory/utils";
import history from "../../../../../common/router/history";
import "./index.css";

export default class Form extends Retail {
    constructor(props){
        super(props);
        this.state = {
          ...this.state,
          disabledCustomer: true,
          isOutOfStock: false,
          returnId: "",
          isNotYetLoadComponentDidUpdated: true
        };
    }

    componentDidUpdate(){
        super.componentDidUpdate();
        const returnValues = this.props.transactionDetail.data;
        let productOrderList = [];

        if(this.state.isNotYetLoadComponentDidUpdated) {
            if(returnValues) {
                productOrderList = returnValues.transactionEntries.map(value => {
                    return {
                        id: value.id,
                        productVariantId: value.productVariant.id,
                        name: value.productVariant ? Util.getProductNameV2(value.productVariant.product) : "",
                        variantName: value.productVariant.name ? value.productVariant.name : "",
                        barcode: value.productVariant.barcode,
                        quantity: value.quantity - value.returnQuantity,
                        returnQuantity: value.returnQuantity,
                        tax: value.tax,
                        price: value.price,
                        wholePrice: value.productVariant.wholePrice,
                        distributePrice: value.productVariant.distributePrice,
                        discount: value.discount,
                        taxDescription: {
                            id: 0,
                            taxRate: 0,
                            taxName: "No Tax"
                        },
                        status: this.Enum.TRANSACTION_ENTRY_STATUS.RETURN,
                        description: value.description
                    };
                });

                this.props.form.setFieldsValue({ searchRecord: `${returnValues.customer.firstName ? returnValues.customer.firstName : "" } ${returnValues.customer.lastName ? returnValues.customer.lastName : ""}`});
                this.getSelectedCustomer(returnValues.customer);
               
                this.setState({
                    productOrderList,
                    isNotYetLoadComponentDidUpdated: false,
                    returnId: returnValues.id,
                    isDiscountHasAdded: returnValues.discount > 0,
                    discountValue: {
                        type: Enum.DISCOUNT_TYPE.PERCENTAGE,
                        value: returnValues.terms ? returnValues.terms : 0
                    }
                });

                this.props.dispatch(TransactionAction.reset(Constant.RESET_DETAIL_TRANSACTION));
            }
        }

        if (this.props.transactionReturn.updated) {
            this.props.dispatch(TransactionAction.reset(Constant.RESET_RETURN_TRANSACTION));
            history.push("/transactions/sales");
        }

        if (this.props.transactionReturn.error) {
            if (this.Util.getErrorCodeFromState(this.props.transactionReturn.error) === Enum.INVALID_QUANTITY_SALE_RETURN) {
                swal({
                    text: this.CATranslate("text_warning_invalid_quantity_to_return", this.props.locale),
                    icon: "error",
                    button: <span style={{ textTransform: "uppercase" }}><this.Translate id="text_close" /></span>,
                    dangerMode: true
                });
            }
        }

        //is redirect to saleHistory list if refresh page
        if (this.state.productOrderList.length === 0 && this.props.transactionDetail.fetched === false && this.props.transactionDetail.fetching === false){
            history.push("/transactions/sales");
        }
    }

    
    handleReturn = () => {
        swal({
            title: this.CATranslate("text_confirm_return_invoice", this.props.locale),
            text: this.CATranslate("text_message_return_invoice", this.props.locale),
            icon: "warning",
            buttons: [this.CATranslate("text_cancel", this.props.locale), this.CATranslate("text_ok", this.props.locale)],
            dangerMode: true,
        })
            .then(willDelete => {
                if (willDelete) {
                    let productOrderList = this.state.productOrderList;
                    if (productOrderList.length > 0) {
                        this.props.form.validateFieldsAndScroll((err, values) => {

                            this.Util.clearObjProperty(values, [
                                "price",
                                "quantity",
                                "searchProduct",
                                "searchRecord",
                                "description"
                            ]);

                            const {
                                summaryTotal,
                                discountAmount,
                                taxAmount
                            } = this.getSummaryTotal();


                            values["total"] = SalesUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount);
                            values["totalExcludeTax"] = summaryTotal.subTotalAfterDiscount;
                            values["discount"] = discountAmount;
                            values["transactionEntries"] = productOrderList;
                            this.props.dispatch(TransactionAction.returnTransaction(this.state.returnId, values)); 
                        });
                    } else {
                        swal({
                            text: this.CATranslate("text_error_not_return_transection", this.props.locale),
                            icon: "error",
                            button: <span style={{ textTransform: "uppercase" }}><this.Translate id="text_close" /></span>,
                            dangerMode: true
                        });
                    }
                }
            });
    }

    handleOnRemoveProductFromOrderList = (value, index, isUndo = false) => {
        if (value.id) {
            const productOrderList = this.state.productOrderList;
            productOrderList[index]["status"] = isUndo ? this.Enum.ACTIVE : this.Enum.TRANSACTION_ENTRY_STATUS.RETURN;
            this.setState({ productOrderList });
        } else {
            this.removeProductFromOrderList(value);
        }
    }
    fieldNotation = (index, values) => (
        <this.InputTextArea
            name={`description[${index}]`}
            label={<this.Translate id="text_notation" />}
            data={values.description}
            className="ca-input-v1"
            handleKeyUp={event => this.handleOnChangOrderField(event, index, "description")}
            placeholder={this.CATranslate("text_add_notation", this.props.locale)}
            rows={7}
            form={this.props.form} />
    )

    renderSaveAndPayButton = () => (
        <this.Row className="return-action">
            <this.Button type="info" className="mg-right" loading={this.props.transactionReturn.updating} onClick={this.handleReturn}>
                <span className="icon-sale-return icon-padding-right"></span>
                <this.Translate id="text_return" />
            </this.Button>
        </this.Row>
    )
}