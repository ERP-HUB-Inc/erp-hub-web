import React from "react";
import moment from "moment";
import _ from "lodash";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactToPrint from "react-to-print";
import { connect } from "react-redux";
import { Translate } from "react-localize-redux";
import { Link } from "react-router-dom";
import {
  Badge,
  Col,
  Collapse,
  Divider,
  Dropdown,
  Form,
  Icon,
  Menu,
  PageHeader,
  Row,
  Select,
  Spin,
  Table,
  Tabs,
  Tag,
  message
} from "antd";
import {
  InputText,
  InputNumber,
  DatePickers,
  Select as InputSelect,
  InputTextArea,
  Button
} from "../../../../common/elements/ant-ui";
import Util from "../../../../common/util";
import history from "../../../../common/router/history";
import InvoiceService from "../../../services/transactions/InvoiceService";
import CustomerService from "../../../../crm/services/customers/CustomerService";
import SerialService from "../../../services/transactions/SerialService";
import CustomerAction from "../../../../crm/actions/customers/customer";
import ProductVariantAction from "../../../../inventory/actions/products/productVariant";
import CustomerConstant from "../../../../crm/constants/customers/customer";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import Enum from "../../../enums";
import UtilEnum from "../../../../common/enums";
import EnumProduct from "../../../../inventory/enums";
import InputInvoiceNo from "../Invoice/InvoiceNo";
import SearchProductDropdown from "../Invoice/SearchProduct";
import CAInvoice from "../Invoice/CAInvoice";
import ReceiptTemplate from "../receipt/template";
import SerialForm from "../Invoice/SerialForm";
import SerialFormDelete from "../Invoice/SerialFormDelete";
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
};

class FormItem extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      transactionEntries: [],
      productSearch: [],
      customers: [],
      selectedSerials: [],
      serialFormData: {},
      customerForm: null,
      modalVariant: null
    };
    this.util = new Util();
    this.INVOICE_STATUS_STR = {
      [Enum.INVOICE_STATUS.DRAFT]: { title: stringTranslate("text_draft", this.props.locale), color: "#bfbfbf" },
      [Enum.INVOICE_STATUS.SENT]: { title: stringTranslate("text_sent", this.props.locale), color: "#1890ff" },
      [Enum.INVOICE_STATUS.PARTIAL]: { title: stringTranslate("text_partial_pay", this.props.locale), color: "#52c41a"},
      [Enum.INVOICE_STATUS.PAID]: { title: stringTranslate("text_paid", this.props.locale), color: "#52c41a"},
      [Enum.INVOICE_STATUS.VOID]: { title: stringTranslate("text_void", this.props.locale), color: "#d9d9d9"},
    };
    this.entryColumn = [
      {
        title: <Translate id="text_number_of" />,
        dataIndex: "no",
        key: "no",
        width: 80,
        align: "center",
        render: (no, record, index) => index + 1
      },
      {
        title: <Translate id="text_description" />,
        dataIndex: "description",
        key: "description",
        className: "entry-column-note",
        width: 600,
        render: (description, record, index) => {
          let serials = [];
          if (record.serials && record.serials.length) {
            serials = record.serials;
          }
          let activeLen = serials && serials.filter(serial => serial.status !== UtilEnum.ARCHIVE).length;
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
              handleOnChange={(e) => this.onChangeDescription(e, index)}
              form={this.props.form} />
              {
                record.enableDescription ? <React.Fragment>
                  <Collapse defaultActiveKey={["1"]} style={{background: "none", border: "none"}} className="serial-panel">
                    <Collapse.Panel header={<div><i style={{color: "red"}}>*</i> IMEI OR SERIAL</div>} key="1">
                      <div style={{marginBottom: 4, display: "flex", flexDirection: "column", width: 200}}>
                        {
                          serials && serials.map((serial, key) => <React.Fragment key={key}>
                            <Tag 
                              title={stringTranslate("text_double_click_edit_serial", this.props.locale)}
                              className={`${serial.status === UtilEnum.ARCHIVE ? "hidden" : ""} serial-tag`}
                              onDoubleClick={() => this.handleUpdateSerial(serial, index, key)}
                            >
                              {serial.number}
                              <Icon type="close-circle" title="Delete serial" className="btn-remove-serial" onClick={() => this.onDeleteSerial(serial, index, key)} />
                            </Tag>
                            {!serial.number && <span onDoubleClick={() => this.handleUpdateSerial(serial, index, key)} style={{color: "red", fontSize: 13, margin: "-7px 0 6px"}}><Translate id="error_serial_number_require" /></span>}
                          </React.Fragment>)
                        }
                        <Button type="info" style={{fontSize: 12, height: 31, marginRight: 8}} onClick={() => this.handleShowModal(index, record.productVariantId)} >
                          <Icon type="plus-circle" style={{paddingRight: 5}} />
                          <Translate id="text_add" />
                        </Button>
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                  <InputTextArea 
                    name={`serials[${index}]`}
                    required={true}
                    errorRequired={stringTranslate("error_serial_number_require", this.props.locale)}
                    validator={(rule, value, callback) => this.validateSerialNo(value, callback, index)}
                    data={serials.length ? JSON.stringify(serials) : null}
                    style={{display: `${activeLen ? "none" : "block"}`}}
                    inputStyle={{display: "none"}}
                    form={this.props.form} />
                </React.Fragment> : null
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
    this.pageTitle = "";
    this.id = "";
    this.timer = null;
  }

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
      this.pageTitle = "text_update_recurring_invoice";
      this.fetchDetail(idParam);
    } else {
      this.pageTitle = "text_create_recurring_invoice";
      this.setState({
        formData: {
          phoneNumber: "",
          invoiceDate: moment().format("YYYY-MM-DD"),
          dueDate: null,
          deposit: 0,
          discount: 0,
          taxRate: 0,
          discountType: Enum.DISCOUNT_TYPE.AMOUNT,
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
          status: 1,
          enableDescription: false
        }]
      });
    }

    CustomerService.lists(10)
    .then(response => {
      if (response && response.data) {
        const data = response.data.data;
        const {formData} = this.state;
        if (formData && formData.customerId) {
          const customerId = formData && formData.customerId;
          let selectedCustomer = data.find(customer => customer.id === customerId);
          if (!selectedCustomer) {
            data.concat([{
              id: customerId,
              firstName: formData.firstName,
              lastName: formData.lastName,
              phoneNumber: formData.phoneNumber
            }]);
          }
        }

        this.setState({customers: data});
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

  fetchDetail(id) {
    const action = new URLSearchParams(document.location.search).get("action");
    const isClone = action === "clone";
    this.setState({loading: true});
    InvoiceService.detail(id)
    .then(response => {
      const data = response.data;
      let totalExcludeTax = Number(data.totalExcludeTax);
      if (!totalExcludeTax) {
        totalExcludeTax = data.total;
      }

      const transactionEntries = [];
      const selectedSerials = [];

      data.transactionEntries.length && data.transactionEntries.forEach(entry => {
        transactionEntries.push({
          id: entry.id,
          productVariantId: entry.productVariantId,
          variantName: entry.variantName,
          categoryId: entry.categoryId,
          description: entry.description,
          unitId: entry.unitId,
          quantity: entry.quantity,
          unitName: entry.unitName,
          cost: entry.cost,
          price: entry.price,
          discount: 0,
          amount: entry.quantity * entry.price,
          serialNo: isClone ? "" : entry.serialNo,
          serials: isClone ? [] : entry.serialNo && entry.serialNo.split(",").map(serial => ({number: serial, status: "old"})),
          status: entry.status,
          enableDescription: entry.enableDescription
        });

        entry.serialNo && entry.serialNo.split(",").forEach(serial => {
          selectedSerials.push(serial);
        });
      });

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
        preState.selectedSerials = selectedSerials;
        return preState;
      });
    })
    .finally(() => this.setState({loading: false}));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!values.customerId) {
        return this.props.form.setFields({
          customerId: {
            errors: [new Error(stringTranslate("text_required_customer", this.props.locale))]
          }
        });
      }

      if (!err) {
        const {formData, transactionEntries} = this.state;
        const subTotal = this.getTotal();

        if (this.id && ![Enum.INVOICE_STATUS.DRAFT, Enum.INVOICE_STATUS.PAID].includes(Number(formData.status))) {
          return this.util.sweetAlertMessageV2("Warning", "Can't update invoice in this step", "warning");
        }

        if (formData.discount > subTotal) {
          return this.props.form.setFields({
            discountField: {
              errors: [new Error("Discount amount must be less than total amount")]
            }
          });
        }

        const invoice = {
          customerId: values.customerId,
          discount: values.discount,
          exchangeRate: values.exchangeRate,
          discountType: values.discountType,
          publicNote: formData.publicNote,
          deliveryFee: values.deliveryFee ? values.deliveryFee : 0,
          payTermType: values.payTermType,
          payTermNumber: values.payTermNumber,
          template: values.template,
          invoiceNumber: values.invoiceNumber,
          terms: values.terms,
          interval: values.interval,
          autoBill: values.autoBill,
          invoiceDate: this.util.formatDateForMYSQL(values["invoiceDate"]),
          startDate: values.startDate ? this.util.formatDateForMYSQL(values["startDate"]) : null,
          registerDate: this.util.formatDateForMYSQL(formData.registerDate ? formData.registerDate : moment()),
          invoiceType: Enum.INVOICE_TYPE.SCHEDULED,
          totalExcludeTax: subTotal,
          deposit: values.deposit,
          total: values.total
        };

        const entries = [];
        if (values["description"] && values["description"].length) {
          values["description"].forEach((description, index) => {
            if (description || values.quantity[index]) {
              entries.push({
                id: transactionEntries[index].id,
                productVariantId: transactionEntries[index].productVariantId,
                variantName: transactionEntries[index].variantName,
                categoryId: transactionEntries[index].categoryId,
                description,
                quantity: values.quantity[index],
                enableDescription: transactionEntries[index].enableDescription,
                unitId: transactionEntries[index].unitId,
                unitName: transactionEntries[index].unitName,
                cost: transactionEntries[index].cost,
                price: values.price[index],
                discount: 0,
                status: transactionEntries[index].status,
                serials: transactionEntries[index].serials && transactionEntries[index].serials.length ? transactionEntries[index].serials : ""
              });
            }
          });
          invoice["transactionEntries"] = entries;
        } else {
          return this.util.sweetAlertMessage(stringTranslate("text_please_select_product", this.props.locale), "warning");
        }

        this.save(invoice);
      }
    });
  }

  save(data) {
    if (this.id) {
      InvoiceService.update(data, this.id)
      .then(() => {
        this.util.sweetAlertMessageV2(
          stringTranslate("text_success", this.props.locale),
          stringTranslate("text_update_success", this.props.locale),
          "success"
        );
        this.fetchDetail(this.id);
      });
    } else {
      InvoiceService.create(data)
      .then(response => {
        this.util.sweetAlertMessageV2(
          stringTranslate("text_success", this.props.locale),
          stringTranslate("text_success_save_invoice", this.props.locale),
          "success"
        );
        this.id = response.data.data.id;
        history.push(`/transactions/recurring-invoice/update/${this.id}?after-created=1`);
        this.pageTitle = "text_update_recurring_invoice";
        this.fetchDetail(this.id);
      });
    }
  }

  handleShowModal(index, pVariantId) {
    this.modalTitle = <div><Translate id="text_add" /> <Translate id="text_serial_no" /></div>;
    this.setState({
      serialFormData: {
        id: "",
        pVariantId,
        invoiceDate: this.props.form.getFieldValue("invoiceDate"),
        quantity: this.props.form.getFieldValue(`quantity[${index}]`),
        description: this.props.form.getFieldValue(`description[${index}]`),
        number: "",
        numOfWarranty: 0,
        durationType: "DAY",
        index,
        index2: null
      }
    });
    this.serialRef.handleShowModal();
  }

  validateSerialNo(value, callback, index) {
    if (value && this.util.isJsonString(value)) {
      value = JSON.parse(value);
      let qty = this.props.form.getFieldValue(`quantity[${index}]`);
      value = value.filter(serial => serial.status !== UtilEnum.ARCHIVE && serial.number);
      if (value && !value.length) {
        callback(stringTranslate("error_serial_number_require", this.props.locale));
      }

      if (value && value.length !== Number(qty)) {
        callback(stringTranslate("text_serial_number_must_equal_quantity", this.props.locale));
      }
    }
    callback();
  }

  handleSaveSerialNo = (values) => {
    let transactionEntries = this.state.transactionEntries.slice();
    const {formData} = this.state;
    let selectedSerials = this.state.selectedSerials;
    const index = Number(values.fieldIndex);
    const index2 = values.fieldIndex2;
    const serialNumber = values.serialNumber;
    const numOfWarranty = values.numOfWarranty;
    let qty = Number(this.props.form.getFieldValue(`quantity[${index}]`));

    if (!serialNumber && !numOfWarranty) {
      return false;
    }

    let newSerials = [];
    let serials = transactionEntries[index].serials;
    if (serials && serials.length) {
      newSerials = serials;
    }

    if (index2 === null) {
      let serialNo = transactionEntries[index].serialNo;
      newSerials.push({number: serialNumber, numOfWarranty, durationType: values.durationType, isNew: true, status: 1});
      if (qty < newSerials.length) {
        qty += 1;
        const price = transactionEntries[index].price;
        let amount = (qty * price);

        if (!amount || amount < 0) amount = 0;
        transactionEntries[index].quantity = qty;
        transactionEntries[index].amount = amount;
        let discount = this.props.form.getFieldValue("discountField");
        let total = this.getTotal(transactionEntries);
        if (formData.discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
          discount = this.util.getValueFromPercentage(total, discount);
        }
        formData.discount = discount;
      }
      transactionEntries[index].serialNo = serialNo ? `${serialNo},${serialNumber}` : serialNumber;
      selectedSerials.push(serialNumber);
    } else {
      let serialNo = transactionEntries[index].serialNo.toString().split(",");
      newSerials[index2].id = values.id;
      newSerials[index2].number = serialNumber;
      newSerials[index2].numOfWarranty = numOfWarranty;
      newSerials[index2].durationType = values.durationType;
      newSerials[index2].status = 1;
      serialNo[index2] = serialNumber;
      transactionEntries[index].serialNo = serialNo.toString();
      let serialIndex = selectedSerials.indexOf(values.oldSerial);
      if (serialIndex) {
        selectedSerials[serialIndex] = serialNumber;
      }
    }

    transactionEntries[index].serials = newSerials;
    this.setState({
      transactionEntries,
      selectedSerials,
      formData,
      isShowModal: false
    });
    this.props.form.setFieldsValue({[`quantity[${index}]`]: qty});
    this.props.form.setFieldsValue({[`serials[${index}]`]: JSON.stringify(newSerials)});
    const activeSerialLen = newSerials.filter(serial => serial.status !== UtilEnum.ARCHIVE).length;
    if (qty === activeSerialLen) {
      this.serialRef.onCloseModal();
    }
  }

  onCancelAddSerial = (index) => {
    const qty = Number(this.props.form.getFieldValue(`quantity[${index}]`));
    let numOfSerials = this.props.form.getFieldValue(`serials[${index}]`);
    const transactionEntries = [];
    Object.assign(transactionEntries, this.state.transactionEntries);
    let serials = [];
    serials = transactionEntries[index].serials;

    if (numOfSerials && this.util.isJsonString(numOfSerials)) {
      numOfSerials = JSON.parse(numOfSerials);
      if (numOfSerials.length < qty) {
        for(let i = 0; i < qty - numOfSerials.length; i++) {
          serials.push({id: "", number: "", status: 1, isNew: true});
        }
        transactionEntries[index].serials = serials;
        this.setState(preState => {
          preState.transactionEntries = transactionEntries;
          return preState;
        });
        this.props.form.setFieldsValue({[`serials[${index}]`]: JSON.stringify(serials)});
        setTimeout(() => {
          this.props.form.validateFields([`serials[${index}]`]);
        }, 500);
      }
    }
  }

  async handleUpdateSerial(serial, index, index2) {
    const variantId = this.state.transactionEntries[index].productVariantId;
    const transEntryId = this.state.transactionEntries[index].id;
    if (!serial.isNew) {
      const response = (await SerialService.findByNumber(serial.number, variantId, transEntryId)).data;
      if (response.length) {
        serial.id = response[0].id;
        serial.numOfWarranty = response[0].numOfWarranty;
        serial.durationType = response[0].durationType;
      }
    }

    this.modalTitle = <div><Translate id="text_edit" /> <Translate id="text_serial_no" /></div>;
    this.setState({
      serialFormData: {
        id: serial.id,
        pVariantId: variantId,
        invoiceDate: this.props.form.getFieldValue("invoiceDate"),
        quantity: this.props.form.getFieldValue(`quantity[${index}]`),
        description: this.props.form.getFieldValue(`description[${index}]`),
        number: serial.number,
        numOfWarranty: serial.numOfWarranty,
        durationType: serial.durationType,
        index,
        index2
      }
    });
    this.serialRef.handleShowModal();
  }

  handleRemoveSerialsNo = (values) => {
    const removeSerials = values.serials;
    const index = Number(values.index);
    const {formData} = this.state;
    const transactionEntries = JSON.parse(JSON.stringify(this.state.transactionEntries));
    let selectedSerials = this.state.selectedSerials;
    let serials = transactionEntries[index].serials;
    let serialNo = transactionEntries[index].serialNo.toString().split(",");
    let discount = this.props.form.getFieldValue("discountField");
    const price = transactionEntries[index].price;
    let qty = transactionEntries[index].quantity;
    if (removeSerials && removeSerials.length) {
      removeSerials.forEach(item => {
        let index2 = serials.findIndex(serial => serial.number === item.number);
        if (index2 >= 0) {
          if (serials[index2].isNew) {
            serials.splice(index2, 1);
          } else {
            serials[index2].status = UtilEnum.ARCHIVE;
          }
          serialNo = _.without(serialNo, item.number);
          selectedSerials = _.without(selectedSerials, item.number);
        }
      });
      transactionEntries[index].serials = serials;
      transactionEntries[index].serialNo = serialNo.toString();
      transactionEntries[index].quantity = qty;
      transactionEntries[index].amount = price * qty;
      let total = this.getTotal(transactionEntries);
      if (formData.discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
        discount = this.util.getValueFromPercentage(total, discount);
      }
      formData.discount = discount;

      const activeSerials = serials.filter(serial => Number(serial.status) !== UtilEnum.ARCHIVE).length;
      if (activeSerials === qty) {
        this.deleteSerialRef.onCloseModal();
      }
      this.props.form.setFieldsValue({[`serials[${index}]`]: JSON.stringify(serials)});
      this.setState({formData, transactionEntries, selectedSerials});
    }
  }

  onShowDeleteSerialForm(index) {
    this.setState({
      deleteSerialData: {
        index,
        pVariantId: this.state.transactionEntries[index].productVariantId,
        transEntryId: this.state.transactionEntries[index].id,
        description: this.props.form.getFieldValue(`description[${index}]`),
        quantity: this.props.form.getFieldValue(`quantity[${index}]`)
      }
    });
    this.deleteSerialRef.handleShowModal();
  }

  onDeleteSerial = (serial, index, index2) => {
    let {formData, selectedSerials} = this.state;
    const transactionEntries = this.util.copyArrayObj(this.state.transactionEntries);
    let qty = Number(this.props.form.getFieldValue(`quantity[${index}]`)) - 1;
    let price = transactionEntries[index].price;
    let amount = qty * price;
    if (serial.isNew) {
      let serials = transactionEntries[index].serials;
      let serialNo = transactionEntries[index].serialNo.toString().split(",");
      serials.splice(index2, 1);
      transactionEntries[index].serials = serials;
      serialNo = _.without(serialNo, serial.number);
      transactionEntries[index].serialNo = serialNo.toString();
      this.props.form.setFieldsValue({[`serials[${index}]`]: JSON.stringify(serials)});
      this.props.form.setFieldsValue({[`quantity[${index}]`]: qty});
      transactionEntries[index].quantity = qty;
      transactionEntries[index].amount = amount;
      let discount = this.props.form.getFieldValue("discountField");
      let total = this.getTotal(transactionEntries);
      if (formData.discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
        discount = this.util.getValueFromPercentage(total, discount);
      }
      formData.discount = discount;
      selectedSerials = _.without(selectedSerials, serial.number);
      this.setState({
        formData,
        transactionEntries,
        selectedSerials
      });
    } else {
      this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
      .then(willDelete => {
        if (willDelete) {
          let serials = transactionEntries[index].serials;
          let serialNo = transactionEntries[index].serialNo.toString().split(",");
          serials[index2].status = UtilEnum.ARCHIVE;
          serialNo = _.without(serialNo, serial.number);
          this.props.form.setFieldsValue({[`serials[${index}]`]: JSON.stringify(serials)});
          this.props.form.setFieldsValue({[`quantity[${index}]`]: qty});
          let discount = this.props.form.getFieldValue("discountField");
          transactionEntries[index].serials = serials;
          transactionEntries[index].serialNo = serialNo.toString();
          transactionEntries[index].quantity = qty;
          transactionEntries[index].amount = amount;
          let total = this.getTotal(transactionEntries);
          if (formData.discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
            discount = this.util.getValueFromPercentage(total, discount);
          }
          formData.discount = discount;
          this.setState({
            transactionEntries, 
            formData
          });
        }
      });
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

  onChangeQty = (qty, index) => {
    clearTimeout(this.timer);
    if (!qty || qty < 0) qty = 0;
    let serials = this.props.form.getFieldValue(`serials[${index}]`);

    this.timer = setTimeout(() => {
      if (serials && this.util.isJsonString(serials)) {
        serials = JSON.parse(serials);
        serials = Array.isArray(serials) && serials.filter(serial => serial.status !== UtilEnum.ARCHIVE);
        if (qty < serials.length) {
          this.onShowDeleteSerialForm(index);
        } else if (qty > serials.length) {
          this.handleShowModal(index);
        }

        this.props.form.validateFields([`serials[${index}]`]);
      }
    }, 500);

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

  onChangeVATType = (type) => {
    if (type !== "include") {
      this.setState(preState => {
        preState.formData.taxRate = 0;
        return preState;
      });
    }
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

  removeEntry = (index) => {
    const {formData} = this.state;
    const transactionEntries = this.util.copyArrayObj(this.state.transactionEntries);

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
          this.setState({transactionEntries, formData});
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
        this.setState({transactionEntries, formData});
        transactionEntries.length && transactionEntries.forEach((entry, index) => {
          this.props.form.setFieldsValue({
            [`description[${index}]`]: entry.description,
            [`quantity[${index}]`]: entry.quantity,
            [`price[${index}]`]: entry.price
          });
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
    this.props.form.setFieldsValue({searchProduct: ""});
    existingProductList.length && existingProductList.forEach((entry, index) => {
      this.props.form.setFieldsValue({
        [`description[${index}]`]: entry.description,
        [`quantity[${index}]`]: entry.quantity,
        [`price[${index}]`]: entry.price
      });
    });
    if (product.enableDescription) {
      setTimeout(() => {
        this.handleShowModal(0, productVariant.id);
      }, 900);
    }
  }

  showCustomerForm = () => {
    this.setState({customerForm: <CustomerCreate />});
    this.props.dispatch(CustomerAction.showForm());
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

  handleGoBack = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") || params.get("after-created")) {
      history.push("/transactions/recurring-invoice/list");
    } else {
      history.goBack();
    }
  }

  getTotal(transactionEntries = this.state.transactionEntries) {
    let total = 0;
    if (transactionEntries.length) {
      total = _.sumBy(transactionEntries, (value) => value.status !== 3 && value.amount);
    }
    if (!total || total < 0) total = 0;
    return total;
  }

  renderPageHeaderSubTitle(formData) {
    let statusColor = formData.status >= 0 && this.INVOICE_STATUS_STR[formData.status].color;
    let statusTitle = formData.status >= 0 && this.INVOICE_STATUS_STR[formData.status].title;

    if (formData.status === Enum.INVOICE_STATUS.SENT && moment(formData.dueDate).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")) {
      statusColor = "#f5222d";
      statusTitle = stringTranslate("text_expired", this.props.locale);
    }

    return <div>
      <Translate id="text_invoice" />
      {this.id && formData.status >= 0 ? <Badge count={statusTitle} style={{ backgroundColor: statusColor}} /> : ""}
    </div>;
  }

  renderSelectCustomer() {
    return (
      <Select
        notFoundContent={this.state.fetching ? <Spin /> : <Translate id="text_not_found_customer" />}
        filterOption={false}
        onSearch={this.fetchCustomer}
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
    const {formData} = this.state;
    let discount = Number(formData.discount);
    let subTotal = this.getTotal();

    formData.totalExcludeTax = subTotal;
    let vat = this.util.getTaxValue(subTotal - discount, formData.taxRate);
    formData.total = subTotal + vat;
    formData.status = Number(formData.status);
    
    return (
      Object.keys(formData).length && !this.state.loading ?
      <div>
        <Form onSubmit={this.handleSubmit} className="recurring-inv-form" id="invoice-form" layout="horizontal" >
          <PageHeader 
            style={{
              backgroundColor: "#f7f7f7",
              paddingLeft: 0,
              paddingRight: 0,
              position: "relative"
            }}
            onBack={this.handleGoBack}
            title={<Translate id={this.pageTitle} />} 
            subTitle={this.renderPageHeaderSubTitle(formData)}
          />

          <Row>
            <Col md={8} style={{paddingRight: 80}}>
              <Row>
                <Col md={6}><label style={{marginTop: 10}}><Translate id="text_customer" /></label></Col>
                <Col md={18}>
                  <Form.Item className="item-left" style={{width: "100%"}}>
                    {
                      this.props.form.getFieldDecorator("customerId", {
                        rules: [
                          {
                            require: true
                          }
                        ],
                        initialValue: formData.customerId
                      })(this.renderSelectCustomer())
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{marginTop: 50}}>
                <Col md={6}><label style={{marginTop: 10}}><Translate id="text_delivery_fee" /></label></Col>
                <Col md={18}>
                  <InputNumber
                    name="deliveryFee"
                    placeholder={`${stringTranslate("text_delivery_fee", this.props.locale)}`}
                    precision={2}
                    data={formData.deliveryFee ? formData.deliveryFee : 0}
                    isAutoSelect={true}
                    onChange={(value) => this.setState(preState => {
                      preState.formData.deliveryFee = value;
                      return preState;
                    })}
                    form={this.props.form}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={8}>
              <Row>
                <Col md={8} style={{display: "inline-grid", textAlign: "right", paddingRight: 10, lineHeight: "42px"}}>
                  <label><Translate id="text_invoice_date" /></label>
                  <label><Translate id="text_frequency" /></label>
                  <label><Translate id="text_next_send_date" /></label>
                  <label><Translate id="text_payment_terms" /></label>
                  <label><Translate id="currency_exchange" /></label>
                </Col>
                <Col md={16} style={{paddingRight: 30}}>
                  <DatePickers
                    name="invoiceDate"
                    placeholder={`${stringTranslate("text_received_date", this.props.locale)}`}
                    defaultValue={formData.invoiceDate ? moment(formData.invoiceDate) : null}
                    onChange={(date) => this.setState(preState => {
                      if (!date) {
                        date = "";
                      }
                      preState.formData.invoiceDate = this.util.formatDateForMYSQL(date);
                      return preState;
                    })}
                    form={this.props.form} />

                  <InputSelect 
                    name="interval"
                    valueKey="value"
                    placeholder={`${stringTranslate("text_frequency", this.props.locale)}`}
                    defaultValue={formData.frequency}
                    dataSource={[
                      {name: <Translate id="text_weekly" />, value: Enum.INVOICE_INTERVAL.WEEKLY},
                      {name: <Translate id="text_monthly" />, value: Enum.INVOICE_INTERVAL.MONTHLY}
                    ]}
                    form={this.props.form} /> 

                  <DatePickers
                    name="startDate"
                    placeholder={`${stringTranslate("text_next_send_date", this.props.locale)}`}
                    defaultValue={formData.startDate ? moment(formData.startDate) : null}
                    onChange={(date) => this.setState(preState => {
                      if (!date) {
                        date = "";
                      }
                      preState.formData.startDate = this.util.formatDateForMYSQL(date);
                      return preState;
                    })}
                    form={this.props.form} />

                  <div style={{display: "flex"}}>
                    <InputNumber
                      name="payTermNumber"
                      placeholder={stringTranslate("text_payment_terms", this.props.locale)}
                      data={formData.payTermNumber ? formData.payTermNumber : "" }
                      isAutoSelect={true}
                      defaultValue={formData.payTermNumber ? formData.payTermNumber : ""}
                      precision={0}
                      inputStyle={{width: 170}}
                      form={this.props.form}
                    />
                    <InputSelect
                      name="payTermType"
                      placeholder={`${stringTranslate("text_please_select", this.props.locale)}`}
                      defaultValue={formData.payTermType}
                      valueKey="value"
                      required={this.props.form.getFieldValue("payTermNumber") ? true : false}
                      dataSource={[
                        {name: <Translate id="text_day" />, value: Enum.PAYMENT_TERM_TYPE.DAY},
                        {name: <Translate id="text_month" />, value: Enum.PAYMENT_TERM_TYPE.MONTH}
                      ]}
                      style={{width: "100%", paddingLeft: 10}}
                      form={this.props.form} />
                  </div>
                  <InputNumber
                    name="exchangeRate"
                    placeholder={`${stringTranslate("currency_exchange", this.props.locale)}`}
                    required={true}
                    precision={0}
                    data={formData.exchangeRate}
                    isAutoSelect={true}
                    onChange={(value) => this.setState(preState => {
                        preState.formData.exchangeRate = value;
                        return preState;
                    })}
                    style={{width: "100%"}}
                    form={this.props.form} />
                </Col>
              </Row>
            </Col>
            <Col md={8}>
              <Row>
                <Col md={9} style={{display: "inline-grid", textAlign: "right", lineHeight: "42px", paddingRight: 10}}>
                  <label><Translate id="text_invoice_no" /></label>
                  <label><Translate id="text_deposit" /></label>
                  <label><Translate id="text_discount" /></label>
                  <label><Translate id="text_vat" /></label>
                  <label><Translate id="text_auto_bill" /></label>
                </Col>
                <Col md={15}>
                  <InputInvoiceNo 
                    name="invoiceNumber"
                    placeholder={`${stringTranslate("text_invoice_no", this.props.locale)}`}
                    data={formData.invoiceNumber}
                    locale={this.props.locale}
                    form={this.props.form}
                  />
                  <InputNumber
                    name="deposit"
                    data={formData.deposit ? formData.deposit : 0}
                    isAutoSelect={true}
                    min={0}
                    form={this.props.form} />
                  <div style={{display: "flex"}}>
                    <InputNumber
                      name="discountField"
                      data={formData.deposit}
                      isAutoSelect={true}
                      min={0}
                      onChange={this.onChangeTotalDiscount}
                      form={this.props.form}
                    />
                    <InputSelect 
                      name="discountType"
                      placeholder={`${stringTranslate("text_please_select", this.props.locale)}`}
                      defaultValue={formData.discountType ? formData.discountType : Enum.DISCOUNT_TYPE.AMOUNT}
                      valueKey="value"
                      dataSource={[
                        {name: <Translate id="text_percentage" />, value: Enum.DISCOUNT_TYPE.PERCENTAGE},
                        {name: <Translate id="text_amount" />, value: Enum.DISCOUNT_TYPE.AMOUNT}
                      ]}
                      style={{width: "100%", paddingLeft: 10}}
                      onChange={this.onChangeDiscountType} 
                      form={this.props.form} />
                  </div>
                  <div style={{display: "flex"}}>
                    <InputSelect 
                      name="vatType"
                      placeholder={`${stringTranslate("text_please_select", this.props.locale)}`}
                      defaultValue={formData.taxRate ? "include" : "exclude"}
                      valueKey="value"
                      dataSource={[
                        {name: "Include", value: "include"},
                        {name: "Exclude", value: "exclude"}
                      ]}
                      style={{width: "100%", paddingRight: 10}}
                      form={this.props.form} />
                    <InputText
                      name="taxRate"
                      data={`${Number(formData.taxRate)}`}
                      style={{width: 120}}
                      addonAfter="%"
                      disabled={this.props.form.getFieldValue("vatType") !== "include" ? true : false}
                      handleOnFocus={(e) => e.target.select()}
                      onChange={this.onChangeTaxRate}
                      form={this.props.form} />
                  </div>
                  <InputSelect 
                    name="autoBill"
                    placeholder={`${stringTranslate("text_please_select", this.props.locale)}`}
                    defaultValue={formData.autoBill}
                    valueKey="value"
                    dataSource={[
                      {name: "Enable", value: 1},
                      {name: "Disable", value: 0}
                    ]}
                    style={{width: "100%"}}
                    form={this.props.form} />
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
              //disabled={this.action === paramsAction.convertToInvoice ? true : false}
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
                <Tabs.TabPane tab={<Translate id="text_public_note" />} key="1" style={{width: 668}}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.publicNote ? formData.publicNote : ""}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      this.setState(preState => {
                        preState.formData.publicNote = data;
                        return preState;
                      });
                    }}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<Translate id="text_terms" />} key="2">
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
                </Tabs.TabPane>
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
                  data={discount ? discount : 0}
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
                <div><Translate id="text_delivery_fee" />:</div>
                <div style={{width: 100, textAlign: "right"}}>{this.util.formatCurrency(formData.deliveryFee ? formData.deliveryFee : 0)}</div>
              </div>
              <div style={styles.itemSummary}>
                <div><Translate id="text_grand_total" />:</div>
                <div style={{width: 100, textAlign: "right"}}>{this.util.formatCurrency(formData.total - discount + (formData.deliveryFee ? formData.deliveryFee : 0))}</div>
                <InputNumber
                  name="total"
                  data={formData.total ? formData.total : 0}
                  style={{display: "none"}}
                  form={this.props.form}
                />
              </div>
            </Col>
          </Row>

          <hr />

          <Row>
            <Col md={24} style={{display: "flex", justifyContent: "center"}}>
              <InputSelect 
                name="template"
                placeholder={`${stringTranslate("text_choose_template", this.props.locale)}`}
                onChange={(value) => this.onChangeTemplate(value)}
                defaultValue={formData.template ? formData.template : Enum.PAPER_SIZE.EXCLUDE_TAX}
                dataSource={[
                  {name: `${stringTranslate("text_template", this.props.locale)} 1`, value: Enum.PAPER_SIZE.EXCLUDE_TAX},
                  {name: `${stringTranslate("text_template", this.props.locale)} 2`, value: Enum.PAPER_SIZE.INCLUDE_TAX},
                ]}
                style={{marginTop: -4, marginRight: 15, width: 175}}
                form={this.props.form} />

              <Button type="info" htmlType="submit" loading={this.state.saveLoading} >
                <Translate id="text_save" />
              </Button>
              <Button style={{marginRight: 15, marginLeft: 15}} onClick={this.handleResetForm}>
                <Translate id="text_clear" />
              </Button>
              {
                formData.id ?
                <React.Fragment>
                  <Button onClick={() => window.print()} style={{marginRight: 15}}>
                    <Translate id="text_print_invoice" />
                  </Button>
                  <Dropdown
                    overlay={(
                      <Menu>
                        <Menu.Item key={0} onClick={this.handlePrintInvoiceA5}><Translate id="text_print_invoice" /> A5</Menu.Item>
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
                        <Menu.Item key={5}>
                          <Link to="/transactions/create-invoice" target="_blank">
                            <Translate id="text_new_invoice" />
                          </Link>
                        </Menu.Item>
                        {this.id ?
                          <Menu.Item key={6} onClick={this.handleVoidInvoice}>
                            <Translate id="text_void" />
                          </Menu.Item>
                          : null
                        } 
                    </Menu>
                    )}
                  >
                    <button className="ant-btn ant-dropdown-link" id="button-more-action" type="button">
                      <Translate id="text_more_action" /> <Icon type="down" />
                    </button>
                  </Dropdown>
                </React.Fragment>
                :
                ""
              }
            </Col>
          </Row>
        </Form>
        {this.renderReceipt(formData)}
        {this.renderPreviewInvoice(formData)}
        {this.state.customerForm}
        {this.state.modalVariant}
        <SerialForm 
          ref={ref => this.serialRef = ref}
          modalTitle={this.modalTitle}
          locale={this.props.locale}
          formData={this.state.serialFormData}
          selectedSerials={this.state.selectedSerials}
          onSuccess={this.handleSaveSerialNo}
          onCanceled={this.onCancelAddSerial}
          form={this.props.form} 
        />
        <SerialFormDelete 
          ref={ref => this.deleteSerialRef = ref}
          locale={this.props.locale}
          formData={this.state.deleteSerialData}
          selectedSerials={this.state.selectedSerials}
          onSuccess={this.handleRemoveSerialsNo}
          onCanceled={this.onCancelRemoveSerials}
          form={this.props.form} 
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
    locale: state.locale,
    customerAdd: state.reducer.customer.add,
    productVariant: state.reducer.productVariant.request,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formItem = Form.create(mapPropsToFields)(FormItem);
export default connect(mapStateToProps)(formItem);