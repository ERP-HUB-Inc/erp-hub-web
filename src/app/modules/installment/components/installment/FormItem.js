import React from "react";
import moment from "moment";
import {connect} from "react-redux";
import {Translate} from "react-localize-redux";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {Link} from "react-router-dom";
import {
  Form,
  Spin,
  PageHeader,
  Row,
  Col,
  Icon,
  Input,
  Divider,
  Select as AntSelect,
  Table,
  message,
  Badge,
  Tabs
} from "antd";
import {
  Button,
  DatePickers,
  InputNumber,
  InputText,
  Select
} from "../../../common/elements/ant-ui";
import CustomerService from "../../../crm/services/customers/CustomerService";
import InstallmentService from "../../services/InstallmentService";
import SerialService from "../../../pos/services/transactions/SerialService";
import PrivilegeService from "../../../pos/services/settings/PrivilegeService";
import CustomerAction from "../../../crm/actions/customers/customer";
import ProductVariantAction from "../../../inventory/actions/products/productVariant";
import CustomerConstant from "../../../crm/constants/customers/customer";
import Util from "../../../common/util";
import Enum from "../../../common/enums";
import EnumProduct from "../../../inventory/enums";
import EnumINS from "../../enum";
import history from "../../../common/router/history";
import {stringTranslate} from "../../../common/helper/stringTranslate";
import SearchProductDropdown from "../../../pos/components/transactions/Invoice/SearchProduct";
import DownPaymentTable from "./DownPayment";
import CustomerCreate from "../../../crm/containers/customers/Customer/FormCreate";
import VariantProduct from "../../../pos/containers/transactions/SaleWalkin/VariantProduct";

class FormItem extends React.Component {
  state = {
    formData: {},
    customers: [],
    modalVariant: null,
    customerForm: null,
    loading: false,
    loadingSubmit: false,
    fetchingCustomer: false,
    isCanDelete: false
  }
  Util = new Util();
  productColumns = [
    {
      title: <Translate id="text_number_of" />,
      dataIndex: "no",
      key: "no",
      render: (no, record, index) => index + 1
    },
    {
      title: <Translate id="text_description" />,
      dataIndex: "productName",
      key: "description",
      width: 600,
      render: (productName, record, index) => {
        return (
          <div>
            {productName} {record.variantName}
            {
              record.enableDescription || record.serialNo ?
              <div style={{width: 200, marginTop: 6}}>
                <InputText 
                  name={`serialNo[${index}]`}
                  label="Serial or IMEI"
                  required={true}
                  placeholder="Serial or IMEI"
                  data={record.serialNo}
                  onChange={(e) => this.onChangeSerial(e.target.value, index)}
                  form={this.props.form} />
                <InputNumber
                  name={`numOfWarranty[${index}]`}
                  label={<Translate id="text_warranty_duration" />}
                  required={true}
                  precision={0}
                  style={{padding: "6px 0"}}
                  isAutoSelect={true}
                  data={record.numOfWarranty}
                  min={0}
                  form={this.props.form} />
                <Select 
                  name={`serialDurationType[${index}]`}
                  label={<Translate id="text_duration_type" />}
                  required={true}
                  defaultValue={record.serial ? record.durationType : Enum.DURATION_TYPE.DAY}
                  dataSource={[
                    {name: <Translate id="text_day" />, value: Enum.DURATION_TYPE.DAY},
                    {name: <Translate id="text_week" />, value: Enum.DURATION_TYPE.WEEK},
                    {name: <Translate id="text_month" />, value: Enum.DURATION_TYPE.MONTH},
                    {name: <Translate id="text_year" />, value: Enum.DURATION_TYPE.YEAR}
                  ]}
                  form={this.props.form} />
              </div>
            : null}
          </div>
        );
      }
    },
    {
      title: <Translate id="text_quantity" />,
      dataIndex: "quantity",
      key: "quantity"
    },
    {
      title: <Translate id="text_price" />,
      dataIndex: "price",
      key: "price",
      render: (price) => this.Util.formatCurrency(price)
    },
    {
      title: <Translate id="text_amount" />,
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (amount, record, index) => {
        const {formData} = this.state;
        return <div>
          {this.Util.formatCurrency(record.quantity * record.price)}
          {
            formData.id && formData.status !== EnumINS.INSTALLMENT_STATUS.DRAFT ?
            null
            :
            <Icon style={{color: "red", marginLeft: 5}} onClick={() => this.handleDeleteProduct(index)} type="close" />
          }
        </div>;
      }
    }
  ]
  INSTALLMENT_STATUS_STR = {
    [EnumINS.INSTALLMENT_STATUS.DRAFT]: { title: stringTranslate("text_draft", this.props.locale), color: "#bfbfbf"},
    [EnumINS.INSTALLMENT_STATUS.RECEIVED]: { title: stringTranslate("text_received", this.props.locale), color: "#1890ff"},
    [EnumINS.INSTALLMENT_STATUS.COMPLETED]: { title: stringTranslate("text_completed", this.props.locale), color: "#f50"},
  };
  id = "";
  pageTitle = "text_create_installment";
  modalTitle = "";
  textRequiredCustomer = "";
  permissionModuleCode = "installment";
  timer = null;

  componentDidMount() {
    const idParam = this.props.match.params.id;
    if (idParam) {
      this.id = idParam;
      this.pageTitle = "text_update_installment";
      this.fetchDetail(idParam);
    } else {
      this.getDefaultData();
    }

    CustomerService.lists(10)
    .then(response => {
      if (response && response.data) {
        this.setState({customers: response.data.data});
      }
    });
    this.checkDeletePermission();
  }

  componentDidUpdate() {
    if (this.props.customerAdd.added) {
      const {customers, formData} = this.state;
      const data = this.props.customerAdd.response.data;
      formData.customerId = data.id;
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
        message.error(stringTranslate("error_product_not_found", this.props.locale));
        this.props.form.setFieldsValue({searchProduct: ""});
        document.getElementById("searchProduct").focus();
      }
      this.props.dispatch(ProductVariantAction.reset("RESET_PRODUCT_VARIANT"));
    }
  }

  checkDeletePermission() {
    PrivilegeService.checkPermission(this.permissionModuleCode, "delete")
    .then(({data}) => this.setState({isCanDelete: data}));
  }

  getDefaultData() {
    const formData = {
      customerId: "",
      serialNo: "",
      product: "",
      price: 0,
      receivedDate: "",
      duration: 0,
      durationType: Enum.DURATION_TYPE.MONTH,
      rate: 0,
      firstPayment: 0,
      paymentDate: "",
      customer: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        code: ""
      },
      client: {
        businessNamekm: Util.prototype.getSetting().businessNamekm
      },
      installmentEntries: [],
      paymentSchedule: []
    };
    this.setState({formData});
  }

  fetchDetail(id) {
    this.setState({loading: true});
    InstallmentService.detail(id)
    .then(response => {
      if (response) {
        const data = response.data.data;
        const formData = data;
        this.setState({formData});
      }
    })
    .finally(() => {
      this.setState({loading: false, isChangeSchedule: false});
    });
  }

  generatePaymentSchedule(rate, numberOfMonth, paymentDate) {
    const {formData} = this.state;
    let price = 0;

    formData.installmentEntries && formData.installmentEntries.forEach(entry => {
      price += entry.quantity * entry.price;
    });
    price = price - formData.firstPayment;

    if (price < 0) {
      price = 0;
    }

    if (!(price && rate && numberOfMonth && paymentDate)) {
      return;
    }

    InstallmentService.generatePaymentSchedule(price, rate, numberOfMonth, paymentDate)
    .then(response => {
      if (response) {
        formData.paymentSchedule = response.data;
        this.setState({formData});
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {formData} = this.state;
        let needConfirm = false;
        if (formData.id && formData.status !== EnumINS.INSTALLMENT_STATUS.DRAFT) {
          return this.Util.sweetAlertMessageV2(
            "Sorry",
            "Allow update only in draft step!",
            "warning"
          );
        }

        if (!values.customerId) {
          this.textRequiredCustomer = <Translate id="text_required_customer" />;
          return;
        }

        if (!formData.installmentEntries.length) {
          return this.Util.sweetAlertMessageV2("Error", "Please select product", "error");
        }

        if (values.receiveDate) {
          needConfirm = true;
        }

        values.receiveDate = this.Util.formatDateForMYSQL(values.receiveDate);
        values.paymentDate = this.Util.formatDateForMYSQL(values.paymentDate);
        if (moment(values.receiveDate).isValid()) {
          values.status = EnumINS.INSTALLMENT_STATUS.RECEIVED;
        }

        const installmentEntries = [];
        let total = 0;
        formData.installmentEntries.forEach((entry, index) => {
          total += entry.quantity * entry.price;
          installmentEntries.push({
            id: entry.id,
            productVariantId: entry.productVariantId,
            productName: entry.productName,
            variantName: entry.variantName,
            quantity: entry.quantity,
            price: entry.price,
            serialId: entry.serialId,
            numOfWarranty: values.numOfWarranty && values.numOfWarranty[index],
            durationType: values.serialDurationType && values.serialDurationType[index],
            serialNo: entry.serialNo && entry.serialNo,
            status: entry.status
          });
        });
        values.total = total;
        values.installmentEntries = installmentEntries;
        values.description = formData.description;
        delete values.serialNo;
        delete values.serialDurationType;
        delete values.numOfWarranty;
        delete values.searchProduct;
        if (needConfirm) {
          return this.Util.sweetAlertConfirm(
            "Are you sure?",
            "Make sure all your information are correctly."
          )
          .then(willUpdate => {
            if (willUpdate) {
              this.save(values);
            }
          });
        } else {
          this.save(values);
        }
      }
    });
  }

  save(data) {
    const id = this.props.match.params.id;
    if (id) {
      this.setState({loadingSubmit: true});
      InstallmentService.update(data, id)
      .then(() => {
        this.fetchDetail(id);
      })
      .finally(() => {
        this.setState({loadingSubmit: false});
      });
    } else {
      this.setState({loadingSubmit: true});
      InstallmentService.create(data)
      .then(response => {
        this.setState({loadingSubmit: false});
        history.push(`/installment/update/${response.data.id}?after-create=true`);
        this.pageTitle = "text_update_installment";
        this.fetchDetail(response.data.id);
      })
      .catch(err => {
        this.Util.sweetAlertMessageV2("Sorry!", "Something went wrong", "error");
      })
      .finally(() => {
        this.setState({loadingSubmit: false});
      });
    }
  }

  onChangeSerial = (value, index) => {
    clearTimeout(this.timer);
    if (value !== this.state.formData.installmentEntries[index].serialNo) {
      this.timer = setTimeout(() => {
        SerialService.findByNumber(value, this.state.formData.installmentEntries[index].productVariantId)
        .then(response => {
          if (response.data && response.data.length) {
            return this.props.form.setFields({
              serialNo: {
                errors: [new Error(value + ": " + stringTranslate("text_this_serial_is_sold", this.props.locale))]
              }
            });
          } else {
            this.setState(preState => {
              preState.formData.installmentEntries[index].serialNo = value;
              return preState;
            });
          }
        });
      });
    }
  }

  handleChangePayDate = (date) => {
    const {formData} = this.state;
    let duration = formData.duration;
    date = this.Util.formatDateForMYSQL(date);
    let numberOfMonth = duration;
    if (formData.durationType === Enum.DURATION_TYPE.YEAR) {
      numberOfMonth = duration * 12; // Multiply duration with 12months
    }
    this.setState(preState => {
      preState.formData.paymentDate = date;
      return preState;
    });
    this.generatePaymentSchedule(formData.price, formData.rate, numberOfMonth, date);
  }

  handleChangeRate = (rate) => {
    const {formData} = this.state;
    let duration = formData.duration;
    let numberOfMonth = duration;
    if (formData.durationType === Enum.DURATION_TYPE.YEAR) {
      numberOfMonth = duration * 12;
    }
    this.setState(preState => {
      preState.formData.rate = rate;
      return preState;
    });
    this.generatePaymentSchedule(rate, numberOfMonth, formData.paymentDate);
  }

  handleChangeFirstPayment = (value) => {
    const {formData} = this.state;
    let numberOfMonth = formData.duration;
    if (formData.durationType === Enum.DURATION_TYPE.YEAR) {
      numberOfMonth = numberOfMonth * 12;
    }

    this.setState(preState => {
      preState.formData.firstPayment = value;
      return preState;
    });
    this.generatePaymentSchedule(formData.rate, numberOfMonth, formData.paymentDate);
  }

  handelChangeDuration = (duration) => {
    let numberOfMonth = duration;
    const {formData} = this.state;
    if (formData.durationType === Enum.DURATION_TYPE.YEAR) {
      numberOfMonth = duration * 12;
    }
    this.setState(preState => {
      preState.formData.duration = duration;
      return preState;
    });
    this.generatePaymentSchedule(formData.rate, numberOfMonth, formData.paymentDate);
  }

  handelChangeDurationType = (type) => {
    const {formData} = this.state;
    let numberOfMonth = formData.duration;
    if (type === Enum.DURATION_TYPE.YEAR) {
      numberOfMonth = formData.duration * 12;
    }
    this.setState(preState => {
      preState.formData.durationType = type;
      return preState;
    });
    this.generatePaymentSchedule(formData.rate, numberOfMonth, formData.paymentDate);
  }

  handleDeleteProduct(index) {
    const installmentEntries = this.Util.copyArrayObj(this.state.formData.installmentEntries);
    if (this.id) {
      this.Util.sweetAlertConfirm(stringTranslate("text_confirm", this.props.locale), stringTranslate("text_are_you_sure", this.props.locale))
      .then(willDelete => {
        if (willDelete) {
          this.setState(preState => {
            installmentEntries[index].status = Enum.ARCHIVE;
            preState.formData.installmentEntries = installmentEntries;
            preState.formData.paymentSchedule = [];
            return preState;
          });
        }
      });
    } else {
      this.setState(preState => {
        installmentEntries.splice(index, 1);
        preState.formData.installmentEntries = installmentEntries;
        preState.formData.paymentSchedule = [];
        return preState;
      });
    }
  }

  handleDelete(id) {
    const {formData} = this.state;
    if (formData.status !== EnumINS.INSTALLMENT_STATUS.DRAFT) {
      return this.Util.sweetAlertMessageV2("Warning", "Allow delete only in draft step", "warning");
    }

    this.Util.sweetAlertConfirm("Warning", stringTranslate("text_are_you_sure", this.props.locale))
    .then(willDelete => {
      if (willDelete) {
        InstallmentService.delete(id)
        .then(() => {
          this.Util.sweetAlertMessageV2(
            "Success",
            "Installment has been deleted.",
            "success"
          );
          history.push("/installment/list");
        })
        .catch(() => {
          this.Util.sweetAlertMessageV2("Error", "Something went wrong", "error");
        });
      }
    });
  }

  handleOnSelectList = (product, productVariant, isRequestVariantForm = true) => {
    let isProductVariant = product.productOption === EnumProduct.PRODUCT_VARIANT;
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
    
    const formData = this.Util.copyObj(this.state.formData);
    const {installmentEntries} = formData;
    installmentEntries.unshift({
      id: "",
      serialId: "",
      productVariantId: productVariant.id,
      productName: product.name,
      variantName: productVariant.name,
      quantity: 1,
      price: productVariant.price,
      status: 1,
      enableDescription: product.enableDescription
    });

    formData.installmentEntries = installmentEntries;

    let numberOfMonth = formData.duration;
    if (formData.durationType === Enum.DURATION_TYPE.YEAR) {
      numberOfMonth = formData.duration * 12;
    }

    installmentEntries.forEach((entry, index) => {
      this.props.form.setFieldsValue({
        [`serialId[${index}]`]: entry.serialId,
        [`serialNo[${index}]`]: entry.serialNo,
        [`numOfWarranty[${index}]`]: entry.numOfWarranty,
        [`serialDurationType[${index}]`]: entry.serialDurationType
      });
    });

    this.setState({formData}, () => {
      this.generatePaymentSchedule(formData.rate, numberOfMonth, formData.paymentDate);
    });
    this.props.form.setFieldsValue({searchProduct: ""});
  }

  handlePrintInvoiceA5 = () => {
    document.getElementById("invoice-content").classList.add("invoice-A5");
    document.getElementById("wrap-invoice-form").setAttribute("id", "wrap-invoice-form-A5");
    setTimeout(() => {
        window.print();
    }, 600);
  }

  handleGoBack = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") || params.get("after-create")) {
      history.push("/installment/list");
    } else {
      history.goBack();
    }
  }

  onSelectCustomer(value, record) {
    if (value) {
      const {formData} = this.state;
      const customer = record.props.object;

      this.textRequiredCustomer = "";
      formData.customer = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phoneNumber,
        number: customer.number
      };
      this.setState({formData});
    } else {
      this.textRequiredCustomer = <Translate id="text_required_customer" />;
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

  showCustomerForm = () => {
    this.setState({customerForm: <CustomerCreate />});
    this.props.dispatch(CustomerAction.showForm());
  }

  renderSelectCustomer() {
    return (
      <AntSelect
        notFoundContent={this.state.fetchingCustomer ? <Spin /> : <Translate id="text_not_found_customer" />}
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
          <AntSelect.Option key={index} object={customer} value={customer.id}>{customer.firstName} {customer.lastName}</AntSelect.Option>
        )}
      </AntSelect>
    );
  }

  render() {
    const {formData} = this.state;
    const {form, locale} = this.props;

    onafterprint = (() => {
      document.getElementById("invoice-content").classList.remove("invoice-A5");
      const wrapInvoiceEl = document.getElementById("wrap-invoice-form-A5");
      wrapInvoiceEl.setAttribute("id", "wrap-invoice-form");
    });

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
          title={<Translate id={this.pageTitle} />}
          subTitle={
            formData.status ? <Badge 
              count={this.INSTALLMENT_STATUS_STR[formData.status].title} 
              style={{background: this.INSTALLMENT_STATUS_STR[formData.status].color}} 
            /> : null
          }
        />

        <Form onSubmit={this.handleSubmit} id="invoice-form">
          <Row>
            <Col md={8}>
              <Row>
                <Col md={4} style={{paddingTop: 8}}><Translate id="text_customer" /></Col>
                <Col md={16}>
                  <Form.Item style={{paddingLeft: 10, position: "relative"}}>
                    {
                      form.getFieldDecorator("customerId", {
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
              </Row>
            </Col>
            <Col md={8}>
              <Row>
                <Col md={8} style={{display: "inline-grid", textAlign: "right", paddingRight: 10, lineHeight: "40px", marginLeft: -30}}>
                  <label><Translate id="text_received_date" /></label>
                  <label><Translate id="text_payment_date" /></label>
                  <label><Translate id="text_rate" /></label>
                </Col>
                <Col md={16} style={{paddingRight: 25}}>
                  <DatePickers
                    name="receiveDate"
                    placeholder={`${stringTranslate("text_received_date", locale)}`}
                    defaultValue={formData.receiveDate ? moment(formData.receiveDate) : null}
                    onChange={(date) => this.setState(preState => {
                      if (!date) {
                        date = "";
                      }
                      preState.formData.receiveDate = this.Util.formatDateForMYSQL(date);
                      return preState;
                    })}
                    form={form} />
                  <DatePickers
                    name="paymentDate"
                    placeholder={`${stringTranslate("text_payment_date", locale)}`}
                    defaultValue={formData.paymentDate ? moment(formData.paymentDate) : null}
                    required={form.getFieldValue("receiveDate") ? true : false}
                    onChange={this.handleChangePayDate}
                    form={form} />
                  
                  <div style={{position: "relative"}}>
                    <InputNumber
                      name="rate"
                      className="input-installment-rate"
                      placeholder={`${stringTranslate("text_rate", locale)}`}
                      data={formData.rate}
                      isAutoSelect={true}
                      onChange={this.handleChangeRate}
                      form={form} />
                    <div style={{position: "absolute", top: 9, right: 13}}>%</div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col md={8}>
              <Row>
                <Col md={8} style={{textAlign: "right", paddingRight: 10, display: "inline-grid", lineHeight: "40px"}}>
                  <label><Translate id="text_first_payment" /></label>
                  <label><Translate id="text_duration" /></label>
                </Col>
                <Col md={16}>
                  <InputNumber 
                    name="firstPayment"
                    placeholder={`${stringTranslate("text_first_payment", locale)}`}
                    isAutoSelect={true}
                    data={formData.firstPayment}
                    onChange={this.handleChangeFirstPayment}
                    form={form} />
                  <Input.Group style={{display: "flex"}}>
                    <InputNumber
                      name="duration"
                      placeholder={`${stringTranslate("text_duration", locale)}`}
                      isAutoSelect={true}
                      style={{width: "60%"}}
                      data={formData.duration}
                      onChange={this.handelChangeDuration}
                      precision={0}
                      form={form} />
                    <Select 
                      name="durationType"
                      placeholder={`${stringTranslate("text_duration_type", locale)}`}
                      defaultValue={formData.durationType}
                      style={{width: "40%", paddingLeft: 10}}
                      dataSource={[
                        {name: <Translate id="text_month" />, value: Enum.DURATION_TYPE.MONTH},
                        {name: <Translate id="text_year" />, value: Enum.DURATION_TYPE.YEAR}
                      ]}
                      onChange={this.handelChangeDurationType}
                      form={form} />
                  </Input.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row style={{marginBottom: 20}}>
            <SearchProductDropdown
              productSearch={this.state.productSearch}
              handleOnSelectList={this.handleOnSelectList}
              className="ca-input-v1 purchase-order"
              locale={this.props.locale}
              style={{marginTop: 12}}
              form={form}/>  
            <Col md={24}>
              <Table 
                rowKey={((record, index) => index)}
                columns={this.productColumns}
                className="table-form-invoice-entry"
                dataSource={formData.installmentEntries}
                pagination={false}
                locale={{emptyText: <div style={{padding: "25px 0"}}><Translate id="text_no_sale_entries_product" /></div>}}
                rowClassName={((record) => record.status === 3 ? "hidden" : "")}
              />
            </Col>
          </Row>
          <Row style={{marginBottom: 20}}>
            <Col md={10}>
              <Tabs type="card" className="invoice-form-tab-note">
                <Tabs.TabPane tab={<Translate id="text_remark" />} key="1">
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.description}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      this.setState(preState => {
                        preState.formData.description = data;
                        return preState;
                      });
                    }}
                  />
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>
          <hr />
          <Row style={{paddingBottom: 14}}>
            <Col span={24} style={{textAlign: "center"}}>
              <Button type="info" htmlType="submit" loading={this.state.loadingSubmit} >
                <Translate id="text_save" />
              </Button>
              <Button onClick={() => window.print()} style={{margin: "0 15px"}}>
                <Translate id="text_print" />
              </Button>
              {/* <Button onClick={this.handlePrintInvoiceA5}>
                <Translate id="text_print" /> A5
              </Button> */}
              <Link to="/installment/create" target="_blank" type="button" className="ant-btn" style={{marginRight: "15px"}}>
                <Translate id="text_new_installment" />
              </Link>
              {this.state.isCanDelete &&
                <Button onClick={() => this.handleDelete(this.id)} type="danger">
                  <Translate id="text_delete" />
                </Button>
              }
            </Col>
          </Row>
        </Form>
        {this.state.modalVariant}
        {this.state.customerForm}
        <div id="wrap-invoice-form">
          <DownPaymentTable formData={formData} />
        </div>
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
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formItem =  Form.create(mapPropsToFields)(FormItem);
  
export default connect(mapStateToProps)(formItem);