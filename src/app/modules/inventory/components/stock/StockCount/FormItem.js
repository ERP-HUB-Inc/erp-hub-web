import React from "react";
import moment from "moment";
import {connect} from "react-redux";
import {Translate} from "react-localize-redux";
import {
  Form,
  Spin,
  Icon,
} from "antd";
import Util from "../../../../common/util";
import history from "../../../../common/router/history";
import Enum from "../../../../common/enums";
import EnumStock from "../../../enums";
import {stringTranslate} from "../../../../common/helper/stringTranslate";
import {
  Button
} from "../../../../common/elements/ant-ui";
import LocationService from "../../../../pos/services/settings/LocationService";
import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import FormStep3 from "./FormStep3";

class FormItem extends React.Component {
  state = {
    formData: {},
    locations: [],
    products: [],
    step: 1,
    loading: false
  };
  util = new Util();
  productColumn = [
    {
      title: <Translate id="text_product_name" />,
      dataIndex: "name",
      key: "name",
      render: (name, record) => {
        return <div>
          <div>{name}</div>
          {record.variantName ? <div className="variant-name">{record.variantName}</div> : ""}
        </div>;
      }
    },
    {
      title: <Translate id="text_barcode" />,
      dataIndex: "barcode",
      key: "barcode"
    },
    {
      title: <Translate id="text_action" />,
      dataIndex: "id",
      key: "id",
      render: (id, record, index) => <Button htmlType="button" onClick={() => this.handleRemoveProduct(id, index)} >
        <Icon type="delete" /> <Translate id="text_remove" />
      </Button>
    }
  ];
  pageTitle = "text_create_stock_count";
  id = "";

  componentDidMount() {
    const idParam = this.props.match.params.id;
    if (idParam) {
      this.id = idParam;
      this.pageTitle = "text_update_stock_count";
    } else {
      this.pageTitle = "text_create_stock_count";

      this.setState({
        formData: {
          countType: EnumStock.STOCK_COUNT_TYPE.PARTIAL,
          startDate: moment(),
          startTime: moment(),
          locationId: this.util.getLocationId()
        }
      });
    }

    LocationService.lists(50, 0)
    .then(response => {
      const locations = response.data.data;
      this.setState(preState => {
        if (!this.state.formData.name) {
          const location = locations.find(location => location.id === this.util.getLocationId());
          let name = "";
          if (location) {
            name = `${location.name} - ${moment().format("MMM DD, YYYY")} at ${moment().format("hh:mm A")}`;
          }
          preState.formData.name = name;
        }
        
        preState.locations = locations;
        return preState;
      });
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {formData, products} = this.state;
        const data = {
          startDate: this.util.formatDateForMYSQL(formData.startDate),
          startTime: this.util.formatDateForMYSQL(formData.startTime),
          locationId: formData.locationId,
          name: formData.name
        };

        data.products = products;

        this.save(data);
      }
    });
  }

  save(data) {
    console.log("date", data);
    if (this.id) {

    } else {

    }
  }

  handleStartCount = () => {
    const countType = this.state.formData.countType;
    if (!this.state.formData.name) {
      return this.util.sweetAlertMessageV2("", "Please input name", "warning");
    }

    if (countType === EnumStock.STOCK_COUNT_TYPE.PARTIAL && !this.state.products.length) {
      return this.util.sweetAlertMessageV2(
        stringTranslate("text_warning", this.props.locale),
        stringTranslate("text_please_input_product", this.props.locale),
        "error"
      );
    }

    this.setState({step: 2});
  }

  handleGoToPreview = (products) => {
    products = this.util.copyArrayObj(products);
    this.setState({
      products,
      step: 3
    });
  }

  handleRemoveProduct = (id, index) => {
    const selectedProducts = this.util.copyArrayObj(this.state.products);

    if (id) {
      this.util.sweetAlertConfirm(
        "",
        stringTranslate("text_are_you_sure", this.props.locale),
        [stringTranslate("text_cancel", this.props.locale), stringTranslate("text_yes", this.props.locale)]
      )
      .then(willRemove => {
        if (willRemove) {
          selectedProducts[index].status = Enum.ARCHIVE;
          return this.setState({products: selectedProducts});
        }
      });
    } else {
      selectedProducts.splice(index, 1);
      this.setState({products: selectedProducts});
    }
  }

  handleChangeDate = (date) => {
    let locationName = "";
    const locationId = this.props.form.getFieldValue("locationId");
    const startTime = this.props.form.getFieldValue("startTime");
    const location = this.state.locations.find(location => location.id === locationId);
    if (location) {
      locationName = location.name;
    }
    this.setState(preState => {
      preState.formData.startDate = date;
      return preState;
    });
    this.setStockCountName(locationName, date, startTime);
  }

  handleChangeTime = (time) => {
    let locationName = "";
    const locationId = this.props.form.getFieldValue("locationId");
    const startDate = this.props.form.getFieldValue("startDate");
    const location = this.state.locations.find(location => location.id === locationId);
    if (location) {
      locationName = location.name;
    }
    this.setState(preState => {
      preState.formData.startTime = time;
      return preState;
    });
    this.setStockCountName(locationName, startDate, time);
  }

  handleChangeLocation = (locationId) => {
    const location = this.state.locations.find(location => location.id === locationId);
    const startDate = this.props.form.getFieldValue("startDate");
    const startTime = this.props.form.getFieldValue("startTime");
    this.setState(preState => {
      preState.formData.locationId = locationId;
      return preState;
    });
    this.setStockCountName(location.name, startDate, startTime);
  }

  handleOnSelectList = (products) => {
    this.setState({products});
  }

  setStockCountName(location, startDate, startTime) {
    let name = "";
    const formData = this.util.copyObj(this.state.formData);
    if (location) {
      name += location;
    }

    if (startDate) {
      name += ` - ${this.util.formatDate(startDate, "MMM DD, YYYY")}`;
    }

    if (startTime) {
      name += ` at ${this.util.formatDate(startTime, "hh:mm A")}`;
    }

    formData.name = name;
    this.setState({formData});
  }

  handleGoBackToList = () => {
    history.goBack();
  }

  renderFormItem(formData) {
    const {form, locale} = this.props;
    let formItem = <div />;
    if (this.state.step === 1) {
      formItem = <FormStep1
        formData={formData}
        locale={locale}
        productVariant={this.props.productVariant}
        pageTitle={this.pageTitle}
        locations={this.state.locations}
        products={this.state.products}
        columns={this.productColumn}
        dispatch={this.props.dispatch}
        handleStartCount={this.handleStartCount}
        goBack={this.handleGoBackToList}
        handleChangeCountType={(e) => {
          const formData = this.util.copyObj(this.state.formData);
          formData.countType = e.target.value;
          this.setState({formData});
        }}
        handleRemoveProduct={this.handleRemoveProduct}
        handleChangeDate={this.handleChangeDate}
        handleChangeTime={this.handleChangeTime}
        handleChangeLocation={this.handleChangeLocation}
        handleOnSelectList={this.handleOnSelectList}
        form={form} 
      />;
    } else if (this.state.step === 2) {
      formItem = <FormStep2
        formData={formData}
        locale={locale}
        products={this.state.products}
        productVariant={this.props.productVariant}
        dispatch={this.props.dispatch}
        goBack={() => this.setState({step: 1})}
        handleReview={this.handleGoToPreview}
        form={form} />;
    } else if (this.state.step === 3) {
      formItem = <FormStep3
        formData={formData}
        locale={locale}
        products={this.state.products}
        goBack={() => this.setState({step: 2})}
        handleContinue={() => this.setState({step: 2})}
        form={form} />;
    }

    return formItem;
  }

  render() {
    const {formData} = this.state;
    return (
      !this.state.loading ?
      <div>
        <Form onSubmit={this.handleSubmit} className="recurring-inv-form">
          {this.renderFormItem(formData)}
        </Form>

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
    productVariant: state.reducer.productVariant.request
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formItem = Form.create(mapPropsToFields)(FormItem);
export default connect(mapStateToProps)(formItem);