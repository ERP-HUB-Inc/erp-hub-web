import moment from "moment";
import _ from "lodash";

export class Util {
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
      var renameResult = _.mapKeys(value1, function(value, key) {
        return template[key];
      });
      return renameResult;
    });
  }

  isValidEmail (email) {
    var re = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  }

  
  getAccessToken (key) {
    if (!localStorage.getItem(key)) return null;
    let result = localStorage.getItem(key);
    result = JSON.parse(result);
    return result.accessToken;
  }

  getSetting (key) {
    if (!localStorage.getItem(key)) return null;
    let result = localStorage.getItem(key);
    result = JSON.parse(result);
    return result.setting;
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
    return value !="" && value !=null ? value : "-";
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
    let result = n.toFixed(2).replace(/./g, function(c, i, a) {
      return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });

    if (position === 0) {
      result = `${currency} ${result}`;
    } else {
      result = `${result} ${currency}`;
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
}