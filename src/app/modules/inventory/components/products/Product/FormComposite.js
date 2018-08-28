import React from "react";
import { List } from "antd";
import Modal from "../../../../common/components/shares/Modal";
export default class FormComposite extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      visibleDropDown: false
    };
    this.columns = [
      {
        title: <this.Translate id="col_composite_product" />,
        dataIndex: "product_composite",
        key: "product_composite"
      },
      {
        title: <this.Translate id="col_composite_product_markup" />,
        dataIndex: "composite_product_markup",
        key: "composite_product_markup"
      },
      {
        title: <this.Translate id="col_composite_product_cost" />,
        dataIndex: "composite_product_cost",
        key: "composite_product_cost"
      },
      {
        title: <this.Translate id="col_composite_action" />,
        dataIndex: "composite_product_action",
        key: "composite_product_action"
      }
    ];

    this.timer = null;

    this.handleKeyDownOnProductSearch = this.handleKeyDownOnProductSearch.bind(this);
    this.handlePressEnterOnSearch = this.handlePressEnterOnSearch.bind(this);
    this.handleOnBlurSearch = this.handleOnBlurSearch.bind(this);
    this.handleOnFocusSearch = this.handleOnFocusSearch.bind(this);
  }

  handlePressEnterOnSearch() {
    alert("Hello World");
  }

  handleOnBlurSearch() {
    this.setState({visibleDropDown: false});
  }

  handleOnFocusSearch() {
    this.setState({visibleDropDown: true});
  }

  handleKeyDownOnProductSearch(event) {
    if (event.keyCode === 38) {
      // console.log("Key Up");
    }
    else if (event.keyCode === 40) {
      
    } else if (event.target.value.trim().length > 0){
      clearTimeout(this.timer);
      // this.setState({data: [
      //   {
      //     title: "Ant Design Title 1",
      //   },
      //   {
      //     title: "Ant Design Title 2",
      //   },
      //   {
      //     title: "Ant Design Title 3",
      //   },
      //   {
      //     title: "Ant Design Title 4",
      //   },
      //   {
      //     title: "Ant Design Title 4",
      //   },
      //   {
      //     title: "Ant Design Title 4",
      //   },
      //   {
      //     title: "Ant Design Title 4",
      //   },
      //   {
      //     title: "Ant Design Title 4",
      //   },
      //   {
      //     title: "Ant Design Title 4",
      //   },
      //   {
      //     title: "Ant Design Title 4",
      //   },
      //   {
      //     title: "Ant Design Title 4",
      //   },
      //   {
      //     title: "Ant Design Title 4",
      //   },
      //   {
      //     title: "Ant Design Title 4",
      //   }
      // ]});
      
      this.timer = setTimeout(function() {
        this.setState({data: [{
          title: "Ant Design Title 1",
        },
        {
          title: "Ant Design Title 2",
        },
        {
          title: "Ant Design Title 3",
        },
        {
          title: "Ant Design Title 4",
        },
        {
          title: "Ant Design Title 4",
        },
        {
          title: "Ant Design Title 4",
        },
        {
          title: "Ant Design Title 4",
        },
        {
          title: "Ant Design Title 4",
        },
        {
          title: "Ant Design Title 4",
        },
        {
          title: "Ant Design Title 4",
        },
        {
          title: "Ant Design Title 4",
        },
        {
          title: "Ant Design Title 4",
        },
        {
          title: "Ant Design Title 4",
        }]});
      }.bind(this), 1000);

    } else {
      this.setState({data: []});
    }
  }

  requestData() {
    
  }

  componentDidMount() {
    var element = document.getElementsByClassName("ant-list-item");
    if (element.length > 0) {
      element[0].classList.add("product-item-hover");
    }
  }

  componentDidUpdate() {
    var element = document.getElementsByClassName("ant-list-item");
    if (element.length > 0) {
      element[0].classList.add("product-item-hover");
    }
  }

  render() {
    return (
      <this.Row style={{position: "relative"}}>
        <this.Col md="4">
          <this.InputText
            name="searchProduct"
            label={<this.Translate id="input_product_search_product" />}
            placeholder={this.CATranslate("input_product_search_product", this.props.locale)}
            handleKeyUp={this.handleKeyDownOnProductSearch}
            handlePressEnter={this.handlePressEnterOnSearch}
            handleOnBlur={this.handleOnBlurSearch}
            handleOnFocus={this.handleOnFocusSearch}
            max={20}
            form={this.props.form}/>
        </this.Col>
        <this.Col md="4">
          <this.Button type="info" className="btn-add-product-compsite">
            <span className="icon-add"></span>
          </this.Button>
        </this.Col>
        <this.Col md="8" className="wrap-dropdown-search-product">
          {
            this.state.visibleDropDown ?
              <List
                itemLayout="horizontal"
                dataSource={this.state.data}
                className="list-search"
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                      title={<a href="https://ant.design">{item.title}</a>}
                      description="Ant Design, a design language for background applications."
                    />
                  </List.Item>
                )}
              />
              :
              ""
          }
        </this.Col>
        <this.Col md="12">
          <this.Table 
            dataSource={[]}
            columns={this.columns}
            locale={{emptyText: <this.Translate id="placeholder_table_composite_product" />}} />
        </this.Col>
      </this.Row>
    );
  }
}