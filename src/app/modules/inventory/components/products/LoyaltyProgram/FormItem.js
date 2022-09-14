import React from "react";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { 
  Form, 
  PageHeader,
  Row,
  Col,
  Table,
  Icon,
  message,
  Spin
} from "antd";
import Util from "../../../../common/util";
import history from "../../../../common/router/history";
import LoyaltyProgramService from "../../../services/products/LoyaltyProgramService";
import { 
  Button, 
  InputText,
  InputNumber,
  Select
} from "../../../../common/elements/ant-ui";
import { stringTranslate } from "../../../../common/helper/stringTranslate";

class FormItem extends React.PureComponent {
  state = {
    formData: {},
    rewards: [],
    loading: false,
    loadingButton: false
  }
  rewardColumns = [
    {
      title: <Translate id="text_name" />,
      dataIndex: "name",
      key: "name",
      width: "50%",
      render: (name, record, index) => {
        return <React.Fragment>
          <InputText 
            name={`rewardName[${index}]`}
            placeholder={`${stringTranslate("text_name", this.props.locale)}`}
            data={name}
            onChange={(e) => this.onChangeName(e, index)}
            form={this.props.form} />
          <InputText
            name={`id[${index}]`}
            data={record.id}
            style={{display: "none"}}
            form={this.props.form} />
          <InputNumber
            name={`status[${index}]`}
            data={record.status}
            style={{display: "none"}}
            form={this.props.form} />
        </React.Fragment>;  
      }
    },
    {
      title: <Translate id="text_type" />,
      dataIndex: "type",
      key: "type",
      width: "25%",
      render: (type, record, index) => {
        return <Select 
          name={`type[${index}]`}
          defaultValue="gift"
          placeholder={`${stringTranslate("text_type", this.props.locale)}`}
          valueKey="value"
          dataSource={[
            {value: "gift", name: <Translate id="text_gift" />}
            // {value: "discount_value", name: <Translate id="text_discount_value" />},
            // {value: "discount_percentage", name: <Translate id="text_discount_percentage" />},
          ]}
          form={this.props.form} />;
      }
    },
    {
      title: <Translate id="text_reward_cost" />,
      dataIndex: "cost",
      key: "cost",
      render: (cost, record, index) => {
        return <div style={{display: "flex"}}>
          <InputNumber 
            name={`cost[${index}]`}
            placeholder={`${stringTranslate("text_name", this.props.locale)}`}
            data={cost}
            style={{width: "100%"}}
            isAutoSelect={true}
            form={this.props.form} />

          <button style={{background: "none", border: "none", color: "red", marginLeft: 14, fontSize: 14}} onClick={() => this.removeReward(record.id, index)} type="button">
            <Icon type="close" />
          </button>
        </div>;
      }
    }
  ];
  util = new Util();
  pageTitle = "text_new_loyalty_program";
  id = "";

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.id = id;
      this.pageTitle = "text_update_loyalty_program";
      this.setState({loading: true});
      LoyaltyProgramService.detail(id)
      .then(response => {
        const data = response.data.data;
        let rewards = [];
        rewards = data.rewards.length && data.rewards.map(reward => ({
          ...reward,
          status: 1
        }));

        delete data.rewards;

        if (!rewards.length) {
          rewards.push({
            name: "",
            type: "",
            cost: 0,
            status: 1
          });
        }

        this.setState(prevState => {
          prevState.formData = data;
          prevState.rewards = rewards;
          return prevState;
        });
      })
      .finally(() => this.setState({loading: false}));
    } else {
      this.setState({
        formData: {
          name: "",
          pointPerAmount: 0,
          pointPerOrder: 0,
          pointPerProduct: 0,
          pointIncreament: 0
        },
        rewards: [
          {
            id: "",
            name: "",
            type: "",
            cost: 0,
            status: 1
          }
        ]
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          name: values.name,
          pointPerAmount: values.pointPerAmount,
          pointPerOrder: values.pointPerOrder,
          pointPerProduct: values.pointPerProduct,
          pointIncreament: values.pointIncreament
        };

        const rewards = [];
        if (values.rewardName && values.rewardName.length) {
          values.rewardName.forEach((rewardName, index) => {
            if (rewardName) {
              rewards.push({
                id: values.id[index],
                name: rewardName,
                type: values.type[index],
                cost: values.cost[index],
                status: values.status[index]
              });
            }
          });
        }
        data.rewards = rewards;

        this.save(data);
      }
    });
  }

  save(data) {
    if (!data.rewards.length) {
      return this.util.sweetAlertMessage(stringTranslate("text_please_enter_reward", this.props.locale), "warning");
    }

    this.setState({loadingButton: true});
    if (this.id) {
      LoyaltyProgramService.update(this.id, data)
      .then(() => {
        message.success(stringTranslate("text_update_success", this.props.locale));
        history.goBack();
      })
      .finally(() => this.setState({loadingButton: false}));
    } else {
      LoyaltyProgramService.create(data)
      .then(() => {
        message.success(stringTranslate("text_save_success", this.props.locale));
        history.goBack();
      })
      .finally(() => this.setState({loadingButton: false}));
    }
  }

  onChangeName(e, index) {
    const value = e.target.value;
    const {rewards} = this.state;
    const activeReward = rewards.filter(item => item.status !== 3);
    if (value && index ===(activeReward.length - 1)) {
      rewards.push({
        id: "",
        name: "",
        type: "",
        cost: 0,
        status: 1
      });
    }
    this.setState({rewards});
  }

  removeReward(id, index) {
    const rewards = [];
    Object.assign(rewards, this.state.rewards);
    const activeReward = rewards.filter(item => item.status !== 3);
    if (activeReward.length === 1) {
      return this.util.sweetAlertMessage("Can't not delete last record", "warning");
    }

    if (id) {
      this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
      .then(willDelete => {
        if (willDelete) {
          rewards[index].status = 3;
          this.setState({rewards});
        }
      });
    } else {
      rewards.splice(index, 1);
      this.setState({rewards});
    }
  }
  
  render() {
    const {formData} = this.state;
    return (
      !this.state.loading && Object.keys(formData).length ?
      <div style={{background: "#FFFFFF", padding: "0px 15px 31px 18px", marginTop: 10}}>
        <Form onSubmit={this.handleSubmit} id="loyalty-form">
          <PageHeader
            style={{
              paddingLeft: 0,
              paddingRight: 0,
            }}
            onBack={() => history.goBack()}
            title={<Translate id={`${this.pageTitle}`} />}
            extra={[
              <Button key={0} type="info" htmlType="submit" loading={this.state.loadingButton}>
                <Translate id="text_save_and_close" />
              </Button>
            ]}
          />

          <Row gutter={40} style={{marginLeft: 0}}>
            <Col md={6}>
              <InputText 
                name="name"
                label={<Translate id="text_name" />}
                placeholder={`${stringTranslate("text_enter_loyalty_program_name", this.props.locale)}`}
                required={true}
                data={formData.name}
                form={this.props.form} />

              <InputNumber
                name="pointPerOrder"
                label={<Translate id="text_point_per_order" />}
                placeholder={stringTranslate("text_enter_point_per_order", this.props.locale)}
                isAutoSelect={true}
                data={formData.pointPerOrder}
                form={this.props.form} />
            </Col>
            <Col md={6}>
              <InputNumber
                name="pointPerAmount"
                label={<Translate id="text_point_per_amount" />}
                placeholder={stringTranslate("text_enter_point_per_amount", this.props.locale)}
                isAutoSelect={true}
                data={formData.pointPerAmount}
                form={this.props.form} />

              <InputNumber
                name="pointPerProduct"
                label={<Translate id="text_point_per_product" />}
                placeholder={stringTranslate("text_enter_point_per_product", this.props.locale)}
                isAutoSelect={true}
                data={formData.pointPerProduct}
                form={this.props.form} />
            </Col>
            <Col md={6}>
              <InputNumber
                name="hidden"
                label={<Translate id="text_point_per_product" />}
                style={{visibility: "hidden"}}
                form={this.props.form} />
              <InputNumber
                name="pointIncreament"
                label={<Translate id="text_point_increament" />}
                placeholder={stringTranslate("text_enter_point_increament", this.props.locale)}
                required
                isAutoSelect={true}
                data={formData.pointPerProduct}
                form={this.props.form} />
            </Col>
          </Row>

          <Row style={{marginLeft: 20}}>
            <Col md={24}>
              <h4 style={{fontSize: 14, marginTop: 24}}><Translate id="text_rewards" /></h4>
              <span style={{color: "#B5B2B2", fontSize: 14}}><Translate id="text_reward_customer_gift_loyalty_point" /></span>
              <Table 
                rowKey={((record, index) => index)}
                rowClassName={((record) => record.status === 3 ? "hidden" : "")}
                columns={this.rewardColumns}
                dataSource={this.state.rewards}
                pagination={false}
              />
            </Col>
          </Row>
        </Form>
      </div>
      :
      <div style={{width: 30, margin: "0 auto", paddingTop: 30}}><Spin /></div>
    );
  }
}

function mapStateToProps(state) {
  return {
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