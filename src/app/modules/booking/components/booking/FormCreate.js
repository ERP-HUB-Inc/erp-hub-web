import React from "react";
import moment from "moment";
import { Translate } from "react-localize-redux";
import {
  Form,
  Icon,
  Modal,
} from "antd";
import { Button } from "../../../common/elements/ant-ui";
import BookingService from "../../services/BookingService";
import Util from "../../../common/util";
import { stringTranslate } from "../../../common/helper/stringTranslate";
import FormItem from "./FormItem";

export default class FormCreate extends React.PureComponent {
  state = {
    visible: false,
    loading: false
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
        BookingService.create(values)
        .then(() => {
          this.props.onSuccess();
          this.setState({visible: false});
          this.util.sweetAlertMessageV2(
            stringTranslate("text_success", this.props.locale),
            stringTranslate("text_save_success", this.props.locale),
            "success"
          );
        })
        .catch(err => {
          if (err.response && err.response.data) {
            this.util.sweetAlertMessageV2(
              stringTranslate("text_sorry", this.props.locale),
              stringTranslate("text_something_went_wrong", this.props.locale),
              "error"
            );
          }
        })
        .finally(() => this.setState({loading: false}));
      }
    });
  }

  handleShowForm = () => {
    this.setState({visible: true});
  }

  handleClose = () => {
    this.setState({visible: false});
  }

  render() {
    return (this.state.visible ?
      <Modal
        title={<Translate id="text_create_booking" />}
        visible={true}
        footer={null}
        onCancel={this.handleClose}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem 
            formData={{}}
            locale={this.props.locale}
            form={this.props.form} />

          <div style={{paddingBottom: 22, paddingTop: 10, textAlign: "center"}}>
            <Button htmlType="button" type="danger" onClick={this.handleClose}>
              <Icon type="close-circle" /> <Translate id="text_cancel" />
            </Button>
            <Button type="info" htmlType="submit" style={{marginLeft: 15}} loading={this.state.loading}>
              <span className="icon-save icon-padding-right"></span> <Translate id="text_save" />
            </Button>
          </div>
        </Form>
      </Modal>
      : <div />
    );
  }
}