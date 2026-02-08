import React from "react";
import {
   Drawer,
   Form,
   Button,
   Col,
   Row,
   Input,
   InputNumber,
   Select
} from "antd";
import {
   Translate,
   getActiveLanguage
} from "@redux/index";
import Util from "@helper/inventory";
import LocationService from "@services/LocationService";
import StockAdjustmentService from "@services/StockAdjustmentService";

const { Option } = Select;

class Shipping {
   shippingDetail = "";
   shippingContact1 = "";
   shippingContact2 = "";
   shippingAddress = "";
   shippingStatus = "";
}

class EditStock extends React.Component {
   state = {
      visible: false,
      submitting: false,
      reason: "",
      adjustQuantity: 0,
      locations: [],
      locationId: null,
      product: {}
   };

   shippingDetailRef = React.createRef();

   componentDidMount() {
      LocationService.get({ limit: 100 })
      .then(response => {
         if (response && response.data && response.data.data) {
            const locations = response.data.data;
            if (locations) {
               const defaultLocation = locations.find(location => location.isDefault === 1);
               this.setState({
                  locations,
                  locationId: defaultLocation ? defaultLocation.id : null
               });
            }
         }
      });
   }

   getCurrentIndexLanguage() {
      const currentLanguage = getActiveLanguage(this.props.locale);
      for (var i=0; i < this.props.locale.languages.length; i++) {
        if (this.props.locale.languages[i].code ===currentLanguage.code) {
          return i;
        }
      }
    }
  
    CATranslate(key) {
      const currentIndex = this.getCurrentIndexLanguage(this.props.locale);
  
      if (this.props.locale.translations[key] == null) return null;
  
      return this.props.locale.translations[key][currentIndex];
    }

   showDrawer = (product) => {
      this.setState({
         visible: true,
         product
      });
   };

   onClose = () => {
      this.setState({
         visible: false,
         formData: new Shipping()
      });
   };

   onSubmit = (event) => {
      event.preventDefault();
      const {
         product,
      } = this.state;

      const data = {
         reason: this.state.reason,
         locationId: this.state.locationId,
         status: 1,
         entries: [
            {
               variantId: Util.getProductVariantId(product),
               itemName: product.name,
               variantName: "",
               barcode: Util.getItemBarcode(product),
               unitId: product.unit ? product.unit.id : null,
               adjustQuantity: this.state.adjustQuantity
            }
         ]
      };

      this.setState({ submitting: true });
      StockAdjustmentService.add(data)
      .then(() => {
         this.onClose();
         this.props.callback();
      })
      .finally(() => this.setState({submitting: false}));
   }

   onChange = (fieldName, value) => {
      this.setState(prevState => ({...prevState, [fieldName]: value}));
   }

  render() {
    return (
      <div>
         <Drawer
            title={`${this.CATranslate("text_edit_stock")} > ${this.state.product.name}`}
            width={500}
            onClose={this.onClose}
            visible={this.state.visible}
            bodyStyle={{ paddingBottom: 80 }}
         >
            <Form layout="vertical" onSubmit={this.onSubmit}>
               <Row gutter={16}>
                  <Col span={24}>
                     <Form.Item required={true} label={<Translate id="text_reason" />}>
                        <Input.TextArea rows={4} placeholder={this.CATranslate("text_reason_help")} onChange={(event) => this.onChange("reason", event.target.value)} />
                     </Form.Item>
                  </Col>
               </Row>
               <Row gutter={16}>
                  <Col span={24}>
                     <Form.Item required={true} label={<Translate id="text_location" />}>
                        <Select
                           placeholder={this.CATranslate("text_location")}
                           defaultValue={this.state.locationId ? this.state.locationId : undefined}
                           onChange={(value) => this.onChange("locationId", value)}
                        >
                           {
                              this.state.locations.map((location, index) => 
                                 <Select.Option value={location.id} key={index}>{location.name}{this.state.locationId}</Select.Option>
                              )
                           }
                        </Select>
                     </Form.Item>
                  </Col>
                  <Col span={24}>
                     <Form.Item label={<Translate id="text_quantity" />}>
                        <InputNumber placeholder={this.CATranslate("text_adjust_quantity_help")} onChange={(value) => this.onChange("adjustQuantity", value)} />
                     </Form.Item>
                  </Col>
               </Row>
               <div
                  style={{
                     position: "absolute",
                     right: 0,
                     bottom: 0,
                     width: "100%",
                     borderTop: "1px solid #e9e9e9",
                     padding: "10px 16px",
                     background: "#fff",
                     textAlign: "right"
                  }}
               >
                  <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                     <Translate id="text_cancel" />
                  </Button>
                  <Button htmlType="submit" disabled={this.state.submitting} loading={this.state.submitting} type="primary">
                     <Translate id="text_adjust" />
                  </Button>
               </div>
            </Form>
        </Drawer>
      </div>
    );
  }
}

export default EditStock;