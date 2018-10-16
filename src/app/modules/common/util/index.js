import moment from "moment";
import _ from "lodash";
import ConstantAuth from "../constants/authentication";

export class Util {
  getAPIURL() {
    let host = process.env.REACT_APP_API_HOST;
    if (process.env.REACT_APP_ENV === "DEV") {
      host = process.env.REACT_APP_API_DEV_HOST;
    }
    const port = process.env.REACT_APP_API_PORT;
    const rootPath = process.env.REACT_APP_API_ROOT;
    const url = `${host}:${port}/${rootPath}`;
    return url;
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

  renameObjectKeys(obj, key, newKey){
    if(_.includes(_.keys(obj), key)) {
      obj[newKey] = _.clone(obj[key], true);
      delete obj[key];
    }
    return obj;
  }

  renameObjectKey (template, source) {
    return source.map((value1, key1) => {
      var renameResult = _.mapKeys(value1, (value, key) => {
        console.log("Keys:", key);
        return template[key];
      });
      return renameResult;
    });
  }

  isValidEmail (email) {
    var re = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  }

  getAuthSession () {
    if (!localStorage.getItem(ConstantAuth.ACCESS_TOKEN)) return null;
    let result = localStorage.getItem(ConstantAuth.ACCESS_TOKEN);
    result = JSON.parse(result);
    return result;
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

  getClientId() {
    const result = this.getAuthSession();
    if (result)
      return result.clientId;
    else 
      return null;
  }

  getCurrentDate () {
    return moment();
  }

  formatDate (value, format = "MMM-Do-YYYY h:mm A") {
    format = format == null ? "MMM-Do-YYYY h:mm A" : format;
    return moment(value).format(format);
  }

  formatDatePicker (value, format="YYYY/MM/DD") {
    return moment(value, format);
  }

  listFormatDate () {
    return [
      {name: "MMM-Do-YYYY h:mm A", value: "MMM-Do-YYYY h:mm A"},
      {name: "MMM Do YY", value: "MMM Do YY"},
      {name: "YYYY/MM/DD", value: "YYYY/MM/DD"}
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
    const sub = parts[0];
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

  formatCurrency(n, currency = "$", position = 0) {
    // 0: BEFORE, 1: AFTER
    let result = parseFloat(n).toFixed(2).replace(/./g, function(c, i, a) {
      return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });

    if (position === 0) {
      result = `${currency}${result}`;
    } else {
      result = `${result}${currency}`;
    }

    return result;
  }
  
  formatCurrencyV2(n, currency) {
    return currency + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }
  
  formatCurrencyV3(n, currency) {
    return new Intl.NumberFormat("ru", {
      style: "currency",
      currency: currency
    }).format(n);
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
    var mywindow = window.open("", "PRINT", "height=400,width=600");

    mywindow.document.write("<html><head><title>" + document.title  + "</title>");
    mywindow.document.write("</head><body >");
    mywindow.document.write(contentHtml);
    mywindow.document.write("</body></html>");

    mywindow.document.close();
    mywindow.focus();

    setTimeout(function() {
      mywindow.print();
      mywindow.close();
    }, 250);

    return true;
  }

  getProductImage(fileName, key="product") {
    return {
      url: `${process.env.REACT_APP_RESOURCE_HOST}/${this.getClientId()}/${key}/${fileName}`
    };
  }

  testImage(url, callback, timeout) {
    timeout = timeout || 5000;
    var timedOut = false, timer;
    var img = new Image();
    img.onerror = img.onabort = () => {
      if (!timedOut) {
        clearTimeout(timer);
        callback(url, "error");
      }
    };
    img.onload = () => {
      if (!timedOut) {
        clearTimeout(timer);
        callback(url, "success");
      }
    };
    img.src = url;
    timer = setTimeout(() => {
      timedOut = true;
      callback(url, "timeout");
    }, timeout); 
  }

  getImageFromSpace(image) {
    return `${process.env.REACT_APP_RESOURCE_HOST}/${image}`;
  }
}