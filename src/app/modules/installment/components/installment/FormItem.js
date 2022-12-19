import React from "react";
import moment from "moment";
import _ from "lodash";
import {connect} from "react-redux";
import {Translate} from "react-localize-redux";
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
  Dropdown,
  Menu,
  message,
  Badge
} from "antd";
import {
  Button,
  DatePickers,
  InputNumber,
  Select
} from "../../../common/elements/ant-ui";
import CustomerService from "../../../crm/services/customers/CustomerService";
import InstallmentService from "../../services/InstallmentService";
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
import DownPaymentTable from "./downPayment";
import CustomerCreate from "../../../crm/containers/customers/Customer/FormCreate";
import VariantProduct from "../../../pos/containers/transactions/SaleWalkin/VariantProduct";
import SerialForm from "../../../pos/components/transactions/Invoice/SerialForm";

class FormItem extends React.Component {
  state = {
    formData: {},
    customers: [],
    modalVariant: null,
    customerForm: null,
    selectedSerials: [],
    loading: false,
    loadingSubmit: false,
    fetchingCustomer: false,
    isChangeSchedule: false
  }
  Util = new Util();
  productColumns = [
    {
      title: <Translate id="text_no" />,
      dataIndex: "no",
      key: "no",
      render: (no, record, index) => index + 1
    },
    {
      title: <Translate id="text_description" />,
      dataIndex: "description",
      key: "description",
      width: 600,
      render: (productVariantId, record, index) => {
        // const serialNo = this.state.formData.serialNo;
        // const serial = this.state.formData.serial;
        return (
          <div>
            {record.name}
            {
              record.enableDescription ?
              <div style={{marginTop: 8}}>
                {/* {serialNo ?
                  <Tag 
                    onClose={() => this.handleRemoveSerialNo(index)}
                    title={stringTranslate("text_double_click_edit_serial", this.props.locale)}
                    className="serial-tag"
                    style={{padding: 5}}
                    onDoubleClick={() => this.handleUpdateSerial(serial, index)}
                  >
                    {serialNo}
                    <Icon style={{paddingLeft: 3}} type="close-circle" title="Delete serial" className="btn-remove-serial" onClick={() => this.handleDeleteSerial(serialNo, index)} />
                  </Tag>
                :
                  <Button type="info" style={{fontSize: 12, height: 31, marginRight: 8}} onClick={() => this.handleShowSerialModal(index, record.productVariantId)} >
                    <Icon type="plus-circle" style={{paddingRight: 5}} />
                    <Translate id="text_add" /> Serial
                  </Button>
                } */}
                {/* <InputText 
                  name={`serial[${index}]`}
                  required={true}
                  errorRequired={stringTranslate("error_serial_number_require", this.props.locale)}
                  validator={(rule, value, callback) => this.validateSerialNo(value, callback)}
                  data={serialNo}
                  inputStyle={{display: "none"}}
                  form={this.props.form} /> */}
              </div>
              :
              null
            }
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
      title: <Translate id="text_amount" />,
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (amount, record) => {
        return <div>
          {this.Util.formatCurrency(record.quantity * record.price)}
          <Icon style={{color: "red", marginLeft: 5}} onClick={() => this.handleDeleteProduct()} type="close" />
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
      products: [],
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
        formData.products = [data.productVariant];
        this.setState({formData});
      }
    })
    .finally(() => {
      this.setState({loading: false, isChangeSchedule: false});
    });
  }

  generatePaymentSchedule(price, rate, numberOfMonth, paymentDate) {
    if (!(price && rate && numberOfMonth && paymentDate)) {
      return;
    }

    const {formData} = this.state;
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
        if (!values.customerId) {
          this.textRequiredCustomer = <Translate id="text_required_customer" />;
          return;
        }

        if (!formData.productVariantId) {
          return this.Util.sweetAlertMessageV2("Error", "Please select product", "error");
        }

        values.productVariantId = formData.productVariantId;
        values.serialNo = "";
        values.receiveDate = this.Util.formatDateForMYSQL(values.receiveDate);
        values.paymentDate = this.Util.formatDateForMYSQL(values.paymentDate);
        values.price = formData.price;
        values.total = _.sumBy(formData.paymentSchedule, "payAmount");
        values.isChangeSchedule = this.state.isChangeSchedule;
        if (values.receiveDate <= moment().format("YYYY-MM-DD")) {
          values.status = EnumINS.INSTALLMENT_STATUS.RECEIVED;
        }
        delete values.searchProduct;
        this.save(values);
      }
    });
  }

  save(data) {
    if (this.id) {
      this.setState({loadingSubmit: true});
      InstallmentService.update(data, this.id)
      .then(() => {
        this.fetchDetail(this.id);
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
        message.error("Something went wrong!");
      })
      .finally(() => {
        this.setState({loadingSubmit: false});
      });
    }
  }

  handleShowSerialModal(index, pVariantId) {
    this.modalTitle = <div><Translate id="text_add" /> <Translate id="text_serial_no" /></div>;
    this.setState({
      serialFormData: {
        id: "",
        pVariantId,
        invoiceDate: this.props.form.getFieldValue("receivedDate"),
        quantity: this.props.form.getFieldValue(`quantity[${index}]`),
        description: this.state.formData.products[index].name,
        number: "",
        numOfWarranty: 0,
        durationType: "DAY",
        index,
      }
    });
    this.serialRef.handleShowModal();
  }

  handleSaveSerialNo = (values) => {
    const {formData} = this.state;
    const serialNumber = values.serialNumber;
    const numOfWarranty = values.numOfWarranty;
    let newSerials = {};
    if (values.id) {
      newSerials.id = values.id;
      newSerials.number = serialNumber;
      newSerials.numOfWarranty = numOfWarranty;
      newSerials.durationType = values.durationType;
      newSerials.status = 1;
    } else {
      newSerials = {
        number: serialNumber, 
        numOfWarranty, 
        durationType: values.durationType, 
        isNew: true, 
        status: 1
      };
    }

    formData.serial = newSerials;
    formData.serialNo = serialNumber;
    this.setState({
      selectedSerials: [serialNumber],
      formData
    });
    this.serialRef.onCloseModal();
  }

  onCancelAddSerial = (index = 1) => {
    this.serialRef.onCloseModal();
  }

  handleUpdateSerial(serial, index) {

  }

  handleRemoveSerialNo(index) {

  }

  handleDeleteSerial(serial, index) {

  }

  validateSerialNo(value, callback) {
    if (!value) {
      callback(stringTranslate("error_serial_number_require", this.props.locale));
    }
    callback();
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
    this.generatePaymentSchedule(formData.price, rate, numberOfMonth, formData.paymentDate);
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
    this.generatePaymentSchedule(formData.price, formData.rate, numberOfMonth, formData.paymentDate);
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
    this.generatePaymentSchedule(formData.price, formData.rate, numberOfMonth, formData.paymentDate);
  }

  handleDeleteProduct() {
    if (this.id) {
      this.Util.sweetAlertConfirm(stringTranslate("text_confirm", this.props.locale), stringTranslate("text_are_you_sure", this.props.locale))
      .then(willDelete => {
        if (willDelete) {
          this.setState(preState => {
            preState.formData.productVariantId = "";
            preState.formData.productVariant = {};
            preState.formData.products = [];
            preState.formData.price = 0;
            preState.formData.paymentSchedule = [];
            return preState;
          });
        }
      });
    } else {
      this.setState(preState => {
        preState.formData.productVariant = {};
        preState.formData.productVariantId = "";
        preState.formData.products = [];
        preState.formData.price = 0;
        preState.formData.paymentSchedule = [];
        return preState;
      });
    }
  }

  handleDeleteSchedule(status) {
    if (status === EnumINS.INSTALLMENT_STATUS.DRAFT) {
      this.setState(preState => {
        preState.formData.paymentSchedule = [];
        return preState;
      });
    } else {
      this.Util.sweetAlertConfirm("", stringTranslate("text_are_you_sure", this.props.locale))
      .then(willDelete => {
        if (willDelete) {
          this.setState(preState => {
            preState.formData.paymentSchedule = [];
            preState.isChangeSchedule = true;
            return preState;
          });
        }
      });
    }
  }

  handleDelete(id) {

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
    formData.productVariantId = productVariant.id;
    formData.price = productVariant.price;
    formData.productVariant = {
      name: product.name
    };
    formData.products = [{
      id: formData.products[0] ? formData.products[0].id : "",
      name: `${product.name ? product.name : product.namekm} ${isProductVariant ? productVariant.name : ""}`,
      quantity: 1,
      price: productVariant.price,
      status: 1,
      enableDescription: product.enableDescription
    }];

    let numberOfMonth = formData.duration;
    if (formData.durationType === Enum.DURATION_TYPE.YEAR) {
      numberOfMonth = formData.duration * 12;
    }

    this.setState({formData}, () => {
      this.generatePaymentSchedule(productVariant.price, formData.rate, numberOfMonth, formData.paymentDate);
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

  handleMarkReceived(id) {
    InstallmentService.markAsReceived(id)
    .then(() => {
      message.success("Mark as received success");
      this.fetchDetail(id);
    });
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
    let disabledEdit = false;
    if (formData.id && formData.status !== EnumINS.INSTALLMENT_STATUS.DRAFT && formData.paymentSchedule && formData.paymentSchedule.length) {
      disabledEdit = true;
    }

    if (this.state.isChangeSchedule) {
      disabledEdit = false;
    }

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
                <Col md={8} style={{display: "inline-grid", textAlign: "right", paddingRight: 10, lineHeight: "40px"}}>
                  <label><Translate id="text_received_date" /></label>
                  <label><Translate id="text_payment_date" /></label>
                  <label><Translate id="text_rate" /></label>
                </Col>
                <Col md={16}>
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
                    onChange={this.handleChangePayDate}
                    form={form} />
                  
                  <Input.Group style={{display: "flex"}}>
                    <InputNumber
                      name="rate"
                      placeholder={`${stringTranslate("text_rate", locale)}`}
                      data={formData.rate}
                      disabled={disabledEdit}
                      style={{width: "80%"}}
                      isAutoSelect={true}
                      onChange={this.handleChangeRate}
                      form={form} />
                    <Input value="%" style={{width: "20%", marginLeft: 10, marginTop: 3}} disabled={true} />
                  </Input.Group>
                </Col>
              </Row>
            </Col>
            <Col md={8}>
              <Row>
                <Col md={8} style={{textAlign: "right", paddingRight: 10, paddingTop: 8}}>
                  <label><Translate id="text_duration" /></label>
                </Col>
                <Col md={16}>
                  <Input.Group style={{display: "flex"}}>
                    <InputNumber
                      name="duration"
                      placeholder={`${stringTranslate("text_duration", locale)}`}
                      isAutoSelect={true}
                      style={{width: "60%"}}
                      data={formData.duration}
                      onChange={this.handelChangeDuration}
                      precision={0}
                      disabled={disabledEdit}
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
                      disabled={disabledEdit}
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
              disabled={disabledEdit}
              style={{marginTop: 12}}
              form={form}/>  
            <Col md={24}>
              <Table 
                rowKey={((record, index) => index)}
                columns={this.productColumns}
                className="table-form-invoice-entry"
                dataSource={formData.products}
                pagination={false}
                locale={{emptyText: <div style={{padding: "25px 0"}}><Translate id="text_no_sale_entries_product" /></div>}}
                rowClassName={((record) => record.status === 3 ? "hidden" : "")}
              />
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
              <Dropdown 
                overlay={(
                  <Menu>
                    <Menu.Item onClick={this.handlePrintInvoiceA5}><Translate id="text_print_invoice" /> A5</Menu.Item>
                    <Menu.Item onClick={() => this.handleMarkReceived(this.id)}>
                      <Translate id="text_mark_as_received" />
                    </Menu.Item>
                    <Menu.Item>
                      <Link to="/installment/create" target="_blank"><Translate id="text_new_installment" /></Link>
                    </Menu.Item>
                    <Menu.Item style={{color: "red"}} onClick={() => this.handleDeleteSchedule(formData.status)}><Translate id="text_delete_schedule" /></Menu.Item>
                    <Menu.Item style={{color: "red"}} onClick={() => this.handleDelete(this.id)}><Translate id="text_delete" /></Menu.Item>
                  </Menu>
                )}
              >
                <button className="ant-btn ant-dropdown-link" id="button-more-action" type="button">
                  <Translate id="text_more_action" /> <Icon type="down" />
                </button>
              </Dropdown>
            </Col>
          </Row>
        </Form>
        {this.state.modalVariant}
        {this.state.customerForm}
        <div id="wrap-invoice-form">
          <DownPaymentTable formData={formData} />
        </div>
        <SerialForm 
          ref={ref => this.serialRef = ref}
          modalTitle={this.modalTitle}
          locale={this.props.locale}
          formData={this.state.serialFormData}
          selectedSerials={this.state.selectedSerials}
          onSuccess={this.handleSaveSerialNo}
          onCanceled={this.onCancelAddSerial}
          form={form} 
        />
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