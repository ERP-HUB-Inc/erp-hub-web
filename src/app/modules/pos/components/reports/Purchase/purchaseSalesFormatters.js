import Util from "../../../../common/util";
import { quantity } from "./purchaseReportConfig";
import { finiteNumber } from "./costChangesModel";

const util = new Util();

export const numberText = value => quantity(finiteNumber(value));

export const signedQuantity = value => {
  const number = finiteNumber(value);
  return number === null ? "—" : `${number > 0 ? "+" : ""}${numberText(number)}`;
};

export const moneyText = (value, currency, signed = false) => {
  const amount = finiteNumber(value);
  if (amount === null) return "—";
  const prefix = currency ? `${currency} ` : "";
  return `${signed && amount > 0 ? "+" : ""}${util.formatCurrency(amount, prefix)}`;
};
