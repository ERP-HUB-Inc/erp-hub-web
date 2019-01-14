import React from "react";
import PrivilegeAction from "../../../action/settings/privilege";
import RolePrivilegeAction from "../../../action/settings/rolePrivilege";
import ConstantRolePrivilege from "../../../constants/settings/rolePrivilege";
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
  };

  componentDidMount () {
    this.props.dispatch(PrivilegeAction.fetch(200));
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.rolePrivileges.fetched) {
      let rolePrivilegesList = nextProps.rolePrivileges.list;

      this.setState({
        checkChildIdList: [],
        checkChildIdListV2: [],
        checkParentIdList: []
      });
  
      const checkChildIdListV2 = [];
      const checkChildIdList = [];
      const checkParentIdList = [];

      rolePrivilegesList.forEach(rolePrivilege => {
        const parentId = rolePrivilege.privilege.parentId;
        const privilegeId = rolePrivilege.privilegeId;
        const rolePrivilegeId = rolePrivilege.id;

        // append parent list
        if (!checkParentIdList.find(checkParentId => checkParentId === rolePrivilege.privilege.parentId)) {
          checkParentIdList.push(rolePrivilege.privilege.parentId);
        }

        // For Child Check List
        checkChildIdList.push({
          rolePrivilegeId,
          privilegeId,
          value: 1,
          isHasUpdated: false
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
        checkChildIdListV2,
        checkParentIdList
      });

      if (this.props.handleCallBackGetPrivilegeList) {
        this.props.handleCallBackGetPrivilegeList(this.state.checkChildIdList);
      }

      this.props.dispatch(RolePrivilegeAction.reset(ConstantRolePrivilege.RESET_REQUEST_ROLE_PRIVILEGE_PARTIAL));
    }
  }

  handleSearchPrivilege (e) {
    this.setState({searchPrivilegeKey: e.target.value.trim()});
  }

  compareTwoCollection (parentId) {
    const allPrivilegeCollection = this.privilegeCollection.find(value => value.id === parentId);
    const selectedPrivilegeCollection = this.state.checkChildIdListV2.find(value => value.parentId === parentId);

    if (selectedPrivilegeCollection == null || selectedPrivilegeCollection.child.length === 0) {
      return {
        indeterminate: false,
        checkAll: false
      };
    }
    
    if (allPrivilegeCollection.child.length === selectedPrivilegeCollection.child.length) { // if existing length equal to user check mean user check all, so make checkbox all to checked
      return {
        indeterminate: false,
        checkAll: true
      };
    } else { // here user only checked some not all checkbox
      return {
        indeterminate: true,
        checkAll: false
      };
    }

  }

  onCheckAllChange (e){
    const {privileges} = this.props;

    if (e.target.checked) {

      // get all child ids of parent to add to checked list
      const allChildIds = privileges.list.filter(value => value["parentId"] === e.target.value).map(value => {
        return {rolePrivilegeId: 0, privilegeId: value.id, value: 1, isHasUpdated: true};
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
      const checkChildIdList = this.state.checkChildIdList;
      allChildIds.forEach(childPrivilege => {
        const searchResult = checkChildIdList.find(checkChildId => checkChildId.privilegeId === childPrivilege.privilegeId);
        if (!searchResult) {
          checkChildIdList.push(childPrivilege);
        } else if(searchResult) {
          searchResult["value"] = 1;// it affect to state because it reference address
        }
      });

      this.setState({checkChildIdList});

      if (this.props.handleCallBackGetPrivilegeList) {
        this.props.handleCallBackGetPrivilegeList(checkChildIdList);
      }

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
      const checkChildIdForRemove = [];
      this.state.checkChildIdList.forEach((value, valueIndex) => {

        const existPrivilege = allChildIds.find(child => value.privilegeId === child.privilegeId);
        if (value.rolePrivilegeId === 0) {
          checkChildIdForRemove.push(valueIndex);
        } else {

          if (!this.Util.isObjectEmpty(existPrivilege)) {
            value["value"] = 0;//For change status in DB
            value["isHasUpdated"] = true;
          }

          checkChildIdList.push(value);
        }
      });

      // Remove checked child list that not existing in DB
      for (let j = checkChildIdForRemove.length - 1; j >= 0; j--) {
        checkChildIdList.splice(checkChildIdForRemove[j], 1);
      }

      // For Check Box Group Detect State
      this.setState({
        checkChildIdList,
        checkChildIdListV2: this.state.checkChildIdListV2.map(value => {
          if (value["parentId"] === e.target.value) { // if the same parent just only append array
            value["child"] = [];
            return value;
          } else {
            return value;
          }
        })
      });


      if (this.props.handleCallBackGetPrivilegeList) {
        this.props.handleCallBackGetPrivilegeList(checkChildIdList);
      }

    }
  };

  handleRemoveTextSearch() {
    this.props.form.setFieldsValue({search_name_privillege: ""});
  }


  onChangeChild (e, parentId) {
    if (e.target.checked) {
      const {privilegeId} = e.target.value;
      const checkChildIdList = this.state.checkChildIdList;

      if (checkChildIdList.length === 0) {
        e.target.value["value"] = 1;
        e.target.value["isHasUpdated"] = true;
        checkChildIdList.push(e.target.value);
      } else {
        let isPrivilegeNotExist = true;
        checkChildIdList.forEach((value, index) => {
          if (value.privilegeId === privilegeId) {
            isPrivilegeNotExist = false;
            checkChildIdList[index]["value"] = 1;
            checkChildIdList[index]["isHasUpdated"] = true;
          }
        });

        if (isPrivilegeNotExist) {
          e.target.value["value"] = 1;
          e.target.value["isHasUpdated"] = true;
          checkChildIdList.push(e.target.value);
        }
      }

      this.setState({checkChildIdList});

      if (this.props.handleCallBackGetPrivilegeList) {
        this.props.handleCallBackGetPrivilegeList(checkChildIdList);
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
          value["isHasUpdated"] = true;
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

      if (this.props.handleCallBackGetPrivilegeList) {
        this.props.handleCallBackGetPrivilegeList(checkChildIdList);
      }

    }
  }

  renderPanelPrivilege (parent) {
    
    const resultCompare = this.compareTwoCollection(parent.id);

    return (
      <this.Panel 
        header={
          <div>
            <span className="text-uppercase">
              {parent.name}
            </span>
            <this.Checkbox // 1 THIS THE SAME IT SHOW WHEN COLAPSE CLOSE
              indeterminate={resultCompare["indeterminate"]}
              checked={resultCompare["checkAll"]}
              className="groupCheckAccessRole"/>
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
            className="groupCheckAccessRole"/>
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
  
  render() {
    const {privileges, form} = this.props;

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

    return (
      <div className="main-role-access">
        <this.Row className="scroll-role">
          <this.Col md="12" className="search-dropdown-product search-height">
            <div className="main-searchs">
              <span className="search-icon icon-search"></span>
              <this.InputText 
                name="search_name_privillege" 
                placeholder="Search access privillege" 
                form={form}
                handleKeyUp={this.handleSearchPrivilege}/>  
              <div className="remove-search-icon icon-clear" onClick={this.handleRemoveTextSearch}></div>
            </div>
          </this.Col>
        </this.Row>
        { privileges.fetched ?
          <this.Row>
            <this.Col md="12">   
              <this.Collapse>
                {this.privilegeCollection.map(parent => this.renderPanelPrivilege(parent))}
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


