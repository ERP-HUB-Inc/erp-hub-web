import Enum from "../../../enums";
export const PaperSize = [
  {
    code: Enum.PAPER_SIZE.A4,
    name: "A4",
    setting: {
      storeNameFontSize: "16pt",
      dataFontSize: "8pt",
      subDataFontSize: "7pt",
      width: "120mm",
      color: "rgb(142, 136, 136)"
    }
  },
  {
    code: Enum.PAPER_SIZE.THERMAL,
    name: "Thermal",
    setting: {
      storeNameFontSize: "10pt",
      dataFontSize: "7pt",
      subDataFontSize: "6pt",
      width: "100%",
      color: "black"
    }
  },
  {
    code: Enum.PAPER_SIZE.MINI_THERMAL,
    name: "Mini Thermal",
    setting: {
      storeNameFontSize: "10pt",
      dataFontSize: "6pt",
      subDataFontSize: "5pt",
      width: "80%",
      color: "black"
    }
  }
];