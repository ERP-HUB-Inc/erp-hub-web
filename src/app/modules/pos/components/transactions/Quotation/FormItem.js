import React from "react";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import sweetalert from "sweetalert";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Link } from "react-router-dom";
import { 
  Form,
  Spin,
  PageHeader,
  Row,
  Select,
  Icon,
  Divider,
  Col,
  Input,
  Table,
  Tabs,
  Dropdown,
  Menu,
  message
} from "antd";
import { 
  DatePickers,
  Button,
  InputNumber,
  InputText,
  InputTextArea
} from "../../../../common/elements/ant-ui";
import history from "../../../../common/router/history";
import Enum from "../../../enums";
import EnumProduct from "../../../../inventory/enums";
import Util from "../../../../common/util";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import CustomerService from "../../../../crm/services/customers/CustomerService";
import QuotationService from "../../../services/transactions/QuotationService";
import VariantProduct from "../../../containers/transactions/SaleWalkin/VariantProduct";
import QuotationNo from "./QuotationNo";
import SearchProductDropdown from "../Invoice/SearchProduct";
import styles from "../styles";
import CAInvoice from "../Invoice/CAInvoice";

const {TabPane} = Tabs;

class FormItem extends React.PureComponent {
  state = {
    loading: false,
    formData: {},
    productSearch: [],
    customers: [],
    quotationEntries: [],
    loadingButton: false
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
          <InputTextArea
            name={`description[${index}]`}
            data={description}
            inputStyle={{width: "100%"}}
            style={{width: "100%"}}
            handleOnChange={(e) => {
              const value = e.target.value;
              this.setState(preState => {
                preState.quotationEntries[index].description = value;
              });
            }}
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
  pageTitle = "text_create_quotation";
  id = "";
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
    }

    if (idParam) {
      this.pageTitle = "text_edit_quotation";
      this.setState({loading: true});
      this.getDetail(idParam);
    } else {
      this.setState(preState => {
        preState.formData = {
          customerId: null,
          phoneNumber: "",
          saleOrderDate: moment().format("YYYY-MM-DD"),
          expectedPaymentDate: null,
          deposit: 0,
          discount: 0,
          taxRate: 0,
          discountType: Enum.DISCOUNT_TYPE.AMOUNT,
          publicNote: "",
          template: Enum.PAPER_SIZE.EXCLUDE_TAX
        };
        preState.quotationEntries = [{
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
        }];

        return preState;
      });
    }

    CustomerService.lists(10)
    .then(response => {
        if (response && response.data) {
            this.setState({customers: response.data.data});
        }
    });
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
        if (formData.discount > subTotal) {
          this.textDiscountErr = "Discount amount must be less than total amount";
          return;
        }

        const quotation = {
          customerId: values.customerId,
          discount: values.discount,
          discountType: values.discountType,
          publicNote: formData.publicNote,
          template: values.template,
          number: values.number,
          terms: values.terms ? values.terms : formData.terms,
          quotationDate: this.util.formatDateForMYSQL(values["quotationDate"]),
          validDate: this.util.formatDateForMYSQL(values["validDate"]),
          totalExcludeTax:  subTotal,
          total: values.total,
          status: Enum.QUOTATION_STATUS.DRAFT
        };

        const quotationEntries = [];
        if (values["description"] && values["description"].length) {
          values["description"].forEach((description, index) => {
            quotationEntries.push({
              id: values.id[index],
              productVariantId: values.productVariantId[index],
              description,
              quantity: values.quantity[index],
              price: values.price[index],
              discount: 0,
              status: values.status[index]
            });
          });
          quotation["Entries"] = quotationEntries;
        } else {
          return this.util.sweetAlertMessage(stringTranslate("text_please_select_product", this.props.locale), "warning");
        }

        this.save(quotation);
      }
    });
  }

  getDetail(id) {
    this.setState({loading: true});
    const action = new URLSearchParams(document.location.search).get("action");
    QuotationService.detail2(id)
    .then(response => {
      const data = response.data.data;
      let totalExcludeTax = Number(data.totalExcludeTax);
      if (!totalExcludeTax) {
        totalExcludeTax = data.total;
      }
      const quotationEntries = data.quotationEntries.length && data.quotationEntries.map(entry => ({
        id: action === "clone" ? "" : entry.id,
        status: entry.status,
        productVariantId: entry.productVariantId,
        discount: 0,
        description: entry.description,
        quantity: entry.quantity,
        price: entry.price,
        amount: entry.quantity * entry.price,
      }));

      let discount = data.discount;
      let taxRate = this.util.getTaxRate(data.totalExcludeTax - discount, data.total - totalExcludeTax);
      if (!taxRate)
        taxRate = 0;
      data.taxRate = taxRate;

      if (action === "clone") {
        data.number = "";
      }

      delete data.quotationEntries;
      this.setState(preState => {
        preState.formData = data;
        preState.quotationEntries = quotationEntries;
        return preState;
      });
    })
    .finally(() => this.setState({loading: false}));
  }

  save(data) {
    this.setState({loadingButton: true});
    if (this.id) {
      data.id = this.id;
      QuotationService.update(data)
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
      .catch(() => message.error("Error!.."))
      .finally(() => this.setState({loadingButton: false}));
    } else {
      QuotationService.add(data)
      .then(response => {
        message.success("Create quotation success");
        this.id = response.data.data.id;
        history.push(`/transactions/quotation-update/${this.id}`);
      })
      .catch(() => message.error("Error!.."))
      .finally(() => this.setState({loadingButton: false}));
    }
  }

  onChangeQty = (qty, index) => {
    if (!qty || qty < 0) qty = 0;
    this.setState(preState => {
        const price = preState.quotationEntries[index].price;
        let amount = (qty * price);

        if (!amount || amount < 0) amount = 0;
        preState.quotationEntries[index].quantity = qty;
        preState.quotationEntries[index].amount = amount;

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
      const qty = preState.quotationEntries[index].quantity;
      let amount = (qty * price);

      if (!amount || amount < 0) amount = 0;
      preState.quotationEntries[index].price = price;
      preState.quotationEntries[index].amount = amount;

      let discount = this.props.form.getFieldValue("discountField");
      let total = this.getTotal(preState.transactionEntries);
      if (preState.formData.discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
        discount = this.util.getValueFromPercentage(total, discount);
      }
      preState.formData.discount = discount;
      return preState;
    });
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

  handleOnSelectList = (product, productVariant, isRequestVariantForm = true) => {
    let isProductVariant = product.productOption === EnumProduct.PRODUCT_VARIANT;
    let discount = this.props.form.getFieldValue("discountField");
    let type = this.props.form.getFieldValue("discountType");
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
    
    const formData = this.state.formData;
    const existingProductList = this.state.quotationEntries;
    if (existingProductList.length === 0) {
      existingProductList.push({
        productVariantId: productVariant.id,
        description: product.name ? product.name : product.namekm,
        quantity: 1,
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
          description: product.name ? product.name : product.namekm,
          quantity: 1,
          price: productVariant.price,
          discount: 0,
          amount: (productVariant.price * 1),
          status: 1
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

    this.setState({quotationEntries: existingProductList, formData});
    this.props.form.setFieldsValue({searchProduct: ""});
    document.getElementById("searchProduct").focus();
  }

  removeEntry = (index) => {
    const {quotationEntries, formData} = this.state;
    if (quotationEntries[index].id) {
      this.util.sweetAlertConfirm(stringTranslate("text_confirm_delete", this.props.locale), "warning")
      .then(isDelete => {
        if (isDelete) {
          let discount = this.props.form.getFieldValue("discountField");
          let type = this.props.form.getFieldValue("discountType");
          quotationEntries[index].status = 3;
          if (Number(type) === Enum.DISCOUNT_TYPE.PERCENTAGE) {
            let total = this.getTotal();
            discount = this.util.getValueFromPercentage(total, discount);
          }
          formData.discount = discount;
          this.setState({quotationEntries, formData, productSearch: []});
        }
      });
    } else {
      quotationEntries.splice(index, 1);
      this.setState({quotationEntries, productSearch: []});
    }
  }

  onChangeTemplate = (value) => {
    this.setState(preState => {
      preState.formData.template = value;
      return preState;
    });
  }

  handleDeleteQuotation(id) {
    this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
    .then(willDelete => {
      if (willDelete) {
        QuotationService.deleteQuotation(id)
        .then(() => {
          message.success("Delete success!");
          history.goBack();
        })
        .catch(() => message.error("Error!..."));
      }
    });
  }

  handleResetForm = () => {
    const {quotationEntries} = this.state;
    this.props.form.resetFields();
    if (quotationEntries.length) {
        if (this.id) {
            this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
            .then(willClear => {
                if (willClear) {
                    quotationEntries.forEach((entry, index) => {
                        if (entry.id) {
                            quotationEntries[index].status = 3;
                        } else {
                            quotationEntries.splice(index, 1);
                        }
                        this.setState({quotationEntries, productSearch: []});
                    });
                }
            });
        } else {
            this.setState({quotationEntries: []});
        }
    }
  }

  handleNewProposal = () => {
    this.id = "";
    this.setState({
      formData: {
        taxRate: 0,
        discount: 0,
        publicNote: ""
      },
      quotationEntries: []
    });
    history.push("/transactions/quotation-create");
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

  onSelectCustomer(value, record) {
    if (value) {
      const customer = record.props.Object;
      this.textRequiredCustomer = "";
      this.setState(preState => {
        preState.formData.firstName = customer.firstName;
        preState.formData.lastName = customer.lastName;
        preState.formData.company = customer.company;
        preState.formData.phoneNumber = customer.phoneNumber;
        preState.formData.address = customer.address;
        return preState;
      });
    } else {
      this.textRequiredCustomer = <Translate id="text_required_customer" />;
    }
  }

  handleGoBack = () => {
    const action = new URLSearchParams(window.location.search).get("action");
    if (action) {
      history.push("/transactions/quotation");
    } else {
      history.goBack();
    }
  }

  getTotal(quotationEntries = this.state.quotationEntries) {
    let total = 0;
    if (quotationEntries.length) {
        total = _.sumBy(quotationEntries, (value) => value.status !== 3 && value.amount);
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
          <Select.Option key={index} Object={customer} value={customer.id}>{customer.firstName} {customer.lastName}</Select.Option>
        )}
      </Select>
    );
  }

  renderPreviewInvoice(formData) {
    formData.transactionEntries = this.state.quotationEntries;
    formData.invoiceDate = formData.quotationDate;
    formData.dueDate = formData.validDate;
    formData.invoiceNumber = formData.number;
    formData.company = formData.customer && formData.customer.company;
    formData.address = formData.customer && formData.customer.address;
    return <div id="wrap-invoice-form">
      <CAInvoice 
        invoiceTitle="Quotation"
        invoiceTaxTitleKH="សម្រង់តម្លៃអាករ"
        invoiceNoTitle="Quote No"
        invoiceNoTitleKH="លេខសម្រង់តម្លៃ"
        numberTitle="Quote Number"
        invoiceDateTitle="Quote Date"
        dueDateTitle="Valid till Date"
        formData={formData} />
    </div>;
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
    };
    const {getFieldDecorator} = this.props.form;
    const {formData} = this.state;
    let discount = Number(formData.discount);
    let subTotal = this.getTotal();
    formData.totalExcludeTax = subTotal;
    let vat = this.util.getTaxValue(subTotal - discount, formData.taxRate);
    formData.total = subTotal + vat;
    return (
      !this.state.loading && Object.keys(formData).length ?
      <div>
        <PageHeader
          style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0,
          position: "relative"
          }}
          onBack={this.handleGoBack}
          title={<Translate id={this.pageTitle} />} />

        <Form onSubmit={this.handleSubmit} {...formItemLayout} id="invoice-form">
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
                name="quotationDate"
                label={<Translate id="text_quotation_date" />}
                placeholder={`${stringTranslate("text_quotation_date", this.props.locale)}`}
                defaultValue={formData.quotationDate ? moment(formData.quotationDate) : null}
                style={styles.itemCenter}
                form={this.props.form} />
              <DatePickers
                name="validDate"
                style={styles.itemCenter}
                label={<Translate id="text_valid_till" />}
                placeholder={`${stringTranslate("text_valid_till", this.props.locale)}`}
                defaultValue={formData.validDate ? moment(formData.validDate) : null}
                form={this.props.form} />
            </Col>
            <Col md={8} style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
              <QuotationNo
                name="number"
                label={<div style={{marginTop: 7, marginRight: 10}}><Translate id="text_quotation_no" /></div>}
                placeholder={`${stringTranslate("text_quotation_no", this.props.locale)}`}
                data={formData.number}
                style={{display: "flex", marginBottom: 4}}
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
                <Form.Item style={{width: 255}} label={<div style={{marginTop: 7, marginRight: 10}}>VAT</div>}>
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
                dataSource={this.state.quotationEntries}
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
                  name="discount"
                  data={discount}
                  style={{display: "none"}}
                  form={this.props.form}
                />
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
                    style={{width: 180}} 
                    placeholder={`${stringTranslate("text_choose_template", this.props.locale)}`}
                    onChange={(value) => this.onChangeTemplate(value)}
                  >
                    <Select.Option key={2} value={Enum.PAPER_SIZE.EXCLUDE_TAX}><Translate id="text_quotation_temp" /> 1</Select.Option>
                    <Select.Option key={1} value={Enum.PAPER_SIZE.INCLUDE_TAX}><Translate id="text_quotation_temp" /> 2</Select.Option>
                  </Select>
                )
              }
              </Form.Item>
              <Button type="info" htmlType="submit" loading={this.state.loadingButton} >
                <Translate id="text_save" />
              </Button>
              <Button style={{marginRight: 15, marginLeft: 15}} onClick={this.handleResetForm}>
                <Translate id="text_clear" />
              </Button> 
              <Button onClick={() => window.print()} style={{marginRight: 15}}>
                <Translate id="print_quotation" />
              </Button>
                <Dropdown 
                  overlay={(
                    <Menu>
                      <Menu.Item key={1}>
                        <Link to={`/transactions/create-invoice?quotationId=${formData.id}&action=convertToInvoice`}>
                          <Translate id="text_convert_to_invoice" />
                        </Link>
                      </Menu.Item>
                      <Menu.Item key={2}>
                        <Link target="_blank" to={`/transactions/quotation-create?id=${formData.id}&action=clone`} >
                          <Translate id="text_clone" />
                        </Link>
                      </Menu.Item>
                      <Menu.Item key={3} onClick={this.handleNewProposal}>
                        <Translate id="text_new_proposal" />
                      </Menu.Item>
                      <Menu.Item key={4} onClick={() => this.handleDeleteQuotation(formData.id)}>
                        <Translate id="text_delete" />
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
        {this.state.customerForm}
        {this.renderPreviewInvoice(formData)}
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

const formItem =  Form.create(mapPropsToFields)(FormItem);

export default connect(mapStateToProps)(formItem);