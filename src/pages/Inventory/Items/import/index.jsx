import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Modal, Progress, Table } from "antd";
import { Link, Prompt } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ClipboardCheck, Cloud, Database, Download, FileSpreadsheet, FileText, HelpCircle, History, Info, Lightbulb, ListFilter, RefreshCw, Rocket, ShieldCheck, SlidersHorizontal, UploadCloud, Warehouse, X } from "lucide-react";
import { PageHeader } from "@components/PageHeader";
import { FIELDS, mappingErrors } from "./model";
import useImport, { isEditable, isRunning } from "./use-import";
import "./style.css";

const ITEMS_PATH = "/inventories/items";
const STEPS = [
  { label: "Upload File", Icon: UploadCloud },
  { label: "Schema & Mapping", Icon: ListFilter },
  { label: "Data Cleansing", Icon: ClipboardCheck },
  { label: "Commit & Ingest", Icon: Rocket }
];
const stateLabel = state => ({ mapping_required: "Mapping required", validation_failed: "Validation errors", ready_to_commit: "Ready to commit", queued: "Queued", processing: "Processing", completed: "Completed", failed: "Failed", discarded: "Discarded", expired: "Expired" }[state] || "Status unavailable");
const dateLabel = value => {
  const date = new Date(value);
  return value && Number.isFinite(date.getTime()) ? date.toLocaleString() : "Unavailable";
};
const count = value => Number.isInteger(value) && value >= 0 ? value.toLocaleString() : "Unavailable";

function Section({ title, icon: Icon, extra, children, className = "" }) {
  return <section className={`item-import-card ${className}`}><div className="item-import-card-heading"><h2><Icon size={20} aria-hidden="true" />{title}</h2>{extra}</div>{children}</section>;
}
function SelectField({ label, children, ...props }) {
  return <label className="item-import-field"><span>{label}</span><select {...props}>{children}</select></label>;
}
function Failure({ error, retry }) {
  if (!error) return null;
  return <Alert type="error" showIcon message={error.message} description={<>{error.requestId && <span>Request ID: <code className="item-import-copy-id">{error.requestId}</code> </span>}{retry && <Button onClick={retry}>Retry</Button>}</>} />;
}
function Status({ state }) {
  return <span className={`item-import-badge ${state === "completed" || state === "ready_to_commit" ? "success" : state === "failed" || state === "validation_failed" ? "danger" : ""}`}>{stateLabel(state)}</span>;
}
function Counts({ values, committed = false }) {
  return <div className="item-import-review-counts">{(committed ? [["created", "Created"], ["updated", "Updated"], ["skipped", "Skipped"], ["failed", "Failed"]] : [["create", "Proposed new items"], ["update", "Proposed updates"], ["skip", "Skipped"], ["error", "Need correction"]]).map(([key, label]) => <div key={key}><strong>{count(values && values[key])}</strong><span>{label}</span></div>)}</div>;
}

export default function ItemImport({ history }) {
  const flow = useImport(history);
  const { capabilities: caps, session, draft, preview, step, busy, dirty } = flow;
  const [encoding, setEncoding] = useState("utf-8");
  const [delimiter, setDelimiter] = useState(",");
  const [dragging, setDragging] = useState(false);
  const [guide, setGuide] = useState(false);
  const [fileError, setFileError] = useState(null);
  const inputRef = useRef(null);
  const editable = isEditable(session);
  const running = isRunning(session);
  const permissions = caps ? caps.actions : {};
  const fields = caps ? caps.fields.map(field => ({ ...(FIELDS.find(local => local.key === field.name) || { label: field.name }), key: field.name, required: field.required, maxLength: field.maxLength })) : FIELDS;
  const issues = draft ? mappingErrors(draft.mapping, fields) : [];
  const conventionsChanged = Boolean(session && draft && ["worksheet", "headerRow", "encoding", "delimiter"].some(key => draft[key] !== session.settings[key]));
  const canValidate = editable && permissions.validate && !busy && !conventionsChanged && !issues.length && preview && !flow.previewError;
  const supportsOpeningStock = Boolean(caps && (caps.stockOperations || []).includes("opening_stock"));
  const canCommit = session && session.state === "ready_to_commit" && session.validationId && !dirty && !busy && !flow.uncertain && permissions.commit;
  const protect = dirty || busy === "upload";

  useEffect(() => {
    const beforeUnload = event => { event.preventDefault(); event.returnValue = ""; };
    if (protect) window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [protect]);

  const updateDraft = changes => flow.setDraft({ ...draft, ...changes });
  const chooseFile = file => {
    if (!file || busy || !permissions.upload) return;
    const upload = () => { setFileError(null); flow.upload(file, encoding, delimiter); };
    if (session) Modal.confirm({ title: "Start a new import?", content: "The current saved session stays in import history. Any unsaved mapping changes will be lost.", className: "sv-modal-confirm", onOk: upload });
    else upload();
  };
  const leave = () => {
    if (editable && permissions.discard && !flow.uncertain) Modal.confirm({ title: "Discard this import session?", content: "The saved file and row data will be removed. To keep it for later, choose Keep Session & Back.", okText: "Discard Session", cancelText: "Keep Session & Back", className: "sv-modal-confirm", onOk: async () => { if (await flow.discard()) history.push(ITEMS_PATH); }, onCancel: () => history.push(ITEMS_PATH) });
    else history.push(ITEMS_PATH);
  };
  const confirmCommit = () => Modal.confirm({ title: "Import these catalog items?", content: `${count(session.proposedCounts && session.proposedCounts.create)} new items are proposed. All retained rows and any positive initial quantities will be committed atomically to the selected authorized location.`, okText: "Commit Import", className: "sv-modal-confirm", onOk: () => flow.commit() });
  const resume = id => {
    if (dirty) Modal.confirm({ title: "Leave unsaved mapping changes?", content: "Saved import sessions are retained. Unsaved changes to this mapping will be lost.", className: "sv-modal-confirm", onOk: () => flow.resume(id) });
    else flow.resume(id);
  };
  const sourceRows = preview ? preview.data.filter(row => row.sourceRow > session.settings.headerRow) : [];
  const sourceColumns = [{ title: "SOURCE ROW", dataIndex: "sourceRow", width: 100 }, ...(preview ? preview.headers : []).map((header, index) => ({ title: `${header || "Unnamed column"} (${index + 1})`, key: String(index), render: (_, row) => row.cells[index] && row.cells[index].formula ? "Formula (not allowed)" : row.cells[index] && row.cells[index].value || "Empty" }))];
  const reviewColumns = [
    { title: "SOURCE ROW", dataIndex: "sourceRow", width: 100 },
    { title: "PRODUCT NAME", key: "name", render: (_, row) => row.proposedChanges.name || "Missing name" },
    { title: "BARCODE", dataIndex: "barcode", render: barcode => <span className="item-import-number">{barcode || "Missing barcode"}</span> },
    { title: "BUYING COST", key: "cost", render: (_, row) => row.proposedChanges.cost == null ? "Not supplied" : row.proposedChanges.cost },
    { title: "RETAIL PRICE", key: "price", render: (_, row) => row.proposedChanges.price == null ? "Not supplied" : row.proposedChanges.price },
    { title: "SERVER RESULT", key: "result", render: (_, row) => <div><span className={`item-import-badge ${row.action === "error" ? "danger" : row.action === "create" ? "success" : ""}`}>{row.action === "create" ? "Proposed new item" : row.action === "skip" ? "Skipped" : "Needs correction"}</span>{[...row.errors, ...row.warnings].map((issue, i) => <p className="item-import-row-issue" key={i}>{issue.field ? `${issue.field}: ` : ""}{issue.message}</p>)}{row.supersededBy && <p className="item-import-row-issue">Retained source row: {row.supersededBy}</p>}</div> }
  ];
  const logColumns = [
    { title: "BATCH ID & FILE NAME", key: "file", render: (_, item) => <div><strong>{item.filename}</strong><div><code>{item.id}</code> · Create New Only</div></div> },
    { title: "IMPORTED BY", key: "user", render: (_, item) => item.importer.name },
    { title: "TIMESTAMP", dataIndex: "createdAt", render: dateLabel },
    { title: "SOURCE ROW COUNT", dataIndex: "sourceRowCount", render: value => `${count(value)} source rows` },
    { title: "INGESTION STATUS", dataIndex: "state", render: state => <Status state={state} /> },
    { title: "ACTION", key: "action", render: (_, item) => <Button disabled={Boolean(busy)} onClick={() => resume(item.id)}>{item.resumeSupported ? "Resume Session" : "View Summary"}<ArrowRight size={14} /></Button> }
  ];

  return <div className="item-import-page">
    <Prompt when={protect} message="Leave unsaved import changes? The saved session remains available in import history." />
    <PageHeader title="Import Items from Excel / CSV" subtitle="Upload your product catalog, map columns, and review server validation before importing new catalog items."
      breadcrumbs={[{ text: "Dashboard", href: "/" }, { text: "Items Management", href: ITEMS_PATH }, { text: "Import Items" }]}
      style={{ padding: 0, background: "transparent" }} titleStyle={{ fontFamily: '"Plus Jakarta Sans", Inter, "Noto Sans Khmer", khfont, sans-serif', fontSize: "36px", lineHeight: "44px", fontWeight: 700, color: "#0b1c30" }}
      subtitleStyle={{ color: "#526176", lineHeight: "20px", maxWidth: 800 }} actions={[
        <Button disabled={Boolean(busy)} onClick={leave}><ArrowLeft size={16} />{editable && permissions.discard ? "Discard & Back to Items" : "Back to Items"}</Button>,
        <Button className="item-import-primary" onClick={() => setGuide(true)}><HelpCircle size={16} />Import Guide</Button>
      ]} />
    <Failure error={flow.capabilityError} retry={flow.loadCapabilities} />
    <Failure error={flow.error} retry={session ? flow.refreshSession : undefined} />
    {flow.error && flow.error.status === 409 && session && <Alert type="warning" showIcon message="The saved session changed. Reload its latest revision before validating or committing again." />}
    {flow.uncertain && <Alert type="warning" showIcon message="Checking whether the server accepted your commit…" description="Do not create another import. This session is being checked automatically; a retry will reuse the same operation key and validated revision." />}
    {!caps && !flow.capabilityError && <p role="status">Loading import permissions and configuration…</p>}

    <ol className="item-import-stepper" aria-label="Import progress">{STEPS.map(({ label, Icon }, i) => <li key={label} className={step === i ? "active" : step > i ? "complete" : ""} aria-current={step === i ? "step" : undefined}><span className="item-import-step-icon">{step > i ? <Check size={24} /> : <Icon size={24} />}</span><div><span className="item-import-micro">STEP {String(i + 1).padStart(2, "0")}</span><strong>{label}</strong></div>{step === i && <span className="item-import-active-dot" aria-label="Current step" />}</li>)}</ol>

    {caps && !permissions.upload && <Alert type="info" showIcon message="You can view import history. Your role does not permit uploading or committing items." />}
    <div className="item-import-layout"><div className="item-import-main">
      {step === 0 && <>
        <Section title="Data Source File" icon={UploadCloud} extra={<span className="item-import-badge">{caps ? "Import service available" : "Connecting"}</span>}>
          <div className={`item-import-dropzone ${dragging ? "dragging" : ""}`} aria-busy={busy === "upload"}
            onDragOver={event => { event.preventDefault(); if (permissions.upload && !busy) setDragging(true); }} onDragLeave={() => setDragging(false)}
            onDrop={event => { event.preventDefault(); setDragging(false); if (event.dataTransfer.files.length !== 1) setFileError({ message: "Choose one file per import session." }); else chooseFile(event.dataTransfer.files[0]); }}>
            <span className="item-import-upload-icon"><UploadCloud size={34} aria-hidden="true" /></span><h3>Drag & drop your Excel or CSV file here</h3>
            <p>or browse from your local drive.{caps ? ` Supports up to ${Math.floor(caps.limits.uploadBytes / 1024 / 1024)} MB and ${count(caps.limits.dataRows)} data rows per import session.` : " File limits are provided by the import service."}</p>
            <input ref={inputRef} type="file" accept={caps ? caps.formats.map(format => `.${format}`).join(",") : ""} className="item-import-file-input" aria-label="Select source spreadsheet" disabled={!permissions.upload || Boolean(busy)} onChange={event => { chooseFile(event.target.files[0]); event.target.value = ""; }} />
            <div className="item-import-upload-actions"><Button className="item-import-primary" disabled={!permissions.upload || Boolean(busy)} loading={busy === "upload"} onClick={() => inputRef.current.click()}><FileSpreadsheet size={16} />{busy === "upload" ? "Uploading & parsing…" : "Browse Files"}</Button><Button onClick={() => Modal.info({ title: "Import from Google Sheets", className: "sv-modal-confirm", content: "In Google Sheets, choose File → Download → Microsoft Excel (.xlsx) or Comma-separated values (.csv), then upload that file here. A direct Google Sheets connection is not configured." })}><Cloud size={16} />Import from Google Sheets</Button></div>
            <div className="item-import-formats">{(caps ? caps.formats : []).map(format => <span key={format}>.{format.toUpperCase()}</span>)}</div>
            {busy === "upload" && flow.uploadPercent != null && <div aria-label="File upload progress"><Progress percent={flow.uploadPercent} status="active" /><p>{flow.uploadPercent === 100 ? "Upload sent. Waiting for server parsing…" : "Sending source file…"}</p></div>}
          </div>
          <Failure error={fileError} />
          {session && <div className="item-import-selected" role="status"><FileSpreadsheet size={24} /><div><strong>{session.filename}</strong><p>{count(session.sourceRowCount)} data rows · Revision {session.revision} · Saved session</p><code>{session.id}</code></div>{editable && permissions.discard && <Button aria-label="Discard selected import session" disabled={Boolean(busy)} onClick={() => Modal.confirm({ title: "Discard this import?", content: "The saved file and row data will be removed.", className: "sv-modal-confirm", onOk: flow.discard })}><X size={16} /></Button>}</div>}
          <div className="item-import-settings">
            <SelectField label="Text encoding" value={draft ? draft.encoding : encoding} disabled={Boolean(busy) || Boolean(session && !editable)} onChange={event => draft ? updateDraft({ encoding: event.target.value, mapping: {} }) : setEncoding(event.target.value)}>{(caps ? caps.encodings : ["utf-8"]).map(value => <option key={value} value={value}>{value === "utf-8" ? "UTF-8 (BOM supported)" : "Windows-1252 (Western text only)"}</option>)}</SelectField>
            <SelectField label="Text delimiter" value={draft ? draft.delimiter : delimiter} disabled={Boolean(busy) || Boolean(session && !editable)} onChange={event => draft ? updateDraft({ delimiter: event.target.value, mapping: {} }) : setDelimiter(event.target.value)}><option value=",">Comma (,)</option><option value={"\t"}>Tab</option><option value=";">Semicolon (;)</option></SelectField>
            {draft && <><SelectField label="Worksheet" value={draft.worksheet} disabled={!editable || Boolean(busy)} onChange={event => updateDraft({ worksheet: event.target.value, mapping: {} })}>{session.worksheets.map(sheet => <option key={sheet.name} value={sheet.name}>{sheet.name}</option>)}</SelectField><label className="item-import-field"><span>Header row (1–100)</span><input type="number" min="1" max="100" value={draft.headerRow} disabled={!editable || Boolean(busy)} onChange={event => updateDraft({ headerRow: Number(event.target.value), mapping: {} })} /></label></>}
          </div>
          <div className="item-import-info-strip"><ShieldCheck size={17} /><span>Files are uploaded for server-side parsing and validation. UTF-8 is recommended for Khmer.</span></div>
        </Section>
        <Section title="Import Mode & Conflict Resolution" icon={SlidersHorizontal}>
          <fieldset className="item-import-mode-list"><legend className="item-import-sr-only">Import mode</legend>
            <label className="item-import-mode disabled"><input type="radio" name="mode" disabled /><div><strong>Smart Upsert <span className="item-import-micro">UNAVAILABLE</span></strong><p>This service currently supports creating new items only.</p></div></label>
            <label className="item-import-mode selected"><input type="radio" name="mode" checked readOnly /><div><strong>Create New Only <span className="item-import-badge success">ADD ONLY</span></strong><p>Register new items matched by barcode within your business. The application generates internal SKUs. Positive initial quantities are recorded through an opening stock transaction.</p></div></label>
            <label className="item-import-mode disabled"><input type="radio" name="mode" disabled /><div><strong>Stock Update Only <span className="item-import-micro">STOCK LEDGER</span></strong><p>Use a separate audited stock workflow for counts, adjustments, or purchase receipts.</p></div></label>
          </fieldset>
          <div className="item-import-settings tinted"><div><label className="item-import-field"><span><Warehouse size={16} />{supportsOpeningStock ? "Initial Stock Location" : "Target Warehouse / Distribution Center"}</span><select value={supportsOpeningStock && draft ? draft.locationId || "" : ""} disabled={!supportsOpeningStock || !editable || !permissions.configure || Boolean(busy)} onChange={event => updateDraft({ locationId: event.target.value })}><option value="">{supportsOpeningStock ? "Choose an authorized location" : "Not available for catalog imports"}</option>{(caps ? caps.warehouses : []).map(location => <option key={location.id} value={location.id}>{location.name}</option>)}</select></label><p>{supportsOpeningStock ? "A positive initial quantity is recorded as an opening balance at this authorized location." : <>No stock is credited. Use <Link to="/inventories/stock-io">Stock IO</Link> after creating items.</>}</p></div>
            <div><SelectField label="Duplicate Barcode Handling (in this file)" value={draft ? draft.fileDuplicatePolicy : "reject"} disabled={!editable || !permissions.configure || Boolean(busy)} onChange={event => updateDraft({ fileDuplicatePolicy: event.target.value })}>{(caps ? caps.fileDuplicatePolicies : ["reject"]).map(value => <option key={value} value={value}>{({ reject: "Require correction of duplicate rows", keep_first: "Keep first source row", keep_last: "Keep last source row" })[value]}</option>)}</SelectField><p>First/last refers to source row order. Replaced rows are disclosed in server validation.</p></div>
            <SelectField label="Existing Barcode Handling (database)" value={draft ? draft.duplicatePolicy : "reject"} disabled={!editable || !permissions.configure || Boolean(busy)} onChange={event => updateDraft({ duplicatePolicy: event.target.value })}>{(caps ? caps.duplicatePolicies : ["reject"]).map(value => <option key={value} value={value}>{value === "skip" ? "Skip existing barcodes" : "Reject existing barcodes"}</option>)}</SelectField>
            <SelectField label="Amount decimal separator" value={draft ? draft.decimalSeparator : "."} disabled={!editable || !permissions.configure || Boolean(busy)} onChange={event => updateDraft({ decimalSeparator: event.target.value })}>{(caps ? caps.decimalSeparators : ["."]).map(value => <option key={value} value={value}>{value === "." ? "Dot (12.50)" : "Comma (12,50)"}</option>)}</SelectField>
            <SelectField label="Catalog currency" value={draft ? draft.currencyId : caps && caps.currencies[0] ? caps.currencies[0].id : ""} disabled={!editable || !permissions.configure || Boolean(busy)} onChange={event => updateDraft({ currencyId: event.target.value })}><option value="" disabled>No configured base currency</option>{(caps ? caps.currencies : []).map(currency => <option key={currency.id} value={currency.id}>{currency.code}</option>)}</SelectField>
          </div>
        </Section>
        <div className="item-import-navigation"><span>No catalog changes until you explicitly commit.</span><Button className="item-import-primary" loading={busy === "configure"} disabled={!editable || !permissions.configure || Boolean(busy) || !draft || draft.headerRow < 1 || draft.headerRow > 100} onClick={flow.configure}>Save & Continue to Mapping<ArrowRight size={16} /></Button></div>
      </>}

      {step === 1 && session && <Section title="Schema & Mapping" icon={ListFilter}>
        <p>Map source columns to catalog fields. Barcode is the matching identifier; internal SKU is generated. Required fields are marked with *.</p>
        <Failure error={flow.previewError} retry={flow.refreshSession} />
        {!preview && !flow.previewError && <p role="status">Loading source preview…</p>}
        <div className="item-import-mapping">{fields.map(field => <SelectField key={field.key} label={`${field.label}${field.required ? " *" : " (optional)"}`} value={Number.isInteger(draft.mapping[field.key]) ? draft.mapping[field.key] : ""} disabled={!editable || !permissions.configure || Boolean(busy)} onChange={event => { const mapping = { ...draft.mapping }; if (event.target.value === "") delete mapping[field.key]; else mapping[field.key] = Number(event.target.value); updateDraft({ mapping }); }}><option value="">{field.required ? "Choose a source column" : "Do not import"}</option>{(preview ? preview.headers : []).map((header, i) => <option key={i} value={i}>{header || "Unnamed column"} · Column {i + 1}</option>)}</SelectField>)}</div>
        {issues.length > 0 && <Alert type="warning" showIcon message="Complete the mapping" description={issues.join(" ")} />}
        <h3>Source preview · first source rows</h3><Table size="small" rowKey="sourceRow" columns={sourceColumns} dataSource={sourceRows.slice(0, 5)} pagination={false} scroll={{ x: true }} />
        <div className="item-import-navigation"><Button disabled={Boolean(busy)} onClick={() => flow.setStep(0)}><ArrowLeft size={16} />Back to Upload Settings</Button><Button className="item-import-primary" disabled={!canValidate} loading={busy === "validate"} onClick={flow.validate}>Save & Validate Data<ArrowRight size={16} /></Button></div>
      </Section>}

      {step === 2 && session && <Section title="Data Cleansing" icon={ClipboardCheck} extra={<Button disabled={Boolean(busy) || !session.validationId} onClick={() => flow.download("report")}><Download size={16} />Download Review</Button>}>
        <Counts values={session.proposedCounts} />
        <Alert type={session.state === "validation_failed" ? "error" : "info"} showIcon message={session.state === "validation_failed" ? "Correct all server validation errors before continuing" : "Server validation passed"} description={`All retained rows must pass validation. Category and unit names must already exist in your business, or have exactly one configured default. Initial quantity must be non-negative${caps ? ` and may have up to ${caps.quantityDecimalPlaces || 0} decimal places` : ""}. Positive quantities are recorded at the selected authorized location; zero creates no stock movement. Correct your file or return to mapping, then validate again.`} />
        <SelectField label="Filter validation rows" value={flow.rowFilter} onChange={event => { flow.setRowFilter(event.target.value); flow.setRowPage(1); }}><option value="">All source rows</option><option value="error">Errors</option><option value="skip">Skipped</option><option value="create">Proposed new items</option></SelectField>
        <Failure error={flow.rowError} retry={flow.refreshSession} />
        <Table size="small" loading={flow.rowLoading} rowKey="sourceRow" columns={reviewColumns} dataSource={flow.rows.data} pagination={{ pageSize: 10, current: flow.rowPage, total: flow.rows.total, onChange: flow.setRowPage, showTotal: total => `${total} source rows` }} scroll={{ x: 800 }} />
        <div className="item-import-navigation"><Button disabled={Boolean(busy)} onClick={() => flow.setStep(1)}><ArrowLeft size={16} />Back to Mapping</Button><Button className="item-import-primary" disabled={!canCommit} onClick={() => flow.setStep(3)}>Review Import<ArrowRight size={16} /></Button></div>
      </Section>}

      {step === 3 && session && <Section title="Commit & Ingest" icon={Rocket} extra={<Status state={session.state} />}>
        <dl className="item-import-final-review"><div><dt>File / batch</dt><dd>{session.filename}<br /><code>{session.id}</code></dd></div><div><dt>Worksheet / header row</dt><dd>{session.settings.worksheet} / {session.settings.headerRow}</dd></div><div><dt>Mode / currency</dt><dd>Create New Only · {(caps && caps.currencies.find(currency => currency.id === session.settings.currencyId) || {}).code || "Unavailable"}</dd></div><div><dt>File duplicates / database conflicts</dt><dd>{({ reject: "Reject", keep_first: "Keep first source row", keep_last: "Keep last source row" })[session.settings.fileDuplicatePolicy]} / {session.settings.duplicatePolicy === "skip" ? "Skip existing barcodes" : "Reject existing barcodes"}</dd></div><div><dt>Initial inventory</dt><dd>{supportsOpeningStock ? `${session.settings.locationId ? caps.warehouses.find(location => location.id === session.settings.locationId)?.name || "Authorized location" : "No location selected"}; positive opening quantities are audited; zero adds no stock.` : "Not supported by this API; only blank or zero quantity is accepted."}</dd></div><div><dt>Commit policy</dt><dd>All retained rows succeed together, or no catalog changes are saved.</dd></div></dl>
        <Counts values={session.state === "completed" || session.state === "failed" ? session.committedCounts : session.proposedCounts} committed={session.state === "completed" || session.state === "failed"} />
        {session.state === "completed" && <Alert type="success" showIcon message="Items imported successfully" description="The catalog transaction is complete. Download the reconciliation report or return to Items to see the refreshed catalog and statistics." />}
        {session.failure && <Alert type="error" showIcon message={session.failure.message} description={`Reference: ${session.failure.code}. Review the report. A completed or failed job is never submitted again.`} />}
        {running && <div role="status"><p>{stateLabel(session.state)} · {count(session.progress.processed)} of {count(session.progress.total)} source rows processed</p><Progress percent={session.progress.total ? Math.floor(session.progress.processed / session.progress.total * 100) : 0} status="active" /><p>Your session is saved. You can leave and view its status from ingestion history.</p></div>}
        <div className="item-import-navigation">{editable && <Button disabled={Boolean(busy) || flow.uncertain} onClick={() => flow.setStep(2)}><ArrowLeft size={16} />Back to Validation</Button>}<Button disabled={Boolean(busy) || !session.validationId} onClick={() => flow.download("report")}><Download size={16} />Download Report</Button>{editable && <Button className="item-import-primary" disabled={!canCommit} loading={busy === "commit"} onClick={confirmCommit}>Commit Import<Rocket size={16} /></Button>}<Button disabled={Boolean(busy)} onClick={flow.refreshSession}><RefreshCw size={16} />Refresh Status</Button>{!editable && !running && <Button disabled={Boolean(busy)} onClick={flow.clear}>Start New Import</Button>}</div>
      </Section>}
      {session && ["expired", "discarded"].includes(session.state) && <Alert type="warning" showIcon message="This session is no longer available" description={<Button onClick={flow.clear}>Start New Import</Button>} />}
    </div>

    <aside className="item-import-aside">
      <Section title="Download Templates" icon={Download}><span className="item-import-micro">{caps ? `VERIFIED SCHEMA ${caps.schemaVersion}` : "LOADING SCHEMA"}</span><p>Download the current server schema for mapping and validation. Templates provide column headers; no formulas or dropdowns are included.</p>
        <button className="item-import-template" disabled={!permissions.view || Boolean(busy)} onClick={() => flow.download("xlsx")}><FileSpreadsheet size={25} /><span><strong>Excel Template <small>(.XLSX)</small></strong><span>Barcode column formatted as text</span></span><Download size={18} /></button>
        <button className="item-import-template" disabled={!permissions.view || Boolean(busy)} onClick={() => flow.download("csv")}><FileText size={25} /><span><strong>CSV Standard <small>(.CSV)</small></strong><span>UTF-8 with BOM · comma separated</span></span><Download size={18} /></button>
        <div className="item-import-specs"><h3>Required Field Specifications</h3><p><strong>Required</strong><br />{fields.filter(field => field.required).map(field => field.label).join(", ")}.</p><p><strong>Optional</strong><br />Category, Unit, Wholesale Price, Distributor Price, and Initial Quantity.</p><p><strong>Initial Quantity</strong><br />{supportsOpeningStock ? "Accepts non-negative amounts up to the inventory precision. Zero adds no stock movement; positive quantities create an audited opening balance at the selected location." : "This import API currently accepts only blank or zero quantity."}</p><p><strong>Reference records</strong><br />Category and unit must exist in this business. Blank values require an unambiguous business default.</p></div>
      </Section>
      <Section title="Pro-tips & Guidelines" icon={Lightbulb}><div className="item-import-tip"><h3>Speed Tip</h3><p>Smaller batches are easier to review. Processing time depends on parsing and validation.</p></div><div className="item-import-tip"><h3>Barcodes</h3><p>Use a separate text barcode column. Internal SKUs are generated. Existing matches and file duplicates have separate policies.</p></div><div className="item-import-tip"><h3>Currencies</h3><p>Use the business base currency and selected decimal separator. Grouping separators and currency conversion are not supported. Amounts support {caps ? caps.maximumDecimalPlaces : "the configured number of"} decimal places.</p></div></Section>
      <div className="item-import-card item-import-database"><span className="item-import-upload-icon"><Database size={24} /></span><div><span className="item-import-micro">CATALOG DATABASE</span><strong>Status unavailable</strong><span className="item-import-secondary">Active SKU count and sync status are not provided.</span></div><span className="item-import-badge">Unknown</span></div>
    </aside></div>

    <Section title="Recent Ingestion Logs (Last 7 Days)" icon={History} className="item-import-logs" extra={<div className="item-import-log-actions"><label><span className="item-import-sr-only">Filter batch or user</span><input placeholder="Filter batch or user…" value={flow.search} disabled={!permissions.view} maxLength={255} onChange={event => { flow.setSearch(event.target.value); flow.setLogPage(1); }} /></label><Button disabled={!permissions.view || flow.logLoading} aria-label="Refresh ingestion logs" onClick={flow.refreshLogs}><RefreshCw size={16} /></Button></div>}>
      <p>Review previous batches, resume saved preparation, or download reconciliation summaries.</p><Failure error={flow.logError} retry={flow.refreshLogs} />
      <Table size="small" loading={flow.logLoading} rowKey="id" columns={logColumns} dataSource={flow.logs.data} pagination={{ pageSize: 10, total: flow.logs.total, current: flow.logPage, onChange: flow.setLogPage, showTotal: total => `${total} import sessions` }} scroll={{ x: 900 }} locale={{ emptyText: flow.logError ? "Unable to load ingestion history." : "No imports found in the last 7 days." }} />
      <div className="item-import-info-strip"><Info size={16} /><span>{caps ? `Source files are retained for ${caps.retention.sourceDays} days; results for ${caps.retention.resultsDays} days. Dates use your browser timezone. Saved sessions can be resumed while available.` : "Retention policy is provided by the import service."}</span></div>
    </Section>
    <Modal title="Item Import Guide" visible={guide} onCancel={() => setGuide(false)} footer={<Button className="item-import-primary" onClick={() => setGuide(false)}>Got it</Button>} className="sv-modal-confirm"><ol className="item-import-guide"><li>Download a server template or upload an Excel, UTF-8 CSV, or tab-delimited file. Set the delimiter before uploading text files.</li><li>Keep barcodes as text. Internal SKUs are generated by the application.</li><li>Choose a worksheet and header row, then save settings and map required fields.</li><li>Select separate policies for database conflicts and duplicate rows within the file.</li><li>Run server validation. Category/unit names must exist, amounts must use the selected decimal separator, and formulas are rejected.</li><li>Initial quantities can be zero or positive. Positive values create an audited opening stock transaction at the selected location; this does not receive a purchase order.</li><li>Review proposed changes and explicitly commit. If the request times out, check the saved session; retries use the same operation key.</li><li>Resume sessions from history or the session URL. Unsaved mapping changes are not retained.</li></ol></Modal>
  </div>;
}
