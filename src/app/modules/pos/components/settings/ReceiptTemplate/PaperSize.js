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
      color: "rgb(142, 136, 136)",
      marginLef: "auto",
      padding: 0,
    }
  },
  {
    code: Enum.PAPER_SIZE.THERMAL,
    name: "Thermal",
    setting: {
      storeNameFontSize: "10pt",
      dataFontSize: "7.5pt",
      subDataFontSize: "6pt",
      width: "100%",
      color: "black",
      marginLef: "auto",
      padding: 0
    }
  },
  {
    code: Enum.PAPER_SIZE.MINI_THERMAL,
    name: "Mini Thermal",
    setting: {
      storeNameFontSize: "10pt",
      dataFontSize: "7pt",
      subDataFontSize: "6pt",
      // width: "80%",
      width: "100%",
      color: "black",
      marginLef: "-25px", // Help to solve problem with mini printer print over margin right
      padding: "0px 15px"
      // padding: 5
    }
  },
  {
    code: Enum.PAPER_SIZE.A4V3,
    name: "A4V3",
    setting: {
      storeNameFontSize: "16pt",
      dataFontSize: "8pt",
      subDataFontSize: "7pt",
      width: "120mm",
      color: "rgb(142, 136, 136)",
      marginLef: "auto",
      padding: 0,
    }
  },
];