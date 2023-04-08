import React from "react";
import moment from "moment";
import {Translate} from "react-localize-redux";
import { 
  Form,
  Icon,
  Modal,
  message
} from "antd";
import {Button} from "../../../common/elements/ant-ui";
import BookingService from "../../services/BookingService";
import Util from "../../../common/util";
import Enum from "../../enum";
import { stringTranslate } from "../../../common/helper/stringTranslate";
import FormItem from "./FormItem";

export default class FormUpdate extends React.PureComponent {
  state = {
    visible: false,
    loading: false,
    submitting: false
  }
  util = new Util();

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const date = moment(values.date).format("YYYY-MM-DD");
        values.start = `${date} ${moment(values.start).format("HH:mm")}`;
        values.end = `${date} ${moment(values.end).format("HH:mm")}`;

        delete values.date;
        delete values.dates;
        delete values.search;
        this.setState({loading: true});
        BookingService.update(values, this.props.formData.id)
        .then(() => {
          this.props.onSuccess();
          this.setState({visible: false});
          this.util.sweetAlertMessageV2(
            stringTranslate("text_success", this.props.locale),
            stringTranslate("text_update_success", this.props.locale),
            "success"
          );
        })
        .catch(err => {
          if (err.response && err.response.date) {
            message.error(stringTranslate("text_something_went_wrong"));
          }
        })
        .finally(() => this.setState({loading: false}));
      }
    });
  }

  handleMarkCompleted = (id) => {
    let start = this.props.form.getFieldValue("start");
    let end = this.props.form.getFieldValue("end");
    let date = this.props.form.getFieldValue("date");
    date = moment(date).format("YYYY-MM-DD");
    start = `${date} ${moment(start).format("HH:mm")}`;
    end = `${date} ${moment(end).format("HH:mm")}`;
    this.setState({loading: true});
    BookingService.markAsComplete(id, {start, end})
    .then(() => {
      this.props.afterAction();
      this.setState({
        visible: false
      });
      this.util.sweetAlertMessageV2(
        "success",
        "Mark completed success",
        "success"
      );
    })
    .finally(() => this.setState({loading: false}));
  }

  handleMarkDelay = (id) => {
    let start = this.props.form.getFieldValue("start");
    let end = this.props.form.getFieldValue("end");
    const note = this.props.form.getFieldValue("note");
    let date = this.props.form.getFieldValue("date");

    date = moment(date).format("YYYY-MM-DD");
    start = `${date} ${moment(start).format("HH:mm")}`;
    end = `${date} ${moment(end).format("HH:mm")}`;
    
    this.setState({loading: true});
    
    BookingService.markAsDelay(id, {start, end, note})
    .then(() => {
      this.props.afterAction();
      this.setState({
        visible: false
      });
      this.util.sweetAlertMessageV2(
        "success",
        "Mark delay success",
        "success"
      );
    })
    .finally(() => this.setState({loading: false}));
  }

  handleShow = () => {
    this.setState({visible: true});
  }

  handleClose = () => {
    this.setState({visible: false});
    this.props.handleClose();
  }

  renderButtonSave() {
    const {action, formData} = this.props;
    const btnProps = {
      type: "info",
      htmlType: "button",
      style: {marginLeft: 15},
      loading: this.state.loading
    };

    let button = <Button type="info" htmlType="submit" style={{marginLeft: 15}} loading={this.state.loading}>
        <span className="icon-save icon-padding-right"></span> <Translate id="text_save" />
      </Button>;

    if (action === Enum.MARK_COMPLETED) {
      button = <Button {...btnProps} loading={this.state.loading} onClick={() => this.handleMarkCompleted(formData.id)}>
        <span className="icon-save icon-padding-right"></span> <Translate id="text_mark_as_completed" />
      </Button>;
    } else if (action === Enum.MARK_DELAY) {
      button = <Button {...btnProps} loading={this.state.loading} onClick={() => this.handleMarkDelay(formData.id)}>
        <span className="icon-save icon-padding-right"></span> <Translate id="text_mark_as_delay" />
      </Button>;
    }

    return button;
  }

  render() {
    return (
      this.state.visible ?
      <Modal
        title={<Translate id="text_update_booking" />}
        visible={this.state.visible}
        footer={null}
        onCancel={this.handleClose}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            action={this.props.action}
            formData={this.props.formData}
            locale={this.props.locale}
            form={this.props.form} />

          <div style={{paddingBottom: 22, paddingTop: 10, textAlign: "center"}}>
            <Button htmlType="button" type="danger" onClick={this.handleClose}>
              <Icon type="close-circle" /> <Translate id="text_cancel" />
            </Button>
            {this.renderButtonSave()}
          </div>
        </Form>
      </Modal>
      : <div />
    );
  }
}