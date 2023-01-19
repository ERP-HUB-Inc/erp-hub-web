import React from "react";
import POEmailTemplate from "./EmailTemplate/PO";
import List from "../List";
import Enum from "../../../enums";
import history from "../../../../common/router/history";
import FormCreate from "../../../containers/stock/PurchaseOrder/FormCreate";
import Constant from "../../../constants/stock/purchaseOrder";
import PurchaseAction from "../../../actions/stock/purchaseOrder";
import LocationAction from "../../../../pos/action/settings/location";
import EmailAction from "../../../../common/actions/email";
import PurchaseService from "../../../services/stock/PurchaseOrderService";
import "./index.css";

export default class PurchaseOrderLists extends List {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            dataForSendMail: null,
            emailForPushToSupplier: null
        };
        this.columns = [
            this.columnCreatedAt,
            {
                title: <this.Translate id="text_location" />,
                dataIndex: "location",
                key: "location",
                render: location => location ? location.name: this.emptyText
            },
            {
                title: <this.Translate id="text_supplier" />,
                dataIndex: "supplier",
                key: "supplierId",
                render: supplier => supplier ? supplier.name : this.emptyText
            },
            {
                title: <this.Translate id="text_receiver"/>,
                dataIndex: "receiver",
                key: "receiverId",
                render: receiver => receiver ? <span style={{textTransform: "uppercase"}}>{receiver.fullName}</span> : this.emptyText
            },
            {
                title: <this.Translate id="text_total" />,
                dataIndex: "requestTotal",
                key: "requestTotal",
                align: "right",
                render: (text, record) => {
                    let key = "requestTotal";
                    if (record.step === Enum.PO_STEP.RECEIVED) {
                        key = "receiveTotal";
                    } else if (record.step === Enum.PO_STEP.RETURN) {
                        key = "returnTotal";
                    }
                    return this.formatCurrency(record[key]);
                }
            },
            {
                title: <this.Translate id="text_status" />,
                dataIndex: "step",
                key: "step",
                width: 100,
                render: step => step in this.PO_STEP_STR ? <this.Tag color={this.PO_STEP_STR[step].color} className="text-uppercase text-center po-step-tag">{this.PO_STEP_STR[step].name}</this.Tag> : ""
            }
        ];
        this.formCreate = <FormCreate/>;
        this.callBackOnShowEditForm = this.showFormEdit;
        this.callBackOnDeleteRecord =
            this.fetchingProp = "purchaseOrder";
        this.service = PurchaseService;
        this.componentHasUpdated = false;
        this.POEmailHasSend = false;

        this.PO_STEP_STR = {
            [Enum.PO_STEP.DRAFT]: {name: <this.Translate id="text_draft" />, color: this.Enum.PO_STEP_COLOR.DRAFT},
            [Enum.PO_STEP.PROCESS]: {name: <this.Translate id="text_process" />, color:  this.Enum.PO_STEP_COLOR.PROCESS},
            [Enum.PO_STEP.RECEIVED]: {name: <this.Translate id="text_received" />, color:  this.Enum.PO_STEP_COLOR.RECEIVE},
            [Enum.PO_STEP.CANCEL]: {name: <this.Translate id="text_cancel" />, color:  this.Enum.PO_STEP_COLOR.CANCEL},
            [Enum.PO_STEP.RETURN]: {name: <this.Translate id="text_returned" />, color:  this.Enum.PO_STEP_COLOR.RETURN},
            [Enum.PO_STEP.PAID]: {name: <this.Translate id="purchase_order_step_paid" />, color:  this.Enum.PO_STEP_COLOR.PAID}
        };

        this.supplierList = [{name: <this.Translate id="text_all_supplier"/>, id: 0}];
        this.columnFilterWithKey = ["name", "number", "invoiceNo", "shippingFee", "requestTotal", "returnTotal", "receiveTotal"];

        this.action = PurchaseAction;
        this.RESET_CONSTANT = Constant.RESET_PURCHASE_ORDER;
        this.getEmailPushToSupplier = this.getEmailPushToSupplier.bind(this);
        this.getEmailDataForSend = this.getEmailDataForSend.bind(this);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.purchaseOrderAdd.added) {
            nextProps.dispatch(PurchaseAction.fetch(this.pageSize));
            nextProps.dispatch(PurchaseAction.reset());
        }

        if (nextProps.purchaseOrderUpdate.updated) {
            nextProps.dispatch(PurchaseAction.fetch(this.pageSize));
            nextProps.dispatch(PurchaseAction.reset(Constant.REQUEST_PURCHASE_ORDER_DETAIL_FULL_RESET));
            nextProps.dispatch(PurchaseAction.reset());
        }

        if (nextProps.purchaseOrderPushToSupplier.updated) {
            this.setState({
                modalConten: <POEmailTemplate
                    data={this.state.dataForSendMail}/>
            });
            this.POEmailHasSend = false;
            nextProps.dispatch(PurchaseAction.fetch(this.pageSize));
            nextProps.dispatch(PurchaseAction.reset(Constant.PUSH_PURCHASE_ORDER_TO_SUPPLIER_RESET));
            nextProps.dispatch(PurchaseAction.reset(Constant.REQUEST_PURCHASE_ORDER_DETAIL_FULL_RESET));
        }

        // GET CONTENT TO SEND EMAIL PO
        let element = document.getElementById("po-email-template");
        if (element && !this.POEmailHasSend && this.state.emailForPushToSupplier) {
            element = `<html><head><title></title></head><body>${element.innerHTML}</body></html>`;
            nextProps.dispatch(EmailAction.send(element, this.state.emailForPushToSupplier, "Purchase Order"));
            this.POEmailHasSend = true;
            this.setState({
                modalConten: null
            });
        }

        // SAVE SETTING TO LOCALE STORAGE
        if (nextProps.storeLocation.fetched) {
            localStorage.setItem(Enum.LOCAL_SCHEMA.LOCATION, JSON.stringify(nextProps.storeLocation.list));
        }

        if (nextProps.supplier.fetched) {
            localStorage.setItem(Enum.LOCAL_SCHEMA.SUPPLIER, JSON.stringify(nextProps.supplier.list));
        }
    }

    componentDidUpdate() {
        if (!this.componentHasUpdated && this.props.purchaseOrder.fetched) {
            this.props.dispatch(LocationAction.fetch(100));
            this.componentHasUpdated = true;
        }

        if (this.props.purchaseOrderDetail.fetched) {
            this.setState({loadingPopup: false});
            this.props.dispatch(PurchaseAction.reset(Constant.REQUEST_PURCHASE_ORDER_DETAIL_RESET));
        }

        if (this.props.mail.sent) {
            this.props.dispatch(EmailAction.reset());
        }
    }

    getEmailPushToSupplier(emailForPushToSupplier) {
        this.setState({emailForPushToSupplier});
    }

    getEmailDataForSend(dataForSendMail) {
        this.setState({dataForSendMail});
    }

    renderButtonAddNew() {
        return (
            <this.Link to="/stocks/purchase/create" className="ant-btn info" style={{marginRight: 15}}>
                <span className="icon-add icon-padding-right"></span>
                <this.Translate id="text_add_new" />
            </this.Link>
        );
    }

    showFormEdit(rowData) {
        history.push(`/stocks/purchase/update/${rowData.id}`);
    }

    handleDelete() {
        this.setState({deleting: true});
        PurchaseService.archive(this.state.selectedListIds)
            .then(response => {
                this.props.dispatch(PurchaseAction.fetch(this.pageSize, (this.state.current - 1) * this.pageSize));
                this.setState({
                    selectedRowKeys: [],
                    modalVisible: false,
                    deleting: false
                });
            })
            .catch(err => {
                this.Message.error(this.CATranslate("error_warning_delete_po", this.props.locale));
                this.setState({deleting: false});
                this.setState({
                    modalVisible: false,
                    deleting: false
                });
            });
    }

    handleSubmitFilter(e){
        if (this.action != null) {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    let filter = {};
                    let rangFilter = {};

                    if (values.createdAt) {
                        values.createdAt = this.Util.formatDateForMYSQL(values.createdAt);
                        rangFilter = JSON.stringify({column: "createdAt", value: [values.createdAt, values.createdAt]});
                    }

                    filter = JSON.stringify(filter);

                    const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
                    this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, rangFilter));
                    this.setState({isClickFilter: true});
                }

            });
        }
    }

    renderFilterRecord() {
        const {form, locale} = this.props;

        const POStepList = Object.keys(this.PO_STEP_STR).map((prop) => {
            return {name: this.PO_STEP_STR[prop].name, value: prop};
        });
        POStepList.unshift({name: <this.Translate id="text_all_step"/>, value: -1});

        const fetchingProps = this.props[this.fetchingProp];
        return (
            form == null ?
                ""
                :
                <this.Form onSubmit={this.handleSubmitFilter}>
                    <this.Row className="main-search-layout">
                        <this.Col md="2">
                            <this.InputText
                                name="key"
                                label={<this.Translate id="text_search" />}
                                placeholder={this.CATranslate("text_po_general_search", locale)}
                                isAutoFocus={true}
                                form={form} />
                        </this.Col>
                        <this.Col md="2">
                            <this.DatePickers
                                name="createdAt"
                                label={<this.Translate id="text_date" />}
                                form={form} />
                        </this.Col>
                        <this.Col md="2" className="wrap-btn-search">
                            <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                                <label htmlFor="status" className="" title="">Filter</label>
                            </div>
                            <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
                                <span className="icon-search icon-padding-right"></span><this.Translate id="button_text_search" />
                            </this.Button>
                        </this.Col>
                    </this.Row>
                </this.Form>
        );
    }

}