import React from 'react';
import { 
    Descriptions,
    Breadcrumb,
    Icon,
    Tabs, 
    Table,
    Spin
  } from 'antd';
  import { Translate } from "react-localize-redux";
  import Enum from "../../../enums";
import ProductService from '../../../services/products/ProductService';



    const { TabPane } = Tabs;   
    

    const columns = [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          
        },
        {
          title: 'Barcode',
          dataIndex: 'barcode',
          key: 'barcode',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
            title: 'Price',
            dataIndex: 'address',
            key: 'address',
          },
          {
            title: 'Distri.Price',
            dataIndex: 'address',
            key: 'address',
          },
          {
            title: 'Whole Price',
            dataIndex: 'address',
            key: 'address',
          },
          {
            title: 'Quantity',
            dataIndex: 'address',
            key: 'address',
          },
          {
            title: 'Total', 
            dataIndex: 'address',
            key: 'address',
          },
      ];

      function callback(key) {
        console.log(key);
      }

export default class ProductDetail extends React.Component {
  state = {
    productDetail: null,
    productVariants: []
  }
  
    componentDidMount() {
      const { id } = this.props.match.params,
      params = new URLSearchParams(this.props.location.search);
      ProductService.detail(id, params.get("productOption"))
      .then(response => {
        if (response.data) {
          this.setState({productDetail: response.data.data});
          this.setState({productVariants: response.data.data.productVariants[0]});
        }
        console.log("Response:", response);
      });
    }
  
    render() {
      const { productDetail } = this.state;
      return productDetail ? (
        <div>
          
            <div className='bread'>
                <Breadcrumb>
                    <Breadcrumb.Item href="">
                        <Icon type="arrow-left" />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="">
                        <span>Product Detail</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <div className='detail-product'>
              <Descriptions>
                <Descriptions.Item label="Product Name">{productDetail.name}</Descriptions.Item>
                <Descriptions.Item label="Barcode">{this.state.productVariants.barcode}</Descriptions.Item>
                <Descriptions.Item label="Stock Type"> {productDetail.serialType == Enum.SERIAL_TYPE.STANDARD ? <Translate id="text_inventory"/> : (productDetail.serialType == Enum.SERIAL_TYPE.NON_INVENTORY ? <Translate id="text_non_inventory"/> : "")} </Descriptions.Item>
                <Descriptions.Item label="Category">{ productDetail.productType.name }</Descriptions.Item> 
                <Descriptions.Item label="Price">{this.state.productVariants.price }</Descriptions.Item> 
                <Descriptions.Item label="Whole Price">{this.state.productVariants.wholePrice }</Descriptions.Item> 
                <Descriptions.Item label="Distr.Price">{this.state.productVariants.distributePrice }</Descriptions.Item> 
                <Descriptions.Item label="Quantity">{productDetail.distributePrice }</Descriptions.Item> 
              </Descriptions>
            </div>
            
            <div className='tab-detail'>
              <Tabs onChange={callback} type="card">
                <TabPane tab="Location" key="1">
                  <Table columns={columns} />
                </TabPane>
                <TabPane tab="Logs" key="2">
                  <Table columns={columns} />
                </TabPane>
                
              </Tabs>
            </div>

            

        </div>
      )
      :'';
    }
  }

