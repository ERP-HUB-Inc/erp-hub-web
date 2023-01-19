import React from "react";
import {
   Drawer,
   Form,
   Button,
   Col,
   Row,
   Input,
   Select
} from "antd";
import InvoiceService from "../../../services/transactions/InvoiceService";

const { Option } = Select;

class Shipping {
   shippingDetail = "";
   shippingContact1 = "";
   shippingContact2 = "";
   shippingAddress = "";
}

class EditShipping extends React.Component {
   state = {
      visible: false,
      submitting: false,
      formData: new Shipping(),
      id: null
   };

   shippingDetailRef = React.createRef();

   showDrawer = (id) => {
      this.setState({
         visible: true,
         id
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
         shippingDetail,
         shippingAddress,
         shippingContact1,
         shippingContact2,
         shippingStatus,
      } = this.state.formData;

      this.setState({submitting: true});

      InvoiceService.editShipping(this.state.id, shippingDetail, shippingAddress, shippingContact1, shippingContact2, shippingStatus)
      .finally(() => {
         this.setState({
            submitting: false,
            visible: false,
            formData: new Shipping()
         });

         if (typeof this.props.callback === "function") {
            this.props.callback();
         }
      });
   }

   onChange = (fieldName, value) => {
      this.setState(prevState => ({formData: {...prevState.formData, [fieldName]: value}}));
   }

  render() {
    return (
      <div>
         <Drawer
            title="Edit Shipping"
            width={500}
            onClose={this.onClose}
            visible={this.state.visible}
            bodyStyle={{ paddingBottom: 80 }}
         >
            <Form layout="vertical" onSubmit={this.onSubmit}>
               <Row gutter={16}>
                  <Col span={24}>
                     <Form.Item label="Shipping Detail">
                        <Input.TextArea rows={4} placeholder="Please enter detail related to shipping of this order..." onChange={(event) => this.onChange("shippingDetail", event.target.value)} />
                     </Form.Item>
                  </Col>
               </Row>
               <Row gutter={16}>
                  <Col span={12}>
                     <Form.Item label="Contact Number 1">
                        <Input placeholder="Contact Number 1" onChange={(event) => this.onChange("shippingContact1", event.target.value)} />
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item label="Contact Number 2">
                        <Input placeholder="Contact Number 2" onChange={(event) => this.onChange("shippingContact2", event.target.value)} />
                     </Form.Item>
                  </Col>
               </Row>
               <Row gutter={16}>
                  <Col span={24}>
                     <Form.Item label="Shipping Address">
                        <Input.TextArea rows={4} placeholder="Please enter address that will deliver to..." onChange={(event) => this.onChange("shippingAddress", event.target.value)} />
                     </Form.Item>
                  </Col>
               </Row>
               <Row gutter={16}>
                  <Col span={24}>
                     <Form.Item label="Shipping Status">
                        <Select placeholder="Please select shipping status" onChange={(value) => this.onChange("shippingStatus", value)}>
                           <Option value="ORDERED">Ordered</Option>
                           <Option value="PACKED">Packed</Option>
                           <Option value="SHIPPED">Shipped</Option>
                           <Option value="DELIVERED">Delivered</Option>
                           <Option value="CANCELLED">Cancelled</Option>
                        </Select>
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
                  textAlign: "right",
                  }}
               >
                  <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                     Cancel
                  </Button>
                  <Button htmlType="submit" disabled={this.state.submitting} loading={this.state.submitting} type="primary">
                     Save
                  </Button>
               </div>
            </Form>
        </Drawer>
      </div>
    );
  }
}

export default EditShipping;