import React from "react";
import $ from "jquery";
import CustomerAction from "../../../actions/customers/customer";
import Constant from "../../../constants/customers/customer";
import Modal from "../../../../common/components/shares/Modal";
import "./DropDownSearch.css";

export default class DropDownSearch extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      visibleDropDown: false,
      isMouseHoverOnSearchList: false,
      isSetFocusSearchInput: false
    };

    this.scrollTop = 0;
    this.timer = null;

    this.handleKeyDownOnSearch = this.handleKeyDownOnSearch.bind(this);
    this.handlePressEnterOnSearch = this.handlePressEnterOnSearch.bind(this);
    this.handleOnBlurSearch = this.handleOnBlurSearch.bind(this);
    this.handleOnFocusSearch = this.handleOnFocusSearch.bind(this);
    this.handleOnSelectList = this.handleOnSelectList.bind(this);
    this.handleOnMouseHoverOnSearchList = this.handleOnMouseHoverOnSearchList.bind(this);
    this.handleOnMouseLeaveOnSearchList = this.handleOnMouseLeaveOnSearchList.bind(this);
    this.renderSearchItem = this.renderSearchItem.bind(this);
    this.handleRemoveTextSearch = this.handleRemoveTextSearch.bind(this);
  }

  componentDidMount() {
    var element = document.getElementsByClassName("ant-list-item");
    if (element.length > 0) {
      element[0].classList.add("search-item-hover");
    }
  }

  componentDidUpdate() {
    var element = document.getElementsByClassName("ant-list-item");
    if (element.length > 0) {
      element[0].classList.add("search-item-hover");
    }
  }

  handlePressEnterOnSearch() {
    const currentActive = $(".ant-spin-container div.search-item-hover");
    const recordId = currentActive.attr("classid");
    const result = this.props.productSearch.list.find(value => value.id === recordId);
    this.props.handlePressEnterOnSearch(result);
    this.setState({visibleDropDown: false});
  }

  handleOnBlurSearch() {
    if (!this.state.isMouseHoverOnSearchList) {
      this.setState({visibleDropDown: false});
    }

    this.setState({isSetFocusSearchInput: false});
  }

  handleOnFocusSearch() {
    this.setState({visibleDropDown: true});
  }

  handleOnMouseHoverOnSearchList() {
    this.setState({isMouseHoverOnSearchList: true});
  }

  handleOnMouseLeaveOnSearchList() {
    this.setState({isMouseHoverOnSearchList: false});
  }

  handleOnSelectList(value) {
    this.setState({visibleDropDown: false});
  }

  handleKeyDownOnSearch(event) {
    const value = event.target.value.trim();

    if (event.keyCode === 38) {
      const currentActive = $(".ant-spin-container div.search-item-hover");
      if (currentActive.prev().hasClass("ant-list-item")) {
        const allRow = $("div.ant-spin-container div.ant-list-item");
        
        allRow.removeClass("search-item-hover");
        currentActive.prev().addClass("search-item-hover");

        if (this.scrollTop > 0) {
          this.scrollTop = this.scrollTop - 60;
          $(".wrap-dropdown-search-ca .list-search").scrollTop(this.scrollTop);
        }
      }

    } else if (event.keyCode === 40) {
      const currentActive = $(".ant-spin-container div.search-item-hover");
      if (currentActive.next().hasClass("ant-list-item")) { // protect offset elemet of row
        const allRow = $("div.ant-spin-container div.ant-list-item");

        allRow.removeClass("search-item-hover");
        currentActive.next().addClass("search-item-hover");

        this.scrollTop = this.scrollTop + 60;
        $(".wrap-dropdown-search-ca .list-search").scrollTop(this.scrollTop);
      }
    } else {
      if (value) {
        clearTimeout(this.timer);
    
        this.timer = setTimeout(function() {
          const searchKey = JSON.stringify({column: ["firstName", "lastName", "phoneNumber"], value});

          this.props.dispatch(CustomerAction.fetch(100, 0, "", "", "", searchKey));

          this.setState({visibleDropDown: true});

        }.bind(this), 200);
      } else {
        this.props.dispatch(CustomerAction.reset(Constant.REQUEST_CUSTOMERS_RESET));
      }
    }
  }

  handleRemoveTextSearch() {
    this.props.form.setFieldsValue({searchRecord: ""});
    this.setState({isSetFocusSearchInput: true});
  }

  renderSearchItem(record) {
    return (
      record !== "new" ?
        <this.List.Item onClick={() => this.handleOnSelectList(record)} className="record-item-search" classID={record.id}>
          <this.List.Item.Meta
            avatar={<span className="icon-person"></span>}
            title={`${record.firstName} ${record.lastName}`}
            description={
              <div className="wrap-description">
                <span className="text-uppercase">{record.phoneNumber}</span>
                <div className="right-description">
                  <div className="customer-code">A-0001</div>
                  <this.Tag color="#FFD627" className="text-uppercase">{record.groupCustomer ? record.groupCustomer.name : "general" }</this.Tag>
                </div>
              </div>} />
        </this.List.Item>
        :
        <this.List.Item onClick={this.props.handleOnAddNewCustomer} className="add-customer">
          <this.List.Item.Meta
            avatar={<span className="icon-add"></span>}
            title={<this.Translate id="text_add_new_customer"/>} />
        </this.List.Item>
    );
  }

  render() {
    return (
      <this.Col md="12" className="search-height" style={{position: "relative"}}>
        <div className="main-searchs">
          <div className="search-icon icon-person"></div>
          <this.InputText
            name="searchRecord"
            isAutoFocus={this.props.isAutoFocus || true}
            didUpdateMakeAutoFocus={this.state.isSetFocusSearchInput}
            className="ca-input-v1-icon-left ca-input-v1"
            placeholder={this.CATranslate("input_search_customer", this.props.locale)}
            validateStatus={this.props.customers.fetching ? "validating" : ""}
            handleKeyUp={this.handleKeyDownOnSearch}
            handlePressEnter={this.handlePressEnterOnSearch}
            handleOnBlur={this.handleOnBlurSearch}
            handleOnFocus={this.handleOnFocusSearch}
            form={this.props.form}/>
          <div className="remove-search-icon icon-delete" onClick={this.handleRemoveTextSearch}></div>
        </div>
        {
          this.state.visibleDropDown && this.props.customers.fetched?
            <div className="wrap-dropdown-search-ca">
              <this.List
                itemLayout="horizontal"
                locale={{emptyText: <this.Translate id="placeholder_product_list_search" />}}
                dataSource={this.props.customers.list.concat(["new"])}
                className="list-search"
                onMouseEnter={this.handleOnMouseHoverOnSearchList}
                onMouseLeave={this.handleOnMouseLeaveOnSearchList}
                renderItem={recordItem => this.renderSearchItem(recordItem)}
              />
              
          
            </div>
            :
            ""
        }
      </this.Col>
    );
  }
}

DropDownSearch.defaultProps = {
  filter: ""
};
