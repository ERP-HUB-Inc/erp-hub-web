import React from "react";
import PrivilegeAction from "../../../action/settings/privilege";
import RolePrivilegeAction from "../../../action/settings/rolePrivilege";
import Component from "../../../../common/components/Component";
import "./index.css";

export default class ListPrivilege extends Component {
  constructor(props){
    super(props);
    this.state = {
      isGrantingPrivilege: false,
      checkParentIdList: [],
      checkChildIdList: [],
      checkChildIdListV2: [], //[{parentId:1, child: []}]
      searchPrivilegeKey: ""
    };

    this.privilegeCollection = [];
    
    this.renderSubPanelPrivilge = this.renderSubPanelPrivilge.bind(this);
    this.renderPanelPrivilege = this.renderPanelPrivilege.bind(this);
    this.onCheckAllChange = this.onCheckAllChange.bind(this);
    this.onChangeChild = this.onChangeChild.bind(this);
    this.compareTwoCollection = this.compareTwoCollection.bind(this);
    this.handleSearchPrivilege = this.handleSearchPrivilege.bind(this);
    this.handleRemoveTextSearch = this.handleRemoveTextSearch.bind(this);
    this.checkPrivileageChange = this.checkPrivileageChange.bind(this);
  };

  componentDidMount () {
    const {dispatch} = this.props;
    dispatch(PrivilegeAction.fetch(200));
  }

  

  // handleSubmit () {
  // const {dispatch} = this.props;

  // if (this.props.rowData) {
  //   const roleId = this.props.rowData.id;
  //   const privileges = {privileges: this.state.checkChildIdList};

  //   this.setState({isGrantingPrivilege: true});
  //   setTimeout(function () {
  //     this.setState({isGrantingPrivilege: false});
  //   }.bind(this), 2000);
      
  //   dispatch(RolePrivilegeAction.assignPrivilege(roleId, privileges));

  // } else {
  //   this.Message.warning(this.CATranslate("warning_not_select_role", this.props.locale));
  // }

  // }

  handleSearchPrivilege (e) {
    this.setState({searchPrivilegeKey: e.target.value.trim()});
  }

  compareTwoCollection (parentId) {
    const allPrivilegeCollection = this.privilegeCollection.find(value => value.id === parentId);
    const selectedPrivilegeCollection = this.state.checkChildIdListV2.find(value => value.parentId === parentId);

    if (selectedPrivilegeCollection == null || selectedPrivilegeCollection.child.length === 0) {
      return {indeterminate: false, checkAll: false};
    }
    
    if (allPrivilegeCollection.child.length === selectedPrivilegeCollection.child.length) { // if existing length equal to user check mean user check all, so make checkbox all to checked
      return {indeterminate: false, checkAll: true};
    } else { // here user only checked some not all checkbox
      return {indeterminate: true, checkAll: false};
    }

  }

  onCheckAllChange (e){
    const {privileges} = this.props;

    if (e.target.checked) {

      // get all child ids of parent to add to checked list
      const allChildIds = privileges.list.filter(value => value["parentId"] === e.target.value).map(value => {
        return {rolePrivilegeId: 0, privilegeId: value.id, value: 1};
      });

      this.state.checkParentIdList.push(e.target.value); // V1

      if (this.state.checkChildIdListV2.length === 0) { // case not select child
        this.setState({checkChildIdListV2: [{parentId: e.target.value, child: allChildIds}]});
      } else {
        const checkChildIdListV2 = this.state.checkChildIdListV2;
        let isParentIdNotExist = true;
        checkChildIdListV2.forEach((value, index) => {
          if (value["parentId"] === e.target.value) {
            isParentIdNotExist = false;
            checkChildIdListV2[index]["child"] = allChildIds;
          }
        });
        
        if (isParentIdNotExist) {
          checkChildIdListV2.push({parentId: e.target.value, child: allChildIds});
        }

        this.setState({checkChildIdListV2});
      }

      // push mutiple elements to array list
      this.state.checkChildIdList.push.apply(this.state.checkChildIdList, allChildIds);

    } else {
      
      // remove parent id from check parent id
      this.setState({
        checkParentIdList: this.state.checkParentIdList.filter(value => value !== e.target.value)
      });

      // get all child ids of parent to add to checked list
      const allChildIds = privileges.list.filter(value => value["parentId"] === e.target.value)
        .map(value => {
          return {rolePrivilegeId: 0, privilegeId: value.id, value: 1};
        });

      // remove child id from check child id or update child privilege value
      const checkChildIdList = [];
      this.state.checkChildIdList.forEach(value => {
        const existPrivilege = allChildIds.find(child => value.privilegeId === child.privilegeId);
        if (this.Util.isObjectEmpty(existPrivilege) && value.rolePrivilegeId === 0) {
          console.log("Not Existing In Database");
        } else {

          if (!this.Util.isObjectEmpty(existPrivilege)) {
            value["value"] = 0;
          }
          checkChildIdList.push(value);
        }
      });

      this.setState({checkChildIdList});

      // For Check Box Group Detect State
      this.setState({
        checkChildIdListV2: this.state.checkChildIdListV2.map(value => {
          if (value["parentId"] === e.target.value) { // if the same parent just only append array
            value["child"] = [];
            return value;
          } else {
            return value;
          }
        })
      });

      console.log("on change all change",this.state.checkChildIdList);
      this.props.form.setFieldsValue({text_privileges: this.state.checkChildIdList});

    }
  };

  handleRemoveTextSearch() {
    this.props.form.setFieldsValue({name: ""});
    this.privilegeCollectionMap();
  }


  onChangeChild (e, parentId) {
    if (e.target.checked) {
      const {privilegeId} = e.target.value;

      if (this.state.checkChildIdList.length === 0) {
        e.target.value["value"] = 1;
        this.setState({checkChildIdList: [e.target.value]});
      } else {
        const checkChildIdList = this.state.checkChildIdList;
        let isPrivilegeNotExist = true;
        checkChildIdList.forEach((value, index) => {
          if (value.privilegeId === privilegeId) {
            isPrivilegeNotExist = false;
            checkChildIdList[index]["value"] = 1;
          }
        });

        if (isPrivilegeNotExist) {
          e.target.value["value"] = 1;
          checkChildIdList.push(e.target.value);
        }

        this.setState({checkChildIdList});
      }

      if (this.state.checkChildIdListV2.length === 0) { // case not select child
        this.setState({checkChildIdListV2: [{parentId, child: [e.target.value]}]});
      } else {
        const checkChildIdListV2 = this.state.checkChildIdListV2;
        let isParentIdNotExist = true;
        checkChildIdListV2.forEach((value, index) => {
          if (value["parentId"] === parentId) {
            isParentIdNotExist = false;
            checkChildIdListV2[index]["child"].push(e.target.value);
          }
        });

        if (isParentIdNotExist) {
          checkChildIdListV2.push({parentId, child: [e.target.value]});
        }

        this.setState({checkChildIdListV2});
        
      }
      
    } else {
      const checkChildIdList = this.state.checkChildIdList.filter(value => 
      {
        if (value.privilegeId === e.target.value.privilegeId && e.target.value.rolePrivilegeId === 0) { // rolePrivilegeId = 0 mean not exist in database yet
          return false;
        } else {
          return true;
        }
      }
      ).map(value => {
        if (value.privilegeId === e.target.value.privilegeId) { // update value to = 0 to update value in database
          value["value"] = 0;
        }
        return value;
      });

      this.setState({checkChildIdList});

      this.setState({
        checkChildIdListV2: this.state.checkChildIdListV2.map(value => {
          if (value["parentId"] === parentId) { // if the same parent just only append array
            value["child"] = value["child"].filter(child => child.privilegeId !== e.target.value.privilegeId);
            return value;
          } else {
            return value;
          }
        })
      });
    }
  }


  componentWillReceiveProps(nextProps) {

    let rolePrivilegesList = nextProps.rolePrivileges.list;

    this.setState({
      checkChildIdList: [],
      checkChildIdListV2: []
    });
  
    const checkChildIdListV2 = [];
    const checkChildIdList = [];

    rolePrivilegesList.forEach(rolePrivilege => {
      const parentId = rolePrivilege.privilege.parentId;
      const privilegeId = rolePrivilege.privilegeId;
      const rolePrivilegeId = rolePrivilege.id;

      // For Child Check List
      checkChildIdList.push({
        rolePrivilegeId,
        privilegeId,
        value: 1
      });

      // checkChildIdListV2: use for validation is all checked or some checked
      if (checkChildIdListV2.length === 0) {
        checkChildIdListV2.push({
          parentId,
          child: [{
            rolePrivilegeId,
            privilegeId,
            value: 1
          }]
        });
      } else {
        let parentNotExist = true;
        checkChildIdListV2.forEach((value, index) => {
          if (value.parentId === parentId) {
            parentNotExist = false;
            checkChildIdListV2[index]["child"].push(
              {
                rolePrivilegeId,
                privilegeId,
                value: 1
              }
            );
          } 
        });

        if (parentNotExist) {
          checkChildIdListV2.push({
            parentId,
            child: [{
              rolePrivilegeId,
              privilegeId,
              value: 1
            }]
          });
        }
      }
    });

    this.setState({
      checkChildIdList,
      checkChildIdListV2
    });

    console.log("checkChildIdList",this.state.checkChildIdList);

  }

  checkPrivileageChange(){
    console.log("checkChildIdList on change",this.state.checkChildIdList);
    this.props.form.setFieldsValue({text_privileges: this.state.checkChildIdList});
  }

  renderPanelPrivilege (parent) {

    const resultCompare = this.compareTwoCollection(parent.id);

    return (
      <this.Panel 
        header={
          <div>
            <span>
              {parent.name}
            </span>
            <this.Checkbox // 1 THIS THE SAME IT SHOW WHEN COLAPSE CLOSE
              indeterminate={resultCompare["indeterminate"]}
              checked={resultCompare["checkAll"]}
              onChange={this.checkPrivileageChange}
              className="groupCheckAccessRole"
            />
          </div>
        }
        key={parent.id}

        id={`${parent.id}`}>
        <this.Row key={parent.id}>
          <this.Checkbox // 2 THIS THE SAME IT SHOW OVER 1 WHEN COLAPSE OPEN
            indeterminate={resultCompare["indeterminate"]}
            checked={resultCompare["checkAll"]}
            value={parent.id}
            onChange={this.onCheckAllChange}
            className="groupCheckAccessRole"
          />
          {
            parent.child.map(privilege => 
              this.renderSubPanelPrivilge(privilege)
            )
          }
        </this.Row>
      </this.Panel>
    );
  }

  renderSubPanelPrivilge (privilege) {
    const rolePrivilge = this.props.rolePrivileges.list.find(value => value.privilegeId === privilege["id"]);
    return (
      <this.Col md="6" className="childPrivilegeItem" key={privilege["id"]}>
        <this.Checkbox
          checked={this.state.checkChildIdList.find(value => value.privilegeId === privilege["id"] && value.value === 1) != null}
          value={{
            rolePrivilegeId: rolePrivilge == null ? 0 : rolePrivilge.id,
            privilegeId: privilege["id"]
          }}
          onChange={(e) => this.onChangeChild(e, privilege["parentId"])}>
          {privilege["name"]}
        </this.Checkbox>
      </this.Col>
    );
  }

  searchPrivilege(){
    const {privileges} = this.props;
    // Here reponse for cash collection to group of privilege
    if (privileges.fetched) {
      this.privilegeCollection = privileges.list.filter((privilege) => {
        if (this.state.searchPrivilegeKey != null) {
          if (privilege["isParent"] && privilege.name.toLowerCase().indexOf(this.state.searchPrivilegeKey.toLowerCase()) !== -1) {
            return true;
          } else {
            return false;
          }
        }

        if (privilege["isParent"]) {
          return true;
        }
        return false; // skip
      }).map(privilege => { 
        privilege["child"] = privileges.list.filter(childPrivilege => 
          childPrivilege.parentId === privilege.id
        );
        return privilege; 
      });

    }
  }

  privilegeCollectionMap(){
    return this.privilegeCollection.map(parent => this.renderPanelPrivilege(parent));
  }
  
  render() {
    const {privileges, form} = this.props;
    this.searchPrivilege();
    return (
      <div className="main-role-access">
        <this.Row className="scroll-role">
          <this.Col md="12" className="search-dropdown-product search-height">
            <div className="main-searchs">
              <this.Form>
                <span className="icon-search"></span>
                <this.InputText 
                  name="name" 
                  placeholder="Search Access Privillege" 
                  form={form}
                  handleKeyUp={this.handleSearchPrivilege}
                />  
                <div className="remove-search-icon icon-clear" onClick={this.handleRemoveTextSearch}></div>
              </this.Form>
            </div>
          </this.Col>
        </this.Row>
        {/* <this.InputText
          name="check_privilege"
          form={form}
        /> */}
        { this.props.form.getFieldDecorator("text_privileges",<input/>) }
        { privileges.fetched ?
          <this.Row>
            <this.Col md="12">   
              <this.Collapse>
                { this.privilegeCollectionMap() }
              </this.Collapse>
            </this.Col>

          </this.Row>
          :
          <div className="text-center">
            <this.Spin/>
          </div> 
        }   
        
      </div>
    );
  }
}


