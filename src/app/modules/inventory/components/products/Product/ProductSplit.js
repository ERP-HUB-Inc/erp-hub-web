import React from "react";
import { connect } from "react-redux";
import {
    Form,
    Button,
    Spin,
    PageHeader,
    Descriptions
} from "antd";
import sweetalert from "sweetalert";
import DropDownSearch from "./DropDownSearch";
import Enum from "../../../enums";
import ProductAction from "../../../actions/products/product";
import Util from "../../../utils";
import history from "../../../../common/router/history";
import ProductService from "../../../services/products/ProductService";
import LocationService from "../../../../pos/services/settings/LocationService";
import Component from "../../../../common/components/Component";

class SplitProduct extends Component {
    state = {
        product: null,
        outputProducts: [],
        locations: [],
        submitting: false,
        loading: false
    };

    componentDidMount() {
        this.fetchProduct(this.Util.getLocationId());
        LocationService.lists()
        .then(response => {
            if (response.data) {
                this.setState({locations: response.data.data});
            }
        });
    }

    fetchProduct(locationId) {
        const { productVariantId } = this.props.match.params;
        this.setState({loading: true});
        ProductService.detailForSplit(productVariantId, locationId)
        .then(response => {
            if (response.data) {
                const {data} = response.data;
                this.setState({
                    product: data,
                    outputProducts: data.productPackages 
                });
            }
        })
        .finally(() => {
            this.setState({loading: false});
        });
    }

    handleRemoveOutput(productVariantId, id) {
        const outputProducts = this.state.outputProducts,
            foundAtIndex = outputProducts.findIndex(outputProduct => outputProduct.productVariantId === productVariantId);
    
        if (foundAtIndex >= 0) {
            if (id) {
                outputProducts[foundAtIndex]["status"] = this.Enum.ARCHIVE;
            } else {
                outputProducts.splice(foundAtIndex, 1);
            }
        }

        this.setState({outputProducts});
    }

    handleOnSelectList(product) {
        const outputProducts = this.state.outputProducts,
            productVariantId = Util.getProductVariantId(product);

        if (productVariantId === this.state.product.productVariantId) {
            sweetalert({
                icon: "warning",
                title: "No!",
                text: "Sorry,This product you have choosed to split",
                button: this.CATranslate("text_cancel", this.props.locale),
                dangerMode: true
                });
            return;
        }

        const prepareData = data => {
            return {
                image: data.image,
                name: data.name,
                barcode: Util.getItemBarcode(data),
                currentQuantity: Util.countProductQTYCurrentLocation(data, this.props.form.getFieldValue("locationId")),
                currentCost: Util.getProductCost(data),
                price: Util.getProductPrice(data),
                productVariantId: Util.getProductVariantId(data),
                quantity: 0,
                cost: 0,
                unitId: data.stockUnitId,
                unitName: data.unit.name
            };
        };

        if (outputProducts.length) {
            const existProduct = outputProducts.find(outputProduct => outputProduct.productVariantId === productVariantId);
            if (!existProduct) {
                outputProducts.push(prepareData(product));
            }

        } else {
            outputProducts.push(prepareData(product));
        }
        
        this.setState({outputProducts});
    }

    handleSubmit() {
        const quantityToSplit = this.props.form.getFieldValue("quantityToSplit");
        if (quantityToSplit > this.state.product.quantity || quantityToSplit === 0) {
            sweetalert({
                icon: "warning",
                title: this.CATranslate("text_sorry", this.props.locale),
                text: this.CATranslate("text_quantity_to_split_warning", this.props.locale),
                button: this.CATranslate("text_cancel", this.props.locale),
                dangerMode: true
            });
            return;
        }

        if (this.state.outputProducts.length === 0) {
            sweetalert({
                icon: "warning",
                title: this.CATranslate("text_sorry", this.props.locale),
                text: this.CATranslate("text_not_choose_product_for_splitting", this.props.locale),
                button: this.CATranslate("text_cancel", this.props.locale),
                dangerMode: true
            });
            return;
        }

        sweetalert({
            title: this.CATranslate("text_are_you_sure", this.props.locale),
            text: this.CATranslate("text_warning_split", this.props.locale),
            icon: "warning",
            buttons: [this.CATranslate("text_cancel", this.props.locale), this.CATranslate("text_split", this.props.locale)],
            dangerMode: true,
          })
          .then(ok => {
            if (ok) {
                const values = this.props.form.getFieldsValue(["id", "productVariantId", "quantity", "cost", "status"]),
                    dataForSplit = {
                        quantityToSplit,
                        locationId: this.props.form.getFieldValue("locationId"),
                        outputProducts: values.productVariantId.map((productVariantId, index) => ({
                            id: values.id[index],
                            productVariantId,
                            cost: values.cost[index],
                            quantity: values.quantity[index],
                            status: values.status[index]
                        }))
                    };
                
                const { productVariantId } = this.props.match.params;
                this.setState({submitting: true});
                ProductService.splitProduct(productVariantId, dataForSplit)
                .then(response => {
                    if (response.data) {
                        sweetalert({
                            icon: "success",
                            title: "Success!",
                            text: "You have splited product successfull!",
                            buttons: false,
                            timer: 1500
                          })
                        .then(() => {
                            history.goBack();
                        });

                        this.props.dispatch(ProductAction.reset());
                    }
                })
                .finally(() => {
                    this.setState({submitting: false});
                });
            }
          });
    }

    render() {
        const {
            product
        } = this.state;

        return <div style={{marginBottom: 25}} id="product-split">
            <Spin size="large" tip={<this.Translate id="text_spliting" />} spinning={this.state.submitting}>
                <PageHeader
                    style={{
                        backgroundColor: "#f7f7f7",
                        paddingLeft: 0,
                        paddingRight: 0
                    }}
                    onBack={() => history.goBack()}
                    title={<this.Translate id="text_slit_item" />}
                    subTitle={<this.Translate id="text_slit_product_for_retail_sale" />}
                    extra={[
                        <div style={{display: "flex", alignItems: "center"}} key="1">
                            <this.Select
                            name="locationId"
                            placeholder={this.CATranslate("text_location", this.props.locale)}
                            dataSource={this.state.locations}
                            defaultValue={this.Util.getLocationId()}
                            valueKey="id"
                            form={this.props.form}
                            className="filter-location"
                            onChange={locationId => this.fetchProduct(locationId)} />
                            <Button type="primary" icon="scissor" style={{width: 120, marginLeft: 15}} onClick={() => this.handleSubmit()}>
                                <this.Translate id="text_split" />
                            </Button>
                        </div>
                    ]} />
                {
                    product ?
                    <this.Row>
                        <this.Col md="12">
                            <Descriptions title={<this.Translate id="text_product_description" />} style={{marginBottom: 15}}>
                                <Descriptions.Item label={<this.Translate id="text_item_name" />}>
                                    {product.name}
                                </Descriptions.Item>
                                <Descriptions.Item label={<this.Translate id="text_barcode" />}>
                                    {product.barcode}
                                </Descriptions.Item>
                                <Descriptions.Item label={<this.Translate id="text_cost" />}>
                                    {this.Util.formatCurrency(product.cost)}/{product.unitName}
                                </Descriptions.Item>
                                <Descriptions.Item label={<this.Translate id="text_retail_price" />}>
                                    {this.Util.formatCurrency(product.price)}/{product.unitName}
                                </Descriptions.Item>
                                <Descriptions.Item label={<this.Translate id="text_quantity" />}>
                                    {product.quantity.toFixed(2)}{product.unitName} {product.locationName ? <span><this.Translate id="text_in_location" /> {product.locationName}</span> : ""}
                                </Descriptions.Item>
                                <Descriptions.Item label={<this.Translate id="text_other_location" />}>
                                    {product.otherQuantity}{product.unitName}
                                </Descriptions.Item>
                                <Descriptions.Item label={`${this.CATranslate("text_quantity_to_split", this.props.locale)}(${product.unitName})`}>
                                    <this.InputNumber
                                        name="quantityToSplit"
                                        isAutoFocus={true}
                                        isAutoSelect={true}
                                        precision={2}
                                        form={this.props.form}
                                        min={0} />
                                </Descriptions.Item>
                            </Descriptions>
                        </this.Col>
                        <this.Col md="12">
                            <DropDownSearch
                                productSearch={this.props.productSearch}
                                placeholder={this.CATranslate("text_search_output_product", this.props.locale)}
                                handleOnSelectList={product => this.handleOnSelectList(product)}
                                dispatch={this.props.dispatch}
                                filter={JSON.stringify({serialType: [Enum.SERIAL_TYPE.LICENSE, Enum.SERIAL_TYPE.PRODUCT, Enum.SERIAL_TYPE.SERIAL]})}
                                className="ca-input-v1"
                                locale={this.props.locale}
                                form={this.props.form} />
                            <this.Table
                                rowKey="productVariantId"
                                dataSource={this.state.outputProducts}
                                rowClassName={(record) => record.status === this.Enum.ARCHIVE ? "hidden" : ""}
                                columns={[
                                    {
                                        title: <this.Translate id="text_item_name" />,
                                        dataIndex: "name",
                                        key: "name",
                                        render: (name, record, index) => {
                                            return <div style={{display: "flex"}}>
                                                <div style={{marginRight: 15}}>
                                                    <this.Image url={this.Util.getProductImage(record.image).url} style={{width: 60, height: 60, objectFit: "cover", borderRadius: 3}} />
                                                </div>
                                                <div>
                                                    <div>
                                                        {name}
                                                    </div>
                                                    <div>
                                                        {record.barcode}
                                                    </div>
                                                </div>
                                                <this.InputText name={`id[${index}]`} data={record.id} className="hidden" form={this.props.form} />
                                                <this.InputText name={`status[${index}]`} data={record.status} className="hidden" form={this.props.form} />
                                                <this.InputText name={`productVariantId[${index}]`} data={record.productVariantId} className="hidden" form={this.props.form} />
                                            </div>;
                                        }
                                    },
                                    {
                                        title: <this.Translate id="text_current_quantity" />,
                                        dataIndex: "currentQuantity",
                                        key: "currentQuantity",
                                        render: (currentQuantity, record) => `${currentQuantity}${record.unitName}`
                                    },
                                    {
                                        title: <this.Translate id="text_current_cost" />,
                                        dataIndex: "currentCost",
                                        key: "currentCost",
                                        render: (currentCost, record) => `${this.Util.formatCurrency(currentCost)}/${record.unitName}`
                                    },
                                    {
                                        title: <this.Translate id="text_retail_price" />,
                                        dataIndex: "price",
                                        key: "price",
                                        render: (price, record) => `${this.Util.formatCurrency(price)}/${record.unitName}`
                                    },
                                    {
                                        title: <this.Translate id="text_output_quantity" />,
                                        dataIndex: "quantity",
                                        key: "quantity",
                                        width: 180,
                                        render: (quantity, record, index) => {
                                            return <div style={{display: "flex", alignItems: "center"}}>
                                                <this.InputNumber name={`quantity[${index}]`} data={quantity} isAutoSelect={true} form={this.props.form} /><div style={{width: 50, marginLeft: 5}}>{record.unitName}</div>
                                            </div>;
                                        }
                                    },
                                    {
                                        title: <this.Translate id="text_cost" />,
                                        dataIndex: "cost",
                                        key: "cost",
                                        width: 200,
                                        render: (cost, record, index) => {
                                            return <div style={{display: "flex", alignItems: "center"}}>
                                                <this.InputNumber name={`cost[${index}]`} data={cost} isAutoSelect={true} form={this.props.form} />/<div style={{width: 50}}>{record.unitName}</div>
                                            </div>;
                                        }
                                    },
                                    {
                                        title: <this.Translate id="text_action" />,
                                        dataIndex: "productVariantId",
                                        key: "productVariantId",
                                        width: 100,
                                        render: (productVariantId, record) => <Button type="danger" onClick={() => this.handleRemoveOutput(productVariantId, record.id)}><this.Translate id="text_remove" /></Button>
                                    }
                                ]} />
                        </this.Col>
                    </this.Row>
                    :
                    <div style={{width: 30, margin: "0 auto"}}>
                        <Spin />
                    </div>
                }
            </Spin>
        </div>;
    }
}

function mapStateToProps(state) {
    return {
        locale: state.locale,
        productSearch: state.reducer.product.search
    };
}

function mapPropsToFields(props) {
    return {
      form: props.form
    };
}
  
const splitProduct =  Form.create(mapPropsToFields)(SplitProduct);

export default connect(mapStateToProps)(splitProduct);