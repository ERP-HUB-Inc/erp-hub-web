import React from "react";
import SearchPO from "./search.po";
import Enum from "@enums/index";
import moment from "moment";
import Constant from "../redux/constant";
import Action from "../redux/action";
import BaseModal from "@layout/base-modal";
import {
  Row,
  Col,
  SelectLocation,
  InputText,
  Select,
  InputTextArea,
  Form,
  Card,
  DatePicker,
} from "@components/index";
import { SelectVendor } from "@components/stateful/SelectVendor";

export default class FormItem extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      isAutoReceive: false,
    };
    this.timer = null;
    this.handleCheckPONumber = this.handleCheckPONumber.bind(this);
    this.validateOrderNumber = "";
    this.errorMessageOrderNumber = "";
    this.handleOnChangeIsAutoReceive =
      this.handleOnChangeIsAutoReceive.bind(this);
  }

  componentDidMount() {
    const isAutoReceive =
      parseInt(localStorage.getItem(Constant.IS_AUTO_RECEIVE_STOCK_KEY), 10) ===
      Enum.IS_AUTO_RECEIVE_STOCK;
    this.setState({
      locations: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.LOCATION)),
      isAutoReceive,
    });
    this.props.dispatch(Action.fetchUnit(100, 0));
  }

  handleCheckPONumber(event) {
    this.validateOrderNumber = "";
    this.errorMessageOrderNumber = "";
    const PONumber = event.target.value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.dispatch(Action.orderNumber(PONumber));
    }, 500);
  }

  handleOnChangeIsAutoReceive(event) {
    if (event.target.checked) {
      localStorage.setItem(
        Constant.IS_AUTO_RECEIVE_STOCK_KEY,
        Enum.IS_AUTO_RECEIVE_STOCK
      );
    } else {
      localStorage.removeItem(Constant.IS_AUTO_RECEIVE_STOCK_KEY);
    }
  }

  render() {
    const {
      form,
      dispatch,
      locale,
      formData,
      productSearch,
      requestOrderNumber,
    } = this.props;

    if (requestOrderNumber.error) {
      if (
        requestOrderNumber.error.response &&
        requestOrderNumber.error.response.data &&
        requestOrderNumber.error.response.data.error
      ) {
        if (
          requestOrderNumber.error.response.data.error.code ===
          this.HttpCode.PO_NUMBER_ALREADY_EXIST
        ) {
          this.errorMessageOrderNumber = (
            <this.Translate id="purchase_order_po_number_already_exist" />
          );
          this.validateOrderNumber = "error";
          this.dispatch(
            Action.reset(Constant.RESET_REQUEST_PURCHASE_ORDER_NUMBER)
          );
        }
      }
    }

    let locationId = formData.locationId;
    if (!locationId && Array.isArray(this.state.locations)) {
      const defaultLocation = this.state.locations.find(
        (location) => location.isDefault === this.Enum.IS_DEFAULT
      );
      if (defaultLocation) {
        locationId = defaultLocation.id;
      }
    }

    return (
      <Row id="purchase-order-form">
        <Col md={24}>
          {/* Master Data Card */}
          <Card>
            <Row gutter={20} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Form.Item label="Supplier / Vendor">
                  <SelectVendor
                    form={form}
                    size="meduim"
                    formData={formData}
                    width={"100%"}
                    placeholder={this.CATranslate("text_location", locale)}
                    onChange={() => console.log("Hello World")}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Warehouse">
                  <SelectLocation
                    form={form}
                    size="meduim"
                    formData={formData}
                    width={"100%"}
                    placeholder={this.CATranslate("text_location", locale)}
                    onChange={() => console.log("Hello World")}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <InputText
                  name="number"
                  size="meduim"
                  label={<this.Translate id="text_order_number" />}
                  data={formData.number}
                  placeholder={this.CATranslate("text_order_number", locale)}
                  form={form}
                />
              </Col>
              <Col span={6}>
                <Select
                  name="step"
                  size="meduim"
                  label={<this.Translate id="text_status" />}
                  placeholder={this.CATranslate("text_status", locale)}
                  defaultValue={
                    formData.id
                      ? formData.step
                      : this.state.isAutoReceive
                      ? Enum.PO_STATUS.FULLY_RECEIVED
                      : Enum.PO_STATUS.DRAFT
                  }
                  dataSource={[
                    {
                      name: <this.Translate id="text_draft" />,
                      value: Enum.PO_STATUS.DRAFT,
                    },
                    {
                      name: <this.Translate id="text_pending_approval" />,
                      value: Enum.PO_STATUS.PENDING_APPROVAL,
                    },
                    {
                      name: <this.Translate id="text_approved" />,
                      value: Enum.PO_STATUS.APPROVED,
                    },
                    {
                      name: <this.Translate id="text_sent_to_supplier" />,
                      value: Enum.PO_STATUS.SENT_TO_SUPPLIER,
                    },
                    {
                      name: <this.Translate id="text_supplier_confirmed" />,
                      value: Enum.PO_STATUS.SUPPLIER_CONFIRMED,
                    },
                    {
                      name: <this.Translate id="text_partially_received" />,
                      value: Enum.PO_STATUS.PARTIALLY_RECEIVED,
                    },
                    {
                      name: <this.Translate id="text_fully_received" />,
                      value: Enum.PO_STATUS.FULLY_RECEIVED,
                    },
                    {
                      name: <this.Translate id="text_closed" />,
                      value: Enum.PO_STATUS.CLOSED,
                    },
                    {
                      name: <this.Translate id="text_cancelled" />,
                      value: Enum.PO_STATUS.CANCELLED,
                    },
                  ]}
                  form={form}
                />
              </Col>

              <Col span={6}>
                <Form.Item label="Expected Delivery Date">
                  {form.getFieldDecorator("date", {
                    rules: [{ required: false }],
                    initialValue: moment(new Date()),
                  })(<DatePicker style={{ width: "100%" }} />)}
                </Form.Item>
              </Col>

              {/* <Col span={6}>
                <InputText
                  name="referenceNo"
                  size="meduim"
                  label={<this.Translate id="text_reference_no" />}
                  data={formData.referenceNo}
                  placeholder={this.CATranslate("text_reference_no", locale)}
                  form={form}
                />
              </Col> */}

              {/* <Col md={6}>
                <InputText
                  name="invoiceNo"
                  label={<this.Translate id="text_invoice_no" />}
                  data={formData.invoiceNo}
                  placeholder={this.CATranslate("text_invoice_no", locale)}
                  max={100}
                  form={form}
                  className="hidden"
                />
              </Col> */}

              <Col md={24}>
                <InputTextArea
                  name="description"
                  label={<this.Translate id="text_notes" />}
                  data={formData.description}
                  placeholder={this.CATranslate(
                    "text_notes",
                    this.props.locale
                  )}
                  max={255}
                  form={this.props.form}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Detail Data Card */}
        <Col md={24} className="purchase-order-entry">
          <Card title={"Order Items"}>
            <SearchPO
              dataSource={productSearch}
              productVariant={this.props.productVariant}
              purchaseOrderEntries={formData.POEntries}
              locale={locale}
              productReOrderPointList={this.props.productReOrderPointList}
              product={this.props.product}
              unit={this.props.unit}
              dispatch={dispatch}
              form={form}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name: "",
    supplierid: "",
    POEntries: [],
    payTermType: "",
    payTermNumber: "",
    payDueDate: "",
  },
  productSearch: [],
};
