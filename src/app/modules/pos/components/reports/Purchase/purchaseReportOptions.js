export const getPurchaseReportOptions = (filters, section) => {
  const dates = { fromDate: filters.fromDate, toDate: filters.toDate };
  const sectionOption = { ...dates };

  if (section !== "trend" && filters.locationId !== "") {
    sectionOption.locationId = filters.locationId;
  }

  if (section !== "trend" && section !== "suppliers" && filters.supplierId !== "") {
    sectionOption.supplierId = filters.supplierId;
  }

  const summaryOption = { ...sectionOption };

  if (section === "priceIncrease") {
    sectionOption.minChangePercent = filters.minChangePercent;
  }

  if (section === "overstock") {
    sectionOption.thresholdDays = filters.thresholdDays;
  }

  return { summaryOption, sectionOption };
};
