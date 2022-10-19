import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-localize-redux";
import {
  Form,
  PageHeader,
  Row,
  Col,
  Select,
  Icon,
  Spin,
  Divider,
  Input,
  Table,
  Tabs,
  Menu,
  Dropdown,
  message,
  Badge
} from "antd";
import { Link } from "react-router-dom";
import sweetalert from "sweetalert";
import moment from "moment";
import _ from "lodash";
import SaleOrderNo from "./SaleOrderNumber";
import history from "../../../../common/router/history";
import { 
  DatePickers, 
  InputText,
  InputNumber,
  Button,
  InputTextArea
} from "../../../../common/elements/ant-ui";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import Enum from "../../../enums";
import EnumProduct from "../../../../inventory/enums";
import Util from "../../../../common/util";
import CustomerService from "../../../../crm/services/customers/CustomerService";
import SaleOrderService from "../../../services/transactions/SaleOrderService";
import ProductVariantAction from "../../../../inventory/actions/products/productVariant";
import CustomerAction from "../../../../crm/actions/customers/customer";
import SearchProductDropdown from "../Invoice/SearchProduct";
import VariantProduct from "../../../containers/transactions/SaleWalkin/VariantProduct";
import CustomerCreate from "../../../../crm/containers/customers/Customer/FormCreate";
import SaleOrderInvoice from "./Invoice";
import styles from "../styles";

const {TabPane} = Tabs;

class FormItem extends React.PureComponent {
  state = {
    fetching: false,
    customers: [],
    formData: {},
    productSearch: [],
    transactionEntries: [],
    customerForm: null,
    selectedProduct: null,
    modalVariant: null,
    loading: false
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
            handleOnChange={(e) => this.onChangeDescription(e, index)}
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
  SALE_ORDER_STATUS_STR = {
    [Enum.SALE_ORDER_STATUS.DRAFT]: { title: stringTranslate("text_draft", this.props.locale), color: "#bfbfbf" },
    [Enum.SALE_ORDER_STATUS.CONFIRMED]: { title: stringTranslate("text_confirm", this.props.locale), color: "#1890ff" },
    [Enum.SALE_ORDER_STATUS.CLOSED]: { title: stringTranslate("text_closed", this.props.locale), color: "#f50"},
    [Enum.SALE_ORDER_STATUS.VOID]: {title: stringTranslate("text_void", this.props.locale), color: "#d9d9d9"}
  };
  util = new Util();
  pageTitle = "text_sale_order";
  textRequiredCustomer = "";
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
      this.pageTitle = "text_edit_sale_order";
      this.getUpdatedData(idParam);
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
          customerNote: "",
          publicNote: "",
          template: Enum.PAPER_SIZE.EXCLUDE_TAX
        };
        preState.transactionEntries = [{
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

  componentDidUpdate() {
    if (this.props.customerAdd.added) {
      const {customers, formData} = this.state;
      const data = this.props.customerAdd.response.data;
      formData.customerId = data.id;
      formData.firstName = data.firstName;
      formData.lastName = data.lastName;
      formData.phoneNumber = data.phoneNumber;
      formData.address = data.address;
      customers.unshift(data);
      this.setState({
        customers, 
        formData
      });

      this.props.dispatch(CustomerAction.reset("RESET_ADD_CUSTOMERS"));
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

  getUpdatedData(id) {
    const action = new URLSearchParams(document.location.search).get("action");
    this.setState({loading: true});
    SaleOrderService.detail(id)
      .then(response => {
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

        let discount = Number(data.discount);
        let taxRate = this.util.getTaxRate(data.totalExcludeTax - discount, data.total - totalExcludeTax);
        if (!taxRate)
          taxRate = 0;
        data.taxRate = taxRate;

        if (action) {
          this.pageTitle = "text_sale_order";
          data.number = "";
          data.saleOrderDate = moment().format("YYYY-MM-DD");
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
        if (formData.status === Enum.SALE_ORDER_STATUS.CLOSED) {
          return this.util.sweetAlertMessageV2("Sorry", "Can't update closed sale order", "warning");
        }

        if (formData.discount > subTotal) {
          this.textDiscountErr = "Discount amount must be less than total amount";
          return;
        }

        const saleOrder = {
          customerId: values.customerId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          company: formData.company,
          discount: values.discount,
          exchangeRate: values.exchangeRate,
          discountType: values.discountType,
          customerNote: values.customerNote,
          publicNote: values.publicNote,
          number: values.number,
          invoiceDate: this.util.formatDateForMYSQL(values["saleOrderDate"]),
          expectedShipmentDate: this.util.formatDateForMYSQL(values.expectedShipmentDate),
          registerDate: this.util.formatDateForMYSQL(formData.registerDate ? formData.registerDate : moment()),
          totalExcludeTax:  subTotal,
          total: values.total
        };

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
                unitId: values.unitId[index],
                unitName: values.unitName[index],
                cost: values.cost[index],
                price: values.price[index],
                discount: 0,
                status: values.status[index]
              });
            }
          });
          saleOrder["transactionEntries"] = transactionEntries;
        } else {
          return this.util.sweetAlertMessage(stringTranslate("text_please_select_product", this.props.locale), "warning");
        }
        this.save(saleOrder);
      }
    });
  }

  save(saleOrder) {
    this.setState({saveLoading: true});
    if (this.id) {
      SaleOrderService.update(saleOrder, this.id)
      .then(() => {
        sweetalert({
          icon: "success",
          title: "Success!",
          text: stringTranslate("text_success_save_invoice", this.props.locale),
          buttons: false,
          timer: 1500
        });
        this.getUpdatedData(this.id);
      })
      .catch(() => message.error("Error"))
      .finally(() => this.setState({saveLoading: false}));
    } else {
      SaleOrderService.create(saleOrder)
      .then((response) => {
        sweetalert({
          icon: "success",
          title: "Success!",
          text: stringTranslate("text_success_save_invoice", this.props.locale),
          buttons: false,
          timer: 1500
        });
        this.id = response.data.data.id;
        history.push(`/transactions/sale-order/update/${this.id}?after-created=1`);
        this.pageTitle = "text_edit_sale_order";
        this.getUpdatedData(this.id);
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

  onChangeQty = (qty, index) => {
    if (!qty || qty < 0) qty = 0;
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

  handleNewSaleOrder = () => {
    this.setState({
      formData: {
        taxRate: 0,
        totalExcludeTax: 0,
        discount: 0,
        total: 0
      },
      transactionEntries: []
    });
    this.id = "";
    history.push("/transactions/sale-order/create");
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

    this.setState({transactionEntries: existingProductList, formData});
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
  }

  removeEntry = (index) => {
    const {transactionEntries, formData} = this.state;
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

  handleMakeConfirm(id) {
    SaleOrderService.markAsConfirm(id)
    .then(() => {
      message.success("Make confirm success");
      this.getUpdatedData(id);
    })
    .catch(() => message.error("Error!....."));
  }

  handleVoid(id) {
    this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
    .then(willVoid => {
      if (willVoid) {
        SaleOrderService.void(id)
        .then(() => message.success("Void success"))
        .catch(() => message.error("Error!......"));
      }
    });
  }

  handleDelete(id) {
    this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
    .then(willDelete => {
      if (willDelete) {
        SaleOrderService.delete(id)
        .then(() => {
          message.success("Delete invoice success");
          history.goBack();
        })
        .catch(() => message.error("Error!......"));
      }
    });
  }

  handleGoBack = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") || params.get("after-created")) {
      history.push("/transactions/sales-order");
    } else {
      history.goBack();
    }
  }

  showCustomerForm = () => {
    this.setState({customerForm: <CustomerCreate />});
    this.props.dispatch(CustomerAction.showForm());
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
    formData.transactionEntries = this.state.transactionEntries;
    return <div id="wrap-invoice-form">
      <SaleOrderInvoice formData={formData} locale={this.props.locale} />
    </div>;
  }

  render() {
    const {formData} = this.state;
    const {getFieldDecorator} = this.props.form;
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
    let discount = Number(formData.discount);
    let subTotal = this.getTotal();

    if (!discount)
      discount = 0;

    formData.totalExcludeTax = subTotal;
    let vat = this.util.getTaxValue(subTotal - discount, formData.taxRate);
    formData.total = subTotal + vat;
    formData.status = Number(formData.status);
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
            <div>
              <Translate id="text_sale_order" />
              {this.id && formData.status >= 0 ? <Badge count={this.SALE_ORDER_STATUS_STR[formData.status].title} style={{ backgroundColor: this.SALE_ORDER_STATUS_STR[formData.status].color}} /> : ""}
            </div>
          }
        />

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
              name="saleOrderDate"
              label={<Translate id="text_sale_order_date" />}
              placeholder={`${stringTranslate("text_sale_order_date", this.props.locale)}`}
              defaultValue={formData.registerDate ? moment(formData.registerDate) : null}
              style={styles.itemCenter}
              form={this.props.form} />
            <DatePickers
              name="expectedShipmentDate"
              style={styles.itemCenter}
              label={<Translate id="text_expected_shipment_date" />}
              placeholder={`${stringTranslate("text_expected_shipment_date", this.props.locale)}`}
              defaultValue={formData.expectedShipmentDate ? moment(formData.expectedShipmentDate) : null}
              form={this.props.form} />
            </Col>
            <Col md={8} style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
              <SaleOrderNo
                name="number"
                label={<div style={{marginTop: 7, marginRight: 10}}><Translate id="text_sale_order_no" /></div>}
                placeholder={`${stringTranslate("text_sale_order_no", this.props.locale)}`}
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
                <TabPane tab={<Translate id="text_customer_note" />} key="1" style={{width: 668}}>
                  <InputTextArea
                    name="customerNote"
                    rows={6}
                    style={{width: 1000, marginTop: -4}}
                    data={formData.customerNote}
                    form={this.props.form} />
                </TabPane>
              </Tabs>
            </Col>
            <Col md={8} style={{lineHeight: "30px", paddingRight: 25}}>
              <div style={styles.itemSummary}>
                <div style={{width: 160}}>
                  <Translate id="text_sub_total" />
                </div>
                <div>:</div>
                <div style={{width: 100, textAlign: "right"}}>{this.util.formatCurrency(formData.totalExcludeTax)}</div>
              </div>
              <div style={styles.itemSummary}>
                <div style={{width: 160}}><Translate id="text_discount" /></div>
                <div>:</div>
                <div style={{width: 100, textAlign: "right", color: "red"}}>-{this.util.formatCurrency(discount)}</div>
                <InputNumber 
                  name="discount"
                  data={formData.discount}
                  style={{display: "none"}}
                  form={this.props.form} />
              </div>
              <div style={styles.itemSummary}>
                <div style={{width: 160}}><Translate id="text_vat" />({formData.taxRate}%)</div>
                <div>:</div>
                <div style={{width: 100, textAlign: "right"}}>{this.util.formatCurrency(vat)}</div>
              </div>
              <div style={styles.itemSummary}>
                <div style={{width: 160}}><Translate id="text_grand_total" /></div>
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
          <Row style={{paddingBottom: 14}}>
            <Col md={24} style={{display: "flex", justifyContent: "center"}}>
              <Button type="info" htmlType="submit" loading={this.state.saveLoading} >
                <Translate id="text_save" />
              </Button>
              <Button style={{marginRight: 15, marginLeft: 15}} onClick={this.handleResetForm}>
                <Translate id="text_clear" />
              </Button> 
              <Button onClick={() => window.print()} style={{marginRight: 15}}>
                <Translate id="text_print" />
              </Button>
              <Dropdown 
                overlay={(
                  <Menu>
                    <Menu.Item key={1} onClick={() => this.handleMakeConfirm(formData.id)}><Translate id="text_mark_as_confirm" /></Menu.Item>
                    <Menu.Item key={2}>
                      <Link to={`/transactions/create-invoice?saleOrderId=${formData.id}&action=convertToInvoice`}>
                        <Translate id="text_convert_to_invoice" />
                      </Link>
                    </Menu.Item>
                    <Menu.Item key={3}>
                      <Link target="_blank" to={`/transactions/sale-order/create?id=${formData.id}&action=clone`} ><Translate id="text_clone" /></Link>
                    </Menu.Item>
                    <Menu.Item key={5} onClick={this.handleNewSaleOrder}><Translate id="text_new_sale_order" /></Menu.Item>
                    <Menu.Item key={6} onClick={() => this.handleVoid(formData.id)}><Translate id="text_void" /></Menu.Item>
                    <Menu.Item key={7} onClick={() => this.handleDelete(formData.id)}><Translate id="text_delete" /></Menu.Item>
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
        {this.state.modalVariant}
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
      productVariant: state.reducer.productVariant.request,
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