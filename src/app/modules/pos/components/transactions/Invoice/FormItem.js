import React from "react";
import { 
    Col, 
    Form, 
    PageHeader, 
    Row,
    Select,
    Input,
    Spin,
    Divider,
    Icon,
    Table,
    message,
    Tabs,
    Dropdown,
    Menu,
    Drawer,
    Badge,
    Modal
} from "antd";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactToPrint from "react-to-print";
import { Link } from "react-router-dom";
import sweetalert from "sweetalert";
import { 
    InputNumber, 
    InputText,
    DatePickers,
    Button,
    InputTextArea
} from "../../../../common/elements/ant-ui";
import { IconKeyboard } from "../../../../common/elements/IconKeyboard";
import Enum from "../../../enums/index";
import EnumProduct from "../../../../inventory/enums";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import CustomerService from "../../../../crm/services/customers/CustomerService";
import CustomerAction from "../../../../crm/actions/customers/customer";
import CustomerConstant from "../../../../crm/constants/customers/customer";
import InvoiceService from "../../../services/transactions/InvoiceService";
import QuotationService from "../../../services/transactions/QuotationService";
import SerialService from "../../../services/transactions/SerialService";
import ProductVariantAction from "../../../../inventory/actions/products/productVariant";
import SearchProductDropdown from "./SearchProduct";
import VariantProduct from "../../../containers/transactions/SaleWalkin/VariantProduct";
import CustomerCreate from "../../../../crm/containers/customers/Customer/FormCreate";
import CAInvoice from "../../transactions/Invoice/CAInvoice";
import InputInvoiceNo from "./InvoiceNo";
import ReceiptTemplate from "../receipt/template";
import ReceivedPayment from "../ReceivedPayment/Form";

const {TabPane} = Tabs;

const styles = {
    itemCenter: {
        display: "flex",
        alignItems: "center"
    },
    itemSummary: {
        display: "flex",
        justifyContent: "flex-end",
        fontSize: 16
    }
};

const paramsAction = {
    clone: "clone",
    convertToInvoice: "convertToInvoice"
};

class NewInvoice extends React.PureComponent {
    state = {
        fetching: false,
        customers: [],
        productSearch: [],
        formData: {},
        loading: false,
        transactionEntries: [],
        customerForm: null,
        saveLoading: false,
        showDrawer: false,
        selectedProduct: null,
        modalVariant: null,
        isShowModal: false
    }
    action = new URLSearchParams(window.location.search).get("action");
    entryColumn = [
        {
            title: <Translate id="text_no" />,
            dataIndex: "no",
            key: "no",
            width: 80,
            align: "center",
            render: (no, record, index) => {
                return <div>
                    {index + 1}
                    <InputText
                        style={{display: "none"}}
                        name={`id[${index}]`}
                        data={record.id ? record.id : null}
                        form={this.props.form}
                    />
                    <InputText
                        style={{display: "none"}}
                        name={`productVariantId[${index}]`}
                        data={record.productVariantId}
                        form={this.props.form}
                    />
                    <InputText
                        style={{display: "none"}}
                        name={`categoryId[${index}]`}
                        data={record.categoryId}
                        form={this.props.form}
                    />
                    <InputText
                        style={{display: "none"}}
                        name={`unitId[${index}]`}
                        data={record.unitId}
                        form={this.props.form}
                    />
                    <InputText
                        style={{display: "none"}}
                        name={`unitName[${index}]`}
                        data={record.unitName}
                        form={this.props.form}
                    />
                    <InputNumber
                        style={{display: "none"}}
                        name={`cost[${index}]`}
                        data={record.cost}
                        form={this.props.form}
                    />
                    <InputNumber
                        style={{display: "none"}}
                        name={`status[${index}]`}
                        data={record.status}
                        form={this.props.form}
                    />
                </div>;
            }
        },
        {
            title: <Translate id="text_description" />,
            dataIndex: "description",
            key: "description",
            className: "entry-column-note",
            width: 600,
            render: (description, record, index) => {
                let serials = [];
                if (record.serialNo) {
                    serials = record.serialNo.toString().split(",");
                }
                return <div>
                    <InputText 
                        style={{display: "none"}}
                        name={`variantName[${index}]`}
                        data={record.variantName}
                        form={this.props.form} />
                    <InputTextArea
                        name={`description[${index}]`}
                        data={description}
                        disabled={this.action === paramsAction.convertToInvoice ? true : false}
                        inputStyle={{width: "100%"}}
                        style={{width: "100%"}}
                        handleOnChange={(e) => this.onChangeDescription(e, index)}
                        form={this.props.form} />
                    
                    {
                        record.enableDescription || serials.length ? <div style={{position: "relative"}}>
                            <Form.Item 
                                style={{width: "100%", marginTop: 5, textAlign: "left"}} 
                                wrapperCol={{sm: {span: 24}, xs: {span: 24}}}
                                labelAlign="left"
                                label="IMEI OR SERIAL"
                            >
                            {
                                this.props.form.getFieldDecorator(`serialNo[${index}]`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: stringTranslate("error_serial_number_require", this.props.locale)
                                        },
                                        {
                                            validator: (rule, value, callback) => this.validateSerialNo(value, callback, index)
                                        }
                                    ],
                                    initialValue: serials
                                })(
                                    <Select mode="tags" 
                                        style={{width: "100%"}}
                                        placeholder="serialNo1, serialNo2, ...."
                                        dropdownStyle={{display: "none"}}
                                        onChange={(value) => this.handleChangeSerialNo(value, index)}
                                    />
                                )
                            }
                            </Form.Item>
                            <div style={{display: "flex", position: "absolute", right: 5, top: 28, color: "#5656", fontSize: 18}}>
                                <IconKeyboard style={{opacity: 0.3, marginRight: 5, cursor: "pointer"}} onClick={() => this.handelFocus(`serialNo[${index}]`)} />
                                <div style={{cursor: "pointer"}} className="icon-scaner icon-clear" onClick={() => this.handelFocus(`serialNo[${index}]`)} />
                            </div>
                        </div> : null
                    }
                    
                </div>;
            }
        },
        {
            title: <Translate id="text_quantity" />,
            dataIndex: "quantity",
            key: "quantity",
            render: (quantity, record, index) => {
                return <InputNumber
                    name={`quantity[${index}]`}
                    min={0}
                    data={quantity}
                    disabled={this.action === paramsAction.convertToInvoice ? true : false}
                    isAutoSelect={true}
                    onChange={(value) => this.onChangeQty(value, index)}
                    form={this.props.form} 
                />;
            }
        },
        {
            title: <Translate id="text_price" />,
            dataIndex: "price",
            key: "price",
            render: (price, record, index) => {
                return <InputNumber 
                    name={`price[${index}]`}
                    min={0}
                    data={price}
                    isAutoSelect={true}
                    disabled={this.action === paramsAction.convertToInvoice ? true : false}
                    onChange={(value) => this.onChangePrice(value, index)}
                    form={this.props.form} 
                />;
            }
        },
        {
            title: <Translate id="text_total" />,
            dataIndex: "amount",
            key: "amount",
            align: "right",
            className: "entry-column-amount",
            render: (amount, record, index) => {
                if (!amount || amount < 0) amount = 0;
                return <div style={{width: "100%", textAlign: "right", fontSize: 14}}>
                    {this.util.formatCurrency(amount)}
                    <Icon type="close" style={{color: "red", marginRight: -10, marginLeft: 8, cursor: "pointer"}} onClick={() => this.removeEntry(index)} />
                </div>;
            }
        }
    ];
    INVOICE_STATUS_STR = {
        [Enum.INVOICE_STATUS.DRAFT]: { title: stringTranslate("text_draft", this.props.locale), color: "#bfbfbf" },
        [Enum.INVOICE_STATUS.SENT]: { title: stringTranslate("text_sent", this.props.locale), color: "#1890ff" },
        [Enum.INVOICE_STATUS.PARTIAL]: { title: stringTranslate("text_partial_pay", this.props.locale), color: "#52c41a"},
        [Enum.INVOICE_STATUS.PAID]: { title: stringTranslate("text_paid", this.props.locale), color: "#52c41a"},
        [Enum.INVOICE_STATUS.VOID]: { title: stringTranslate("text_void", this.props.locale), color: "#d9d9d9"},
    };
    util = new Util();
    timer = null;
    id = "";
    saleOrderId = "";
    quotationId = "";
    pageTitle = "";
    textRequiredCustomer = "";
    textDiscountErr = "";

    componentDidMount() {
        let idParam = this.props.match.params.id;
        const params = new URLSearchParams(document.location.search),   
            action = params.get("action");

        if (idParam) {
            this.id = idParam;
        }

        if (action === "clone") {
            idParam = params.get("id");
        } else if (action === "convertToInvoice") {
            idParam = params.get("saleOrderId");
            this.saleOrderId = params.get("saleOrderId");

            if (params.get("quotationId")) {
                this.quotationId = params.get("quotationId");
                idParam = "";
            }
        }

        if (idParam) {
            this.pageTitle = "text_edit_invoice";
            this.getDetail(idParam);
        } else if (this.quotationId) {
            this.setState({loading: true});
            QuotationService.detail(this.quotationId)
            .then(response => {
                const data = response.data.data;
                let totalExcludeTax = Number(data.totalExcludeTax);
                if (!totalExcludeTax) {
                    totalExcludeTax = data.total;
                }

                let taxRate = this.util.getTaxRate(data.totalExcludeTax - data.discount, data.total - totalExcludeTax);
                if (!taxRate)
                    taxRate = 0;
                data.taxRate = taxRate;
                data.invoiceDate = moment().format("YYYY-MM-DD");
                this.pageTitle = "text_create_invoice";

                const transactionEntries = data.quotationEntries.length && data.quotationEntries.map(entry => ({
                    ...entry,
                    variantName: entry.description,
                    discount: 0,
                    amount: entry.quantity * entry.price
                }));
                delete data.quotationEntries;

                this.setState(preState => {
                    preState.formData = data;
                    preState.transactionEntries = transactionEntries;
                    return preState;
                });
                
            })
            .finally(() => this.setState({loading: false}));
        } else {
            this.pageTitle = "text_create_invoice";
            this.setState({
                formData: {
                    customerId: null,
                    phoneNumber: "",
                    invoiceDate: moment().format("YYYY-MM-DD"),
                    dueDate: null,
                    deposit: 0,
                    discount: 0,
                    taxRate: 0,
                    discountType: Enum.DISCOUNT_TYPE.AMOUNT,
                    publicNote: "",
                    template: Enum.PAPER_SIZE.EXCLUDE_TAX
                },
                transactionEntries: [{
                    id: "",
                    productVariantId: "",
                    variantName: "",
                    categoryId: "",
                    description: "",
                    unitId: "",
                    quantity: 0,
                    unitName: "",
                    cost: 0,
                    price: 0,
                    discount: 0,
                    amount: 0,
                    status: 1
                }]
            });
        }

        CustomerService.lists(10)
        .then(response => {
            if (response && response.data) {
                this.setState({customers: response.data.data});
            }
        });
    }

    componentDidUpdate() {
        if (this.props.customerAdd.added) {
            const {customers, formData} = this.state;
            const data = this.props.customerAdd.response.data;
            formData.customerId = data.id;
            formData.firstName = data.firstName;
            formData.lastName = data.lastName;
            formData.phoneNumber = data.phoneNumber;
            customers.unshift(data);
            this.setState({
                customers, 
                formData
            });

            this.props.dispatch(CustomerAction.reset(CustomerConstant.RESET_ADD_CUSTOMERS));
        }

        if (this.props.productVariant.fetched) {
            if (this.props.productVariant.list) {
                this.handleOnSelectList(this.state.selectedProduct, [this.props.productVariant.list], false);
            } else {
                this.Message.error(stringTranslate("error_product_not_found", this.props.locale));
                this.props.form.setFieldsValue({searchProduct: ""});
                document.getElementById("searchProduct").focus();
            }
            this.props.dispatch(ProductVariantAction.reset("RESET_PRODUCT_VARIANT"));
          }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (!values.customerId) {
                    this.textRequiredCustomer = <Translate id="text_required_customer" />;
                    return;
                }
                const {formData} = this.state;
                const subTotal = this.getTotal();

                if (this.id && ![Enum.INVOICE_STATUS.DRAFT, Enum.INVOICE_STATUS.PAID].includes(Number(formData.status))) {
                    return this.util.sweetAlertMessageV2("Warning", "Can't update invoice in this step", "warning");
                }

                if (formData.discount > subTotal) {
                    this.textDiscountErr = "Discount amount must be less than total amount";
                    return;
                }

                const invoice = {
                    customerId: values.customerId,
                    discount: values.discount,
                    exchangeRate: values.exchangeRate,
                    discountType: values.discountType,
                    publicNote: formData.publicNote,
                    template: values.template,
                    invoiceNumber: values.invoiceNumber,
                    terms: values.terms,
                    invoiceDate: this.util.formatDateForMYSQL(values["invoiceDate"]),
                    dueDate: this.util.formatDateForMYSQL(values["dueDate"]),
                    registerDate: this.util.formatDateForMYSQL(formData.registerDate ? formData.registerDate : moment()),
                    totalExcludeTax:  subTotal,
                    total: values.total
                };

                if (this.saleOrderId) {
                    invoice.referenceId = this.saleOrderId;
                    invoice.referenceNo = formData.number;
                }

                if (this.quotationId) {
                    invoice.quotationId = this.quotationId;
                }

                const transactionEntries = [];
                if (values["description"] && values["description"].length) {
                    values["description"].forEach((description, index) => {
                        if (description || values.quantity[index]) {
                            transactionEntries.push({
                                id: values.id[index],
                                productVariantId: values.productVariantId[index],
                                variantName: values.variantName[index],
                                categoryId: values.categoryId[index],
                                description,
                                quantity: values.quantity[index],
                                serialNo: values.serialNo[index] ? values.serialNo[index].toString() : "",
                                unitId: values.unitId[index],
                                unitName: values.unitName[index],
                                cost: values.cost[index],
                                price: values.price[index],
                                discount: 0,
                                status: values.status[index]
                            });
                        }
                    });
                    invoice["transactionEntries"] = transactionEntries;
                } else {
                    return this.util.sweetAlertMessage(stringTranslate("text_please_select_product", this.props.locale), "warning");
                }

                this.save(invoice);
            }
        });
    }

    getDetail(id) {
        const action = new URLSearchParams(document.location.search).get("action");
        this.setState({loading: true});
        InvoiceService.detail(id)
        .then((response) => {
            const data = response.data;
            let totalExcludeTax = Number(data.totalExcludeTax);
            if (!totalExcludeTax) {
                totalExcludeTax = data.total;
            }
            const transactionEntries = data.transactionEntries.length && data.transactionEntries.map(entry => ({
                ...entry, 
                discount: 0,
                amount: entry.quantity * entry.price,
            }));

            let discount = data.discount;

            let taxRate = this.util.getTaxRate(data.totalExcludeTax - discount, data.total - totalExcludeTax);
            if (!taxRate)
                taxRate = 0;
            data.taxRate = taxRate;

            if (action) {
                this.pageTitle = "text_create_invoice";
                data.invoiceNumber = "";
                data.invoiceDate = moment().format("YYYY-MM-DD");
            }

            delete data.transactionEntries;
            this.setState(preState => {
                preState.formData = data;
                preState.transactionEntries = transactionEntries;
                return preState;
            });
        })
        .finally(() => this.setState({loading: false}));
    }

    save(invoice) {
        this.setState({saveLoading: true});
        if (this.id) {
            InvoiceService.update(invoice, this.id)
            .then(() => {
                sweetalert({
                    icon: "success",
                    title: "Success!",
                    text: stringTranslate("text_success_save_invoice", this.props.locale),
                    buttons: false,
                    timer: 1500
                });
                this.getDetail(this.id);
            })
            .catch(() => message.error("Error"))
            .finally(() => this.setState({saveLoading: false}));
        } else {
            InvoiceService.create(invoice)
            .then((response) => {
                sweetalert({
                    icon: "success",
                    title: "Success!",
                    text: stringTranslate("text_success_save_invoice", this.props.locale),
                    buttons: false,
                    timer: 1500
                });
                this.id = response.data.data.id;
                this.saleOrderId = "";
                this.quotationId = "";
                history.push(`/transactions/update-invoice/${response.data.data.id}?after-created=1`);
                this.pageTitle = "text_edit_invoice";
                this.getDetail(this.id);
            })
            .catch(() => message.error("Error"))
            .finally(() => this.setState({saveLoading: false}));
        }
    }

    onChangeDescription = (e, index) => {
        const value = e.target.value;
        const {transactionEntries} = this.state;
        transactionEntries[index].description = value;
        const activeEntries = transactionEntries.filter(item => item.status !== 3);
        if (value && index === (activeEntries.length - 1)) {
            transactionEntries.push({
                id: "",
                productVariantId: "",
                variantName: "",
                categoryId: "",
                description: "",
                unitId: "",
                quantity: 0,
                unitName: "",
                cost: 0,
                price: 0,
                discount: 0,
                amount: 0,
                status: 1
            });
        }
        this.setState({transactionEntries});
    }

    handleChangeSerialNo = (serials, index) => {
        if (serials && serials.length) {
            const serialNo = serials[serials.length - 1];
            SerialService.findByNumber(serialNo)
            .then(response => {
                if (response.data && response.data.length) {
                    serials.pop();
                    this.props.form.setFields({
                        [`serialNo[${index}]`]: {
                            value: serials,
                            errors: [new Error(serialNo + ": " + stringTranslate("text_this_serial_is_sold", this.props.locale))]
                        }
                    });
                }
            })
            .catch(err => console.log("error", err.response));
        }
    }

    validateSerialNo(value, callback, index) {
        let qty = this.props.form.getFieldValue(`quantity[${index}]`);
        if (value && value.length !== Number(qty)) {
            callback(stringTranslate("text_serial_number_must_equal_quantity", this.props.locale));
        }

        callback();
    }

    onChangeQty = (qty, index) => {
        if (!qty || qty < 0) qty = 0;
        const serialNos = this.props.form.getFieldValue(`serialNo[${index}]`);
        if (serialNos && serialNos.length) {
            if (qty < serialNos.length) {
                this.setState({isShowModal: true}, () => {
                    this.props.form.setFieldsValue({
                        serialNameField: `serialNo[${index}]`
                    });
                });
            }
            this.props.form.validateFields([`serialNo[${index}]`]);
        }

        this.setState(preState => {
            const price = preState.transactionEntries[index].price;
            let amount = (qty * price);

            if (!amount || amount < 0) amount = 0;
            preState.transactionEntries[index].quantity = qty;
            preState.transactionEntries[index].amount = amount;
            let discount = this.props.form.getFieldValue("discountField");
            let total = this.getTotal(preState.transactionEntries);
            if (preState.formData.discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
                discount = this.util.getValueFromPercentage(total, discount);
            }
            preState.formData.discount = discount;

            return preState;
        });
    }

    onChangePrice = (price, index) => {
        if (!price || price < 0) price = 0;
        this.setState(preState => {
            const qty = preState.transactionEntries[index].quantity;
            let amount = (qty * price);

            if (!amount || amount < 0) amount = 0;
            preState.transactionEntries[index].price = price;
            preState.transactionEntries[index].amount = amount;
            let discount = this.props.form.getFieldValue("discountField");
            let total = this.getTotal(preState.transactionEntries);
            if (preState.formData.discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
                discount = this.util.getValueFromPercentage(total, discount);
            }
            preState.formData.discount = discount;
            return preState;
        });
    }

    handleRemoveSerialsNo = () => {
        const removeSerials = this.props.form.getFieldValue("removeSerials");
        const serialNameField = this.props.form.getFieldValue("serialNameField");

        const serialsNo = this.props.form.getFieldValue(serialNameField);
        
        const newSerials = serialsNo.filter(serial => !removeSerials.includes(serial));
        if (newSerials) {
            this.props.form.setFieldsValue({[`${serialNameField}`]: newSerials});
            this.setState({isShowModal: false});
        }
    }

    onChangeTotalDiscount = (discount) => {
        this.textDiscountErr = "";
        this.setState(preState => {
            if (preState.formData.discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
                let total = this.getTotal();
                discount = this.util.getValueFromPercentage(total, discount);
            }
            preState.formData.discount = discount;
            return preState;
        });
    }

    onChangeDiscountType = (type) => {
        this.textDiscountErr = "";
        this.setState(preState => {
            let discount = this.props.form.getFieldValue("discountField");
            if (type === Enum.DISCOUNT_TYPE.PERCENTAGE) {
                let total = this.getTotal();
                discount = this.util.getValueFromPercentage(total, discount);
            }
            preState.formData.discountType = type;
            preState.formData.discount = discount;
            return preState;
        });
    }

    onChangeTaxRate = (e) => {
        e.preventDefault();
        const value = e.target.value;
        if (value) {
            this.setState(preState => {
                preState.formData.taxRate = Number(value);
                return preState;
            });
        }
    }

    handelFocus(fieldName) {
        
    }

    onChangeTemplate = (value) => {
        this.setState(preState => {
            preState.formData.template = value;
            return preState;
        });
    }

    removeEntry = (index) => {
        const {transactionEntries, formData} = this.state;
        if (this.action === paramsAction.convertToInvoice) {
            return this.util.sweetAlertMessage("Can't remove entry in this step", "warning");
        }

        if (transactionEntries[index].id) {
            this.util.sweetAlertConfirm(stringTranslate("text_confirm_delete", this.props.locale), "warning")
            .then(isDelete => {
                if (isDelete) {
                    let discount = this.props.form.getFieldValue("discountField");
                    let type = this.props.form.getFieldValue("discountType");
                    transactionEntries[index].status = 3;
                    if (Number(type) === Enum.DISCOUNT_TYPE.PERCENTAGE) {
                        let total = this.getTotal();
                        discount = this.util.getValueFromPercentage(total, discount);
                    }
                    formData.discount = discount;
                    transactionEntries[index].status = 3;
                    this.setState({transactionEntries, formData, productSearch: []});
                }
            });
        } else {
            transactionEntries.splice(index, 1);
            let discount = this.props.form.getFieldValue("discountField");
            let type = this.props.form.getFieldValue("discountType");
            if (Number(type) === Enum.DISCOUNT_TYPE.PERCENTAGE) {
                let total = this.getTotal();
                discount = this.util.getValueFromPercentage(total, discount);
            }
            formData.discount = discount;
            this.setState({transactionEntries, formData, productSearch: []});
        }
    }

    fetchCustomer = (value) => {
        clearTimeout(this.timer);
        let search = "";
        if (value.length > 1) {
            search = JSON.stringify({column: ["firstName", "lastName"], value});
        }

        this.timer = setTimeout(() => {
            this.setState({fetching: true});
            CustomerService.lists(15, 0, "", "", "", search)
            .then((response) =>  this.setState({customers: response && response.data.data}))
            .finally(() => this.setState({fetching: false}));
        }, 1000);
    }

    handleOnSelectList = (product, productVariant, isRequestVariantForm = true) => {
        let isProductVariant = product.productOption === EnumProduct.PRODUCT_VARIANT;
        let discount = this.props.form.getFieldValue("discountField");
        let type = this.props.form.getFieldValue("discountType");
        if (isProductVariant && isRequestVariantForm) {
            this.setState({
                selectedProduct: product,
                modalVariant: <VariantProduct
                product={product}
                handleCancel={() => this.setState({modalVariant: null})}/>
            });
            return;
        } else if (productVariant && productVariant.length > 0) {
            productVariant = productVariant[0];
            productVariant.name = isProductVariant ? productVariant.name : "";
        }
        
        const existingProductList = this.state.transactionEntries;
        const formData = this.state.formData;
        if (existingProductList.length === 0) {
            existingProductList.unshift({
                id: "",
                productVariantId: productVariant.id,
                variantName: product.name ? product.name : product.namekm,
                categoryId: product.productTypeId,
                description: `${product.name ? product.name : product.namekm} ${isProductVariant ? productVariant.name : ""}`,
                unitId: product.defaultUnitId,
                quantity: 1,
                unitName: product.unit.name,
                cost: productVariant.cost,
                price: productVariant.price,
                discount: 0,
                amount: (productVariant.price * 1),
                status: 1,
                enableDescription: product.enableDescription
            });
        } else {
            let isNotTheSameProduct = true;
            existingProductList.forEach((product, index) => {
                if (product.productVariantId === productVariant.id) {
                    let quantity = existingProductList[index]["quantity"] += 1;
                    existingProductList[index]["quantity"] = quantity;
                    existingProductList[index]["amount"] = quantity * existingProductList[index]["price"];
                    isNotTheSameProduct = false;
                }
            });
    
            if (isNotTheSameProduct) {
                existingProductList.unshift({
                    id: "",
                    productVariantId: productVariant.id,
                    variantName: product.name ? product.name : product.namekm,
                    categoryId: product.productTypeId,
                    description: `${product.name ? product.name : product.namekm} ${isProductVariant ? productVariant.name : ""}`,
                    unitId: product.defaultUnitId,
                    quantity: 1,
                    unitName: product.unit.name,
                    cost: productVariant.cost,
                    price: productVariant.price,
                    discount: 0,
                    amount: (productVariant.price * 1),
                    status: 1,
                    enableDescription: product.enableDescription
                });
            }
        }
    
        let total = 0;
        if (existingProductList.length) {
            total = _.sumBy(existingProductList, (value) => value.status !== 3 && value.amount);
        }

        if (Number(type) === Enum.DISCOUNT_TYPE.PERCENTAGE) {
            discount = this.util.getValueFromPercentage(total, discount);
        }
        formData.discount = discount;
        this.setState({transactionEntries: existingProductList, formData});
        this.props.form.setFieldsValue({
            searchProduct: "",
            [`productVariantId[${0}]`]: existingProductList[0].productVariantId,
            [`description[${0}]`]: existingProductList[0].description,
            [`quantity[${0}]`]: existingProductList[0].quantity,
            [`cost[${0}]`]: existingProductList[0].cost,
            [`price[${0}]`]: existingProductList[0].price
        });
        document.getElementById("searchProduct").focus();
    }

    handleResetForm = () => {
        const {transactionEntries} = this.state;
        if (this.action === paramsAction.convertToInvoice) {
            return this.util.sweetAlertMessage("Can't clear form in this step", "warning");
        }
        this.props.form.resetFields();
        if (transactionEntries.length) {
            if (this.id) {
                this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
                .then(willClear => {
                    if (willClear) {
                        transactionEntries.forEach((entry, index) => {
                            if (entry.id) {
                                transactionEntries[index].status = 3;
                            } else {
                                transactionEntries.splice(index, 1);
                            }
                            this.setState({transactionEntries, productSearch: []});
                        });
                    }
                });
            } else {
                this.setState({transactionEntries: []});
            }
        }
    }

    handleAfterPayment = (id) => {
        this.getDetail(id);
        this.setState({showDrawer: false});
        message.success("Payment success");
    }

    handleMakeAsSent = () => {
        if (Number(this.state.formData.status) === Enum.INVOICE_STATUS.SENT) {
            return this.util.sweetAlertMessageV2("Warning!", "This invoice already sent");
        }
      
        if (Number(this.state.formData.status) !== Enum.INVOICE_STATUS.DRAFT) {
            return this.util.sweetAlertMessageV2("Warning!", "Can't mark sent invoice in this step");
        }

        this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
        .then(willSend => {
            if (willSend) {
                InvoiceService.makAsSent(this.id)
                .then(() => {
                    this.getDetail(this.id);
                    message.success("Make sent success");
                })
                .catch(() => message.error("Error!...."));
            }
        });
    }

    handleNewInvoice = () => {
        this.id = "";
        history.push("/transactions/create-invoice");
        this.pageTitle = "text_create_invoice";
        this.setState({
            formData: {
                customerId: null,
                firstName: "",
                lastName: "",
                phoneNumber: "",
                invoiceDate: moment().format("YYYY-MM-DD"),
                dueDate: null,
                deposit: 0,
                discount: 0,
                discountType: Enum.DISCOUNT_TYPE.AMOUNT,
                publicNote: "",
                template: Enum.PAPER_SIZE.EXCLUDE_TAX
            },
            transactionEntries: [{
                productVariantId: "",
                variantName: "",
                categoryId: "",
                description: "",
                unitId: "",
                quantity: 1,
                unitName: "",
                cost: 0,
                price: 0,
                discount: 0,
                amount: 0,
                status: 1
            }]
        });
    }

    handleVoidInvoice = () => {
        this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
        .then(willVoid => {
            if (willVoid) {
                InvoiceService.void(this.id)
                .then(() => {
                    this.getDetail(this.id);
                    message.success("Void invoice success");
                })
                .catch(err => {
                    const error = err.response && err.response.data && err.response.data.error;
                    if (error.message) {
                        this.util.sweetAlertMessageV2("Warning", error.message, "error");
                    }
                });
            }
        });
    }

    onSelectCustomer(value) {
        if (value) {
            this.textRequiredCustomer = "";
        } else {
            this.textRequiredCustomer = <Translate id="text_required_customer" />;
        }
    }

    showCustomerForm = () => {
        this.setState({customerForm: <CustomerCreate />});
        this.props.dispatch(CustomerAction.showForm());
    }

    renderSelectCustomer() {
        return (
            <Select
                notFoundContent={this.state.fetching ? <Spin /> : <Translate id="text_not_found_customer" />}
                filterOption={false}
                onSearch={this.fetchCustomer}
                onSelect={(value, record) => this.onSelectCustomer(value, record)}
                showSearch
                loading={this.state.fetching}
                allowClear={true}
                placeholder={`${stringTranslate("text_customer", this.props.locale)}`}
                dropdownRender={menu => (
                    <div>
                        <div>
                            {menu}
                        </div>
                        <Divider style={{ margin: "4px 0" }} />
                        <div
                            style={{ padding: "5px 8px", cursor: "pointer" }}
                            onMouseDown={e => e.preventDefault()}
                            onClick={this.showCustomerForm}
                        >
                            {
                            this.state.fetching ?
                                <Spin size="small" />
                                :
                                <div>
                                <Icon type="plus" />
                                <Translate id="text_add_new_customer" />
                                </div>
                            }
                        </div>
                    </div>
                )}
            >
                {this.state.customers && this.state.customers.map((customer, index) => 
                    <Select.Option key={index} value={customer.id}>{customer.firstName} {customer.lastName}</Select.Option>
                )}
            </Select>
        );
    }

    getTotal(transactionEntries = this.state.transactionEntries) {
        let total = 0;
        if (transactionEntries.length) {
            total = _.sumBy(transactionEntries, (value) => value.status !== 3 && value.amount);
        }
        if (!total || total < 0) total = 0;
        return total;
    }

    getDiscountField(formData) {
        let result = formData.discount;
        if (formData.discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
            result = this.util.getPercentage(formData.totalExcludeTax, result);
        }
        return result;
    }

    onChangeVATType = (type) => {
        if (type !== "include") {
            this.setState(preState => {
                preState.formData.taxRate = 0;
                return preState;
            });
        }
    }

    handleGoBack = () => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("action") || params.get("after-created")) {
            history.push("/transactions/invoice");
        } else {
            history.goBack();
        }
    }

    renderPreviewInvoice(formData) {
        formData.transactionEntries = this.state.transactionEntries;
        return <div id="wrap-invoice-form">
            <CAInvoice formData={formData} />
        </div>;
    }

    renderReceipt(formData) {
        return <div style={{display: "none"}}>
            <ReceiptTemplate formData={formData} ref={re => this.receiptRef = re} locale={this.props.locale} />
        </div>;
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                    xs: { span: 24 },
                    sm: { span: 10 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 14 },
            },
        };
        const {formData} = this.state;
        let discount = Number(formData.discount);
        let subTotal = this.getTotal();

        formData.totalExcludeTax = subTotal;
        let vat = this.util.getTaxValue(subTotal - discount, formData.taxRate);
        formData.total = subTotal + vat;
        formData.status = Number(formData.status);

        return ( 
            !this.state.loading && Object.keys(formData).length ? 
            <div>
                <Form 
                    {...formItemLayout}
                    id="invoice-form"
                    onSubmit={this.handleSubmit}>
                    <PageHeader
                        style={{
                        backgroundColor: "#f7f7f7",
                        paddingLeft: 0,
                        paddingRight: 0,
                        position: "relative"
                        }}
                        onBack={this.handleGoBack}
                        title={<Translate id={`${this.pageTitle}`} />} 
                        subTitle={  
                            <div>
                                <Translate id="text_invoice" />
                                {this.id && formData.status >= 0 ? <Badge count={this.INVOICE_STATUS_STR[formData.status].title} style={{ backgroundColor: this.INVOICE_STATUS_STR[formData.status].color}} /> : ""}
                            </div>
                        }
                    />

                    <Row>
                        <Col md={8}>
                            <Form.Item
                                style={{paddingLeft: 10, position: "relative", ...styles.itemCenter}}
                                label={<Translate id="text_customer" />}
                                labelCol={{xs: {span: 16}, sm: {span: 4}}}
                            >
                                {
                                    getFieldDecorator("customerId", {
                                        rules: [
                                            {
                                                require: true
                                            }
                                        ],
                                        initialValue: formData.customerId
                                    })(this.renderSelectCustomer())
                                }
                                <span style={{color: "red", fontSize: 13, position: "absolute", left: 0, top: 20}}>{this.textRequiredCustomer}</span>
                            </Form.Item>
                        </Col>
                        <Col md={8}>
                            <DatePickers 
                                name="invoiceDate"
                                label={<Translate id="text_invoice_date" />}
                                placeholder={`${stringTranslate("text_invoice_date", this.props.locale)}`}
                                defaultValue={formData.invoiceDate ? moment(formData.invoiceDate) : null}
                                style={styles.itemCenter}
                                form={this.props.form} />
                            <DatePickers
                                name="dueDate"
                                style={styles.itemCenter}
                                label={<Translate id="text_due_date" />}
                                placeholder={`${stringTranslate("text_due_date", this.props.locale)}`}
                                defaultValue={formData.dueDate ? moment(formData.dueDate) : null}
                                form={this.props.form} />
                            <InputNumber
                                name="exchangeRate"
                                label={<Translate id="currency_exchange" />}
                                placeholder={`${stringTranslate("currency_exchange", this.props.locale)}`}
                                style={styles.itemCenter}
                                required={true}
                                precision={0}
                                data={formData.exchangeRate}
                                isAutoSelect={true}
                                onChange={(value) => this.setState(preState => {
                                    preState.formData.exchangeRate = value;
                                    return preState;
                                })}
                                form={this.props.form}
                            />
                        </Col>
                        <Col md={8} style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
                            <InputInvoiceNo
                                name="invoiceNumber"
                                label={<div style={{marginTop: 7, marginRight: 10}}><Translate id="text_invoice_no" /></div>}
                                placeholder={`${stringTranslate("text_invoice_no", this.props.locale)}`}
                                data={formData.invoiceNumber}
                                style={{display: "flex", marginBottom: 0}}
                                inputStyle={{width: 269}}
                                locale={this.props.locale}
                                form={this.props.form}
                            />
                            <Input.Group compact style={{textAlign: "right"}}>
                                <InputNumber
                                    name="discountField"
                                    data={this.getDiscountField(formData)}
                                    label={<div style={{marginTop: 7, marginRight: 10}}><Translate id="text_discount" /></div>}
                                    style={{width: 240, marginRight : 8, marginBottom: 0}}
                                    isAutoSelect={true}
                                    min={0}
                                    onChange={this.onChangeTotalDiscount}
                                    form={this.props.form}
                                />
                                <Form.Item>
                                    {
                                        getFieldDecorator("discountType", {initialValue: formData.discountType ? formData.discountType : Enum.DISCOUNT_TYPE.AMOUNT})
                                        (
                                            <Select 
                                                onChange={this.onChangeDiscountType} 
                                                style={{marginTop: 4, width: 120}} 
                                            >
                                                <Select.Option key={0} value={Enum.DISCOUNT_TYPE.PERCENTAGE}><Translate id="text_percentage" /></Select.Option>
                                                <Select.Option key={1} value={Enum.DISCOUNT_TYPE.AMOUNT}><Translate id="text_amount" /></Select.Option>
                                            </Select>
                                        )
                                    }
                                </Form.Item>
                            </Input.Group>
                            {this.textDiscountErr ?<span style={{color: "red", width: 266, marginTop: -14, marginBottom: 4}}>{this.textDiscountErr}</span> : null}
                            <Input.Group compact style={{textAlign: "right"}} className="input-group-full-width">
                                <Form.Item style={{width: 255}} label={<div style={{marginTop: 7, marginRight: 10}}><Translate id="text_vat" /></div>}>
                                    {
                                        getFieldDecorator("vatType", {initialValue: formData.taxRate ? "include" : "exclude"})
                                        (<Select 
                                            onChange={this.onChangeVATType}
                                            style={{marginTop: 4, width: 140, marginRight: 48}} 
                                        >
                                            <Select.Option key={0} value="exclude" >Exclude</Select.Option>
                                            <Select.Option key={1} value="include" >Include</Select.Option>
                                        </Select>)
                                    }
                                </Form.Item>
                                <InputText
                                    name="taxRate"
                                    data={`${formData.taxRate}`}
                                    style={{width: 120}}
                                    addonAfter="%"
                                    disabled={this.props.form.getFieldValue("vatType") !== "include" ? true : false}
                                    handleOnFocus={(e) => e.target.select()}
                                    onChange={this.onChangeTaxRate}
                                    form={this.props.form}
                                />
                            </Input.Group>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: 20}}>
                        <SearchProductDropdown
                            productSearch={this.state.productSearch}
                            handleOnSelectList={this.handleOnSelectList}
                            className="ca-input-v1 purchase-order"
                            locale={this.props.locale}
                            style={{marginTop: 12}}
                            disabled={this.action === paramsAction.convertToInvoice ? true : false}
                            form={this.props.form}/>  
                        <Col md={24}>
                            <Table 
                                rowKey={((record, index) => index)}
                                columns={this.entryColumn}
                                className="table-form-invoice-entry"
                                dataSource={this.state.transactionEntries}
                                pagination={false}
                                locale={{emptyText: <Translate id="text_no_sale_entries_product" />}}
                                rowClassName={((record) => record.status === 3 ? "hidden" : "")}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={16}>
                            <Tabs type="card" className="invoice-form-tab-note">
                                <TabPane tab={<Translate id="text_public_note" />} key="1" style={{width: 668}}>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={formData.publicNote}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            this.setState(preState => {
                                                preState.formData.publicNote = data;
                                                return preState;
                                            });
                                        }}
                                    />
                                </TabPane>
                                <TabPane tab={<Translate id="text_terms" />} key="2">
                                    <InputText
                                        name="terms"
                                        style={{width: 450}}
                                        data={formData.terms}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            this.setState(preState => {
                                                preState.formData.terms = value;
                                                return preState;
                                            });
                                        }}
                                        isAutoSelect={true}
                                        form={this.props.form} />
                                </TabPane>
                            </Tabs>
                        </Col>
                        <Col md={8} style={{lineHeight: "30px", paddingRight: 25}}>
                            <div style={styles.itemSummary}>
                                <div><Translate id="text_sub_total" /></div>
                                <div>:</div>
                                <div style={{width: 100, textAlign: "right"}}>{this.util.formatCurrency(formData.totalExcludeTax)}</div>
                            </div>
                            <div style={styles.itemSummary}>
                                <div><Translate id="text_discount" />:</div>
                                <InputNumber
                                    name="discount"
                                    data={discount}
                                    style={{display: "none"}}
                                    form={this.props.form}
                                />
                                <div style={{width: 100, textAlign: "right", color: "red"}}>-{this.util.formatCurrency(discount)}</div>
                            </div>
                            <div style={styles.itemSummary}>
                                <div><Translate id="text_vat" />({formData.taxRate}%):</div>
                                <div style={{width: 100, textAlign: "right"}}>{this.util.formatCurrency(vat)}</div>
                            </div>
                            <div style={styles.itemSummary}>
                                <div><Translate id="text_grand_total" />:</div>
                                <div style={{width: 100, textAlign: "right"}}>{this.util.formatCurrency(formData.total - discount)}</div>
                                <InputNumber 
                                    name="total"
                                    data={formData.total}
                                    style={{display: "none"}}
                                    form={this.props.form}
                                />
                            </div>
                        </Col>
                    </Row>
                    <hr />
                    <Row style={{paddingBottom: 3}}>
                        <Col md={24} style={{display: "flex", justifyContent: "center"}}>
                            <Form.Item style={{marginTop: -4, marginRight: 15}}>
                                {
                                    getFieldDecorator("template", {initialValue: formData.template ? formData.template : Enum.PAPER_SIZE.EXCLUDE_TAX})(
                                        <Select 
                                            style={{width: 175}} 
                                            placeholder={`${stringTranslate("text_choose_template", this.props.locale)}`}
                                            onChange={(value) => this.onChangeTemplate(value)}
                                        >
                                            <Select.Option key={2} value={Enum.PAPER_SIZE.EXCLUDE_TAX}><Translate id="text_template" /> 1</Select.Option>
                                            <Select.Option key={1} value={Enum.PAPER_SIZE.INCLUDE_TAX}><Translate id="text_template" /> 2</Select.Option>
                                        </Select>
                                    )
                                }
                            </Form.Item>
                            <Button type="info" htmlType="submit" loading={this.state.saveLoading} >
                                <Translate id="text_save" />
                            </Button>
                            <Button style={{marginRight: 15, marginLeft: 15}} onClick={this.handleResetForm}>
                                <Translate id="text_clear" />
                            </Button> 
                            <Button onClick={() => window.print()} style={{marginRight: 15}}>
                                <Translate id="text_print_invoice" />
                            </Button>
                            <Dropdown 
                                overlay={(
                                    <Menu>
                                        <Menu.Item key={1} onClick={this.handleMakeAsSent}><Translate id="text_mark_as_sent" /></Menu.Item>
                                        <Menu.Item key={2} onClick={() => this.setState({showDrawer: true})}>
                                            <Translate id="text_receive_payment" />
                                        </Menu.Item>
                                        {formData.status === Enum.INVOICE_STATUS.PAID ?
                                            <Menu.Item key={3}>
                                                <ReactToPrint
                                                    trigger={() => <button style={{background: "none", border: "none", paddingLeft: 0}}>
                                                        <Translate id="text_print_receipt" />
                                                        </button>}
                                                    content={() => this.receiptRef}
                                                />
                                            </Menu.Item>
                                            : null
                                        }
                                        <Menu.Item key={4}>
                                            <Link target="_blank" to={`/transactions/create-invoice?id=${formData.id}&action=clone`} >
                                                <Translate id="text_clone" />
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item key={5} onClick={this.handleNewInvoice}>
                                            <Translate id="text_new_invoice" />
                                        </Menu.Item>
                                        {this.id ?
                                            <Menu.Item key={6} onClick={this.handleVoidInvoice}>
                                                <Translate id="text_void" />
                                            </Menu.Item>
                                            : null
                                        } 
                                    </Menu>
                                )}
                                trigger={["click"]}
                            >
                                <Button id="button-more-action"><Translate id="text_more_action" /> <Icon type="down" /></Button>
                            </Dropdown>                          
                        </Col>
                    </Row>
                </Form>
                {this.renderReceipt(formData)}
                {this.renderPreviewInvoice(formData)}
                {this.state.customerForm}
                {this.state.modalVariant}
                {
                    this.state.isShowModal ?
                    <Modal
                        title={`${stringTranslate("text_remove", this.props.locale)} ${stringTranslate("text_serial_no", this.props.locale)}`}
                        visible={this.state.isShowModal}
                        onCancel={() => this.setState({isShowModal: false})}
                        footer={null}
                    >
                        <div style={{position: "relative"}}>
                            <Form.Item
                                label={<Translate id="text_input_serial_for_remove" />}
                                style={{width: "100%"}} 
                                wrapperCol={{sm: {span: 24}, xs: {span: 24}}}>
                                {
                                    this.props.form.getFieldDecorator("removeSerials", {
                                    })(
                                        <Select mode="tags" 
                                            style={{width: "100%"}}
                                            placeholder="SerialNo1, SerialNo2, ...."
                                            dropdownStyle={{display: "none"}}
                                        />
                                    )
                                }
                            </Form.Item>
                            <div style={{display: "flex", position: "absolute", right: 5, top: 33, color: "#5656", fontSize: 18}}>
                                <IconKeyboard style={{opacity: 0.3, marginRight: 5}} />
                                <div className="icon-scaner icon-clear"></div>
                            </div>
                        </div>
                        <InputText name="serialNameField" style={{display: "none"}} form={this.props.form} />
                        <div style={{padding: "0 0 22px"}}>
                            <Button className="danger" onClick={() => this.setState({isShowModal: false})} style={{width: 80}}>
                                <Translate id="text_cancel" />
                            </Button>  
                            <Button className="info" style={{marginLeft: 15, width: 80}} onClick={this.handleRemoveSerialsNo}>
                                <Translate id="text_ok" />
                            </Button>
                        </div>
                    </Modal>
                    : null
                }
                <Drawer
                    title={<Translate id="text_receive_payment" />}
                    width={520}
                    visible={this.state.showDrawer}
                    onClose={() => this.setState({showDrawer: false})}
                >
                    <ReceivedPayment 
                        formData={formData} 
                        locale={this.props.locale}
                        onClose={() => this.setState({showDrawer: false})}
                        onSuccess={() => this.handleAfterPayment(formData.id)}
                        form={this.props.form} />
                </Drawer>
            </div>
            :
            <div style={{width: 30, margin: "0 auto", paddingTop: 30}}>
                <Spin />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        customerAdd: state.reducer.customer.add,
        productVariant: state.reducer.productVariant.request,
        locale: state.locale
    };
}

function mapPropsToFields(props) {
    return {
        form: props.form
    };
}
  
const newInvoice =  Form.create(mapPropsToFields)(NewInvoice);
  
export default connect(mapStateToProps)(newInvoice);