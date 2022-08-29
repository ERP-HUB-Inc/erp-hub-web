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
    Drawer
} from "antd";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactToPrint from "react-to-print";
import { 
    InputNumber, 
    InputText,
    DatePickers,
    Button,
    InputTextArea
} from "../../../../common/elements/ant-ui";
import Enum from "../../../enums/index";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import CustomerService from "../../../../crm/services/customers/CustomerService";
import CustomerAction from "../../../../crm/actions/customers/customer";
import CustomerConstant from "../../../../crm/constants/customers/customer";
import InvoiceService from "../../../services/transactions/InvoiceService";
import SearchProductDropdown from "./SearchProduct";
import VariantProduct from "../../../containers/transactions/SaleWalkin/VariantProduct";
import CustomerCreate from "../../../../crm/containers/customers/Customer/FormCreate";
import CAInvoice from "../../transactions/Invoice/CAInvoice";
import InputInvoiceNo from "./InvoiceNo";
import ReceiptTemplate from "../receipt/template";
import { Link } from "react-router-dom";
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
        showDrawer: false
    }
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
                return <div>
                    <InputText 
                        style={{display: "none"}}
                        name={`variantName[${index}]`}
                        data={record.variantName}
                        form={this.props.form} />
                    <InputTextArea
                        name={`description[${index}]`}
                        data={description}
                        inputStyle={{width: "100%"}}
                        style={{width: "100%"}}
                        form={this.props.form} />
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
    util = new Util();
    timer = null;
    id = "";
    saleOrderId = "";
    pageTitle = "";
    textRequiredCustomer = "";

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
        }

        if (idParam) {
            this.pageTitle = <Translate id="text_edit_invoice" />;
            this.setState({loading: true});
            InvoiceService.detail(idParam)
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
                if (data.discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
                    discount = this.util.getValueFromPercentage(data.total, discount);
                } 

                let taxRate = this.util.getTaxRate(data.totalExcludeTax - discount, data.total - totalExcludeTax);
                if (!taxRate)
                    taxRate = 0;
                data.taxRate = taxRate;

                delete data.transactionEntries;
                this.setState(preState => {
                    preState.formData = data;
                    preState.transactionEntries = transactionEntries;
                    return preState;
                });
            })
            .finally(() => this.setState({loading: false}));
        } else {
            this.pageTitle = <Translate id="text_create_invoice" />;
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

                const transactionEntries = [];
                if (values["description"] && values["description"].length) {
                    values["description"].forEach((description, index) => {
                        transactionEntries.push({
                            id: values.id[index],
                            productVariantId: values.productVariantId[index],
                            variantName: values.variantName[index],
                            categoryId: values.categoryId[index],
                            description,
                            quantity: values.quantity[index],
                            unitId: values.unitId[index],
                            unitName: values.unitName[index],
                            cost: values.cost[index],
                            price: values.price[index],
                            discount: 0,
                            status: values.status[index]
                        });
                    });
                    invoice["transactionEntries"] = transactionEntries;
                } else {
                    return this.util.sweetAlertMessage(stringTranslate("text_please_select_product", this.props.locale), "warning");
                }

                this.save(invoice);
            }
        });
    }

    save(invoice) {
        this.setState({saveLoading: true});
        if (this.id) {
            InvoiceService.update(invoice, this.id)
            .then(() => {
                message.success(stringTranslate("text_success_save_invoice", this.props.locale));
            })
            .catch(() => message.error("Error"))
            .finally(() => this.setState({saveLoading: false}));
        } else {
            InvoiceService.create(invoice)
            .then(() => {
                message.success(stringTranslate("text_success_save_invoice", this.props.locale));
            })
            .catch(() => message.error("Error"))
            .finally(() => this.setState({saveLoading: false}));
        }
    }

    onChangeQty = (qty, index) => {
        if (!qty || qty < 0) qty = 0;
        this.setState(preState => {
            const price = preState.transactionEntries[index].price;
            let amount = (qty * price);

            if (!amount || amount < 0) amount = 0;
            preState.transactionEntries[index].quantity = qty;
            preState.transactionEntries[index].amount = amount;
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
            return preState;
        });
    }

    onChangeTotalDiscount = (discount) => {
        this.setState(preState => {
            preState.formData.discount = discount;
            return preState;
        });
    }

    onChangeDiscountType = (type) => {
        this.setState(preState => {
            preState.formData.discountType = type;
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

    onChangeTemplate = (value) => {
        this.setState(preState => {
            preState.formData.template = value;
            return preState;
        });
    }

    removeEntry = (index) => {
        const {transactionEntries} = this.state;
        if (transactionEntries[index].id) {
            this.util.sweetAlertConfirm(stringTranslate("text_confirm_delete", this.props.locale), "warning")
            .then(isDelete => {
                if (isDelete) {
                    transactionEntries[index].status = 3;
                    this.setState({transactionEntries, productSearch: []});
                }
            });
        } else {
            transactionEntries.splice(index, 1);
            this.setState({transactionEntries, productSearch: []});
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
        let isProductVariant = product.productOption === Enum.PRODUCT_VARIANT;
        if (isProductVariant && isRequestVariantForm) {
            this.setState({
                selectedProduct: product,
                modalVariant: <VariantProduct
                product={product}
                handleCancel={this.handleCancelVariantProduct}/>
            });
            return;
        } else if (productVariant && productVariant.length > 0) {
            productVariant = productVariant[0];
            productVariant.name = isProductVariant ? productVariant.name : "";
        }
        
        const existingProductList = this.state.transactionEntries;
        if (existingProductList.length === 0) {
            existingProductList.push({
                productVariantId: productVariant.id,
                variantName: product.name ? product.name : product.namekm,
                categoryId: product.productTypeId,
                description: product.name ? product.name : product.namekm,
                unitId: product.defaultUnitId,
                quantity: 1,
                unitName: product.unit.name,
                cost: productVariant.cost,
                price: productVariant.price,
                discount: 0,
                amount: (productVariant.price * 1),
                status: 1
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
                existingProductList.push({
                    productVariantId: productVariant.id,
                    variantName: product.name ? product.name : product.namekm,
                    categoryId: product.productTypeId,
                    description: product.name ? product.name : product.namekm,
                    unitId: product.defaultUnitId,
                    quantity: 1,
                    unitName: product.unit.name,
                    cost: productVariant.cost,
                    price: productVariant.price,
                    discount: 0,
                    amount: (productVariant.price * 1),
                    status: 1
                });
            }
        }
    
        this.setState({transactionEntries: existingProductList});
        this.props.form.setFieldsValue({searchProduct: ""});
        document.getElementById("searchProduct").focus();
    }

    handleResetForm = () => {
        const {transactionEntries} = this.state;
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

    handleAfterPayment = () => {
        this.setState(preState => {
            preState.showDrawer = false;
            preState.formData.status = Enum.INVOICE_STATUS.PAID;
            return preState;
        });
        message.success("Payment success");
    }

    handleMakeAsSent = () => {
        InvoiceService.makAsSent(this.id)
        .then(() => {
            this.setState(preState => {
                preState.formData.status = Enum.INVOICE_STATUS.SENT;
            });
            message.success("Make sent success");
        })
        .catch(() => message.error("Error!...."));
    }

    handleNewInvoice = () => {
        history.push("/transactions/create-invoice");
        this.pageTitle = <Translate id="text_create_invoice" />;
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

    getTotal() {
        const {transactionEntries} = this.state;
        let total = 0;
        if (transactionEntries.length) {
            total = _.sumBy(transactionEntries, (value) => value.status !== 3 && value.amount);
        }
        if (!total || total < 0) total = 0;
        return total;
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
        const action = new URLSearchParams(window.location.search).get("action");
        if (action) {
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
            <ReceiptTemplate formData={formData} ref={re => this.receiptRef = re} />
        </div>;
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                    xs: { span: 24 },
                    sm: { span: 8 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 },
            },
        };
        const {formData} = this.state;
        let discount = Number(formData.discount);
        let subTotal = this.getTotal();
        if (formData.discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
            discount = this.util.getValueFromPercentage(subTotal, discount);
        }
        formData.totalExcludeTax = subTotal;
        let vat = this.util.getTaxValue(subTotal - discount, formData.taxRate);
        formData.total = subTotal + vat;
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
                        title={this.pageTitle} />

                    <Row>
                        <Col md={8}>
                            <Form.Item
                                style={{paddingLeft: 10, position: "relative", ...styles.itemCenter}}
                                label={<Translate id="text_customer" />}
                                labelCol={{xs: {span: 20}, sm: {span: 4}}}
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
                                style={{display: "flex", marginBottom: 4}}
                                inputStyle={{width: 269}}
                                locale={this.props.locale}
                                form={this.props.form}
                            />
                            <Input.Group compact style={{textAlign: "right"}}>
                                <InputNumber
                                    name="discount"
                                    data={formData.discount}
                                    label={<div style={{marginTop: 7, marginRight: 10}}><Translate id="text_discount" /></div>}
                                    style={{width: 210, marginRight : 8, marginBottom: 0}}
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
                            <Input.Group compact style={{textAlign: "right"}} className="input-group-full-width">
                                <Form.Item label={<div style={{marginTop: 7, marginRight: 10}}><Translate id="text_vat" /></div>}>
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
                                <TabPane tab={<Translate id="text_public_not" />} key="1" style={{width: 668}}>
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
                                <div style={{width: 100}}><Translate id="text_sub_total" /></div>
                                <div>:</div>
                                <div style={{width: 100, textAlign: "right"}}>{this.util.formatCurrency(formData.totalExcludeTax)}</div>
                            </div>
                            <div style={styles.itemSummary}>
                                <div style={{width: 100}}><Translate id="text_discount" /></div>
                                <div>:</div>
                                <div style={{width: 100, textAlign: "right", color: "red"}}>-{this.util.formatCurrency(discount)}</div>
                            </div>
                            <div style={styles.itemSummary}>
                                <div style={{width: 100}}>VAT({formData.taxRate}%)</div>
                                <div>:</div>
                                <div style={{width: 100, textAlign: "right"}}>{this.util.formatCurrency(vat)}</div>
                            </div>
                            <div style={styles.itemSummary}>
                                <div style={{width: 100}}><Translate id="text_grand_total" /></div>
                                <div>:</div>
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
                                            <Menu.Item key={4}>
                                                <ReactToPrint
                                                    trigger={() => <button style={{background: "none", border: "none", paddingLeft: 0}}>
                                                        <Translate id="text_print_receipt" />
                                                        </button>}
                                                    content={() => this.receiptRef}
                                                />
                                            </Menu.Item>
                                            : null
                                        }
                                        <Menu.Item key={5}>
                                            <Link target="_blank" to={`/transactions/create-invoice?id=${formData.id}&action=clone`} >
                                                <Translate id="text_clone" />
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item key={4} onClick={this.handleNewInvoice}>
                                            <Translate id="text_new_invoice" />
                                        </Menu.Item>
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
                        onSuccess={this.handleAfterPayment}
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