import React from "react";
import moment from "moment";
import {
  Translate,
  setActiveLanguage,
  getActiveLanguage,
  connect
} from "@redux/index";
import CSVReader from "react-csv-reader";
import {
  CSVLink,
  CSVDownload
} from "react-csv";
import {  
  Container,
  Col,  
  Row,
  Dropdown, 
  DropdownItem, 
  DropdownToggle, 
  DropdownMenu,
  FormGroup,
  Label,
  FormText
} from "reactstrap";
import {
  NavLink,
  Link
} from "react-router-dom";
import {
  Cards,
  BreadcrumbTitle,
  CTable,
  TableExpand,
  SubTable,
  Noteicon,
  Select,
  ActionButton,
  Switchs,
  Waiting,
  Checkboxs,
  TrashButton,
  Button,
  InputText,
  InputEmail,
  InputNumber,
  InputPassword,
  LoginLayout,
  RadioBox,
  RadioChildBox,
  RadioNormal,
  DatePickers,
  DateRangePicker,
  RadioButton,
  UploadImg,
  Image,
  Loading,
  InputTextArea,
  SearchButton,
  Radios,
  SelectSearch,
  SelectTag,
  TagButton,
  MonthsPicker,
  WeekPickers,
  Doughnut,
  Line,
  C3Chart,
  MessageV2
} from "../index";
import Util from "@helper/util";
import Enum from "@enums/index";
import HttpCode from "@enums/http-status";
import {
  Layout,
  Menu,
  Icon,
  Form,
  Collapse,
  Checkbox,
  Modal,
  Popconfirm,
  message,
  Alert,
  Tooltip,
  Tabs,
  Badge,
  Spin,
  Tag,
  List,
  Breadcrumb,
  Input
} from "antd";
import "@themes/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";

const Panel = Collapse.Panel;
const { Option } = Select;

const TabPane = Tabs.TabPane;

const CheckboxGroup = Checkbox.Group;

const InputGroup = Input.Group;

export default class Component extends React.PureComponent {
  constructor(props) {
    super(props);

    this.pageSize = 50;

    // Element Ant ui
    this.Table = CTable;
    this.TableExpand = TableExpand;
    this.SubTable = SubTable;
    this.Button = Button;
    this.Message = message;
    this.MessageV2 = MessageV2;
    this.Alert = Alert;
    this.Popconfirm = Popconfirm;
    this.Modal = Modal;
    this.Noteicon = () => (<Noteicon/>);
    this.Select = Select;

    // Other
    this.clearFloating = () => <div className="clearFloat"></div>;

    // Localization
    this.Translate = Translate;

    // Function
    this.changeLanguage = this.changeLanguage.bind(this);
    
    // this.SynField = SynField;
    this.connect = connect;

    //React Strap 
    this.Container = Container;
    this.Col = Col;
    this.Row = Row;
    this.Dropdown = Dropdown;
    this.DropdownItem = DropdownItem;
    this.DropdownToggle = DropdownToggle;
    this.DropdownMenu = DropdownMenu;
    this.NavLink = NavLink;
    this.Link = Link;
    this.BreadcrumbTitle = BreadcrumbTitle;
    this.FormGroup = FormGroup;
    this.Label = Label;
    this.FormText = FormText;
    this.Cards = Cards;

    //Ant
    this.Layout = Layout;
    this.Menu = Menu;
    this.Icon = Icon;
    this.ActionButton = ActionButton;
    this.Switchs = Switchs;
    this.Waiting = Waiting;
    this.Checkboxs = Checkboxs;
    this.Checkbox = Checkbox;
    this.CheckboxGroup = CheckboxGroup;
    this.Collapse = Collapse;
    this.Panel = Panel;
    this.Tooltip = Tooltip;
    this.Badge = Badge;
    this.Option = Option;
    this.Form = Form;
    this.TrashButton = TrashButton;
    this.LoginLayout = LoginLayout;
    this.InputText = InputText;
    this.InputNumber = InputNumber;
    this.InputPassword = InputPassword;
    this.RadioBox = RadioBox;
    this.RadioChildBox = RadioChildBox;
    this.RadioNormal = RadioNormal;
    this.RadioButton = RadioButton;
    this.Radios = Radios;
    this.InputEmail = InputEmail;
    this.DatePickers = DatePickers;
    this.DateRangePicker = DateRangePicker;
    this.UploadImg = UploadImg;
    this.Image = Image;
    this.Loading = Loading;
    this.Spin = Spin;
    this.TabPane = TabPane;
    this.Tabs = Tabs;
    this.InputTextArea = InputTextArea;
    this.SearchButton = SearchButton;
    this.SelectSearch = SelectSearch;
    this.SelectTag = SelectTag;
    this.Tag = TagButton;
    this.TagLabel = Tag;
    this.List = List;
    this.Breadcrumb  = Breadcrumb;
    this.MonthPicker = MonthsPicker;
    this.WeekPickers = WeekPickers;
    this.InputGroup = InputGroup;

    this.CSVLink = CSVLink;
    this.CSVDownload = CSVDownload;
    this.CSVReader = CSVReader;

    this.Doughnut = Doughnut;
    this.Line = Line;
    this.C3Chart = C3Chart;

    // Util function
    this.Util = new Util();

    // ENUM VALUE
    this.Enum = Enum;

    // HTTP CODE
    this.HttpCode = HttpCode;

    // OTHER
    this.emptyText = "N/A";

  }

  changeLanguage(key) {
    return setActiveLanguage(key);
  }

  getCurrentLanguage(state) {
    return getActiveLanguage(state);
  }

  dateRangeDataSource() {
    return { 
      [this.CATranslate("text_last_week", this.props.locale)]: [moment().subtract(1, "week").startOf("isoWeek"), moment().subtract(1, "week").endOf("isoWeek")],
      [this.CATranslate("text_this_week", this.props.locale)]: [moment().startOf("isoWeek"), moment().endOf("isoWeek")],
      [this.CATranslate("text_before_last_month", this.props.locale)]:  [moment().subtract(1, "months").startOf("month")],
      [this.CATranslate("text_last_month", this.props.locale)]: [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
      [this.CATranslate("text_this_month", this.props.locale)]: [moment().startOf("month"), moment().endOf("month")],
      [this.CATranslate("text_today", this.props.locale)]: [moment(), moment()]
    };
  }

  getCurrentIndexLanguage(state) {
    const currentLanguage = getActiveLanguage(state);
    for (var i=0; i<state.languages.length; i++) {
      if (state.languages[i].code ===currentLanguage.code) {
        return i;
      }
    }
  }

  CATranslate(key, state) {
    const currentIndex = this.getCurrentIndexLanguage(state);

    if (state.translations[key] == null) return null;

    return state.translations[key][currentIndex];
  }

  getLanguageIcon(key) {
    const flag = {
      km: <span className="icon-kh icon-padding-right language-icon">
        <span className="path1"></span><span className="path2"></span><span className="path3"></span>
      </span>,
      en: <span className="icon-uk icon-padding-right language-icon">
        <span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span><span className="path11"></span><span className="path12"></span><span className="path13"></span><span className="path14"></span><span className="path15"></span><span className="path16"></span><span className="path17"></span><span className="path18"></span><span className="path19"></span><span className="path20"></span><span className="path21"></span><span className="path22"></span><span className="path23"></span><span className="path24"></span><span className="path25"></span><span className="path26"></span><span className="path27"></span><span className="path28"></span><span className="path29"></span><span className="path30"></span><span className="path31"></span><span className="path32"></span><span className="path33"></span><span className="path34"></span><span className="path35"></span><span className="path36"></span><span className="path37"></span><span className="path38"></span><span className="path39"></span><span className="path40"></span><span className="path41"></span><span className="path42"></span><span className="path43"></span><span className="path44"></span><span className="path45"></span><span className="path46"></span><span className="path47"></span><span className="path48"></span><span className="path49"></span><span className="path50"></span>
      </span>,
      bm: <span className="icon-mm icon-padding-right language-icon">
        <span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span>
      </span>
    };

    return flag[key];
  }

  getCurrentUser() {
    const currentUser = localStorage.getItem("ACCESS_TOKEN");
    return JSON.parse(currentUser);
  }

  getCurrentLanguageCode() {
    const currentSetting = this.Util.getSetting();
    if (currentSetting) {
      return currentSetting.defaultLanguageCode;
    }
    return "en";
  }

  formatCurrency(value, currency = "", isShowSymbol = true) {
    let temp = value;
    const currentSetting = this.Util.getSetting();
    let currencyPosition = 0;
    if (currentSetting && !currency) {
      currency = currentSetting.currency;
      currencyPosition = currentSetting.currencyPosition;
    }

    // DETECT DONT WANT TO SHOW CURRENCY SYMBOL
    if (!isShowSymbol) {
      currency = "";
    }

    temp = this.Util.formatCurrency(Math.abs(temp), currency, currencyPosition);
    return value < 0 ? `(${temp})` : temp;
  }

  formatUnit(quantity,multiple,unitName,label = "",andTranslated){
    let multipleValues = quantity / multiple;
    let unit = (multipleValues) - Math.floor(multipleValues);
    if(unit !== 0){
      return `${Math.floor(multipleValues)} ${unitName} ${andTranslated} ${(parseInt(unit * multiple))} ${label}`;
    }else{
      return `${Math.floor(multipleValues)} ${unitName}`;
    }
  }

  getImageFromUpload(value, key = "image") {
    let image = "";
    
    if (value === null) return image;

    if (key in value &&
      value[key] &&
      "file" in value[key] &&
      value[key]["file"] && 
      "name" in value[key]["file"]
    ) {
      image = value[key]["file"]["name"];
    }
    
    return image;
  }
}