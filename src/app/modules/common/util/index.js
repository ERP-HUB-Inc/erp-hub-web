import moment from "moment";
import "moment/min/locales";
import "moment/locale/en-ca";
import _ from "lodash";
import swal from "sweetalert";
import Enum from "../enums";
import ConstantAuth from "../constants/authentication";
import history from "../router/history";

export default class Util {
  getAPIURL() {
    let host = process.env.REACT_APP_API_HOST;
    let port = process.env.REACT_APP_API_PROD_PORT;
    if (process.env.REACT_APP_ENV === "DEV") {
      host = process.env.REACT_APP_API_DEV_HOST;
      port = process.env.REACT_APP_API_PORT;
    } else if (process.env.REACT_APP_ENV === "PREPROD") {
      port = process.env.REACT_APP_API_PRE_PROD_PORT;
    }
    const rootPath = process.env.REACT_APP_API_ROOT;
    const url = `${host}:${port}/${rootPath}`;
    return url;
  }

  removeFullScreen() {
    const element = document.getElementById("center-container");
    element.classList.remove("full-screen");
  }

  logout(history) {
    localStorage.removeItem(ConstantAuth.ACCESS_TOKEN);
    localStorage.removeItem(ConstantAuth.STORE_ACCESS_TOKEN);
    history.push("/signin");
  }
  checkValueSwitch (values){
    return values ? 1 : 0;
  }
  
  findArrayIndex (collection, prop, value) {
    return _.findIndex(collection, [prop, value]);
  }

  mapWithKey (datas) {
    datas.map((element, index) => {
      return element.key = index;
    });
  }

  getQueryParam(location, param) {
    return new URLSearchParams(location.search).get(param);
  }

  renameObjectKeys(obj, key, newKey){
    if(_.includes(_.keys(obj), key)) {
      obj[newKey] = _.clone(obj[key], true);
      delete obj[key];
    }
    return obj;
  }

  isValidEmail (email) {
    var re = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  }

  setAuthSession(data) {
    localStorage.setItem(ConstantAuth.ACCESS_TOKEN, JSON.stringify(data));
  }

  getAuthSession () {
    if (!localStorage.getItem(ConstantAuth.ACCESS_TOKEN)) return null;
    let result = localStorage.getItem(ConstantAuth.ACCESS_TOKEN);
    result = JSON.parse(result);
    return result;
  }

  getBaseUrl() {
    return window.location.origin;
  }
  
  getAccessToken () {
    const result = this.getAuthSession();
    if (result)
      return result.accessToken;
    else 
      return null;
  }

  getSetting () {
    const result = this.getAuthSession();
    if (result)
      return result.setting;
    else 
      return null;
  }

  getCurrentLanguageCode() {
    let languageCode = "en";
    const currentSetting = this.getSetting();
    if (currentSetting) {
      languageCode = currentSetting.defaultLanguageCode;
    }

    if (languageCode === "en") {
      languageCode = "en";
    }

    return languageCode;
  }

  getProductNameField(code) {
    return code === "en" ? "" : code;
  }

  getCurrentUser() {
    const result = this.getAuthSession();
    if (result)
      return result.currentUser;
    else 
      return {
        fullName: "",
        userName: ""
      };
  }

  getClientId() {
    const result = this.getAuthSession();
    if (result)
      return result.clientId;
    else 
      return null;
  }

  getLocationId() {
    const result = this.getAuthSession();
    if (result)
      return result.locationId;
    else 
      return null;
  }

  getDeviceNumber() {
    const result = this.getSetting();
    if (result)
      return result.deviceNumber;
    else 
      return null;
  }

  getClientCustomerCreditStatus() {
    const result = this.getSetting();
    if (result)
      return result.isAllowCustomerCredit;
    else
      return null;
  }

  getClientPaymentTerm() {
    const result = this.getSetting();
    if (result)
      return result.paymentTerm;
    else
      return "";
  }

  getClientVATNo() {
    const result = this.getSetting();
    if (result)
      return result.VATNo;
    else
      return "";
  }

  getCurrentDate () {
    return moment();
  }

  getInitialDateForDOB() {
    return moment().subtract(18, "years");
  }

  
  formatDate (value, format = "DD-MMM-YYYY") {
    format = format === null || format === "" ? "DD MMM YYYY" : format;
    return moment(value).format(format);
  }

  formatDateTime (value, format = "DD/MM/YYYY h:mm A") {
    format = format == null ? "DD/MM/YYYY h:mm A" : format;
    return moment(value).format(format);
  }

  formatDateForMYSQL (value, format = "YYYY-MM-DD") {
    format = format == null ? "YYYY-MM-DD" : format;
    value = moment(value).format(format);
    return value;
  }

  formDateDOB (value) {
    const date = moment(value).format("MMM-Do-YYYY");
    return date;
  }

  isValidDate(value) {
    return value instanceof Date && !isNaN(value);
  }

  formatDatePicker (value, initialValue = null, format="YYYY/MM/DD") {
    let date = moment(value, format);
    if (!date._isValid) {
      if (initialValue === null) {
        initialValue = this.getCurrentDate();
      }
      date = moment(initialValue, format);
    }
    return date;
  }

  listFormatDate () {
    return [
      {name: "MMM-Do-YYYY h:mm A", value: "MMM-Do-YYYY h:mm A"},
      {name: "MMM Do YY", value: "MMM Do YY"},
      {name: "YYYY/MM/DD", value: "YYYY/MM/DD"},
      {name: "DD/MM/YYYY", value: "DD/MM/YYYY"}
    ];
  }

  formtTextError(value){
    return value !=="" && value !== null ? value : "-";
  }

  isObjectEmpty (data) {
    return _.isEmpty(data);
  }

  getDomainInfo () {
    const full = window.location.host;
    //window.location.host is subdomain.domain.com
    const parts = full.split(".");
    let sub = parts[0];
    let domain = parts[1];
    const type = parts[2];
    if (type != null) {
      domain = `${domain}.${type}`;
    }
    const protocol = window.location.protocol.replace(/:/g, "");
    
    let subdomain = `${protocol}://${sub}.${domain}`;
    if (type != null) {
      subdomain = `${subdomain}.${type}`;
    }
    
    return {
      domain: `${protocol}://${domain}`,
      subdomain,
      subStr: sub,
      domainStr: domain,
      protocolStr: protocol
    };
  }

  getPercentage(total, amount) {
    let value = 0;

    if (amount) {
      value = (amount * 100) / total;
    }

    return Number(value.toFixed(2));
  }

  getValueFromPercentage(total, amount) {
    let value = 0;

    if (amount) {
      value = (amount * total) / 100;
    }

    if (!value)
      value = 0;

    return Number(value.toFixed(2));
  }

  getTaxValue(subtotal, valueAddedTaxRate) {
    return Number((subtotal * valueAddedTaxRate / 100).toFixed(2));
  }

  getTaxRate(subTotal, taxAmount) {
    let percentage = (taxAmount * 100) / subTotal;
    if (!percentage)
      percentage = 0;

    return Number(percentage.toFixed(2));
  }

  formatPercentage(n, position = 0) {
    let percentage = "%";

    let unsigne = "";
    if (n < 0) {
      n = Math.abs(n);
      unsigne = "-";
    }
    // 0: BEFORE, 1: AFTER
    let result = parseFloat(n).toFixed(2).replace(/./g, function(c, i, a) {
      return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });

    result = isNaN(result) ? 0 : result;

    if (position === 0) {
      result = `${percentage}${result}`;
    } else {
      result = `${result}${percentage}`;
    }
  
    return `${unsigne}${result}`;
  }

  formatCurrency(n, currency = "$", position = 0) {
    let unsigne = "";
    if (n < 0) {
      n = Math.abs(n);
      unsigne = "-";
    }
    // 0: BEFORE, 1: AFTER
    let result = parseFloat(n).toFixed(2).replace(/./g, function(c, i, a) {
      return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });

    if (position === 0) {
      result = `${currency}${result}`;
    } else {
      result = `${result}${currency}`;
    }

    return `${unsigne}${result}`;
  }

  formatPhoneno(phoneno) {
    if (phoneno) {
      var cleaned = ("" + phoneno).replace(/\D/g, "");
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (phoneno.length === 9) {
        match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
      }
      console.log("match", match);
      if (match) {
        return match[1] + " " + match[2] + " " + match[3];
      }
    }

    return "";
  }

  formatPhonenoWithCountryCode(phoneno) {
    if (phoneno) {
      var cleaned = ("" + phoneno).replace(/\D/g, "");
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (phoneno.length === 9) {
        match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
      }

      if (match) {
        return "(+855) "  + match[1] + " " + match[2] + " " + match[3];
      }
    }
    return phoneno;
  }

  floor(value) {
    if (!value) {
      return 0;
    }
    return parseFloat((value * 1).toFixed(2));
  }
  
  formatCurrencyV2(n, currency) {
    return currency + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }
  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  clearObjProperty(data, props = []) {
    props.forEach(prop => {
      delete data[prop];
    });
  }

  isRecordId(value) {
    let recordId = value.replace("-", "");
    const conditonOne = value.length >= 36 || value.length.length <= 40;
    const conditionTwo = Number.isInteger(parseInt(recordId, 10));
    return conditonOne && conditionTwo;
  }

  isValidProp(value, path) {
    return _.has(value, path);
  }

  chuckCollection(value, numberOfRow) {
    return _.chunk(value, numberOfRow);
  }

  getImage(image) {
    return `${process.env.REACT_APP_RESOURCE_HOST}/${image}`;
  }

  toggleFullScreen(elem) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
      if (elem.requestFullScreen) {
        elem.requestFullScreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  printElem(contentHtml)
  {
    var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    var dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;

    var left = ((width / 2) - (width / 2)) + dualScreenLeft;
    var top = ((height / 2) - (height / 2)) + dualScreenTop;

    var mywindow = window.open("", "PRINT", `height=${height},width=${width},top=${top},${left}`);

    if (mywindow) {
      mywindow.document.write("<html><head><title>" + document.title  + "</title>");
      mywindow.document.write("</head><body >");
      mywindow.document.write(contentHtml);
      mywindow.document.write("</body></html>");

      mywindow.document.close();
      mywindow.focus();

      setTimeout(function() {
        mywindow.print();
      }, 250);
    }
    
    return true;
  }

  printElemV2(contentHtml)
  {
    var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    var dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;

    var left = ((width / 2) - (width / 2)) + dualScreenLeft;
    var top = ((height / 2) - (height / 2)) + dualScreenTop;

    var mywindow = window.open("", "PRINT", `height=${210},width=${580},top=${top},left=${left}`);

    mywindow.document.write("<html><head><title>" + document.title  + "</title>");
    mywindow.document.write("</head><body >");
    mywindow.document.write(contentHtml);
    mywindow.document.write("</body></html>");

    mywindow.document.close();
    mywindow.focus();

    setTimeout(function() {
      mywindow.print();
      // mywindow.close();
    }, 250);

    return true;
  }

  getProductImage(fileName, key="product") {
    return {
      url: `${process.env.REACT_APP_RESOURCE_HOST}/${this.getClientId()}/${key}/${fileName}`
    };
  }

  getGeneralImage(fileName) {
    return {
      url: `${process.env.REACT_APP_RESOURCE_HOST}/${fileName}`
    };
  }

  validImage(url, callback, timeout) {
    timeout = timeout || 5000;
    var timedOut = false, timer;
    var img = new Image();
    img.onerror = img.onabort = () => {
      if (!timedOut) {
        clearTimeout(timer);
        callback("error");
      }
    };
    img.onload = () => {
      if (!timedOut) {
        clearTimeout(timer);
        callback("success");
      }
    };
    img.src = url;
    timer = setTimeout(() => {
      timedOut = true;
      callback("timeout");
    }, timeout); 
  }

  getImageFromSpace(image) {
    return `${process.env.REACT_APP_RESOURCE_HOST}/${image}`;
  }

  isValidCollectionInObj(data, key) {
    if (data && data[key] && Array.isArray(data[key])) {
      return true;
    } else {
      return false;
    }
  }

  getDBFromLocalStorageById(schemaName, id) {
    let data = localStorage.getItem(schemaName);
    data = JSON.parse(data);
    if (Array.isArray(data)) {
      data = data.find(value => value.id === id);
    }
    return data;
  }

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace("[\\[\\]]/g", "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  sumBy(collection, key) {
    return _.sumBy(collection, key);
  }

  orderBy(collection, field = [], type="asc") {
    return _.orderBy(collection, field, type);
  }

  moveArray(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  };

  isNoPermissionProp(props) {
    return props.checkPermission && this.getErrorCodeFromState(props.checkPermission.error) === Enum.NO_PERMISSON;
  }

  isCheckingPermission(props) {
    return props.checkPermission && props.checkPermission.checking;
  }

  groupByTheSameValue(collection, key, calculate , typeCondition){
    return(
      _(collection)
        .filter(value => value["type"] === typeCondition)
        .groupBy(key)
        .map((objs, index) => ({
          key: index,
          calculate: _.sumBy(objs, calculate) }))
        .value()
    );
  }

  copyArrayObj(arg) {
    arg = JSON.stringify(arg);
    return JSON.parse(arg);
  }

  copyObj(arg) {
    arg = JSON.stringify(arg);
    return JSON.parse(arg);
  }

  getErrorCodeFromState(error) {
    let code;
    
    if (
      error &&
      "data" in error &&
      error["data"] &&
      "error" in error["data"] &&
      error["data"]["error"]
    ) {
      code = error["data"]["error"]["code"];
    }

    return code;
  }

  getErrorMessageFromState(error) {
    let message;
    
    if (
      error &&
      "data" in error &&
      error["data"] &&
      "error" in error["data"] &&
      error["data"]["error"]
    ) {
      message = error["data"]["error"]["message"];
    }

    return message;
  }

  processImageOnFlightCropCenter(imageURL, size = {width: 100, height: 100}) {
    return `${process.env.REACT_APP_IMAGE_FLIGHT_HOST}/OptionKey_OptionValue - g_Center, w_${size.width}, h_${size.height}/${imageURL}`;
  }

  fromKHNumberToStandard(dataValue) {
    const khNumber = [
      {
        km: "១",
        en: "1"
      },
      {
        km: "២",
        en: "2"
      },
      {
        km: "៣",
        en: "3"
      },
      {
        km: "៤",
        en: "4"
      },
      {
        km: "៥",
        en: "5"
      },
      {
        km: "៦",
        en: "6"
      },
      {
        km: "៧",
        en: "7"
      },
      {
        km: "៨",
        en: "8"
      },
      {
        km: "៩",
        en: "9"
      },
      {
        km: "០",
        en: "0"
      }
    ];

    let newDataValue = "";

    dataValue.forEach(value => {
      if (value === "-") {
        newDataValue += value;
      } else {
        const findResult = khNumber.find(khNumberValue => khNumberValue.km === value);
        if (findResult) {
          newDataValue += findResult.en;
        }
      }
    });

    return newDataValue;
  }  

  fromStandardNumberKHV2(number) {
    let result = "០";
    if (number){
      let strNum = number + "";
      const dataValue = `${strNum}`.split("");
      const khNumber = ["០","១","២","៣","៤","៥","៦","៧","៨","៩"];
      dataValue.forEach(value=> {
        if(khNumber[value]){
          const regex = new RegExp("" + value + "", "g");
          strNum = strNum.replace(regex,`${khNumber[value]}`);
        }
      });
      result = strNum;
    }
    return result;
  }

  /**
   * When user want to push search params to URL
   * @param {*} pathName 
   * @param {*} strParam 
   */
  pushParamsToURL(pathName, strParam) {
    history.push({
      pathname: pathName,
      search: strParam
    });
  }

  getDatesFromSelectOption(option) {
    let range = [];
    let lastRange = [];
    const format = "YYYY-MM-DD";
    if (option === "today") {
      range = [moment(), moment()];
      lastRange = [moment().subtract(1, "day"), moment().subtract(1, "day")];
    } else if (option === "this-week") {
      range = [moment().startOf("week"), moment().endOf("week")];
      lastRange = [moment().subtract(1, "week").startOf("week"), moment().subtract(1, "week").endOf("week")];
    } else if (option === "current-month") {
      range = [moment().startOf("month"), moment().endOf("month")];
      lastRange = [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")];
    } else if (option === "last-30-days") {
      range = [moment().subtract(29, "days"), moment()];
      lastRange = [moment().subtract(59, "days"), moment().subtract(30, "days")];
    } else if (option === "last-3-months") {
      range = [moment().subtract(2, "months").startOf("month"), moment().endOf("month")];
      lastRange = [moment().subtract(5, "months").startOf("month"), moment().subtract(3, "months").endOf("month")];
    } else if (option === "previous-quater") {
      range = [moment().subtract(1, "quarter").startOf("quarter"), moment().subtract(1, "quarter").endOf("quarter")];
      lastRange = [moment().subtract(2, "quarter").startOf("quarter"), moment().subtract(2, "quarter").endOf("quarter")];
    } else if (option === "last-12-months") {
      range = [moment().subtract(11, "months").startOf("month"), moment().endOf("month")];
      lastRange = [moment().subtract(23, "months").startOf("month"), moment().subtract(12, "months").endOf("month")];
    } else if (option === "previous-year") {
      range = [moment().subtract(1, "year").startOf("year"), moment().subtract(1, "year").endOf("year")];
      lastRange = [moment().subtract(2, "year").startOf("year"), moment().subtract(2, "year").endOf("year")];
    }

    if (range.length) {
      range = [moment(range[0]).format(format), moment(range[1]).format(format)];
      lastRange = [moment(lastRange[0]).format(format), moment(lastRange[1]).format(format)];
    }

    return {
      range,
      lastRange
    };
  }

  sweetAlertConfirm(title, text, buttons = ["Cancel", "Yes"]) {
    return swal({
      title,
      icon: "warning",
      buttons,
      dangerMode: true,
    });
  }

  sweetAlertMessage(text, icon) {
    return swal({
      text,
      icon
    });
  }

  sweetAlertMessageV2(title, text, icon, button) {
    return swal({
      title,
      text,
      icon,
      button
    });
  }

  converNumberToWord(value = 0) {
    let result = "";
    if (!value) 
      result = "";

    value = this.floor(value);

    let strNumber = value.toString().split(".");
    let number = strNumber[0];
    let decimal = strNumber[1];
    
    let intNumber = this.getWordFromInt(number);
    let decNumber = this.getWordFromInt(decimal);
    result = intNumber + "Dollar";
    if (decNumber) {
      result = result + ` and ${decNumber} Cent`;
    }
    
    return result + " Only.";
  }

  getWordFromInt(number) {
    let str = "";
    const arr1 = ["", "one ","two ","three ","four ", "five ","six ","seven ","eight ","nine ","ten ","eleven ","twelve ","thirteen ","fourteen ","fifteen ","sixteen ","seventeen ","eighteen ","nineteen "];
    const arr2 = ["", "", "twenty","thirty","forty","fifty", "sixty","seventy","eighty","ninety"];

    let n = ("000000000" + number).substr(-9).match(/^(\d{2})(\d{1})(\d{1})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    str += (n[2] !== "0") ? (arr1[Number(n[2])] || arr2[n[2][0]] + " " + arr1[n[2][1]]) + "million " : "";
    str += (n[3] !== "0") ? (arr1[Number(n[3])] || arr2[n[3][0]] + " " + arr1[n[3][1]]) + "hundred thousand " : "";
    str += (n[4] !== "00") ? (arr1[Number(n[4])] || arr2[n[4][0]] + " " + arr1[n[4][1]]) + "thousand " : "";
    str += (n[5] !== "0") ? (arr1[Number(n[5])] || arr2[n[5][0]] + " " + arr1[n[5][1]]) + "hundred " : "";
    str += (n[6] !== "00") ? ((str !== "") ? "and " : "") + (arr1[Number(n[6])] || arr2[n[6][0]] + " " + arr1[n[6][1]]) : "";
    return str;
  }
}