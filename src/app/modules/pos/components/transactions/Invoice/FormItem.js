import React from "react";
import { 
    Col, 
    Form, 
    PageHeader, 
    Row,
    Select,
    Input,
    Spin,
    //Divider,
    Icon,
    Table,
    message
} from "antd";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import { 
    InputNumber, 
    InputText,
    DatePickers,
    Button,
    InputTextArea
} from "../../../../common/elements/ant-ui";
import Enum from "../../../../inventory/enums";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import CustomerService from "../../../../crm/services/customers/CustomerService";
import ProductService from "../../../../inventory/services/products/ProductService";
import CustomerAction from "../../../../crm/actions/customers/customer";
import InvoiceService from "../../../services/transactions/InvoiceService";
import SearchProductDropdwon from "./SearchProduct";
import VariantProduct from "../../../containers/transactions/SaleWalkin/VariantProduct";
import CustomerCreate from "../../../../crm/containers/customers/Customer/FormCreate";

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
}

class NewInvoice extends React.PureComponent {
    state = {
        fetching: false,
        customers: [],
        productSearch: [],
        formData: {
            customerId: null,
            invoiceDate: moment(),
            dueDate: null,
            deposit: 0,
            discount: 0
        },
        transactionEntries: [],
        customerForm: null,
        saveCloseLoading: false,
        saveLoading: false
    }
    entryColumn = [
        {
            title: <Translate id="text_no" />,
            dataIndex: "no",
            key: "no",
            width: 80,
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
                </div>
            }
        },
        {
            title: <Translate id="text_product" />,
            dataIndex: "variantName",
            key: "variantName",
            render: (variantName, record, index) => {
                return <div>
                    {variantName}
                    <InputText 
                        name={`variantName[${index}]`}
                        data={variantName}
                        style={{display: "none"}}
                        form={this.props.form} />
                </div>
            }
        },
        {
            title: <Translate id="text_description" />,
            dataIndex: "description",
            key: "description",
            width: 600,
            render: (description, record, index) => {
                return <InputText
                    name={`description[${index}]`}
                    data={description}
                    inputStyle={{width: "100%"}}
                    form={this.props.form} 
                />
            }
        },
        {
            title: <Translate id="text_quantity" />,
            dataIndex: "quantity",
            key: "quantity",
            render: (quantity, record, index) => {
                return <InputNumber
                    name={`quantity[${index}]`}
                    data={quantity}
                    isAutoSelect={true}
                    onChange={(value) => this.onChangeQty(value, index)}
                    form={this.props.form} 
                />
            }
        },
        {
            title: <Translate id="text_price" />,
            dataIndex: "price",
            key: "price",
            render: (price, record, index) => {
                return <InputNumber 
                    name={`price[${index}]`}
                    data={price}
                    isAutoSelect={true}
                    onChange={(value) => this.onChangePrice(value, index)}
                    form={this.props.form} 
                />
            }
        },
        {
            title: <Translate id="text_total" />,
            dataIndex: "amount",
            key: "amount",
            render: (amount, record, index) => {
                if (!amount || amount < 0) amount = 0;
                return <div style={{width: "100%", textAlign: "right", fontSize: 14}}>
                    {this.util.formatCurrency(amount)}
                    <Icon type="close" style={{color: "red", marginRight: -10, marginLeft: 8, cursor: "pointer"}} onClick={() => this.removeEntry(index)} />
                </div>
            }
        }
    ];
    util = new Util();
    timer = null;
    id = "";
    saveOption = "";
    pageTitle = "";

    componentDidMount() {
        const idParam = this.props.match.params.id;
        if (idParam) {
            this.id = idParam;
            this.pageTitle = <Translate id="text_edit_invoice" />;
            InvoiceService.detail(this.id)
            .then((response) => {
                const data = response.data;
                const formData = {
                    customerId: data.customerId,
                    invoiceDate: moment(data.invoiceDate),
                    dueDate: data.dueDate ? moment(data.dueDate) : null,
                    registerDate: moment(data.registerDate),
                    discount: data.discount,
                    deposit: data.deposit
                }
                const transactionEntries = data.transactionEntries.length && data.transactionEntries.map(entry => ({
                    ...entry, 
                    discount: 0,
                    amount: entry.quantity * entry.price,
                }));

                this.setState({
                    formData,
                    transactionEntries
                });
                this.props.form.setFieldsValue({
                    customerInfo: JSON.stringify({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phoneNumber: data.phoneNumber
                    })
                })
            })
        } else {
            this.pageTitle = <Translate id="text_create_invoice" />;
        }

        CustomerService.lists(15)
        .then(response => {
            if (response && response.data) {
                this.setState({customers: response.data.data});
            }
        })
        ProductService.searchForDrowDown(15, 0)
        .then(response => this.setState({productSearch: response && response.data.data}));
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const customer = JSON.parse(values["customerInfo"]);
                const {formData} = this.state;
                const invoice = {
                    customerId: values.customerId,
                    discount: values.discount,
                    deposit: values.deposit,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    phoneNumber: customer.phoneNumber,
                    invoiceDate: this.util.formatDateForMYSQL(values["invoiceDate"]),
                    dueDate: this.util.formatDateForMYSQL(values["dueDate"]),
                    registerDate: this.util.formatDateForMYSQL(formData.registerDate ? formData.registerDate : moment()),
                    total: this.getTotal()
                }

                const transactionEntries = [];
                if (values["productVariantId"] && values["productVariantId"].length) {
                    values["productVariantId"].forEach((productVariantId, index) => {
                        transactionEntries.push({
                            id: values.id[index],
                            productVariantId,
                            variantName: values.variantName[index],
                            categoryId: values.categoryId[index],
                            description: values.description[index],
                            quantity: values.quantity[index],
                            unitId: values.unitId[index],
                            unitName: values.unitName[index],
                            cost: values.cost[index],
                            price: values.price[index],
                            discount: 0,
                            status: values.status[index]
                        });
                    })
                    invoice["transactionEntries"] = transactionEntries;
                } else {
                    return this.util.sweetAlertMessage(stringTranslate("text_please_select_product", this.props.locale), "warning")
                }

                this.save(invoice);
            }
        })
    }

    save(invoice) {
        this.setState({
            saveLoading: true,
            saveCloseLoading: true
        });

        if (this.id) {
            InvoiceService.update(invoice, this.id)
            .then(() => {
                message.success(stringTranslate("text_success_save_invoice", this.props.locale))
                this.handlAfterSave();
            })
            .catch(() => message.error("Error"))
            .finally(() => this.setState({saveCloseLoading: false, saveLoading: false}));
        } else {
            InvoiceService.create(invoice)
            .then(() => {
                message.success(stringTranslate("text_success_save_invoice", this.props.locale));
                this.handlAfterSave();
            })
            .catch(() => message.error("Error"))
            .finally(() => this.setState({saveCloseLoading: false, saveLoading: false}));
        }
    }

    handlAfterSave() {
        if (this.saveOption === "save_close") {
            history.goBack();
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
        })
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
        })
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
            })
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
            this.setState({fetching: true})
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
        } else if (productVariant && productVariant.length > 0) { // Difference from product variant
            productVariant = productVariant[0]; // ACCESS TO PRODUCT VARIANT DEFAUTL FOR STARTDARD PRODUCT
            productVariant.name = isProductVariant ? productVariant.name : ""; // Remove product variant name away from label table
        }
        
        const existingProductList = this.state.transactionEntries;
        if (existingProductList.length === 0) {
            existingProductList.push({
                productVariantId: productVariant.id,
                variantName: product.name ? product.name : product.namekm,
                categoryId: product.productTypeId,
                description: "",
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
                    description: "",
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
                transactionEntries.forEach((entry, index) => {
                    if (entry.id) {
                        transactionEntries[index].status = 3;
                    } else {
                        transactionEntries.splice(index, 1);
                    }
                    this.setState({transactionEntries});
                })
            } else {
                this.setState({transactionEntries: []});
            }
        }
    }

    onSelectCustomer(value, record) {
        if (value) {
            const customer = record.props.object;
            this.props.form.setFieldsValue({
                "customerInfo": JSON.stringify({
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    phoneNumber: customer.phoneNumber
                })
            });
        }
    }

    showCustomerForm = () => {
        this.setState({customerForm: <CustomerCreate />})
        this.props.dispatch(CustomerAction.showForm());
        console.log("orops", this.props);
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
                        {/* <Divider style={{ margin: '4px 0' }} />
                        <div
                            style={{ padding: '5px 8px', cursor: 'pointer' }}
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
                        </div> */}
                    </div>
                )}
            >
                {this.state.customers && this.state.customers.map((customer, index) => 
                    <Select.Option key={index} object={customer} value={customer.id}>{customer.firstName} {customer.lastName}</Select.Option>
                )}
            </Select>
        )
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

    getTotalDiscount() {
        let discount = Number(this.props.form.getFieldValue("discount"));
        const type = this.props.form.getFieldValue("discountType");
        const total = this.getTotal();
        if (type === "percentage") {
            discount = this.util.getValueFromPercentage(total, discount);
        }
        if (!discount || discount < 0) discount = 0;
        return discount;
    }

    getGrandTotal() {
        let total = this.getTotal() - this.getTotalDiscount();
        if (!total || total < 0) total = 0;
        return total;
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
        }
        const {formData} = this.state;
        return (
            <div style={{marginBottom: 25}}>
                <Form 
                    {...formItemLayout}
                    onSubmit={this.handleSubmit}>
                    <PageHeader
                        style={{
                        backgroundColor: "#f7f7f7",
                        paddingLeft: 0,
                        paddingRight: 0,
                        position: "relative"
                        }}
                        onBack={() => history.goBack()}
                        title={this.pageTitle}
                        onChange={(e) => console.log("e", e)}
                        extra={[
                            <Button key={1} htmlType="submit" type="info" onClick={() => this.saveOption = "save_close"} loading={this.state.saveCloseLoading} >
                                <Translate id="text_save_and_close" />
                            </Button>,
                            <Button key={2} htmlType="submit" style={{marginLeft: 15}} onClick={() => this.saveOption = "save"} loading={this.state.saveLoading} >
                                <Translate id="text_save" />
                            </Button>,
                            <Button key={3} style={{marginLeft: 15}} onClick={this.handleResetForm}>
                                <Translate id="text_clear" />
                            </Button>                           
                        ]} />

                    <Row>
                        <Col md={8}>
                            <Form.Item
                                style={{paddingLeft: 10, ...styles.itemCenter}}
                                label={<Translate id="text_customer" />}
                                labelCol={{xs: {span: 20}, sm: {span: 4}}}
                            >
                                {getFieldDecorator("customerId", {initialValue: formData.customerId, require: true})(this.renderSelectCustomer())}
                            </Form.Item>
                            <InputText 
                                name="customerInfo"
                                style={{display: "none"}}
                                form={this.props.form}
                            />
                        </Col>
                        <Col md={8}>
                            <DatePickers 
                                name="invoiceDate"
                                label={<Translate id="text_invoice_date" />}
                                placeholder={`${stringTranslate("text_invoice_date", this.props.locale)}`}
                                defaultValue={formData.invoiceDate}
                                style={styles.itemCenter}
                                form={this.props.form} />
                            <DatePickers
                                name="dueDate"
                                style={styles.itemCenter}
                                label={<Translate id="text_due_date" />}
                                placeholder={`${stringTranslate("text_due_date", this.props.locale)}`}
                                defaultValue={formData.dueDate}
                                form={this.props.form} />
                            <InputNumber
                                name="deposit"
                                label="Partial/Deposit"
                                placeholder={`${stringTranslate("text_deposit", this.props.locale)}`}
                                style={styles.itemCenter}
                                data={formData.deposit}
                                isAutoSelect={true}
                                form={this.props.form}
                            />
                        </Col>
                        <Col md={8}>
                            <Input.Group compact style={{textAlign: "right"}}>
                                <InputNumber
                                    name="discount"
                                    data={formData.discount}
                                    label={<div style={{marginTop: 7, marginRight: 21}}><Translate id="text_discount" /></div>}
                                    style={{width: 280, marginRight : 8}}
                                    isAutoSelect={true}
                                    form={this.props.form}
                                />
                                <Form.Item>
                                    {
                                        getFieldDecorator("discountType", {initialValue: "amount"})
                                        (
                                            <Select 
                                                onChange={this.onChangeDiscountType} 
                                                style={{marginTop: 4, width: 85}} 
                                            >
                                                <Select.Option key="percentage" value="percentage"><Translate id="text_percentage" /></Select.Option>
                                                <Select.Option key="amount" value="amount"><Translate id="text_amount" /></Select.Option>
                                            </Select>
                                        )
                                    }
                                </Form.Item>
                            </Input.Group>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: 20}}>
                        <SearchProductDropdwon
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
                                dataSource={this.state.transactionEntries}
                                pagination={false}
                                locale={{emptyText: <Translate id="text_no_sale_entries_product" />}}
                                rowClassName={((record) => record.status === 3 ? "hidden" : "")}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={16}>
                            <table style={{border: "1px", borderCollapse: "collapse"}}>
                                <thead>
                                    <tr style={{height: 20}}>
                                        <th><Translate id="text_note" /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <InputTextArea 
                                                name="note"
                                                placeholder={`${stringTranslate("text_note", this.props.locale)}....`}
                                                rows={8}
                                                cols={65}
                                                form={this.props.form}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                        <Col md={8} style={{lineHeight: "30px", paddingRight: 25}}>
                            <div style={styles.itemSummary}>
                                <div style={{width: 100}}><Translate id="text_sub_total" /></div>
                                <div>:</div>
                                <div style={{width: 100, textAlign: "right"}}>{this.util.formatCurrency(this.getTotal())}</div>
                            </div>
                            <div style={styles.itemSummary}>
                                <div style={{width: 100}}><Translate id="text_discount" /></div>
                                <div>:</div>
                                <div style={{width: 100, textAlign: "right"}}>{this.util.formatCurrency(this.getTotalDiscount())}</div>
                            </div>
                            <div style={styles.itemSummary}>
                                <div style={{width: 100}}><Translate id="text_grand_total" /></div>
                                <div>:</div>
                                <div style={{width: 100, textAlign: "right"}}>{this.util.formatCurrency(this.getGrandTotal())}</div>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
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