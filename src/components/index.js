import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #BF4F74;
`;

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

const ERPHub = styled.div`
  text-align: center;
  padding-top: 19px;
  padding-bottom: 19px;
  font-weight: bold;
`;



export {
   Title,
   Wrapper,
   ERPHub
}

// Custom Antd Components
export * from "./Breadcrumb";
export * from "./Button";
export * from "./Button/actionButton";
export * from "./Button/searchButton";
export * from "./Button/trashButton";
export * from "./CustomCheckbox";
export * from "./C3Chart";
export * from "./Card";
export * from "./CustomCollapse";
export * from "./CustomFormItem";
export * from "./DatePicker";
export * from "./DateRangePicker";
export * from "./Doughnut";
export * from "./FieldComponent";
export * from "./Image";
export * from "./InputEmail";
export * from "./InputNumber";
export * from "./InputPassword";
export * from "./InputText";
export * from "./Line";
export * from "./ListCollapse";
export * from "./Loading";
export * from "./LoginLayout";
export * from "./Message";
export * from "./MonthPicker";
export * from "./Noteicon";
export * from "./Radio";
export * from "./Radio/RadioBox";
export * from "./Radio/RadioNormal";
export * from "./Select";
export * from "./Select/SelectSearch";
export * from "./Spin";
export * from "./Switch";
export * from "./Table";
export * from "./TagButton";
export * from "./TimePicker";
export * from "./Tooltips";
export * from "./Upload";
export * from "./UploadImageCrop";
export * from "./Waiting";
export * from "./WeekPicker";
export * from "./InputTextArea";

// Antd Components
export {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Checkbox,
  Collapse,
  Col,
  Form,
  Icon,
  Input,
  Layout,
  List,
  Menu,
  Modal,
  PageHeader,
  Popconfirm,
  Row,
  Spin,
  Tabs,
  Tag,
  Tooltip,
  Upload,
  message
} from "antd";