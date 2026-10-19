import React from "react";
import { Button, Select } from "antd";

// Shared remote search behavior; each record select owns its service and defaults.
const RemoteRecordSelect = React.forwardRef(({
  service, limit, allLabel, allValue = 0, defaultValue, value, selectedItem,
  onChange, style, width = 180, ...selectProps
}, ref) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selectedValue = value !== undefined ? value : internalValue;
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [retry, setRetry] = React.useState(0);
  const requestId = React.useRef(0);
  const knownRecords = React.useRef(new Map());
  if (selectedItem) knownRecords.current.set(String(selectedItem.id), selectedItem);

  React.useImperativeHandle(ref, () => ({
    getSelectedLocation: () => selectedValue,
    getSelectedVendor: () => selectedValue
  }), [selectedValue]);

  React.useEffect(() => {
    const id = ++requestId.current;
    setLoading(true);
    setError(false);
    const timer = setTimeout(() => {
      service.get({ limit, ...(search ? { search } : {}) })
        .then(response => {
          if (id !== requestId.current) return;
          const records = response.data && response.data.data;
          if (!Array.isArray(records)) throw new Error("Invalid record list");
          records.forEach(record => knownRecords.current.set(String(record.id), record));
          setRows(records);
        })
        .catch(() => {
          if (id !== requestId.current) return;
          setRows([]);
          setError(true);
        })
        .finally(() => {
          if (id === requestId.current) setLoading(false);
        });
    }, search ? 400 : 0);
    return () => {
      clearTimeout(timer);
      requestId.current += 1;
    };
  }, [service, limit, search, retry]);

  // Resolve a restored filter whose label is outside the first page of choices.
  const [restoredRecord, setRestoredRecord] = React.useState(null);
  React.useEffect(() => {
    if (selectedValue === undefined || selectedValue === null || selectedValue === allValue ||
        knownRecords.current.has(String(selectedValue))) return undefined;
    let mounted = true;
    service.getById(selectedValue)
      .then(response => {
        const record = response.data && response.data.data;
        if (!record || record.id === undefined) throw new Error("Invalid selected record");
        if (mounted) {
          knownRecords.current.set(String(record.id), record);
          setRestoredRecord(record);
        }
      })
      .catch(() => {
        // Keep the selected ID visible and report that its label could not load.
        if (mounted) setRestoredRecord({ id: selectedValue, name: `Unavailable record (${selectedValue})` });
      });
    return () => { mounted = false; };
  }, [service, selectedValue, allValue]);

  const selected = knownRecords.current.get(String(selectedValue)) ||
    (restoredRecord && String(restoredRecord.id) === String(selectedValue) ? restoredRecord : null);
  const options = selected && !rows.some(row => String(row.id) === String(selected.id))
    ? [selected, ...rows] : rows;
  const optionValue = id => typeof selectedValue === "string" ? String(id) : id;

  return (
    <Select
      showSearch
      allowClear
      {...selectProps}
      value={selectedValue}
      filterOption={false}
      loading={loading}
      onChange={nextValue => {
        setInternalValue(nextValue);
        if (onChange) onChange(nextValue);
      }}
      onSearch={nextSearch => {
        // Invalidate in-flight responses before the debounce timer runs.
        if (nextSearch !== search) requestId.current += 1;
        setSearch(nextSearch);
      }}
      style={{ width, marginRight: 15, ...style }}
      notFoundContent={loading ? "Loading options…" : "No records found"}
      dropdownRender={menu => (
        <>
          {error && (
            <div role="alert" style={{ padding: 8 }}>
              Unable to load options. <Button size="small" onClick={() => setRetry(count => count + 1)}>Retry</Button>
            </div>
          )}
          {menu}
        </>
      )}
    >
      <Select.Option value={allValue} key="all">{allLabel}</Select.Option>
      {options.filter(item => String(item.id) !== String(allValue)).map(item => (
        <Select.Option value={optionValue(item.id)} key={item.id}>{item.name}</Select.Option>
      ))}
    </Select>
  );
});

export default RemoteRecordSelect;
